# MLVS — Mine Low-Visibility Support Platform
### Full-Stack Real-Time Safety & Digital Twin Control Room for Autonomous & Instrumented Mining Vehicles

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![STM32](https://img.shields.io/badge/STM32-NUCLEO--F446RE-03234B?logo=stmicroelectronics&logoColor=white)](https://www.st.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org)

---

## 1. System Overview & Physical Architecture

The **MLVS (Mine Low-Visibility Support System)** is an industrial driver-assistance and autonomous hazard mitigation platform designed for open-cast and underground haulage corridors. It fuses real-time acoustic, optical, atmospheric, and infrared telemetry from an instrumented **STM32 NUCLEO-F446RE** controller into an authoritative multi-factor Risk Engine, a live 2D haul-corridor Digital Twin, and a closed-loop OLED downlink.

```
[ PHYSICAL SENSORS ]
  ├── Front HC-SR04 Ultrasonic (TRIG: PA8, ECHO: PB10)
  ├── Rear HC-SR04 Ultrasonic  (TRIG: PC7, ECHO: PB4)
  ├── MQ Series Gas Sensor     (DO: PC0)
  ├── LDR Photocell            (PA4 / ADC2_IN4)
  ├── HC-SR501 PIR Sensor      (PB0)
  ├── IR Obstacle Avoidance    (PB1)
  ├── DHT11 Temp & Humidity    (PA9)
  └── Potentiometer Throttle   (PA4 / ADC2_IN4)
             │
             ▼
[ STM32 NUCLEO-F446RE ] (115200 8N1 @ USB Virtual COM Port)
             │
             ▼ COM7 USB Serial
[ PYTHON FASTAPI BACKEND ]
  ├── Serial Manager (Auto-reconnecting thread, resilient packet buffer)
  ├── Multi-Pattern Serial Parser (Delimiters, errors, whitespace tolerance)
  ├── Preprocessing Service (Normalization, LDR lux/fog index, trend filtering)
  ├── Kinematic TTC Engine (Time-to-Collision = distance / closing_speed)
  ├── Multi-Factor Risk Engine (0-100 composite score, alerts, safe path)
  ├── OLED Downlink Controller (OLED|RISK=...|TTC=...|DIST=...|ACT=...|PATH=...)
  ├── WebSocket Broadcaster (Real-time sub-20ms broadcast to Control Room)
  └── SQLAlchemy Persistence (PostgreSQL primary with graceful SQLite fallback)
             │
   ┌─────────┴─────────┬──────────────────────┐
   ▼                   ▼                      ▼
[ CONTROL ROOM UI ]  [ DIGITAL TWIN ]   [ OLED DOWNLINK ]
Live HUD telemetry,  2D tactical radar  Bidirectional UART
safety override      corridor, reactive transmission back
command dispatch     fog attenuation    to STM32 display
```

---

## 2. Hardware Setup & Pin Mapping

| Peripheral / Sensor | Physical STM32 Pin | Interface / Configuration | Function |
| :--- | :--- | :--- | :--- |
| **Front HC-SR04 Trig** | `PA8` | GPIO Output Push-Pull | 10µs ultrasonic trigger |
| **Front HC-SR04 Echo** | `PB10` | GPIO Input (DWT timer) | Acoustic time-of-flight |
| **Rear HC-SR04 Trig** | `PC7` | GPIO Output Push-Pull | Rear obstacle trigger |
| **Rear HC-SR04 Echo** | `PB4` | GPIO Input (DWT timer) | Rear proximity measurement |
| **MQ Gas Sensor DO** | `PC0` | GPIO Input | Active HIGH toxic gas/smoke |
| **LDR Light Sensor** | `PA4` | ADC2 Channel 4 (12-bit) | Fog optical attenuation |
| **Potentiometer** | `PA4` | ADC2 Channel 4 (12-bit) | Speed throttle / control input |
| **HC-SR501 PIR** | `PB0` | GPIO Input | Corridor personnel motion |
| **IR Obstacle Sensor** | `PB1` | GPIO Input | Near-field blind spot barrier |
| **DHT11 Sensor** | `PA9` | GPIO Bi-directional | Ambient temperature & humidity |
| **UART2 Bridge** | `PA2` (TX), `PA3` (RX) | USART2 @ 115200 Baud | USB Virtual COM Port (`COM7`) |
| **I2C1 OLED** | `PB8` (SCL), `PB9` (SDA) | I2C Standard Mode | SSD1306 128x64 display |

---

## 3. Quick Start Guide

### Prerequisites
- Python 3.10+ (tested with Python 3.14)
- Node.js 18+ and npm
- Physical STM32 connected to USB (defaults to `COM7`)
- PostgreSQL (optional; defaults to local SQLite if offline)

### Step 1: Start the Backend (Terminal 1)
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- WebSocket Endpoint: `ws://localhost:8000/ws/telemetry`
- Health Endpoint: [http://localhost:8000/api/health](http://localhost:8000/api/health)

### Step 2: Start the Frontend (Terminal 2)
```bash
npm run dev
```
- Open browser at [http://localhost:5173](http://localhost:5173)
- Click **ENTER CONTROL ROOM** to access live mission control and the Digital Twin.

---

## 4. Backend Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend and database connection health check |
| `GET` | `/api/status` | Serial port status, packet counts, active WebSocket clients |
| `GET` | `/api/telemetry/latest`| Complete processed telemetry frame and Digital Twin state |
| `GET` | `/api/risk` | Authoritative Risk Engine factors and alerts |
| `GET` | `/api/alerts` | Rolling log of recent safety alarms |
| `GET` | `/api/vehicle` | Vehicle configuration and ground speed |
| `POST` | `/api/serial/connect` | Switch COM port or baud rate dynamically |
| `POST` | `/api/serial/disconnect`| Safely release the serial COM port |
| `POST` | `/api/simulation/start` | Enable synthetic scenario testing |
| `POST` | `/api/simulation/stop` | Resume real hardware ingestion |
| `POST` | `/api/simulation/scenario`| Inject test scenarios (`APPROACHING_HAZARD`, `FOG_CORRIDOR`, `GAS_LEAK`, `PERSONNEL_TRIP`) |
| `POST` | `/api/safety/command` | Dispatch emergency override command to vehicle |
| `WS` | `/ws/telemetry` | Sub-20ms real-time telemetry stream |

---

## 5. Kinematic Time-to-Collision (TTC) & Risk Scoring

### Kinematic Derivation
The closing speed is computed discretely from successive valid HC-SR04 acoustic measurements:
$$v_{\text{closing}} = \frac{d_{t-1} - d_{t}}{\Delta t}$$

If $v_{\text{closing}} > 0.05 \text{ m/s}$ and distance is valid:
$$\text{TTC} = \frac{d_t}{v_{\text{closing}}}$$

If the obstacle is stationary or opening, $\text{TTC} = \text{None}$ and status is marked `STABLE_OR_OPENING`. Closing speed is **never fabricated**.

### Multi-Factor Risk Score
Composite Risk Score ($0 - 100$) integrates:
- **Proximity Distance Factor ($35\%$)**: $<30\text{cm}$ Critical, $<60\text{cm}$ Warning, $<100\text{cm}$ Buffer.
- **Kinematic TTC Factor ($25\%$)**: $<2.0\text{s}$ Critical, $<4.0\text{s}$ Warning.
- **Near-Field IR Obstacle Factor ($15\%$)**: Direct blind-spot hazard penalty.
- **MQ Gas Hazard Factor ($15\%$)**: Toxic gas or smoke alarm.
- **PIR Personnel Presence ($5\%$)**: Personnel walking in haul road.
- **Optical Visibility Factor ($5\%$)**: LDR attenuation during heavy fog.

---

## 6. OLED Downlink Protocol & STM32 Integration

The backend continuously serializes operational guidance for the driver's onboard OLED:
```text
OLED|RISK={LEVEL}|TTC={TTC_SEC}|DIST={DIST_M}|ACT={ACTION}|PATH={PATH}\n
```

### Protocol Format Example
```text
OLED|RISK=CRITICAL|TTC=1.4s|DIST=0.2m|ACT=STOP|PATH=HALT
OLED|RISK=HIGH|TTC=2.8s|DIST=4.2m|ACT=SLOW|PATH=LEFT
OLED|RISK=LOW|TTC=--|DIST=1.2m|ACT=NORMAL|PATH=CLEAR
```

### STM32 C Firmware Integration
To receive downlink commands on UART2, enable RX interrupts in `main.c`:

```c
/* In main.c USER CODE BEGIN PV */
uint8_t rx_byte;
char oled_rx_buf[128];
uint8_t oled_rx_idx = 0;

/* In main.c USER CODE BEGIN 2 */
HAL_UART_Receive_IT(&huart2, &rx_byte, 1);

/* In main.c USER CODE BEGIN 4 */
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
    if (huart->Instance == USART2)
    {
        if (rx_byte == '\n' || rx_byte == '\r')
        {
            oled_rx_buf[oled_rx_idx] = '\0';
            if (strncmp(oled_rx_buf, "OLED|", 5) == 0)
            {
                // Parse RISK, TTC, DIST, ACT, PATH and render to SSD1306 via I2C1
                // Example: SSD1306_DrawString(oled_rx_buf + 5);
            }
            oled_rx_idx = 0;
        }
        else if (oled_rx_idx < sizeof(oled_rx_buf) - 1)
        {
            oled_rx_buf[oled_rx_idx++] = rx_byte;
        }
        HAL_UART_Receive_IT(&huart2, &rx_byte, 1);
    }
}
```

---

## 7. PostgreSQL Database Configuration

### Configure Database URL
Edit `backend/.env`:
```ini
DATABASE_URL=postgresql+psycopg2://postgres:<your_password>@localhost:5432/mlvs_db
```

### Initialize Database Tables
Run the schema script:
```bash
psql -U postgres -d mlvs_db -f database/schema.sql
```

> **Note**: If PostgreSQL is temporarily offline or credentials are not yet supplied, the backend automatically logs a warning and stores records in `backend/telemetry.db` via SQLite, ensuring continuous uptime.

---

## 8. Automated Testing

Run the full pytest suite:
```bash
python -m pytest backend/tests
```

**Test Coverage**:
- `test_parser.py`: Multi-format parsing, `NO ECHO`, missing sensor recovery.
- `test_ttc.py`: Kinematic closing speed, TTC validation, stationary obstacle logic.
- `test_risk_engine.py`: Dynamic risk scaling ($150\text{cm} \to 50\text{cm} \to 20\text{cm}$), gas override.
- `test_oled.py`: Downlink serialization and boundary handling.
