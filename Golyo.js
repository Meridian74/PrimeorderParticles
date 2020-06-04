class Golyo {
   constructor(meret) {
      this.d = meret / 2;                          // a részecske átmérője 
      this.x = random(SCREEN_W);                   // a részecske kezdeti X pozíciója
      this.y = random(SCREEN_H);                   // a részecske kezdeti Y pocíciója
      this.sebesseg = SPEED;                       // a részecske mozgási sebessége
      this.irany = random(-PI, PI);                // a részecske mozgásának iránya
      this.dX = this.sebesseg * cos(this.irany);   // X irányú elmozdulás nagysága
      this.dY = this.sebesseg * -sin(this.irany);  // Y irányú elmozdulás nagysága
      this.SzBal = 0;                              // közeli szomszédok baloldalt
      this.SzJobb = 0;                             // közeli szomszédok jobboldalt
      this.osszesSzomszed = 0;                     // bal és jobboldali szomszédok összege
      this.nagyonKozeliSzomszed = 0;               // R<1.3 belüli szomszédok száma
      this.fordul;                                 // fordulás előjeles iránya
      //a részecske RGB színe:
      this.R = 255;
      this.G = 255;
      this.B = 255;

   }

   // részecske kirajzolása
   display() {
      noStroke();
      // fill(250);
      fill(this.R, this.G, this.B);
      circle(this.x, this.y, this.d);
      
      // határterület és irány kirajzolása - ez csak opcionálisan teszteléshez
      // noFill();
      // circle(this.x, this.y, RMAX_SZOMSZED);
      //line(this.x + cos(this.irany)*RMAX_SZOMSZED, this.y - sin(this.irany)*RMAX_SZOMSZED,
      //         this.x - cos(this.irany)*RMAX_SZOMSZED, this.y + sin(this.irany)*RMAX_SZOMSZED);
      
   }

   setSzin() {
      if (this.osszesSzomszed < 13) { // zöld színű
         this.R = 0;
         this.G = 240;
         this.B = 0;         
      }
      else if (this.osszesSzomszed < 16) { // barna színű
         this.R = 204;
         this.G = 153;
         this.B = 102;         
      }
      else if (this.osszesSzomszed < 36) { // kék színű
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
      if (this.nagyonKozeliSzomszed > 15) { // magenta
         this.R = 240;
         this.G = 0;
         this.B = 240;         
      }

   }

   setSzomszed(ertek) {
      if (ertek === 0) {         // ha nulla érték jön, akkor lenullázuk a szomszédok számát
         this.SzBal = 0;
         this.SzJobb = 0;
         this.osszesSzomszed = 0;
         this.nagyonKozeliSzomszed = 0;
      }
      else if (ertek === 1) {    // 1 = baloldali a szomszéd
         this.SzBal++;
         this.osszesSzomszed++;
      }
      else if (ertek === 2) {    // 2 = jobboldali a szomszéd
         this.SzJobb++;
         this.osszesSzomszed++;
      }
      else if (ertek == 3) {     // 3 = ha a számszéd távolsága extrémkicsi
         this.nagyonKozeliSzomszed++;
      }

   }

   setIrany() {
      if (this.SzBal > this.SzJobb) {
         this.irany = this.irany + radians(ALFA_SZOG + BETA_SZOG * (this.SzBal+this.SzJobb)) ;
      }
      else if (this.SzBal < this.SzJobb) {
         this.irany = this.irany - radians(ALFA_SZOG + BETA_SZOG * (this.SzBal+this.SzJobb));
      }
      else {
         this.irany = this.irany + radians(ALFA_SZOG);
      }

      // túl nagy érték megelőzése érdekében -Pi és PI között tartjuk az irány értékét
      if (this.irany > PI) {
         this.irany = this.irany - PI - PI;
      }
      else if (this.irany <= -PI) {
         this.irany = this.irany + PI + PI;
      }

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

      if (this.y < -VILAG_PEREME ) {
         this.y = this.y + SCREEN_H + 2 * VILAG_PEREME;
      }
      else if (this.y > SCREEN_H + VILAG_PEREME) {
         this.y = this.y - SCREEN_H - 2 * VILAG_PEREME;
      }
   }

   /* DOBOZ VILÁG
   // képernyő határával való találkozás vizsgálata
   checkBorder() {
      if (this.x < this.d / 2) {
         this.x = this.d / 2;
         this.dX = -this.dX;
      }
      else if (this.x > SCREEN_W - this.d / 2) {
         this.x = SCREEN_W - this.d / 2;
         this.dX = -this.dX;
      }

      if (this.y < this.d / 2) {
         this.y = this.d / 2;
         this.dY = -this.dY;
      }
      else if (this.y > SCREEN_H - this.d / 2) {
         this.y = SCREEN_H - this.d / 2;
         this.dY = -this.dY;
      }
   } */

   // részcske mozgatása az új helyére
   move() {
      this.x = this.x + this.dX;
      this.y = this.y + this.dY;
   }

} // end of Class