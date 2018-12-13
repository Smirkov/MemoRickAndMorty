//Variables globales
var CARTEH = 150;
var CARTEW = 150; // hauteur et largeur de la carte
var DX = 30;
var DY = 20;
var couleurs = ["red", "blue", "yellow", "green", "purple", "pink"];

//Fonction qui créer un objet carte
function Carte(f) {
    this.face = f;
    this.posX = 0;
    this.posY = 0;
    this.visible = false;
    this.trouve = false;

    this.img = new Image();

    this.dessinerCarte = function () { //fonction pour dessiner la carte

        if (this.visible == false) {
            this.img.src = "medias/base.png";
        } else {
            this.img.src = "medias/" + (this.face + 1) + ".png";
        }
        this.img.posX = this.posX;
        this.img.posY = this.posY;
        this.img.onload = function () {
            dessinerImage(this);
        }
    }
}

//Fonction qui dessine la carte en question
function dessinerImage(imageObj) {
    cg.clearRect(imageObj.posX, imageObj.posY, CARTEW, CARTEH);
    cg.drawImage(imageObj, imageObj.posX, imageObj.posY, CARTEW, CARTEW);
}