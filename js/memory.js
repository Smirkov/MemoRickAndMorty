// Variables globales
var monCanvas, cg;
var maCarte; // Initialisatin de la carte avec la couleur(face) associée
var NBLIG = 3; // Nombre de lignes de cartes
var NBCOL = 4; // Nombre de colonnes de cartes
var NBMELANGE; // Nombre de mélange effectué
var plateau;
var premiereCarte;
var secondeCarte;
var nbPairesTrouvees;
var temps;
var chrono;
var victoire = false;
var clic;
var secrebours;
var victory;
var sonCarte, sonFin, sonFond;

// Fonction initialisation
function init() {
    premiereCarte = undefined;
    secondeCarte = undefined;
    clic = false;
    victoire = false;
    sonCarte = new sound("./medias/carte.mp3");
    sonWin = new sound("./medias/win.mp3");
    sonFond = new sound("./medias/fond.mp3");
    sonLost = new sound("./medias/lost.mp3");
    nbPairesTrouvees = 0;
    plateau = [];
    temps = 30;
    NBMELANGE = 20;
    monCanvas = document.getElementById('monEcran'); // récupération canvas
    secrebours = document.getElementById('rebours');
    victory = document.getElementById('win');
    cg = monCanvas.getContext('2d');
    monCanvas.addEventListener("mousedown", choisirCarte, false);
    creerPlateau();
    clearInterval(chrono);
    secrebours.innerHTML = temps + " sec";
}

//Fonction menu d'acceuil
function run(evt) {
    monCanvas = document.getElementById('monEcran');
    cg = monCanvas.getContext('2d');
    img = new Image();
    img.src = "./medias/menu.png";
    img.onload = function () {
        drawImage(this);
    }
        monCanvas.addEventListener("mousedown", clicJouer, false);
        monCanvas.addEventListener("mousedown", regle, false);
    
}

//Fonction qui affiche les règls
function regle(evt) {
    var x = evt.clientX;
    var y = evt.clientY;

    x -= monCanvas.offsetLeft;
    y -= monCanvas.offsetTop;
    
    x += window.scrollX;
    y += window.scrollY;

    if ((x > 235) && (x < 513) && (y > 346) && (y < 441)) {
        monCanvas.removeEventListener("mousedown", clicJouer);
        monCanvas.removeEventListener("mousedown", regle);
        cg.clearRect(0, 0, monCanvas.width, monCanvas.height);
        img = new Image();
        img.src = "./medias/regles.png";
        img.onload = function () {
            drawImage(this);
        }
        monCanvas.addEventListener("mousedown", jouerRegle, false);
    }
}

//Fonction pour afficher les images des menus
function drawImage(imgObj) {
    cg.clearRect(0,0,monCanvas.width,monCanvas.height);
    cg.drawImage(imgObj, 0, 0);
}


//Fonction qui lance le jeu à partir de la fonction run (menu d'acceuil)
function clicJouer(evt) {
    var x = evt.clientX;
    var y = evt.clientY;

    x -= monCanvas.offsetLeft;
    y -= monCanvas.offsetTop;
    
    x += window.scrollX;
    y += window.scrollY;
    
    if ((x > 235) && (x < 513) && (y > 129) && (y < 223)) {
        cg.clearRect(0, 0, monCanvas.width, monCanvas.height);
        monCanvas.removeEventListener("mousedown", clicJouer, false);
        monCanvas.removeEventListener("mousedown", regle, false);
        init();
    } 
}

//Fonction qui lance le jeu à partir de la fonction règles
function jouerRegle(evt) {
    var x = evt.clientX;
    var y = evt.clientY;

    x -= monCanvas.offsetLeft;
    y -= monCanvas.offsetTop;
    
    x += window.scrollX;
    y += window.scrollY;

    if ((x > 235) && (x < 513) && (y > 430) && (y < 497)) {
        cg.clearRect(0, 0, monCanvas.width, monCanvas.height);
        monCanvas.removeEventListener("mousedown", clicJouer, false);
        monCanvas.removeEventListener("mousedown", regle, false);
        monCanvas.removeEventListener("mousedown", jouerRegle, false);
        run();
    }
}

//Fonction retournement de la carte
function choisirCarte(evt) {
    sonFond.volume();
    sonFond.play();

    var x = evt.clientX;
    var y = evt.clientY;
    var carte = undefined;

    x -= monCanvas.offsetLeft;
    y -= monCanvas.offsetTop;
    
    x += window.scrollX;
    y += window.scrollY;

    if (!clic) {
        chrono = setInterval(timer, 1000);
    }
    clic = true;

    for (i = 0; i < plateau.length; i++) {
        if ((x > plateau[i].posX) && (x < plateau[i].posX + CARTEW) && (y > plateau[i].posY) && (y < plateau[i].posY + CARTEH)) { // Fixe la zone de clic correspondant à la carte associée
            carte = plateau[i];
        }
        if ((carte != undefined) && (premiereCarte == undefined) && (!carte.trouve)) {
            premiereCarte = carte;
            premiereCarte.visible = true;
        } else if ((carte != undefined) && (secondeCarte == undefined) && (!carte.trouve)) {
            secondeCarte = carte;
            if (secondeCarte != premiereCarte) {
                secondeCarte.visible = true;
                if (premiereCarte.face == secondeCarte.face) {
                    premiereCarte.trouve = true;
                    secondeCarte.trouve = true;
                    reinitCartes();
                } else {
                    setTimeout(reinitCartes, 750);
                }
            } else {
                secondeCarte = undefined;
            }
        }
        if((!victoire) && (premiereCarte != secondeCarte)){
            plateau[i].dessinerCarte();
        }
    }
}

// Fonction création du plateau
function creerPlateau() {
    for (i = 0; i < NBLIG; i++) {
        for (j = 1; j <= NBCOL; j++) {
            var nb;
            if (((NBLIG * i) + j + i) % 2 == 0) {
                nb = ((NBLIG * i) + j + i) / 2;
            } else {
                nb = (((NBLIG * i) + j + i) + 1) / 2;
            }
            var carte = new Carte(nb - 1);
            plateau.push(carte);
        }
    }
    melangerPlateau();
    calculerCoordonnes();
    afficherPlateau();
}

// Fonction mélange du plateau
function melangerPlateau() {
    var i1;
    var i2;
    var temp;

    for (i = 0; i <= NBMELANGE; i++) {
        i1 = Math.floor(Math.random() * 12);
        i2 = Math.floor(Math.random() * 12);
        temp = plateau[i1];
        plateau[i1] = plateau[i2];
        plateau[i2] = temp;
    }
}

function calculerCoordonnes() {
    for (i = 0; i < plateau.length; i++) {
        plateau[i].posX = DX + (DX + CARTEW) * (i % NBCOL);
        plateau[i].posY = DY + (DY + CARTEH) * (Math.floor((i / NBCOL)));
    }
}

//Fonction affichage du plateau
function afficherPlateau() {
    if(!victoire){
     for (i = 0; i < plateau.length; i++) {
        plateau[i].dessinerCarte();
     }
    }
}

//Fonction réinitialisation des cartes en fonction de leur face
function reinitCartes() {
    if (!(premiereCarte.trouve && secondeCarte.trouve)) {
        premiereCarte.visible = false;
        secondeCarte.visible = false;

    } else {
        nbPairesTrouvees++;
        if (nbPairesTrouvees != (NBLIG * NBCOL) / 2) {
            sonCarte.volume();
            sonCarte.play();
        } else {
            sonFond.stop();
            sonWin.volume();
            sonWin.play();
        }
        if (nbPairesTrouvees == (NBLIG * NBCOL) / 2) {
            victoire = true;
            if (victoire) {
                clearInterval(chrono);
                win();
            }
        }
    }
    premiereCarte = undefined;
    secondeCarte = undefined;
    afficherPlateau();
      
}

//Fonction qui affiche l'image en cas de victoire
function win() {
    cg.clearRect(0,0,monCanvas.width,monCanvas.height);
    monCanvas.removeEventListener("mousedown", choisirCarte);
    monCanvas.addEventListener("mousedown", rejouerWin, false);
    img = new Image();
    img.src = "./medias/win.png";
    img.onload = function () {
            drawImage(this);
    }
}

//Fonction qui relance le jeu à partir de l'image de victoire
function rejouerWin(evt){
    cg.clearRect(0,0,monCanvas.width,monCanvas.height);
    monCanvas.removeEventListener("mousedown", rejouerWin);
    
    var x = evt.clientX;
    var y = evt.clientY;
    
    x += window.scrollX;
    y += window.scrollY;
    
    x -= monCanvas.offsetLeft;
    y -= monCanvas.offsetTop;
    if((x > 249) && (x < 589) && (y > 344) && (y < 432)){
        init();
    }
}

// Fonction qui configure et affiche le timer
function timer() {
    temps--;
    if(temps == 0){
        clearInterval(chrono);
        setTimeout(perdu, 1000);
    }
    secrebours.innerHTML = temps + " sec";
}

//Fonction qui affiche l'image en cas de défaite
function perdu(){
    monCanvas.removeEventListener("mousedown", choisirCarte);
    monCanvas.addEventListener("mousedown", rejouerLost, false);
    sonFond.stop();
    sonLost.volume();
    sonLost.play();
    cg.clearRect(0,0,monCanvas.width,monCanvas.height);
    img = new Image();
    img.src = "./medias/perdu.png";
    img.onload = function () {
            drawImage(this);
    }
    
}

//Fonction qui relance le jeu à partir de l'image de défaite
function rejouerLost(evt){
    cg.clearRect(0,0,monCanvas.width,monCanvas.height);
    monCanvas.removeEventListener("mousedown", rejouerLost);
    var x = evt.clientX;
    var y = evt.clientY;
    
    x += window.scrollX;
    y += window.scrollY;
    
    x -= monCanvas.offsetLeft;
    y -= monCanvas.offsetTop;
    if((x > 234) && (x < 513) && (y > 379) && (y < 448)){
        sonLost.stop();
        init();
    }
}



// Fonction qui permet l'utilisation de son (créer un objet + créer des méthodes d'utilisation)
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
    this.volume = function () {
        this.sound.volume = 0.1;
    }
    this.loop = function () {
        this.sound.loop = true;
    }
}