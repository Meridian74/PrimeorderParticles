// PARAMÉTEREK:
SCREEN_W = 800;                  // képernyő méret
SCREEN_H = 800;
FPS = 20;                         // max képrajzolási sebesség
MENNYI = 865;                   // részecskék mennyisége
ATMERO = 8;                     // részecskék átmérője
SPEED = 0.67 * ATMERO;           // részecskék mozgási sebessége
RMAX_SZOMSZED = 5 * ATMERO;      // maximum távolsága a szomszédoknak
RCLOSE_SZOMSZED = 1.3 * ATMERO;  // extrém közeli szomszéd távolsága
ALFA_SZOG = 180;                   // alfa szög paraméter
BETA_SZOG = 17;                  // béta szög paraméter
VILAG_PEREME = RMAX_SZOMSZED * 2;// a kép már láthatatlan széleinek nagysága (TÓRUSZVILÁG-hoz);

// VÁLTOZÓK:
var golyok = new Array(MENNYI);

var i;
var ii;
var j;
var jj;
var tVektor;
var tIrany;
var bezartSzog;

// --- INICIALIZÁLÁS ---
function setup() {
   frameRate(FPS);
   createCanvas(SCREEN_W, SCREEN_H);
   for (i = 0; i < MENNYI; i++) {
      golyok[i] = new Golyo(ATMERO);
   }
}

// --- FŐPROGRAM ---
function draw() {
   // képernyő törlése nagyon sötétszürke (fekete) színnel
   background(10);

   // szomszédok vizsgálása
   szomszedSzamolo();

   // részecskék mozgatása az új pozíciójukba
   for (i = 0; i < MENNYI; i++) {
      golyok[i].setIrany();
      golyok[i].move();
      golyok[i].checkBorder();
   }

   // részecskék kirajzolása
   for (i = 0; i < MENNYI; i++) {
      golyok[i].setSzin();
      golyok[i].display();
      golyok[i].setSzomszed(0); // rajzolás után szomszédok alaphelyzetbe állítva
   }

   // lépés számának kiírása
   fill(240, 240, 240);
   textSize(20);
   text("step: " + frameCount, 10, 30);
}

// ----- SEGÉD FUNKCIÓK -----
function szomszedSzamolo() {
   for (i = 0; i < MENNYI - 1; i++) {            // megvizsgáljuk az összes részecskét sorban
      // a soron következőt összevetjük az összes többi részecskével, hogy szomszédos-e vele
      for (j = i + 1; j < MENNYI; j++) {
         // előszűrő "négyzetterület", ami ezen kívül van, azzal már nem kell foglakozni
         if (abs(golyok[i].x - golyok[j].x) <= RMAX_SZOMSZED
            && abs(golyok[i].y - golyok[j].y) <= RMAX_SZOMSZED) {

            // számoláshoz a dist() beépített fügvényt használom, két részecske valódi távolságát adja vissza
            tavolsag = dist(golyok[i].x, golyok[i].y, golyok[j].x, golyok[j].y);
            if (tavolsag < RMAX_SZOMSZED) {        // van egy közeli részecske, azaz egy szomszéd
               if (tavolsag <= RCLOSE_SZOMSZED) {  // extrém közeli ez a részecske?...
                  golyok[i].setSzomszed(3);        // ...ha igen számba vesszük
                  golyok[j].setSzomszed(3);
               }

               // először az "i"-ik részecske szomszédját nézzük meg...
               tesztOldal(i, j);
               // ... majd a "j"-iket vetjük össze az "i"-vel, vica versa.
               tesztOldal(j, i);

            }
         }
      }
   }
}

function tesztOldal(ii, jj) {
   // az oldal megállapításához "ii"-ik részecske haladási vektorát és a "jj"-ik részecske az "ii"-re
   // mutató irányvektorainak bezért szögét vizsgálom. 
   // (bonyolítja az egészet az, hogy a képernyő X,Y koordináta rendszere X tengely 
   // mentén lefele tükrözve van... azaz a 0,0 pont a bal felső sarok, nem a bal alsó sarok!)

   tVektor = createVector(golyok[ii].x - golyok[jj].x, (-1)*(golyok[ii].y - golyok[jj].y));
   tIrany = tVektor.heading();
   bezartSzog = tIrany - golyok[ii].irany;

   // bezárt szög értékét moderáljuk
   if (bezartSzog > PI) {
      bezartSzog = bezartSzog - TWO_PI;
   }
   else if (bezartSzog < -PI) {
      bezartSzog = bezartSzog + TWO_PI;
   }

   // oldal vizsgálat
   if (bezartSzog > 0 && bezartSzog < PI) {
      golyok[ii].setSzomszed(2); // növeljük a JOBBoldali szomszédok számát
   }
   else {
      golyok[ii].setSzomszed(1); // növeljük a BALoldali szomszédok számát
   }
}