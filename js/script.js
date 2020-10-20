// Tableau contenant les cartes de jeu
var lst_cartes = ["card1","card2","card3","card4","card5","card6","card7","card8","card9","card10","card11","card12","card13","card14","card15","card16","card17","card18"];

var cartes_aleatoires; // Contiendra les cartes doublée et mélangées
var nb_cartes_jeu = 0; // Le nombre de cartes jouées (hors paires déjà effectuées)
var score = 0;

// Noms et numéro des cartes jouées
var carte_jouee1, numero_carte_jouee1;
var carte_jouee2, numero_carte_jouee2;

var start = new Date;

$(function() { 
    //Evenement click sur le bouton "Commencer"
    // "One" permet d'exécuter une seule fois l'événement
    $("#btn_start").one('click', function (event) {  
        event.preventDefault();
        
        $(this).prop('disabled', true); // Permet d'empêcher le double clic sur le bouton

        $(".blocs").fadeOut(1000); // On fait lentement disparaître le bloc sur une seconde

        // Affichage de la zone de jeu une seconde après avoir déclenché l'événément click
        setTimeout(function() {

            $(".game").css('display', 'inline-block');
            $("#container_scores_temps").show();

            initJeu();
        }, 1000); // 1000 (millisecondes), 1 seconde
    });

    // Ici on utilise "on click" car notre élement carte est créé dynamiquement (dans la fonction initJeu)
    // Comme cet élement n'existait pas lors du chargement du DOM, "on()" va permettre de le cibler 
    // contrairement à la fonction click classique qui n'agit que sur les éléments déjà chargés
    $( "#emplacements_cartes" ).on( "click", ".dos_carte", function() {

        // On ne valide pas le click si on est à deux cartes déjà en jeu
        if(nb_cartes_jeu < 2)
        {
            // On récupère l'attribut id de la carte sélectionnée
            var id_carte = $(this).attr('id');
            
            // On désactive la possibilité de cliquer sur d'autres cartes le temps que les vérifications s'effectuent
            // Toutes les cartes non retournées disposant de la class "dos_carte", on applique disable dessus
            $(".dos_carte").prop("disabled",true);
            
            setTimeout(function() {
                afficherCarte(id_carte);
            }, 200);        
        }

    });
});

/**
 * Initialisation du jeu
 * On génère les cartes aléatoirement puis on les double
 * On fait apparaître les cartes face cachées et un décompte de 3 secondes se lance 
*/ 
function initJeu()
{
    // On double le tableau contenant les cartes
    lst_cartes_doubles = lst_cartes.concat(lst_cartes);
    // On mélange aléatoirement les cartes   
    cartes_aleatoires = aleatoire(lst_cartes_doubles);

    // On affiche les cartes face cachées
    for(nb_cartes = 0; nb_cartes < cartes_aleatoires.length; nb_cartes++)
    {
        $("#emplacements_cartes").append('<img class="carte dos_carte" id='+nb_cartes+' src="images/dos_carte.png" />')
    }

    temps_decompte = 3;
    // On empêche de cliquer sur une carte le temps que le décompte soit à 0
    $(".dos_carte").prop("disabled",true)

    // Décompte avant le début du jeu
    var decompte = setInterval(function(){  
        temps_decompte--;

        if(temps_decompte <= 0)
        {
            $("#decompte_debut").html("GO !");

            // Pour que la fonction ne tourne pas indéfinément, on utilise clearInterval une fois arrivé à 0
            clearInterval(decompte); // Stop le timer

            // On active les cartes
            $(".dos_carte").prop("disabled",false);

            // On lance le chrono
            initChrono();            
        }
        else
        {
            // On affiche le temps restant du décompte
            $("#decompte_debut").html(temps_decompte);        
        }

    }, 1000);
}

/**
 * Cette fonction est basée sur l'algorithme du "mélange de Fisher-Yates"
 * Elle va permettre d'obtenir un tableau aux valeurs mélangées
 * 
 * @param {array} tableau : tableau à mélanger
 * @return {array}
 */
function aleatoire(tableau) 
{
    // Initialisation des variables
    var j = 0;
    var temp;

    // On récupère la taille du tableau
    var i = tableau.length;

    // On exécute la boucle tant que i est > 0. A chaque fois qu'on rééxécute la boucle, on enlève 1 à i
    for(i; i > 0; i--)
    {
        // Math.floor permettra d'arrondir à la valeur supérieure
        // Math.random génère un nombre aléatoire entre 0 et 1 
        j = Math.floor(Math.random() * i);

        // On garde dans un tableau temporaire l'élément en situé à la position i en décalant de 1
        temp = tableau[i-1];

        // On échange les deux valeurs
        // - On place l'élément sélectionné aléatoirement à la position i en décalant de 1
        // - On place l'élément sauvegardé dans la variable temp à la position j
        tableau[i-1] = tableau[j];
        tableau[j] = temp;
    }

    return tableau;
}

/**
 * Lance le chrono de 1 minute 30 et l'affiche à l'écran via la barre de chargement
 */
function initChrono()
{
    // Temps fixé à 1 minute 30
    var temps_restant = 90;

    // La fonction setInterval s'exécute toutes les x millisecondes définies
    var timerJeu = setInterval(function(){  
        
        if(temps_restant <= 0)
        {
            // Pour que la fonction ne tourne pas indéfinément, on utilise clearInterval une fois arrivé à 0
            clearInterval(timerJeu); // Stop le timer

            // On empêche d'autres cartes d'être cliquées et on affiche le message de fin de jeu
            $(".dos_carte").prop("disabled",true);
            
            // On termine le jeu
            terminerJeu();
        }
        
        // Réduire la taille de la barre de chargement pour indiquer le temps qui s'écoule
        $("#barre_temps_restant").width(temps_restant + "%");
        temps_restant--;

    }, temps_restant * 1000 / 100);
}

/**
 * Cette fonction va permettre d'afficher la carte sur laquelle on a cliqué
 * Elle récupère la bonne carte du tableau selon l'index passé en paramètre
 * 
 * @param {int} numero
 */
function afficherCarte(numero)
{
    // On modifie l'attribut src en sélectionnant la carte associée dans le tableau
    $("#"+numero).attr("src", "images/"+cartes_aleatoires[numero]+".png");

    // On vérifie la carte retournée
    verifierCarte(numero, cartes_aleatoires[numero]);
}

/**
 * Cette fonction va vérifier si les deux cartes jouées sont indentiques ou non
 * 
 * @param {int} numero
 * @param {string} carte
 */
function verifierCarte(numero, carte)
{
    nb_cartes_jeu++; // On incrémente le compteur de nombre de cartes jouées

    if(nb_cartes_jeu == 1)
    {
        // on enregistre le nom et le numéro de la carte jouée
        carte_jouee1 = carte; 
        numero_carte_jouee1 = numero;

        $("#"+numero_carte_jouee1).addClass('carte_retournee').removeClass('dos_carte');
    }
    else if(nb_cartes_jeu == 2)
    {
        // on enregistre le nom et le numéro de la carte jouée
        carte_jouee2 = carte;
        numero_carte_jouee2 = numero;

        $("#"+numero_carte_jouee2).addClass('carte_retournee').removeClass('dos_carte');

        // On compare les noms des deux cartes jouées
        if(carte_jouee1 == carte_jouee2)
        {
            // Les cartes sont les mêmes, on valide la paire
            score++;

            // On rajoute la class carte_retournee et on supprime la class dos_carte pour que les événements ne s'appliquent plus sur ces 
            $("#"+numero_carte_jouee1+",#"+numero_carte_jouee2).addClass('carte_retournee').removeClass('dos_carte');

            numero_carte_jouee1, numero_carte_jouee2 = "";
            carte_jouee1, carte_jouee2 = "";
            nb_cartes_jeu = 0;

            $("#score_actuel").html(score);
        }
        else
        {
            setTimeout(function() {      
                // Les cartes ne sont pas les mêmes, on les masque de nouveau
                $("#"+numero_carte_jouee1+",#"+numero_carte_jouee2).attr("src", "images/dos_carte.png");
                $("#"+numero_carte_jouee1+",#"+numero_carte_jouee2).addClass('dos_carte').removeClass('carte_retournee');
                
                // On met à jour nos variables
                numero_carte_jouee1, numero_carte_jouee2 = "";
                carte_jouee1, carte_jouee2 = "";
                nb_cartes_jeu = 0;
            }, 700);             
        }
    }

    // On redonne la possibilité de cliquer
    $(".dos_carte").prop("disabled",false);
}

/**
 * On demande son pseudo au joueur
 * On enregistre son score en base de donnée 
 */
function terminerJeu()
{
    pseudo_joueur = "";

    // Affichage d'un message différent selon le score
    // Prompt permet de demander une information à l'utilisateur
    if(score <= 13)
    {     
        pseudo_joueur = prompt("Game Over ! Ton score est de " + score + " ! Merci d'indiquer ton pseudo :", "Anonyme");
    }
    else
    {
        pseudo_joueur = prompt("Félicitations ! Ton score est de " + score + " ! Merci d'indiquer ton pseudo :", "Anonyme");
    }

    // Si le pseudo n'est pas renseigné
    if(pseudo_joueur == null)
    {
        pseudo_joueur = "Anonyme";
    }
    // Si le pseudo a plus de 15 caractères (en base on limite le pseudo à 15 caractères maximum)
    else if(pseudo_joueur.length > 15)
    {
        // substring(from, to)
        pseudo_joueur = pseudo_joueur.substring(0, 15);
    }

    // On envoi le pseudo du joueur et son score afin de les insérer en base
    $.ajax({
        url: 'index.php',
        type: 'POST',
        dataType: 'json',
        data: { pseudo:pseudo_joueur, score:score },
        success: function(data)
        {
            // Si c'est un succès
            if(data.status == 'success')
            {
                // Recharge la page
                location.reload();
            }
        }
    });    
}