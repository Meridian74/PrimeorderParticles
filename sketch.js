// PARAMÉTEREK:
SCREEN_W = 800;                  // képernyő méret
SCREEN_H = 800;
FPS = 20;                        // max képrajzolási sebesség
MENNYI = 750;                    // részecskék mennyisége
ATMERO = 10;                     // részecskék átmérője
SPEED = 0.67 * ATMERO;           // részecskék mozgási sebessége
RMAX_SZOMSZED = 5 * ATMERO       // maximum távolsága a szomszédoknak
RCLOSE_SZOMSZED = 1.3 * ATMERO   // extrém közeli szomszéd távolsága
ALFA_SZOG = 180;                 // alfa szög paraméter
BETA_SZOG = 17;                  // béta szög paraméter
VILAG_PEREME = RMAX_SZOMSZED;    // a kép már láthatatlan széleinek nagysága (TÓRUSZVILÁG-hoz);

// VÁLTOZÓK:
var golyok = new Array(MENNYI);

var i;
var j;

var yI;
var yJ;
var idX;
var idY;

function setup() {
   frameRate(FPS);
   createCanvas(SCREEN_W, SCREEN_H);
   for (i = 0; i < MENNYI; i++) {
      golyok[i] = new Golyo(ATMERO);
   }
}

function draw() {
   background(10);

   // szomszédok kiszámolása
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
   }
}

function szomszedSzamolo() {
   for (i = 0; i < MENNYI; i++) {            // megvizsgáljuk az összes részecskét sorban
      golyok[i].setSzomszed(0);              // lenullázzuk a szomszédok számait

      // a soron következőt összevetjük az összes többi részecskével, hogy szomszédos-e vele
      for (j = 0; j < MENNYI; j++) {
         if (j != i) {                       // saját magával nem vetjük össze - azt kihagyjuk így

            // számoláshoz a dist() beépített fügvényt használom, a távolságot adja vissza
            if (abs(golyok[i].x - golyok[j].x) <= RMAX_SZOMSZED && abs(golyok[i].y - golyok[j].y) <= RMAX_SZOMSZED) {
               tavolsag = dist(golyok[i].x, golyok[i].y, golyok[j].x, golyok[j].y);
               if (tavolsag < RMAX_SZOMSZED) {  // van egy közeli részecske, azaz egy szomszéd
                  idX = cos(golyok[i].irany);   // delta X vektor érték
                  idY = -sin(golyok[i].irany);  // delta Y vektor érték
                  if (tavolsag <= RCLOSE_SZOMSZED) {
                     golyok[i].setSzomszed(3);
                  }

                  if (golyok[i].irany >= (0 - PI / 2) && golyok[i].irany < (PI - PI / 2)) { // irányegyenes irányának eldöntése
                     // a számolás áttekinthetősége miatt yJ és yI változók a két vizsgált 
                     // részecske Y koordináta értékét tároljuk ezekben a változókban
                     yJ = golyok[j].y;                            // "j"-ik vizsgált részkecske Y koordináta értéke
                     yI = golyok[i].y +
                        (golyok[j].x - golyok[i].x) / idX * idY;  // "i"-ik részkecske irányegyenesének megfelelően módosított Y koordináta értéke

                     if (yI > yJ) { // baloldali szomszédról van szó
                        golyok[i].setSzomszed(1); // növeljük a baloldali szomszédok számát
                     }
                     else {
                        golyok[i].setSzomszed(2); // ellenkező esetben a jobboldali szomszédokat növeljük
                     }
                  }
                  else {
                     yJ = golyok[j].y;                            // "j"-ik vizsgált részkecske Y koordináta értéke
                     yI = golyok[i].y +
                        (golyok[j].x - golyok[i].x) / idX * idY;  // "i"-ik részkecske irányegyenesének megfelelően módosított Y koordináta értéke

                     if (yJ > yI) { // baloldali szomszédról van szó
                        golyok[i].setSzomszed(1); // növeljük a baloldali szomszédok számát
                     }
                     else {
                        golyok[i].setSzomszed(2); // ellenkező esetben a jobboldali szomszédokat növeljük
                     }
                  }
               }
            }
         }
      }
   }
}