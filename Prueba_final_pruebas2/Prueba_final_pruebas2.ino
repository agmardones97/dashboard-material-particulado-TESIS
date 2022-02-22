#include <Arduino.h>
#include <SoftwareSerial.h>
#include <TinyGPS.h>
#include <SD.h>
#include <SPI.h>
#include <Time.h>

TinyGPS gps;

SoftwareSerial ss(2, 3);
SoftwareSerial pms(4, 5);

File Data;

#define LENG 31 //0x42 + 31 bytes equivalente a 32 bytes

unsigned char buf[LENG];
static void smartdelay(unsigned long ms);
static void print_float(float val, float invalid, int len, int prec);

int PM2_5Value = 0; //define PM2.5 value of the air detector module
int PM10Value = 0; //define PM10 value of the air detector module

long inicio = millis();
unsigned long inter1 = 1000;
unsigned long inter2 = 2000;

void setup() {
  Serial.begin(9600);
  
  ss.begin(9600);

  pms.begin(9600);
  pms.setTimeout(1500); //longer than the data transmission periodic time of the sensor
  
  // Se activa el micro SD
  Serial.print("Iniciando SD …");
  if (!SD.begin(7)) {
    Serial.println("No se pudo inicializar");
    return;
  }
  Serial.println("inicializacion exitosa");
  // Se botrran los ficheros creados en cualquier medida anterior
  /////////////////////////////////////////////////////////////////
  SD.remove("data.csv");

  Data = SD.open("data.csv", FILE_WRITE);//abrimos el archivo
  if (Data)
  {
    //Serial.println(“Escribiendo SD: “);
    Data.print("mp10,lat,lon,mp25");
    Data.println();
    Data.close(); //cerramos el archivo
  }
  else
  {
    Serial.println("Error al abrir el archivo");
  }
}

void loop() {
  if (millis() - inicio < inter1 ) {
    ss.listen();
    inicio = millis();
    float flat, flon;
    unsigned long age;
    gps.f_get_position(&flat, &flon, &age);
    print_float(flat, TinyGPS::GPS_INVALID_F_ANGLE, 10, 6);
    Serial.print(", ");
    print_float(flon, TinyGPS::GPS_INVALID_F_ANGLE, 10, 6)
    Serial.println();
    smartdelay(999);
    inter1 = inter1 + 1000;
  }
  if (millis() - inicio < inter2 ) {
    pms.listen();
    inicio = millis();
    //aqui mpp
    if (pms.find(0x42)) { //start to read when detect 0x42
      pms.readBytes(buf, LENG);
      if (buf[0] == 0x4d) {
        if (checkValue(buf, LENG)) {
          PM2_5Value = transmitPM2_5(buf); //count PM2.5 value of the air detector module
          PM10Value = transmitPM10(buf); } } } //count PM10 value of the air detector module*
    Serial.print("PM2.5: ");
    Serial.print(PM2_5Value);
    Serial.print("ug/m3, ");
    Serial.print("PM10: ");
    Serial.print(PM10Value);
    Serial.print("ug/m3, ");
    Data = SD.open("data.csv", FILE_WRITE);//abrimos el archivo
    if (Data) {
      Data.print(PM2_5Value);
      Data.println(" ");
      Data.print(PM10Value);
      Data.print(",");
      Data.close(); } //cerramos el archivo
    else {
      Serial.println("Error al abrir el archivo"); }
    smartdelay(999);
    inter2 = inter2 + 1000;
  }
}

char checkValue(unsigned char *thebuf, char leng){
  char receiveflag = 0;
  int receiveSum = 0;
  for (int i = 0; i < (leng - 2); i++) {
    receiveSum = receiveSum + thebuf[i]; }
  receiveSum = receiveSum + 0x42;
  if (receiveSum == ((thebuf[leng - 2] << 8) + thebuf[leng - 1])) { //check the serial data
    receiveSum = 0;
    receiveflag = 1; }
  return receiveflag;
}
//int transmitPM01(unsigned char *thebuf)
//{
//  int PM01Val;
//  PM01Val = ((thebuf[3] << 8) + thebuf[4]); //count PM1.0 value of the air detector module
//  return PM01Val;
//}
int transmitPM2_5(unsigned char *thebuf)
{
  int PM2_5Val;
  PM2_5Val = ((thebuf[5] << 8) + thebuf[6]); //count PM2.5 value of the air detector module
  return PM2_5Val;
}

//transmit PM Value to PC
int transmitPM10(unsigned char *thebuf)
{
  int PM10Val;
  PM10Val = ((thebuf[7] << 8) + thebuf[8]); //count PM10 value of the air detector module
  return PM10Val;
}

static void smartdelay(unsigned long ms)
{
  unsigned long start = millis();
  do
  {
    while (ss.available())
      gps.encode(ss.read());
  } while (millis() - start < ms);

}

static void print_float(float val, float invalid, int len, int prec)
{
  if (val == invalid)
  {
    Serial.print("no signal");
    Data = SD.open("data.csv", FILE_WRITE);//abrimos el archivo
    Data.print("0,");
    Data.close(); //cerramos el archivo
  }
  else
  {
    Serial.print(' ' + val, prec);

    Data = SD.open("data.csv", FILE_WRITE);//abrimos el archivo
    if (Data){
      Data.print(val, prec);
      Data.print(',');
      Data.close(); } //cerramos el archivo
    else {
      Serial.println("Error al abrir el archivo"); }
    
    int vi = abs((int)val);
    int flen = prec + (val < 0.0 ? 2 : 1); // . and -
    flen += vi >= 1000 ? 4 : vi >= 100 ? 3 : vi >= 10 ? 2 : 1;
    for (int i = flen; i < len; ++i)
      Serial.print(' ');
  }
  smartdelay(0);
}
