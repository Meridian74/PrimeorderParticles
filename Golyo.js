class Golyo {
   constructor(meret) {
      this.d = meret / 2;                          // a részecske átmérője 
      this.x = random(SCREEN_W);                   // a részecske kezdeti X pozíciója
      this.y = random(SCREEN_H);                   // a részecske kezdeti Y pocíciója
      this.sebesseg = SPEED;                       // a részecske mozgási sebessége
      this.irany = random(-PI, PI);                // a részecske mozgásának iránya
      this.dX = this.sebesseg * cos(this.irany);   // X irányú elmozdulás nagysága
      this.dY = this.sebesseg * sin(this.irany);   // Y irányú elmozdulás nagysága
      this.szBal = 0;                              // közeli szomszédok baloldalt
      this.szJobb = 0;                             // közeli szomszédok jobboldalt
      this.osszesSzomszed = 0;                     // bal és jobboldali szomszédok összege
      this.nagyonKozeliSzomszed = 0;               // R<1.3 belüli szomszédok száma
      this.fordulasiSzog;

      //a részecske RGB színe:
      this.R = 255;
      this.G = 255;
      this.B = 255;
      this.A = 255;

   }

   // részecske kirajzolása
   display() {
      noStroke();
      fill(this.R, this.G, this.B);
      circle(this.x, this.y, this.d);

      /*
      // határterület és irány kirajzolása - ez csak opcionálisan teszteléshez
      noFill();
      stroke(200);
      circle(this.x, this.y, RMAX_SZOMSZED);
      line(this.x + cos(this.irany) * RMAX_SZOMSZED, this.y - sin(this.irany) * RMAX_SZOMSZED,
         this.x - cos(this.irany) * RMAX_SZOMSZED, this.y + sin(this.irany) * RMAX_SZOMSZED);

      textSize(12);
      fill(255, 255, 255, this.A);
      text(i + '. / B' + this.szBal + ', J' + this.szJobb
         + ', Ö:' + this.osszesSzomszed
         + ', X:' + this.nagyonKozeliSzomszed, this.x - 30, this.y - 15);
      */
   }

   // színválasztás
   setSzin() {
      if (this.osszesSzomszed < 13) {        // zöld színű
         this.R = 0;
         this.G = 240;
         this.B = 0;
      }
      else if (this.osszesSzomszed < 16) {   // barna színű
         this.R = 204;
         this.G = 153;
         this.B = 102;
      }
      else if (this.osszesSzomszed < 36) {   // kék színű
         this.R = 0;
         this.G = 0;
         this.B = 240;
      }
      else {   // sárga színű
         this.R = 240;
         this.G = 240;
         this.B = 0;
      }

      // magenta ha nagyon sokan tömörülnek össze kis helyre - felülbírálva az eredeti színt
      if (this.nagyonKozeliSzomszed > 15) {
         this.R = 240;
         this.G = 0;
         this.B = 240;
      }
   }

   // szomszédok értékének változtatása
   setSzomszed(ertek) {
      if (ertek === 0) {         // ha nulla érték jön, akkor lenullázuk a szomszédok számát
         this.szBal = 0;
         this.szJobb = 0;
         this.osszesSzomszed = 0;
         this.nagyonKozeliSzomszed = 0;
      }
      else if (ertek === 1) {    // 1 = baloldali a szomszéd
         this.szBal++;
         this.osszesSzomszed++;
      }
      else if (ertek === 2) {    // 2 = jobboldali a szomszéd
         this.szJobb++;
         this.osszesSzomszed++;
      }
      else if (ertek === 3) {    // 3 = ha a számszéd távolsága extrémkicsi
         this.nagyonKozeliSzomszed++;
      }

   }

   // irányelhajlás kalkulációja
   setIrany() {
      // mennyiségi előkalkuláció a teljes elfordulása, ami olykor extrém nagy értékké is alakulhat
      this.fordulasiSzog = BETA_SZOG * this.osszesSzomszed;
      this.fordulasiSzog = this.fordulasiSzog % 360;  // normalizáljuk az érték nagyságát

      // előjel szerinti elfordítás
      if (this.szBal > this.szJobb) {
         this.irany = this.irany + radians(ALFA_SZOG + this.fordulasiSzog);
      }
      else if (this.szBal < this.szJobb) {
         this.irany = this.irany + radians(ALFA_SZOG - this.fordulasiSzog);
      }
      else {
         this.irany = this.irany + radians(ALFA_SZOG);
      }

      // -Pi és PI között tartjuk továbbra is az irány értékét
      this.irany = this.irany % TWO_PI;

      this.dX = this.sebesseg * cos(this.irany);   // X irányú elmozdulás újraszámolva
      this.dY = this.sebesseg * -sin(this.irany);  // Y irányú elmozdulás újraszámolva
   }

   // kiterített TÓRUSZ VILÁG - minden szél a szemközti oldallal találkozik
   // képernyő határával való találkozás vizsgálata
   checkBorder() {
      if (this.x < -VILAG_PEREME) {
         this.x = this.x + SCREEN_W + 2 * VILAG_PEREME;
      }
      else if (this.x > SCREEN_W + VILAG_PEREME) {
         this.y = this.y - SCREEN_W - 2 * VILAG_PEREME;
      }

      if (this.y < -VILAG_PEREME) {
         this.y = this.y + SCREEN_H + 2 * VILAG_PEREME;
      }
      else if (this.y > SCREEN_H + VILAG_PEREME) {
         this.y = this.y - SCREEN_H - 2 * VILAG_PEREME;
      }
   }

   // részecske mozgatása az új helyére
   move() {
      this.x = this.x + this.dX;
      this.y = this.y + this.dY;
   }

} // end of Class