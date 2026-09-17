#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// L'ESP32 crée son propre réseau Wi-Fi (Access Point).
const char* AP_SSID = "Va au Creve";
const char* AP_PASSWORD = "22222222";

// LCD I2C 16 colonnes x 2 lignes. Essayez 0x3F si 0x27 ne fonctionne pas.
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

  server.sendHeader("Access-Control-Allow-Origin", "*");
  afficher(server.arg("line1"), server.arg("line2"));
  affichageAttente = false;
  dernierChangement = millis();
  server.send(200, "text/plain", "LCD mis a jour");
}

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22); // SDA = GPIO 21, SCL = GPIO 22
  lcd.init();
  lcd.backlight();
  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_PASSWORD);
  IPAddress ip = WiFi.softAPIP(); // Par défaut : 192.168.4.1

  afficherAttente();
  dernierChangement = millis();
  Serial.print("Reseau Wi-Fi : ");
  Serial.println(AP_SSID);
  Serial.print("Adresse ESP32 : http://");
  Serial.println(ip);

  server.on("/display", HTTP_POST, afficherDepuisSite);
  server.begin();
}

void loop() {
  server.handleClient();

  if (!affichageAttente && millis() - dernierChangement >= 4000) {
    afficherAttente();
  }
}
