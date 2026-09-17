#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const char* WIFI_SSID = "LYCEE_WIFI";
const char* WIFI_PASSWORD = "votre_mot_de_passe";

LiquidCrystal_I2C lcd(0x27, 16, 2);
WebServer server(80);

void afficher(const String& ligne1, const String& ligne2) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(ligne1.substring(0, 16));
  lcd.setCursor(0, 1);
  lcd.print(ligne2.substring(0, 16));
}

unsigned long dernierChangement = 0;
bool affichageAttente = true;

void afficherAttente() {
  afficher("INSCRIPTION", "EN ATTENTE");
  affichageAttente = true;
}

void afficherDepuisSite() {
  if (!server.hasArg("line1") || !server.hasArg("line2")) {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(400, "text/plain", "line1 et line2 sont obligatoires");
    afficherAttente();
    return;
  }

  String line1 = server.arg("line1");
  String line2 = server.arg("line2");

  afficher(line1, line2);
  affichageAttente = false;
  dernierChangement = millis();

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "LCD mis a jour");
}

void setup() {
  Serial.begin(115200);

  Wire.begin(21, 22);
  lcd.init();
  lcd.backlight();

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connexion au Wi-Fi ");
  Serial.println(WIFI_SSID);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  afficherAttente();
  dernierChangement = millis();

  Serial.println();
  Serial.print("Wi-Fi connecte. IP ESP32 : ");
  Serial.println(WiFi.localIP());

  server.on("/display", HTTP_POST, afficherDepuisSite);
  server.begin();
}

void loop() {
  server.handleClient();

  if (!affichageAttente && millis() - dernierChangement >= 4000) {
    afficherAttente();
  }
}