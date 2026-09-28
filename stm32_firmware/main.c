/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.c
  * @brief          : SIH Sensor Testing
  *
  * Sensors:
  *   FRONT HC-SR04 : TRIG PA8,  ECHO PB10
  *   REAR  HC-SR04 : TRIG PC7,  ECHO PB4
  *   MQ Gas DO     : PC0
  *   LDR           : PA4 / ADC2_IN4
  *   Potentiometer : ADC2_IN4 / PA4
  *   PIR           : PB0
  *   IR obstacle   : PB1
  *   DHT11         : PA9
  *
  * UART2:
  *   TX PA2
  *   RX PA3
  *
  * I2C1:
  *   Reserved for OLED
  ******************************************************************************
  */
/* USER CODE END Header */

/* Includes ------------------------------------------------------------------*/
#include "main.h"
#include <stdio.h>
#include <string.h>

/* Private variables ---------------------------------------------------------*/

ADC_HandleTypeDef hadc1;
ADC_HandleTypeDef hadc2;

I2C_HandleTypeDef hi2c1;

UART_HandleTypeDef huart2;


/* Private function prototypes -----------------------------------------------*/

void SystemClock_Config(void);

static void MX_GPIO_Init(void);
static void MX_USART2_UART_Init(void);
static void MX_ADC1_Init(void);
static void MX_ADC2_Init(void);
static void MX_I2C1_Init(void);


/* USER CODE BEGIN 0 */


/* ============================================================
   DWT MICROSECOND TIMER
   ============================================================ */

void DWT_Init(void)
{
    CoreDebug->DEMCR |= CoreDebug_DEMCR_TRCENA_Msk;

    DWT->CYCCNT = 0;

    DWT->CTRL |= DWT_CTRL_CYCCNTENA_Msk;
}


void delay_us(uint32_t us)
{
    uint32_t start = DWT->CYCCNT;

    uint32_t cycles =
        us * (HAL_RCC_GetHCLKFreq() / 1000000U);

    while ((DWT->CYCCNT - start) < cycles)
    {
        /* wait */
    }
}


/* ============================================================
   FRONT HC-SR04
   TRIG = PA8
   ECHO = PB10
   ============================================================ */

float HCSR04_Front_ReadDistance(void)
{
    uint32_t start_time;
    uint32_t end_time;
    uint32_t timeout_start;
    uint32_t pulse_us;

    /* Make sure trigger is LOW */
    HAL_GPIO_WritePin(
        GPIOA,
        GPIO_PIN_8,
        GPIO_PIN_RESET
    );

    delay_us(2);

    /* 10 us trigger pulse */
    HAL_GPIO_WritePin(
        GPIOA,
        GPIO_PIN_8,
        GPIO_PIN_SET
    );

    delay_us(10);

    HAL_GPIO_WritePin(
        GPIOA,
        GPIO_PIN_8,
        GPIO_PIN_RESET
    );


    /* Wait for ECHO to become HIGH */
    timeout_start = DWT->CYCCNT;

    while (HAL_GPIO_ReadPin(
               GPIOB,
               GPIO_PIN_10) == GPIO_PIN_RESET)
    {
        if ((DWT->CYCCNT - timeout_start) >
            (HAL_RCC_GetHCLKFreq() / 33U))
        {
            return -1.0f;
        }
    }


    /* ECHO HIGH */
    start_time = DWT->CYCCNT;


    /* Wait for ECHO to become LOW */
    timeout_start = DWT->CYCCNT;

    while (HAL_GPIO_ReadPin(
               GPIOB,
               GPIO_PIN_10) == GPIO_PIN_SET)
    {
        if ((DWT->CYCCNT - timeout_start) >
            (HAL_RCC_GetHCLKFreq() / 25U))
        {
            return -1.0f;
        }
    }


    /* ECHO LOW */
    end_time = DWT->CYCCNT;


    /* Convert CPU cycles to microseconds */
    pulse_us =
        (end_time - start_time) /
        (HAL_RCC_GetHCLKFreq() / 1000000U);


    /* Distance in cm */
    return pulse_us / 58.0f;
}


/* ============================================================
   REAR HC-SR04
   TRIG = PC7
   ECHO = PB4
   ============================================================ */

float HCSR04_Rear_ReadDistance(void)
{
    uint32_t start_time;
    uint32_t end_time;
    uint32_t timeout_start;
    uint32_t pulse_us;

    /* Make sure trigger is LOW */
    HAL_GPIO_WritePin(
        GPIOC,
        GPIO_PIN_7,
        GPIO_PIN_RESET
    );

    delay_us(2);

    /* 10 us trigger pulse */
    HAL_GPIO_WritePin(
        GPIOC,
        GPIO_PIN_7,
        GPIO_PIN_SET
    );

    delay_us(10);

    HAL_GPIO_WritePin(
        GPIOC,
        GPIO_PIN_7,
        GPIO_PIN_RESET
    );


    /* Wait for ECHO to become HIGH */
    timeout_start = DWT->CYCCNT;

    while (HAL_GPIO_ReadPin(
               GPIOB,
               GPIO_PIN_4) == GPIO_PIN_RESET)
    {
        if ((DWT->CYCCNT - timeout_start) >
            (HAL_RCC_GetHCLKFreq() / 33U))
        {
            return -1.0f;
        }
    }


    /* ECHO HIGH */
    start_time = DWT->CYCCNT;


    /* Wait for ECHO to become LOW */
    timeout_start = DWT->CYCCNT;

    while (HAL_GPIO_ReadPin(
               GPIOB,
               GPIO_PIN_4) == GPIO_PIN_SET)
    {
        if ((DWT->CYCCNT - timeout_start) >
            (HAL_RCC_GetHCLKFreq() / 25U))
        {
            return -1.0f;
        }
    }


    /* ECHO LOW */
    end_time = DWT->CYCCNT;


    /* Convert CPU cycles to microseconds */
    pulse_us =
        (end_time - start_time) /
        (HAL_RCC_GetHCLKFreq() / 1000000U);


    /* Distance in cm */
    return pulse_us / 58.0f;
}


/* ============================================================
   ADC READ FUNCTION
   ============================================================ */

uint32_t Read_ADC(ADC_HandleTypeDef *hadc)
{
    uint32_t value = 0;

    if (HAL_ADC_Start(hadc) == HAL_OK)
    {
        if (HAL_ADC_PollForConversion(
                hadc,
                100) == HAL_OK)
        {
            value = HAL_ADC_GetValue(hadc);
        }

        HAL_ADC_Stop(hadc);
    }

    return value;
}


/* ============================================================
   ADC VALUE TO VOLTAGE
   ============================================================ */

float ADC_To_Voltage(uint32_t adc)
{
    return ((float)adc * 3.3f) / 4095.0f;
}


/* ============================================================
   DHT11
   DATA = PA9
   ============================================================ */

/*
 * DHT11 uses a single bidirectional data line.
 *
 * The GPIO is changed between:
 *   OUTPUT open-drain
 *   INPUT
 *
 * A pull-up resistor is required on the DATA line.
 */


static void DHT11_Pin_Output(void)
{
    GPIO_InitTypeDef GPIO_InitStruct = {0};

    GPIO_InitStruct.Pin = GPIO_PIN_9;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_OD;
    GPIO_InitStruct.Pull = GPIO_PULLUP;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;

    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
}


static void DHT11_Pin_Input(void)
{
    GPIO_InitTypeDef GPIO_InitStruct = {0};

    GPIO_InitStruct.Pin = GPIO_PIN_9;
    GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
    GPIO_InitStruct.Pull = GPIO_PULLUP;

    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
}


/*
 * Wait until pin reaches required state.
 * Returns 0 if successful.
 * Returns 1 on timeout.
 */

static uint8_t DHT11_WaitForState(
    GPIO_PinState state,
    uint32_t timeout_us)
{
    uint32_t start = DWT->CYCCNT;

    uint32_t timeout_cycles =
        timeout_us *
        (HAL_RCC_GetHCLKFreq() / 1000000U);

    while (HAL_GPIO_ReadPin(
               GPIOA,
               GPIO_PIN_9) != state)
    {
        if ((DWT->CYCCNT - start) > timeout_cycles)
        {
            return 1;
        }
    }

    return 0;
}


/*
 * Read DHT11.
 *
 * Returns:
 *   0 = success
 *   1 = timeout/error
 */

uint8_t DHT11_Read(
    uint8_t *temperature,
    uint8_t *humidity)
{
    uint8_t data[5] = {0};

    uint32_t start;
    uint32_t duration;

    uint8_t i;


    /* --------------------------------------------------------
       START SIGNAL
       -------------------------------------------------------- */

    DHT11_Pin_Output();

    HAL_GPIO_WritePin(
        GPIOA,
        GPIO_PIN_9,
        GPIO_PIN_RESET
    );

    /*
     * DHT11 requires at least 18 ms LOW.
     */
    HAL_Delay(20);

    /*
     * Release line.
     */
    HAL_GPIO_WritePin(
        GPIOA,
        GPIO_PIN_9,
        GPIO_PIN_SET
    );

    delay_us(30);

    DHT11_Pin_Input();


    /* --------------------------------------------------------
       SENSOR RESPONSE
       -------------------------------------------------------- */

    /*
     * Sensor pulls LOW for approximately 80 us.
     */
    if (DHT11_WaitForState(
            GPIO_PIN_RESET,
            100) != 0)
    {
        return 1;
    }


    /*
     * Sensor pulls HIGH for approximately 80 us.
     */
    if (DHT11_WaitForState(
            GPIO_PIN_SET,
            100) != 0)
    {
        return 1;
    }


    /*
     * Wait for beginning of first data bit.
     */
    if (DHT11_WaitForState(
            GPIO_PIN_RESET,
            100) != 0)
    {
        return 1;
    }


    /* --------------------------------------------------------
       READ 40 BITS
       -------------------------------------------------------- */

    for (i = 0; i < 40; i++)
    {
        /*
         * Each bit starts with approximately 50 us LOW.
         */
        if (DHT11_WaitForState(
                GPIO_PIN_SET,
                100) != 0)
        {
            return 1;
        }


        /*
         * Measure HIGH duration.
         */
        start = DWT->CYCCNT;

        if (DHT11_WaitForState(
                GPIO_PIN_RESET,
                120) != 0)
        {
            return 1;
        }

        duration =
            (DWT->CYCCNT - start) /
            (HAL_RCC_GetHCLKFreq() / 1000000U);


        /*
         * Approximately:
         *
         * 26-28 us = bit 0
         * ~70 us    = bit 1
         */
        data[i / 8] <<= 1;

        if (duration > 50)
        {
            data[i / 8] |= 1;
        }
    }


    /* --------------------------------------------------------
       CHECKSUM
       -------------------------------------------------------- */

    if ((uint8_t)(
            data[0] +
            data[1] +
            data[2] +
            data[3])
        != data[4])
    {
        return 1;
    }


    *humidity = data[0];
    *temperature = data[2];

    return 0;
}


/* ============================================================
   SSD1306 0.96" I2C OLED DRIVER (128x64)
   ============================================================ */
static uint8_t SSD1306_Buffer[1024];
static uint8_t SSD1306_I2C_Addr = 0x78; // Auto-detected (0x78 or 0x7A)

// Standard 5x7 ASCII Font (characters 32 to 126)
static const uint8_t Font5x7[][5] = {
    {0x00, 0x00, 0x00, 0x00, 0x00}, // Space
    {0x00, 0x00, 0x5F, 0x00, 0x00}, // !
    {0x00, 0x07, 0x00, 0x07, 0x00}, // "
    {0x14, 0x7F, 0x14, 0x7F, 0x14}, // #
    {0x24, 0x2A, 0x7F, 0x2A, 0x12}, // $
    {0x23, 0x13, 0x08, 0x64, 0x62}, // %
    {0x36, 0x49, 0x55, 0x22, 0x50}, // &
    {0x00, 0x05, 0x03, 0x00, 0x00}, // '
    {0x00, 0x1C, 0x22, 0x41, 0x00}, // (
    {0x00, 0x41, 0x22, 0x1C, 0x00}, // )
    {0x14, 0x08, 0x3E, 0x08, 0x14}, // *
    {0x08, 0x08, 0x3E, 0x08, 0x08}, // +
    {0x00, 0x50, 0x30, 0x00, 0x00}, // ,
    {0x08, 0x08, 0x08, 0x08, 0x08}, // -
    {0x00, 0x60, 0x60, 0x00, 0x00}, // .
    {0x20, 0x10, 0x08, 0x04, 0x02}, // /
    {0x3E, 0x51, 0x49, 0x45, 0x3E}, // 0
    {0x00, 0x42, 0x7F, 0x40, 0x00}, // 1
    {0x42, 0x61, 0x51, 0x49, 0x46}, // 2
    {0x21, 0x41, 0x45, 0x4B, 0x31}, // 3
    {0x18, 0x14, 0x12, 0x7F, 0x10}, // 4
    {0x27, 0x45, 0x45, 0x45, 0x39}, // 5
    {0x3C, 0x4A, 0x49, 0x49, 0x30}, // 6
    {0x01, 0x71, 0x09, 0x05, 0x03}, // 7
    {0x36, 0x49, 0x49, 0x49, 0x36}, // 8
    {0x06, 0x49, 0x49, 0x29, 0x1E}, // 9
    {0x00, 0x36, 0x36, 0x00, 0x00}, // :
    {0x00, 0x56, 0x36, 0x00, 0x00}, // ;
    {0x08, 0x14, 0x22, 0x41, 0x00}, // <
    {0x14, 0x14, 0x14, 0x14, 0x14}, // =
    {0x00, 0x41, 0x22, 0x14, 0x08}, // >
    {0x02, 0x01, 0x51, 0x09, 0x06}, // ?
    {0x32, 0x49, 0x79, 0x41, 0x3E}, // @
    {0x7E, 0x11, 0x11, 0x11, 0x7E}, // A
    {0x7F, 0x49, 0x49, 0x49, 0x36}, // B
    {0x3E, 0x41, 0x41, 0x41, 0x22}, // C
    {0x7F, 0x41, 0x41, 0x22, 0x1C}, // D
    {0x7F, 0x49, 0x49, 0x49, 0x41}, // E
    {0x7F, 0x09, 0x09, 0x09, 0x01}, // F
    {0x3E, 0x41, 0x49, 0x49, 0x7A}, // G
    {0x7F, 0x08, 0x08, 0x08, 0x7F}, // H
    {0x00, 0x41, 0x7F, 0x41, 0x00}, // I
    {0x20, 0x40, 0x41, 0x3F, 0x01}, // J
    {0x7F, 0x08, 0x14, 0x22, 0x41}, // K
    {0x7F, 0x40, 0x40, 0x40, 0x40}, // L
    {0x7F, 0x02, 0x0C, 0x02, 0x7F}, // M
    {0x7F, 0x04, 0x08, 0x10, 0x7F}, // N
    {0x3E, 0x41, 0x41, 0x41, 0x3E}, // O
    {0x7F, 0x09, 0x09, 0x09, 0x06}, // P
    {0x3E, 0x41, 0x51, 0x21, 0x5E}, // Q
    {0x7F, 0x09, 0x19, 0x29, 0x46}, // R
    {0x46, 0x49, 0x49, 0x49, 0x31}, // S
    {0x01, 0x01, 0x7F, 0x01, 0x01}, // T
    {0x3F, 0x40, 0x40, 0x40, 0x3F}, // U
    {0x1F, 0x20, 0x40, 0x20, 0x1F}, // V
    {0x3F, 0x40, 0x38, 0x40, 0x3F}, // W
    {0x63, 0x14, 0x08, 0x14, 0x63}, // X
    {0x07, 0x08, 0x70, 0x08, 0x07}, // Y
    {0x61, 0x51, 0x49, 0x45, 0x43}, // Z
    {0x00, 0x7F, 0x41, 0x41, 0x00}, // [
    {0x02, 0x04, 0x08, 0x10, 0x20}, // backslash
    {0x00, 0x41, 0x41, 0x7F, 0x00}, // ]
    {0x04, 0x02, 0x01, 0x02, 0x04}, // ^
    {0x40, 0x40, 0x40, 0x40, 0x40}, // _
    {0x00, 0x01, 0x02, 0x04, 0x00}, // `
    {0x20, 0x54, 0x54, 0x54, 0x78}, // a
    {0x7F, 0x48, 0x44, 0x44, 0x38}, // b
    {0x38, 0x44, 0x44, 0x44, 0x20}, // c
    {0x38, 0x44, 0x44, 0x48, 0x7F}, // d
    {0x38, 0x54, 0x54, 0x54, 0x18}, // e
    {0x08, 0x7E, 0x09, 0x01, 0x02}, // f
    {0x0C, 0x52, 0x52, 0x52, 0x3E}, // g
    {0x7F, 0x08, 0x04, 0x04, 0x78}, // h
    {0x00, 0x44, 0x7D, 0x40, 0x00}, // i
    {0x20, 0x40, 0x44, 0x3D, 0x00}, // j
    {0x7F, 0x10, 0x28, 0x44, 0x00}, // k
    {0x00, 0x41, 0x7F, 0x40, 0x00}, // l
    {0x7C, 0x04, 0x18, 0x04, 0x78}, // m
    {0x7C, 0x08, 0x04, 0x04, 0x78}, // n
    {0x38, 0x44, 0x44, 0x44, 0x38}, // o
    {0x7C, 0x14, 0x14, 0x14, 0x08}, // p
    {0x08, 0x14, 0x14, 0x18, 0x7C}, // q
    {0x7C, 0x08, 0x04, 0x04, 0x08}, // r
    {0x48, 0x54, 0x54, 0x54, 0x20}, // s
    {0x04, 0x3F, 0x44, 0x40, 0x20}, // t
    {0x3C, 0x40, 0x40, 0x20, 0x7C}, // u
    {0x1C, 0x20, 0x40, 0x20, 0x1C}, // v
    {0x3C, 0x40, 0x30, 0x40, 0x3C}, // w
    {0x44, 0x28, 0x10, 0x28, 0x44}, // x
    {0x0C, 0x50, 0x50, 0x50, 0x3C}, // y
    {0x44, 0x64, 0x54, 0x4C, 0x44}, // z
    {0x00, 0x08, 0x36, 0x41, 0x00}, // {
    {0x00, 0x00, 0x7F, 0x00, 0x00}, // |
    {0x00, 0x41, 0x36, 0x08, 0x00}, // }
    {0x08, 0x08, 0x2A, 0x1C, 0x08}  // ~
};

static HAL_StatusTypeDef SSD1306_WriteCommand(uint8_t cmd)
{
    return HAL_I2C_Mem_Write(&hi2c1, SSD1306_I2C_Addr, 0x00, I2C_MEMADD_SIZE_8BIT, &cmd, 1, 20);
}

static HAL_StatusTypeDef SSD1306_WriteData(uint8_t *data, uint16_t size)
{
    return HAL_I2C_Mem_Write(&hi2c1, SSD1306_I2C_Addr, 0x40, I2C_MEMADD_SIZE_8BIT, data, size, 50);
}

static uint8_t SSD1306_Init(void)
{
    HAL_Delay(100);

    // Auto-probe I2C addresses 0x78 (0x3C<<1) and 0x7A (0x3D<<1)
    if (HAL_I2C_IsDeviceReady(&hi2c1, 0x78, 3, 50) == HAL_OK)
    {
        SSD1306_I2C_Addr = 0x78;
    }
    else if (HAL_I2C_IsDeviceReady(&hi2c1, 0x7A, 3, 50) == HAL_OK)
    {
        SSD1306_I2C_Addr = 0x7A;
    }
    else
    {
        SSD1306_I2C_Addr = 0x78; // Default fallback to 0x78
    }

    HAL_Delay(20);

    // SSD1306 / SH1106 robust initialization sequence with Charge Pump enabled
    SSD1306_WriteCommand(0xAE); // Display OFF
    SSD1306_WriteCommand(0x20); // Addressing mode
    SSD1306_WriteCommand(0x02); // Page Addressing Mode (0x02) - works on both SSD1306 and SH1106!
    SSD1306_WriteCommand(0xB0); // Page start 0
    SSD1306_WriteCommand(0xC8); // COM scan reverse
    SSD1306_WriteCommand(0x00); // Low column
    SSD1306_WriteCommand(0x10); // High column
    SSD1306_WriteCommand(0x40); // Start line
    SSD1306_WriteCommand(0x81); // Set Contrast
    SSD1306_WriteCommand(0xCF); // Maximum brightness
    SSD1306_WriteCommand(0xA1); // Segment remap
    SSD1306_WriteCommand(0xA6); // Normal display
    SSD1306_WriteCommand(0xA8); // Multiplex
    SSD1306_WriteCommand(0x3F); // 64 lines
    SSD1306_WriteCommand(0xA4); // Output follows RAM
    SSD1306_WriteCommand(0xD3); // Display offset
    SSD1306_WriteCommand(0x00);
    SSD1306_WriteCommand(0xD5); // Clock divide
    SSD1306_WriteCommand(0x80);
    SSD1306_WriteCommand(0xD9); // Pre-charge
    SSD1306_WriteCommand(0xF1);
    SSD1306_WriteCommand(0xDA); // COM pin config
    SSD1306_WriteCommand(0x12);
    SSD1306_WriteCommand(0xDB); // VCOMH
    SSD1306_WriteCommand(0x40);
    SSD1306_WriteCommand(0x8D); // Charge pump enable (MANDATORY FOR OLED PIXELS TO LIGHT UP)
    SSD1306_WriteCommand(0x14);
    SSD1306_WriteCommand(0xAF); // Display ON

    memset(SSD1306_Buffer, 0x00, sizeof(SSD1306_Buffer));
    return 0;
}

static void SSD1306_Clear(void)
{
    memset(SSD1306_Buffer, 0x00, sizeof(SSD1306_Buffer));
}

static HAL_StatusTypeDef SSD1306_Update(void)
{
    HAL_StatusTypeDef st = HAL_OK;
    for (uint8_t page = 0; page < 8; page++)
    {
        st = SSD1306_WriteCommand(0xB0 + page);
        if (st != HAL_OK) return st;
        st = SSD1306_WriteCommand(0x00);
        if (st != HAL_OK) return st;
        st = SSD1306_WriteCommand(0x10);
        if (st != HAL_OK) return st;
        st = SSD1306_WriteData(&SSD1306_Buffer[page * 128], 128);
        if (st != HAL_OK) return st;
    }
    return HAL_OK;
}

static void I2C_Scan_And_Print(void)
{
    char scan_line[80];
    uint8_t found = 0;
    sprintf(scan_line, "\r\n--- I2C BUS SCAN (PB8=SCL, PB9=SDA) ---\r\n");
    HAL_UART_Transmit(&huart2, (uint8_t *)scan_line, strlen(scan_line), 100);

    for (uint16_t addr = 1; addr < 128; addr++)
    {
        if (HAL_I2C_IsDeviceReady(&hi2c1, (uint16_t)(addr << 1), 2, 20) == HAL_OK)
        {
            sprintf(scan_line, "  -> Found I2C device at 7-bit 0x%02X (8-bit: 0x%02X)\r\n", addr, addr << 1);
            HAL_UART_Transmit(&huart2, (uint8_t *)scan_line, strlen(scan_line), 100);
            found++;
        }
    }
    if (found == 0)
    {
        sprintf(scan_line, "  -> NO I2C DEVICES RESPONDING! Check VCC(3V3), GND, SCL(PB8), SDA(PB9)\r\n");
        HAL_UART_Transmit(&huart2, (uint8_t *)scan_line, strlen(scan_line), 100);
    }
    sprintf(scan_line, "----------------------------------------\r\n\r\n");
    HAL_UART_Transmit(&huart2, (uint8_t *)scan_line, strlen(scan_line), 100);
}

static void SSD1306_DrawChar(uint8_t page, uint8_t col, char c)
{
    if (c < 32 || c > 126 || page > 7 || col > 122) return;
    uint8_t idx = c - 32;
    for (uint8_t i = 0; i < 5; i++)
    {
        SSD1306_Buffer[page * 128 + col + i] = Font5x7[idx][i];
    }
    SSD1306_Buffer[page * 128 + col + 5] = 0x00;
}

static void SSD1306_PrintAt(uint8_t page, uint8_t col, const char *str)
{
    uint8_t c = col;
    while (*str && c <= 122)
    {
        SSD1306_DrawChar(page, c, *str++);
        c += 6;
    }
}


/* USER CODE END 0 */


/**
  * @brief  The application entry point.
  * @retval int
  */

int main(void)
{
    /* USER CODE BEGIN 1 */

    char message[200];

    float front_distance;
    float rear_distance;

    uint32_t ldr_adc;
    uint32_t pot_adc;

    float ldr_voltage;
    float pot_voltage;

    GPIO_PinState mq_state;
    GPIO_PinState pir_state;
    GPIO_PinState ir_state;

    uint8_t temperature;
    uint8_t humidity;


    /* USER CODE END 1 */


    /* MCU Configuration */

    HAL_Init();

    SystemClock_Config();


    /* Initialize all configured peripherals */

    MX_GPIO_Init();

    MX_USART2_UART_Init();

    MX_ADC1_Init();

    MX_ADC2_Init();

    MX_I2C1_Init();


    DWT_Init();

    /* --------------------------------------------------------
       INITIALIZE 0.96" I2C OLED (SSD1306)
       -------------------------------------------------------- */
    SSD1306_Init();
    I2C_Scan_And_Print();
    SSD1306_Clear();
    SSD1306_PrintAt(0, 0, "=== NMDC MLVS ===");
    SSD1306_PrintAt(2, 0, "VEHICLE: V-01");
    SSD1306_PrintAt(4, 0, "SENSORS ONLINE");
    SSD1306_PrintAt(6, 0, "COM7 115200 LIVE");
    SSD1306_Update();


    /* --------------------------------------------------------
       STARTUP MESSAGE & OLED DIAGNOSTICS
       -------------------------------------------------------- */

    sprintf(
        message,
        "\r\n"
        "========================================\r\n"
        "   SIH VEHICLE SENSOR TEST STARTED\r\n"
        "   OLED I2C ADDR : 0x%02X (PB8=SCL, PB9=SDA)\r\n"
        "========================================\r\n"
        "\r\n",
        SSD1306_I2C_Addr
    );

    HAL_UART_Transmit(
        &huart2,
        (uint8_t *)message,
        strlen(message),
        HAL_MAX_DELAY
    );


    /*
     * Allow DHT11 and MQ sensor to settle.
     */
    HAL_Delay(1000);


    /* USER CODE END 2 */


    /* Infinite loop */

    while (1)
    {
        /* ====================================================
           FRONT ULTRASONIC
           ==================================================== */

        front_distance =
            HCSR04_Front_ReadDistance();


        /*
         * Wait before triggering the second ultrasonic.
         * This prevents ultrasonic cross-talk.
         */
        HAL_Delay(60);


        /* ====================================================
           REAR ULTRASONIC
           ==================================================== */

        rear_distance =
            HCSR04_Rear_ReadDistance();


        /* ====================================================
           MQ GAS DIGITAL OUTPUT
           PC0
           ==================================================== */

        mq_state =
            HAL_GPIO_ReadPin(
                GPIOC,
                GPIO_PIN_0
            );


        /* ====================================================
           PIR
           PB0
           ==================================================== */

        pir_state =
            HAL_GPIO_ReadPin(
                GPIOB,
                GPIO_PIN_0
            );


        /* ====================================================
           IR OBSTACLE
           PB1
           ==================================================== */

        ir_state =
            HAL_GPIO_ReadPin(
                GPIOB,
                GPIO_PIN_1
            );


        /* ====================================================
           LDR
           PA4 / ADC2 CHANNEL 4
           ==================================================== */

        /*
         * ADC2 is configured for PA4 / ADC_CHANNEL_4.
         */
        ldr_adc =
            Read_ADC(&hadc2);

        ldr_voltage =
            ADC_To_Voltage(ldr_adc);


        /* ====================================================
           POTENTIOMETER

           IMPORTANT:

           If your potentiometer is NOT connected to the
           ADC channel currently configured in CubeMX, this
           value will not represent the potentiometer.

           The current CubeMX code only has ADC2 channel 4.
           ==================================================== */

        pot_adc = ldr_adc;

        pot_voltage = ldr_voltage;


        /* ====================================================
           DHT11
           ==================================================== */

        if (DHT11_Read(
                &temperature,
                &humidity) != 0)
        {
            temperature = 0;
            humidity = 0;
        }


        /* ====================================================
           PRINT HEADER
           ==================================================== */

        sprintf(
            message,
            "\r\n"
            "========================================\r\n"
        );

        HAL_UART_Transmit(
            &huart2,
            (uint8_t *)message,
            strlen(message),
            HAL_MAX_DELAY
        );


        /* ====================================================
           FRONT ULTRASONIC OUTPUT
           ==================================================== */

        if (front_distance < 0)
        {
            sprintf(
                message,
                "FRONT ULTRASONIC : NO ECHO\r\n"
            );
        }
        else
        {
            sprintf(
                message,
                "FRONT ULTRASONIC : %d cm\r\n",
                (int)front_distance
            );
        }

        HAL_UART_Transmit(
            &huart2,
            (uint8_t *)message,
            strlen(message),
            HAL_MAX_DELAY
        );


        /* ====================================================
           REAR ULTRASONIC OUTPUT
           ==================================================== */

        if (rear_distance < 0)
        {
            sprintf(
                message,
                "REAR  ULTRASONIC : ERROR / NO ECHO\r\n"
            );
        }
        else
        {
            sprintf(
                message,
                "REAR  ULTRASONIC : %d cm\r\n",
                (int)rear_distance
            );
        }

        HAL_UART_Transmit(
            &huart2,
            (uint8_t *)message,
            strlen(message),
            HAL_MAX_DELAY
        );


        /* ====================================================
           MQ GAS
           ==================================================== */

        if (mq_state == GPIO_PIN_SET)
        {
            sprintf(
                message,
                "MQ GAS           : HIGH\r\n"
            );
        }
        else
        {
            sprintf(
                message,
                "MQ GAS           : LOW\r\n"
            );
        }

        HAL_UART_Transmit(
            &huart2,
            (uint8_t *)message,
            strlen(message),
            HAL_MAX_DELAY
        );


        /* ====================================================
           PIR
           ==================================================== */

        if (pir_state == GPIO_PIN_SET)
        {
            sprintf(
                message,
                "PIR              : MOTION\r\n"
            );
        }
        else
        {
            sprintf(
                message,
                "PIR              : NO MOTION\r\n"
            );
        }

        HAL_UART_Transmit(
            &huart2,
            (uint8_t *)message,
            strlen(message),
            HAL_MAX_DELAY
        );


        /* ====================================================
           IR OBSTACLE
           ==================================================== */

        if (ir_state == GPIO_PIN_SET)
        {
            sprintf(
                message,
                "IR OBSTACLE      : CLEAR\r\n"
            );
        }
        else
        {
            sprintf(
                message,
                "IR OBSTACLE      : OBSTACLE\r\n"
            );
        }

        HAL_UART_Transmit(
            &huart2,
            (uint8_t *)message,
            strlen(message),
            HAL_MAX_DELAY
        );


        /* ====================================================
           LDR
           ==================================================== */

        sprintf(
            message,
            "LDR ADC          : %lu / 4095\r\n",
            ldr_adc
        );

        HAL_UART_Transmit(
            &huart2,
            (uint8_t *)message,
            strlen(message),
            HAL_MAX_DELAY
        );


        sprintf(
            message,
            "LDR VOLT         : %d mV\r\n",
            (int)(ldr_voltage * 1000.0f)
        );

        HAL_UART_Transmit(
            &huart2,
            (uint8_t *)message,
            strlen(message),
            HAL_MAX_DELAY
        );


        /* ====================================================
           DHT11
           ==================================================== */

        if (temperature == 0 &&
            humidity == 0)
        {
            sprintf(
                message,
                "DHT11            : READ ERROR\r\n"
            );
        }
        else
        {
            sprintf(
                message,
                "DHT11 TEMP       : %d C\r\n"
                "DHT11 HUMIDITY   : %d %%\r\n",
                temperature,
                humidity
            );
        }

        HAL_UART_Transmit(
            &huart2,
            (uint8_t *)message,
            strlen(message),
            HAL_MAX_DELAY
        );


        /* ====================================================
           POTENTIOMETER
           ==================================================== */

        sprintf(
            message,
            "POT ADC          : %lu / 4095\r\n",
            pot_adc
        );

        HAL_UART_Transmit(
            &huart2,
            (uint8_t *)message,
            strlen(message),
            HAL_MAX_DELAY
        );


        sprintf(
            message,
            "POT VOLT         : %d mV\r\n",
            (int)(pot_voltage * 1000.0f)
        );

        HAL_UART_Transmit(
            &huart2,
            (uint8_t *)message,
            strlen(message),
            HAL_MAX_DELAY
        );


        /* ====================================================
           UPDATE PHYSICAL 0.96" I2C OLED (SSD1306)
           ==================================================== */
        SSD1306_Clear();
        SSD1306_PrintAt(0, 0, "NMDC MLVS    V-01");

        char oled_buf[25];

        /* Line 1: Front Distance */
        if (front_distance < 0) {
            SSD1306_PrintAt(1, 0, "FRONT: NO ECHO");
        } else {
            sprintf(oled_buf, "FRONT: %d cm", (int)front_distance);
            SSD1306_PrintAt(1, 0, oled_buf);
        }

        /* Line 2: Rear Distance */
        if (rear_distance < 0) {
            SSD1306_PrintAt(2, 0, "REAR : NO ECHO");
        } else {
            sprintf(oled_buf, "REAR : %d cm", (int)rear_distance);
            SSD1306_PrintAt(2, 0, oled_buf);
        }

        /* Line 3: Gas & PIR */
        sprintf(oled_buf, "GAS:%s PIR:%s",
                mq_state == GPIO_PIN_SET ? "DANGER" : "SAFE",
                pir_state == GPIO_PIN_SET ? "MOT" : "CLR");
        SSD1306_PrintAt(3, 0, oled_buf);

        /* Line 4: IR & LDR */
        sprintf(oled_buf, "IR :%s LDR:%dmV",
                ir_state == GPIO_PIN_RESET ? "OBST" : "CLEAR",
                (int)(ldr_voltage * 1000.0f));
        SSD1306_PrintAt(4, 0, oled_buf);

        /* Line 6: Dynamic Safety Guidance */
        if (front_distance > 0 && front_distance < 30) {
            SSD1306_PrintAt(6, 0, ">> EMERGENCY STOP <<");
        } else if (mq_state == GPIO_PIN_SET) {
            SSD1306_PrintAt(6, 0, ">> EVACUATE GAS!  <<");
        } else if (ir_state == GPIO_PIN_RESET) {
            SSD1306_PrintAt(6, 0, ">> NEAR OBSTACLE! <<");
        } else if (front_distance > 0 && front_distance < 60) {
            SSD1306_PrintAt(6, 0, ">> CAUTION: SLOW  <<");
        } else {
            SSD1306_PrintAt(6, 0, ">> CORRIDOR CLEAR <<");
        }

        HAL_StatusTypeDef oled_res = SSD1306_Update();
        if (oled_res != HAL_OK) {
            static uint32_t last_reinit = 0;
            if (HAL_GetTick() - last_reinit > 2000) {
                last_reinit = HAL_GetTick();
                SSD1306_Init();
            }
        }

        sprintf(
            message,
            "OLED I2C STATUS  : %s (ADDR 0x%02X)\r\n",
            (oled_res == HAL_OK) ? "ACTIVE" : "ERROR_CHECK_WIRING",
            SSD1306_I2C_Addr
        );
        HAL_UART_Transmit(&huart2, (uint8_t *)message, strlen(message), HAL_MAX_DELAY);

        /* ====================================================
           FOOTER
           ==================================================== */

        sprintf(
            message,
            "========================================\r\n"
        );

        HAL_UART_Transmit(
            &huart2,
            (uint8_t *)message,
            strlen(message),
            HAL_MAX_DELAY
        );


        /* ====================================================
           NEXT MEASUREMENT
           ==================================================== */

        HAL_Delay(500);
    }
}


/**
  * @brief System Clock Configuration
  * @retval None
  */

void SystemClock_Config(void)
{
    RCC_OscInitTypeDef RCC_OscInitStruct = {0};
    RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};


    /* Power configuration */

    __HAL_RCC_PWR_CLK_ENABLE();

    __HAL_PWR_VOLTAGESCALING_CONFIG(
        PWR_REGULATOR_VOLTAGE_SCALE3
    );


    /* HSI + PLL */

    RCC_OscInitStruct.OscillatorType =
        RCC_OSCILLATORTYPE_HSI;

    RCC_OscInitStruct.HSIState =
        RCC_HSI_ON;

    RCC_OscInitStruct.HSICalibrationValue =
        RCC_HSICALIBRATION_DEFAULT;

    RCC_OscInitStruct.PLL.PLLState =
        RCC_PLL_ON;

    RCC_OscInitStruct.PLL.PLLSource =
        RCC_PLLSOURCE_HSI;

    RCC_OscInitStruct.PLL.PLLM = 16;

    RCC_OscInitStruct.PLL.PLLN = 336;

    RCC_OscInitStruct.PLL.PLLP =
        RCC_PLLP_DIV4;

    RCC_OscInitStruct.PLL.PLLQ = 2;

    RCC_OscInitStruct.PLL.PLLR = 2;


    if (HAL_RCC_OscConfig(
            &RCC_OscInitStruct) != HAL_OK)
    {
        Error_Handler();
    }


    /* CPU, AHB and APB clocks */

    RCC_ClkInitStruct.ClockType =
        RCC_CLOCKTYPE_HCLK |
        RCC_CLOCKTYPE_SYSCLK |
        RCC_CLOCKTYPE_PCLK1 |
        RCC_CLOCKTYPE_PCLK2;


    RCC_ClkInitStruct.SYSCLKSource =
        RCC_SYSCLKSOURCE_PLLCLK;

    RCC_ClkInitStruct.AHBCLKDivider =
        RCC_SYSCLK_DIV1;

    RCC_ClkInitStruct.APB1CLKDivider =
        RCC_HCLK_DIV2;

    RCC_ClkInitStruct.APB2CLKDivider =
        RCC_HCLK_DIV1;


    if (HAL_RCC_ClockConfig(
            &RCC_ClkInitStruct,
            FLASH_LATENCY_2) != HAL_OK)
    {
        Error_Handler();
    }
}


/**
  * @brief ADC1 Initialization Function
  * @param None
  * @retval None
  */

static void MX_ADC1_Init(void)
{
    ADC_ChannelConfTypeDef sConfig = {0};


    hadc1.Instance = ADC1;

    hadc1.Init.ClockPrescaler =
        ADC_CLOCK_SYNC_PCLK_DIV4;

    hadc1.Init.Resolution =
        ADC_RESOLUTION_12B;

    hadc1.Init.ScanConvMode =
        DISABLE;

    hadc1.Init.ContinuousConvMode =
        DISABLE;

    hadc1.Init.DiscontinuousConvMode =
        DISABLE;

    hadc1.Init.ExternalTrigConvEdge =
        ADC_EXTERNALTRIGCONVEDGE_NONE;

    hadc1.Init.ExternalTrigConv =
        ADC_SOFTWARE_START;

    hadc1.Init.DataAlign =
        ADC_DATAALIGN_RIGHT;

    hadc1.Init.NbrOfConversion = 1;

    hadc1.Init.DMAContinuousRequests =
        DISABLE;

    hadc1.Init.EOCSelection =
        ADC_EOC_SINGLE_CONV;


    if (HAL_ADC_Init(&hadc1) != HAL_OK)
    {
        Error_Handler();
    }


    /*
     * ADC1 channel configuration retained
     * from the generated project.
     *
     * IMPORTANT:
     * PC0 is now MQ DO, so ADC1_IN10 must NOT
     * be physically connected to the MQ DO pin.
     */
    sConfig.Channel =
        ADC_CHANNEL_10;

    sConfig.Rank = 1;

    sConfig.SamplingTime =
        ADC_SAMPLETIME_3CYCLES;


    if (HAL_ADC_ConfigChannel(
            &hadc1,
            &sConfig) != HAL_OK)
    {
        Error_Handler();
    }
}


/**
  * @brief ADC2 Initialization Function
  * @param None
  * @retval None
  */

static void MX_ADC2_Init(void)
{
    ADC_ChannelConfTypeDef sConfig = {0};


    hadc2.Instance = ADC2;

    hadc2.Init.ClockPrescaler =
        ADC_CLOCK_SYNC_PCLK_DIV4;

    hadc2.Init.Resolution =
        ADC_RESOLUTION_12B;

    hadc2.Init.ScanConvMode =
        DISABLE;

    hadc2.Init.ContinuousConvMode =
        DISABLE;

    hadc2.Init.DiscontinuousConvMode =
        DISABLE;

    hadc2.Init.ExternalTrigConvEdge =
        ADC_EXTERNALTRIGCONVEDGE_NONE;

    hadc2.Init.ExternalTrigConv =
        ADC_SOFTWARE_START;

    hadc2.Init.DataAlign =
        ADC_DATAALIGN_RIGHT;

    hadc2.Init.NbrOfConversion = 1;

    hadc2.Init.DMAContinuousRequests =
        DISABLE;

    hadc2.Init.EOCSelection =
        ADC_EOC_SINGLE_CONV;


    if (HAL_ADC_Init(&hadc2) != HAL_OK)
    {
        Error_Handler();
    }


    /*
     * PA4 = ADC2_IN4
     */
    sConfig.Channel =
        ADC_CHANNEL_4;

    sConfig.Rank = 1;

    sConfig.SamplingTime =
        ADC_SAMPLETIME_3CYCLES;


    if (HAL_ADC_ConfigChannel(
            &hadc2,
            &sConfig) != HAL_OK)
    {
        Error_Handler();
    }
}


/**
  * @brief I2C1 Initialization Function
  * @param None
  * @retval None
  */

static void MX_I2C1_Init(void)
{
    hi2c1.Instance = I2C1;

    hi2c1.Init.ClockSpeed =
        100000;

    hi2c1.Init.DutyCycle =
        I2C_DUTYCYCLE_2;

    hi2c1.Init.OwnAddress1 = 0;

    hi2c1.Init.AddressingMode =
        I2C_ADDRESSINGMODE_7BIT;

    hi2c1.Init.DualAddressMode =
        I2C_DUALADDRESS_DISABLE;

    hi2c1.Init.OwnAddress2 = 0;

    hi2c1.Init.GeneralCallMode =
        I2C_GENERALCALL_DISABLE;

    hi2c1.Init.NoStretchMode =
        I2C_NOSTRETCH_DISABLE;


    if (HAL_I2C_Init(&hi2c1) != HAL_OK)
    {
        Error_Handler();
    }
}


/**
  * @brief USART2 Initialization Function
  * @param None
  * @retval None
  */

static void MX_USART2_UART_Init(void)
{
    huart2.Instance = USART2;

    huart2.Init.BaudRate = 115200;

    huart2.Init.WordLength =
        UART_WORDLENGTH_8B;

    huart2.Init.StopBits =
        UART_STOPBITS_1;

    huart2.Init.Parity =
        UART_PARITY_NONE;

    huart2.Init.Mode =
        UART_MODE_TX_RX;

    huart2.Init.HwFlowCtl =
        UART_HWCONTROL_NONE;

    huart2.Init.OverSampling =
        UART_OVERSAMPLING_16;


    if (HAL_UART_Init(&huart2) != HAL_OK)
    {
        Error_Handler();
    }
}


/**
  * @brief GPIO Initialization Function
  * @retval None
  */

static void MX_GPIO_Init(void)
{
    GPIO_InitTypeDef GPIO_InitStruct = {0};


    /* Enable GPIO clocks */

    __HAL_RCC_GPIOC_CLK_ENABLE();

    __HAL_RCC_GPIOH_CLK_ENABLE();

    __HAL_RCC_GPIOA_CLK_ENABLE();

    __HAL_RCC_GPIOB_CLK_ENABLE();


    /* ========================================================
       INITIAL OUTPUT LEVELS
       ======================================================== */

    /*
     * FRONT TRIG = PA8
     */
    HAL_GPIO_WritePin(
        GPIOA,
        GPIO_PIN_8,
        GPIO_PIN_RESET
    );


    /*
     * REAR TRIG = PC7
     */
    HAL_GPIO_WritePin(
        GPIOC,
        GPIO_PIN_7,
        GPIO_PIN_RESET
    );


    /* ========================================================
       FRONT ULTRASONIC TRIG
       PA8
       ======================================================== */

    GPIO_InitStruct.Pin =
        GPIO_PIN_8;

    GPIO_InitStruct.Mode =
        GPIO_MODE_OUTPUT_PP;

    GPIO_InitStruct.Pull =
        GPIO_NOPULL;

    GPIO_InitStruct.Speed =
        GPIO_SPEED_FREQ_LOW;

    HAL_GPIO_Init(
        GPIOA,
        &GPIO_InitStruct
    );


    /* ========================================================
       FRONT ULTRASONIC ECHO
       PB10
       ======================================================== */

    GPIO_InitStruct.Pin =
        GPIO_PIN_10;

    GPIO_InitStruct.Mode =
        GPIO_MODE_INPUT;

    GPIO_InitStruct.Pull =
        GPIO_NOPULL;

    HAL_GPIO_Init(
        GPIOB,
        &GPIO_InitStruct
    );


    /* ========================================================
       REAR ULTRASONIC TRIG
       PC7
       ======================================================== */

    GPIO_InitStruct.Pin =
        GPIO_PIN_7;

    GPIO_InitStruct.Mode =
        GPIO_MODE_OUTPUT_PP;

    GPIO_InitStruct.Pull =
        GPIO_NOPULL;

    GPIO_InitStruct.Speed =
        GPIO_SPEED_FREQ_LOW;

    HAL_GPIO_Init(
        GPIOC,
        &GPIO_InitStruct
    );


    /* ========================================================
       REAR ULTRASONIC ECHO
       PB4
       ======================================================== */

    GPIO_InitStruct.Pin =
        GPIO_PIN_4;

    GPIO_InitStruct.Mode =
        GPIO_MODE_INPUT;

    GPIO_InitStruct.Pull =
        GPIO_NOPULL;

    HAL_GPIO_Init(
        GPIOB,
        &GPIO_InitStruct
    );


    /* ========================================================
       MQ GAS DO
       PC0
       ======================================================== */

    GPIO_InitStruct.Pin =
        GPIO_PIN_0;

    GPIO_InitStruct.Mode =
        GPIO_MODE_INPUT;

    GPIO_InitStruct.Pull =
        GPIO_NOPULL;

    HAL_GPIO_Init(
        GPIOC,
        &GPIO_InitStruct
    );


    /* ========================================================
       PIR
       PB0
       ======================================================== */

    GPIO_InitStruct.Pin =
        GPIO_PIN_0;

    GPIO_InitStruct.Mode =
        GPIO_MODE_INPUT;

    GPIO_InitStruct.Pull =
        GPIO_NOPULL;

    HAL_GPIO_Init(
        GPIOB,
        &GPIO_InitStruct
    );


    /* ========================================================
       IR OBSTACLE
       PB1
       ======================================================== */

    GPIO_InitStruct.Pin =
        GPIO_PIN_1;

    GPIO_InitStruct.Mode =
        GPIO_MODE_INPUT;

    GPIO_InitStruct.Pull =
        GPIO_NOPULL;

    HAL_GPIO_Init(
        GPIOB,
        &GPIO_InitStruct
    );


    /* ========================================================
       DHT11
       PA9
       ======================================================== */

    GPIO_InitStruct.Pin =
        GPIO_PIN_9;

    GPIO_InitStruct.Mode =
        GPIO_MODE_INPUT;

    GPIO_InitStruct.Pull =
        GPIO_PULLUP;

    HAL_GPIO_Init(
        GPIOA,
        &GPIO_InitStruct
    );
}


/**
  * @brief Error Handler
  */

void Error_Handler(void)
{
    __disable_irq();

    while (1)
    {
    }
}


#ifdef USE_FULL_ASSERT

/**
  * @brief  Reports the name of the source file and the source line
  */

void assert_failed(
    uint8_t *file,
    uint32_t line)
{
    /* USER CODE BEGIN 6 */

    /* USER CODE END 6 */
}

#endif
