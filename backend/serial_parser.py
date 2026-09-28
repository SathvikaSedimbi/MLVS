import re
import time
from typing import Optional, Dict, Any, List

class SerialParser:
    """
    Robust parser for STM32 NUCLEO-F446RE sensor telemetry streams.
    Handles delimiters, missing fields, multiple sensor label formats, and partial data.
    """

    def __init__(self):
        # Current accumulating packet dictionary
        self._current_packet: Dict[str, Any] = self._create_empty_packet()
        self._raw_buffer_lines: List[str] = []

    def _create_empty_packet(self) -> Dict[str, Any]:
        return {
            "front_distance_cm": None,
            "rear_distance_cm": None,
            "gas_level": None,
            "gas_status": None,
            "ldr_adc": None,
            "ldr_voltage_mv": None,
            "pir": None,
            "ir_obstacle": None,
            "dht11_status": "OK",
            "temperature_c": None,
            "humidity_pct": None,
            "pot_adc": None,
            "pot_voltage_mv": None,
            "oled_hardware_status": "ACTIVE",
            "oled_i2c_addr": "0x78",
            "raw_lines": [],
            "timestamp": time.time()
        }

    def parse_line(self, line: str) -> Optional[Dict[str, Any]]:
        """
        Parses a single serial text line.
        If a frame delimiter is encountered and sufficient data has been collected,
        returns the completed packet and resets the buffer.
        """
        clean_line = line.strip()
        if not clean_line:
            return None

        # Detect packet boundary delimiter
        if clean_line.startswith("======="):
            if self._has_sufficient_data(self._current_packet):
                completed = dict(self._current_packet)
                completed["raw_lines"] = list(self._raw_buffer_lines)
                completed["timestamp"] = time.time()
                # Reset for next packet
                self._current_packet = self._create_empty_packet()
                self._raw_buffer_lines = []
                return completed
            else:
                # Boundary encountered before enough data accumulated, reset
                self._current_packet = self._create_empty_packet()
                self._raw_buffer_lines = []
                return None

        self._raw_buffer_lines.append(clean_line)
        self._extract_metric_from_line(clean_line, self._current_packet)
        return None

    def _has_sufficient_data(self, packet: Dict[str, Any]) -> bool:
        # A packet is considered valid if at least one sensor reading is present
        keys_to_check = [
            "front_distance_cm", "rear_distance_cm", "gas_level",
            "ldr_adc", "pir", "ir_obstacle", "temperature_c", "pot_adc"
        ]
        return any(packet.get(k) is not None for k in keys_to_check)

    def _extract_metric_from_line(self, line: str, packet: Dict[str, Any]) -> None:
        """Extracts sensor metrics using flexible regexes matching all variations."""

        # 1. FRONT ULTRASONIC / HC-SR04
        # Examples: "FRONT ULTRASONIC : 25 cm", "FRONT ULTRASONIC : NO ECHO", "HC-SR04 : 45 cm", "HC-SR04 :  cm"
        m = re.search(r'(?:FRONT\s+ULTRASONIC|HC-SR04)\s*:\s*([^\r\n]+)', line, re.IGNORECASE)
        if m:
            val_str = m.group(1).strip()
            if "NO ECHO" in val_str.upper() or "ERROR" in val_str.upper() or val_str == "cm":
                packet["front_distance_cm"] = None
            else:
                num_m = re.search(r'(\d+(?:\.\d+)?)', val_str)
                if num_m:
                    packet["front_distance_cm"] = float(num_m.group(1))

        # 2. REAR ULTRASONIC
        # Examples: "REAR  ULTRASONIC : 7 cm", "REAR  ULTRASONIC : ERROR / NO ECHO"
        m = re.search(r'REAR\s+ULTRASONIC\s*:\s*([^\r\n]+)', line, re.IGNORECASE)
        if m:
            val_str = m.group(1).strip()
            if "NO ECHO" in val_str.upper() or "ERROR" in val_str.upper():
                packet["rear_distance_cm"] = None
            else:
                num_m = re.search(r'(\d+(?:\.\d+)?)', val_str)
                if num_m:
                    packet["rear_distance_cm"] = float(num_m.group(1))

        # 3. MQ GAS DIGITAL OUTPUT / LEVEL
        # Examples: "MQ GAS           : HIGH", "MQ GAS: LOW"
        m = re.search(r'MQ\s+GAS\s*:\s*(\w+)', line, re.IGNORECASE)
        if m:
            val = m.group(1).upper()
            packet["gas_level"] = val
            if packet["gas_status"] is None:
                packet["gas_status"] = "NORMAL" if val == "LOW" else "HAZARD"

        # 4. MQ STATUS
        # Example: "MQ STATUS: NORMAL", "MQ STATUS: DANGER"
        m = re.search(r'MQ\s+STATUS\s*:\s*(\w+)', line, re.IGNORECASE)
        if m:
            packet["gas_status"] = m.group(1).upper()

        # 5. PIR SENSOR
        # Examples: "PIR              : MOTION", "PIR : NO MOTION"
        m = re.search(r'PIR\s*:\s*([^\r\n]+)', line, re.IGNORECASE)
        if m:
            val = m.group(1).strip().upper()
            packet["pir"] = "MOTION" if "MOTION" in val and "NO" not in val else "NO MOTION"

        # 6. IR OBSTACLE
        # Examples: "IR OBSTACLE      : CLEAR", "IR OBST  : OBSTACLE"
        m = re.search(r'IR\s+(?:OBSTACLE|OBST)\s*:\s*(\w+)', line, re.IGNORECASE)
        if m:
            packet["ir_obstacle"] = m.group(1).upper()

        # 7. LDR ADC & VOLT
        # Examples: "LDR ADC          : 157 / 4095", "LDR ADC : 4081 / 4095"
        m = re.search(r'LDR\s+ADC\s*:\s*(\d+)', line, re.IGNORECASE)
        if m:
            packet["ldr_adc"] = int(m.group(1))

        # Example: "LDR VOLT         : 126 mV"
        m = re.search(r'LDR\s+VOLT\s*:\s*(\d+)', line, re.IGNORECASE)
        if m:
            packet["ldr_voltage_mv"] = int(m.group(1))

        # 8. DHT11 TEMP & HUMIDITY / ERROR
        # Examples: "DHT11            : READ ERROR"
        if re.search(r'DHT11\s*:\s*READ\s*ERROR', line, re.IGNORECASE):
            packet["dht11_status"] = "READ ERROR"
            packet["temperature_c"] = None
            packet["humidity_pct"] = None
        else:
            m_temp = re.search(r'DHT11\s+TEMP\s*:\s*(\d+(?:\.\d+)?)\s*C', line, re.IGNORECASE)
            if m_temp:
                packet["temperature_c"] = float(m_temp.group(1))
                packet["dht11_status"] = "OK"

            m_hum = re.search(r'DHT11\s+HUMIDITY\s*:\s*(\d+(?:\.\d+)?)\s*%', line, re.IGNORECASE)
            if m_hum:
                packet["humidity_pct"] = float(m_hum.group(1))
                packet["dht11_status"] = "OK"

        # 9. POTENTIOMETER ADC & VOLT
        # Examples: "POT ADC          : 4082 / 4095"
        m = re.search(r'POT\s+ADC\s*:\s*(\d+)', line, re.IGNORECASE)
        if m:
            packet["pot_adc"] = int(m.group(1))

        # Example: "POT VOLT         : 3289 mV"
        m = re.search(r'POT\s+VOLT\s*:\s*(\d+)', line, re.IGNORECASE)
        if m:
            packet["pot_voltage_mv"] = int(m.group(1))

        # 10. OLED I2C STATUS
        # Example: "OLED I2C STATUS  : ACTIVE (ADDR 0x78)"
        m_oled = re.search(r'OLED\s+(?:I2C\s+)?STATUS\s*:\s*([A-Za-z0-9_]+)(?:\s*\((?:ADDR\s*)?([0-9a-fxA-FX]+)\))?', line, re.IGNORECASE)
        if m_oled:
            packet["oled_hardware_status"] = m_oled.group(1).upper()
            if m_oled.group(2):
                packet["oled_i2c_addr"] = m_oled.group(2).upper()

    def parse_chunk(self, chunk: str) -> List[Dict[str, Any]]:
        """Parses a multi-line string/block of raw serial text and yields any completed packets."""
        results = []
        for line in chunk.splitlines():
            res = self.parse_line(line)
            if res:
                results.append(res)
        return results
