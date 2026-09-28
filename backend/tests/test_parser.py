import pytest
from backend.serial_parser import SerialParser

def test_parse_standard_stm32_packet():
    parser = SerialParser()
    raw_block = """
========================================
FRONT ULTRASONIC : 45 cm
REAR  ULTRASONIC : 12 cm
MQ GAS           : LOW
PIR              : NO MOTION
IR OBSTACLE      : CLEAR
LDR ADC          : 350 / 4095
LDR VOLT         : 280 mV
DHT11 TEMP       : 27 C
DHT11 HUMIDITY   : 62 %
POT ADC          : 2048 / 4095
POT VOLT         : 1650 mV
========================================
"""
    packets = parser.parse_chunk(raw_block)
    assert len(packets) == 1
    p = packets[0]
    assert p["front_distance_cm"] == 45.0
    assert p["rear_distance_cm"] == 12.0
    assert p["gas_level"] == "LOW"
    assert p["gas_status"] == "NORMAL"
    assert p["pir"] == "NO MOTION"
    assert p["ir_obstacle"] == "CLEAR"
    assert p["ldr_adc"] == 350
    assert p["ldr_voltage_mv"] == 280
    assert p["temperature_c"] == 27.0
    assert p["humidity_pct"] == 62.0
    assert p["pot_adc"] == 2048
    assert p["pot_voltage_mv"] == 1650
    assert p["dht11_status"] == "OK"

def test_parse_putty_compact_format():
    parser = SerialParser()
    raw_block = """
========================================
HC-SR04 : 32 cm
MQ GAS   : HIGH
MQ STATUS: HAZARD
LDR ADC  : 157 / 4095
LDR VOLT : 126 mV
PIR      : MOTION
IR OBST  : OBSTACLE
DHT11    : READ ERROR
POT ADC  : 4082 / 4095
POT VOLT : 3289 mV
========================================
"""
    packets = parser.parse_chunk(raw_block)
    assert len(packets) == 1
    p = packets[0]
    assert p["front_distance_cm"] == 32.0
    assert p["gas_level"] == "HIGH"
    assert p["gas_status"] == "HAZARD"
    assert p["pir"] == "MOTION"
    assert p["ir_obstacle"] == "OBSTACLE"
    assert p["dht11_status"] == "READ ERROR"
    assert p["temperature_c"] is None
    assert p["humidity_pct"] is None

def test_parse_no_echo_and_missing_sensors():
    parser = SerialParser()
    raw_block = """
========================================
FRONT ULTRASONIC : NO ECHO
REAR  ULTRASONIC : ERROR / NO ECHO
MQ GAS           : LOW
PIR              : NO MOTION
IR OBSTACLE      : CLEAR
LDR ADC          : 4080 / 4095
DHT11            : READ ERROR
========================================
"""
    packets = parser.parse_chunk(raw_block)
    assert len(packets) == 1
    p = packets[0]
    assert p["front_distance_cm"] is None
    assert p["rear_distance_cm"] is None
    assert p["dht11_status"] == "READ ERROR"
    assert p["ldr_adc"] == 4080
