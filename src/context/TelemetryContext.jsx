import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from 'react';

const TelemetryContext = createContext(null);

export const TelemetryProvider = ({ children }) => {
  // Navigation view: 'LANDING' | 'CONTROL_ROOM'
  const [activeView, setActiveView] = useState('LANDING');
  // Control Room Active Tab: 'OVERVIEW' | 'DIGITAL_TWIN' | 'VEHICLES' | 'ENVIRONMENT' | 'RISK_ENGINE' | 'COMMUNICATION' | 'SYSTEM_HEALTH'
  const [activeDashboardTab, setActiveDashboardTab] = useState('OVERVIEW');

  // Connection & Backend Health State
  const [wsConnected, setWsConnected] = useState(false);
  const [hardwareConnected, setHardwareConnected] = useState(false);
  const [comPort, setComPort] = useState('COM7');
  const [baudRate, setBaudRate] = useState(115200);
  const [isSimulatingLive, setIsSimulatingLive] = useState(false);
  const [lastPacketTime, setLastPacketTime] = useState(null);
  const [packetCount, setPacketCount] = useState(0);

  // Live Hardware Sensor Telemetry (NO simulated defaults)
  const [vehicleId, setVehicleId] = useState('V-01');
  const [v01Speed, setV01Speed] = useState(0.0);
  const [v02Speed, setV02Speed] = useState(0.0);
  const [v02Detected, setV02Detected] = useState(false);
  const [v2vActive, setV2vActive] = useState(true);
  const [battery, setBattery] = useState(100);

  const [frontDistance, setFrontDistance] = useState(null); // null means NO ECHO / CLEAR
  const [rearDistance, setRearDistance] = useState(null);
  const [leftDistance, setLeftDistance] = useState(null);
  const [rightDistance, setRightDistance] = useState(null);

  const [visibilityIndex, setVisibilityIndex] = useState(0.0);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [dht11Status, setDht11Status] = useState('READ ERROR');
  
  const [gasHazard, setGasHazard] = useState(false);
  const [gasLevel, setGasLevel] = useState('WAITING');
  const [pirMotion, setPirMotion] = useState(false);
  const [irObstacle, setIrObstacle] = useState(false);
  
  const [ldrAdc, setLdrAdc] = useState(null);
  const [ldrVolt, setLdrVolt] = useState(null);
  const [potAdc, setPotAdc] = useState(null);
  const [potVolt, setPotVolt] = useState(null);

  const [closingSpeed, setClosingSpeed] = useState(null);
  const [ttc, setTtc] = useState(null);

  // Risk Engine State
  const [riskAnalysis, setRiskAnalysis] = useState({
    risk_score: 0.0,
    risk_level: 'LOW',
    state: 'NORMAL',
    alerts: [],
    recommended_action: 'MAINTAIN_SPEED',
    safe_path: 'CLEAR',
    confidence: 1.0,
    factors: {
      distance_risk: 0.0,
      ttc_risk: 0.0,
      ir_obstacle_risk: 0.0,
      gas_risk: 0.0,
      personnel_risk: 0.0,
      visibility_risk: 0.0
    },
    thresholds: {
      critical_dist_cm: 30.0,
      warning_dist_cm: 60.0,
      critical_ttc_sec: 2.0
    }
  });

  // Digital Twin Structured State
  const [digitalTwin, setDigitalTwin] = useState({
    vehicle_present: true,
    vehicle_id: 'V-01',
    obstacle_present: false,
    obstacle_distance_m: null,
    obstacle_rear_distance_m: null,
    risk_level: 'LOW',
    risk_score: 0.0,
    visibility: 'CLEAR',
    visibility_pct: 100.0,
    safe_path: 'CLEAR',
    ir_obstacle: false,
    pir_motion: false,
    gas_hazard: false,
    vehicle_speed_kmh: 0.0,
    vehicle_direction: 'FORWARD'
  });

  // OLED Downlink & Hardware Status
  const [oledDownlink, setOledDownlink] = useState('OLED|WAITING_FOR_STM32_DATA\n');
  const [oledHardwareStatus, setOledHardwareStatus] = useState('ACTIVE');
  const [oledI2cAddr, setOledI2cAddr] = useState('0x78');

  // Subsystem Health Matrix
  const [sensorHealth, setSensorHealth] = useState({
    ultrasonic_front: 'OFFLINE',
    ultrasonic_rear: 'OFFLINE',
    gas_sensor: 'OFFLINE',
    ldr_sensor: 'OFFLINE',
    pir_sensor: 'OFFLINE',
    ir_sensor: 'OFFLINE',
    dht11_sensor: 'OFFLINE'
  });

  // Raw serial lines buffer (for live terminal inspection)
  const [rawSerialLines, setRawSerialLines] = useState([]);
  const [rawTelemetryPacket, setRawTelemetryPacket] = useState(null);

  // Safety Command History
  const [safetyCommand, setSafetyCommand] = useState('NORMAL');
  const [commandLog, setCommandLog] = useState([]);

  // WebSocket reference
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const lastPacketTimeRef = useRef(Date.now());

  // Navigation callbacks
  const navigateToControlRoom = useCallback(() => {
    setActiveView('CONTROL_ROOM');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const navigateToLanding = useCallback(() => {
    setActiveView('LANDING');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Update state from incoming REAL STM32 hardware payload
  const handleIncomingPayload = useCallback((payload) => {
    if (!payload || payload.status === 'INITIALIZING_HARDWARE') return;
    
    lastPacketTimeRef.current = Date.now();
    setRawTelemetryPacket(payload);
    setLastPacketTime(Date.now());
    setPacketCount((prev) => prev + 1);

    if (payload.hardware_connected !== undefined) {
      setHardwareConnected(payload.hardware_connected);
    }
    if (payload.is_simulated !== undefined) {
      setIsSimulatingLive(payload.is_simulated);
    }

    // Vehicle stats
    if (payload.vehicle) {
      if (payload.vehicle.vehicle_id) setVehicleId(payload.vehicle.vehicle_id);
      if (payload.vehicle.speed_kmh !== undefined) setV01Speed(payload.vehicle.speed_kmh);
    }

    // Raw sensor data lines
    if (payload.raw) {
      const r = payload.raw;
      if (r.raw_lines && r.raw_lines.length > 0) {
        setRawSerialLines(r.raw_lines);
      }
      if (r.ldr_adc !== undefined) setLdrAdc(r.ldr_adc);
      if (r.ldr_voltage_mv !== undefined) setLdrVolt(r.ldr_voltage_mv);
      if (r.pot_adc !== undefined) setPotAdc(r.pot_adc);
      if (r.pot_voltage_mv !== undefined) setPotVolt(r.pot_voltage_mv);
      if (r.dht11_status !== undefined) setDht11Status(r.dht11_status);
      if (r.gas_level) setGasLevel(r.gas_level);
      if (r.pir) setPirMotion(r.pir === 'MOTION');
      if (r.ir_obstacle) setIrObstacle(r.ir_obstacle === 'OBSTACLE');
      if (r.oled_hardware_status) setOledHardwareStatus(r.oled_hardware_status);
      if (r.oled_i2c_addr) setOledI2cAddr(r.oled_i2c_addr);
    }

    // Processed sensor metrics
    if (payload.processed) {
      const p = payload.processed;
      if (p.front_distance_cm) {
        const val = p.front_distance_cm.value;
        setFrontDistance(val);
        setV02Detected(val !== null);
      }
      if (p.rear_distance_cm) {
        setRearDistance(p.rear_distance_cm.value);
      }
      if (p.visibility_index && p.visibility_index.value !== undefined) {
        setVisibilityIndex(p.visibility_index.value);
      }
      if (p.environment) {
        setTemperature(p.environment.temperature_c);
        setHumidity(p.environment.humidity_pct);
      }
      if (p.gas_hazard) {
        setGasHazard(p.gas_hazard.detected || false);
        setGasLevel(p.gas_hazard.level || 'LOW');
      }
      if (p.personnel_detected) {
        setPirMotion(p.personnel_detected.value || false);
      }
      if (p.ir_obstacle_present) {
        setIrObstacle(p.ir_obstacle_present.value || false);
      }
      if (p.sensor_health) {
        setSensorHealth(p.sensor_health);
      }
    }

    // Kinematic TTC
    if (payload.ttc) {
      setTtc(payload.ttc.ttc_seconds);
      if (payload.ttc.closing_speed_kmh !== undefined) {
        setClosingSpeed(payload.ttc.closing_speed_kmh);
      }
    }

    // Risk Engine
    if (payload.risk) {
      setRiskAnalysis(payload.risk);
    }

    // Digital Twin
    if (payload.digital_twin) {
      setDigitalTwin(payload.digital_twin);
    }

    // OLED downlink frame
    if (payload.oled && payload.oled.downlink_frame) {
      setOledDownlink(payload.oled.downlink_frame);
    }
  }, []);

  // WebSocket Connection Lifecycle
  useEffect(() => {
    let isMounted = true;
    const host = window.location.hostname || 'localhost';
    const wsUrl = `ws://${host}:8000/ws/telemetry`;
    const apiBase = `http://${host}:8000/api`;

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setWsConnected(true);
          console.log(`[MLVS] Connected to physical STM32 telemetry stream at ${wsUrl}`);
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            handleIncomingPayload(data);
          } catch (e) {
            console.error('[MLVS] Error parsing WebSocket message:', e);
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setWsConnected(false);
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 1500);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch (err) {
        if (!isMounted) return;
        setWsConnected(false);
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 2000);
      }
    };

    connectWebSocket();

    // Fallback REST polling if WebSocket is reconnecting or stale
    const pollInterval = setInterval(async () => {
      const isStale = (Date.now() - lastPacketTimeRef.current) > 1200;
      const wsNotOpen = !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN;

      if (wsNotOpen || isStale) {
        try {
          const res = await fetch(`${apiBase}/telemetry/latest`);
          if (res.ok) {
            const data = await res.json();
            handleIncomingPayload(data);
          }
        } catch (_) {}
      }
    }, 500);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [handleIncomingPayload]);

  // Issue safety override command
  const issueSafetyCommand = useCallback(async (commandName) => {
    setSafetyCommand(commandName);
    const host = window.location.hostname || 'localhost';
    try {
      const res = await fetch(`http://${host}:8000/api/safety/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: commandName, issued_by: 'CONTROL_ROOM' })
      });
      if (res.ok) {
        const data = await res.json();
        setCommandLog((prev) => [data.log, ...prev].slice(0, 30));
      }
    } catch (e) {
      setCommandLog((prev) => [
        { id: Date.now(), timestamp: new Date().toISOString(), command: commandName, issued_by: 'CONTROL_ROOM', status: 'DISPATCHED' },
        ...prev
      ].slice(0, 30));
    }
  }, []);

  const value = {
    // Navigation
    activeView,
    navigateToControlRoom,
    navigateToLanding,
    activeDashboardTab,
    setActiveDashboardTab,

    // Hardware Connectivity
    wsConnected,
    hardwareConnected,
    comPort,
    baudRate,
    isSimulatingLive,
    lastPacketTime,
    packetCount,

    // Live Physical Telemetry
    vehicleId,
    v01Speed,
    setV01Speed,
    v02Speed,
    v02Detected,
    v2vActive,
    setV2vActive,
    battery,
    
    frontDistance,
    setFrontDistance,
    rearDistance,
    setRearDistance,
    leftDistance,
    rightDistance,
    
    visibilityIndex,
    setVisibilityIndex,
    temperature,
    humidity,
    dht11Status,
    
    gasHazard,
    gasLevel,
    pirMotion,
    irObstacle,
    
    ldrAdc,
    ldrVolt,
    potAdc,
    potVolt,
    
    closingSpeed,
    ttc,

    // Risk Engine & Decisions
    riskAnalysis,
    digitalTwin,
    oledDownlink,
    oledHardwareStatus,
    oledI2cAddr,
    sensorHealth,

    // Raw Serial Stream
    rawSerialLines,
    rawTelemetryPacket,

    // Safety Commands
    safetyCommand,
    issueSafetyCommand,
    commandLog
  };

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};
