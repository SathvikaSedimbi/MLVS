import time
import threading
import logging
from typing import Optional, Callable, Dict, Any
import serial
import serial.tools.list_ports
from backend.config import settings
from backend.serial_parser import SerialParser

logger = logging.getLogger("MLVS.SerialManager")

class SerialManager:
    """
    Manages USB Virtual COM port serial communication with STM32 NUCLEO-F446RE.
    Runs continuous background reader thread, parses frames, and handles downlink transmission.
    """

    def __init__(self, on_packet_callback: Optional[Callable[[Dict[str, Any]], None]] = None):
        self.com_port: str = settings.COM_PORT
        self.baud_rate: int = settings.BAUD_RATE
        self.timeout: float = settings.SERIAL_TIMEOUT
        self.on_packet_callback = on_packet_callback

        self.serial_conn: Optional[serial.Serial] = None
        self.parser = SerialParser()
        self.is_running: bool = False
        self._thread: Optional[threading.Thread] = None
        self._lock = threading.Lock()

        self.state: str = "DISCONNECTED"  # DISCONNECTED, CONNECTING, CONNECTED, ERROR
        self.last_error: Optional[str] = None
        self.packets_received: int = 0
        self.bytes_received: int = 0
        self.last_packet_time: Optional[float] = None

    def start(self):
        """Starts the background worker thread."""
        with self._lock:
            if self.is_running:
                return
            self.is_running = True
            self._thread = threading.Thread(target=self._run_loop, daemon=True, name="STM32-Serial-Worker")
            self._thread.start()
            logger.info("Serial background worker thread started.")

    def stop(self):
        """Stops the worker thread and closes the serial port."""
        with self._lock:
            self.is_running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=2.0)
        self._close_port()
        self.state = "DISCONNECTED"
        logger.info("Serial background worker thread stopped.")

    def update_config(self, com_port: str, baud_rate: int):
        """Updates connection parameters and reconnects if active."""
        was_running = self.is_running
        self.stop()
        self.com_port = com_port
        self.baud_rate = baud_rate
        if was_running:
            self.start()

    def _detect_stlink_port(self) -> Optional[str]:
        """Auto-detects STM32 STLink Virtual COM Port if configured port is not available."""
        try:
            ports = list(serial.tools.list_ports.comports())
            # 1. Check if configured port exists
            for p in ports:
                if p.device.upper() == self.com_port.upper():
                    return p.device
            # 2. Look for STLink / STM32 USB descriptor
            for p in ports:
                desc = (p.description or "").upper()
                hwid = (p.hwid or "").upper()
                if "STLINK" in desc or "STM32" in desc or "0483:374B" in hwid or "0483" in hwid:
                    logger.info(f"Auto-detected STM32 STLink on {p.device} ({p.description})")
                    return p.device
        except Exception:
            pass
        return None

    def _open_port(self) -> bool:
        try:
            self.state = "CONNECTING"
            detected_port = self._detect_stlink_port()
            if detected_port and detected_port != self.com_port:
                logger.info(f"Switching target COM port from {self.com_port} to auto-detected {detected_port}")
                self.com_port = detected_port

            self.serial_conn = serial.Serial(
                port=self.com_port,
                baudrate=self.baud_rate,
                timeout=self.timeout,
                bytesize=serial.EIGHTBITS,
                parity=serial.PARITY_NONE,
                stopbits=serial.STOPBITS_ONE
            )
            # Flush existing buffers
            self.serial_conn.reset_input_buffer()
            self.serial_conn.reset_output_buffer()
            self.state = "CONNECTED"
            self.last_error = None
            logger.info(f"Successfully opened serial port {self.com_port} at {self.baud_rate} baud.")
            return True
        except Exception as e:
            self.state = "ERROR"
            self.last_error = str(e)
            logger.warning(f"Could not open serial port {self.com_port}: {e}")
            self.serial_conn = None
            return False

    def _close_port(self):
        if self.serial_conn:
            try:
                self.serial_conn.close()
            except Exception:
                pass
            self.serial_conn = None

    def _run_loop(self):
        while self.is_running:
            if self.serial_conn is None or not self.serial_conn.is_open:
                success = self._open_port()
                if not success:
                    # Retry after brief wait
                    time.sleep(2.0)
                    continue

            try:
                # Read line from STM32
                raw_bytes = self.serial_conn.readline()
                if not raw_bytes:
                    continue

                self.bytes_received += len(raw_bytes)
                line = raw_bytes.decode("utf-8", errors="replace")

                packet = self.parser.parse_line(line)
                if packet:
                    self.packets_received += 1
                    self.last_packet_time = time.time()
                    if self.on_packet_callback:
                        self.on_packet_callback(packet)

            except serial.SerialException as se:
                logger.error(f"Serial exception on {self.com_port}: {se}")
                self.state = "ERROR"
                self.last_error = str(se)
                self._close_port()
                time.sleep(2.0)
            except Exception as e:
                logger.error(f"Unexpected error in serial read loop: {e}")
                time.sleep(0.5)

    def send_downlink(self, message: str) -> bool:
        """Sends a downlink message string (e.g. OLED command) to the STM32."""
        if self.serial_conn and self.serial_conn.is_open:
            try:
                data = message.encode("utf-8")
                self.serial_conn.write(data)
                self.serial_conn.flush()
                return True
            except Exception as e:
                logger.error(f"Error transmitting downlink message to STM32: {e}")
                return False
        return False

    def get_status(self) -> Dict[str, Any]:
        return {
            "state": self.state,
            "com_port": self.com_port,
            "baud_rate": self.baud_rate,
            "is_connected": self.state == "CONNECTED",
            "packets_received": self.packets_received,
            "bytes_received": self.bytes_received,
            "last_packet_time": self.last_packet_time,
            "last_error": self.last_error
        }
