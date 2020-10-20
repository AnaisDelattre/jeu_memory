<?php

/**
 * Charge la vue qui sert d'écran d'accueil et d'écran de jeu
 * Si on reçoit un score via POST, on l'enregistre en base
 */

// Chargement du fichier servant à accéder aux données en base
require 'model/gestion_jeu_model.php';

// Si on reçoit un score via POST
if (isset($_POST['score']) && isset($_POST['pseudo'])) 
{
    $score = intval($_POST['score']);
    $pseudo = $_POST['pseudo'];

    // Le bloc try catch va nous permettre de "capturer" les erreurs qui auraient pu survenir lors de la connexion à la base (dans le bloc try)
    try
    {
        // On appelle la fonction inserer_score() du modèle pour enregistrer le score du joueur
        inserer_score($pseudo, $score);

        $response_array['status'] = 'success'; // Va nous permettre d'indiquer à l'appel ajax que l'insertion est un succès
    }
    catch (Exception $error)
    {
        // die permet d'arrêter l'exécution du script. On peut alors récupérer le message d'erreur dans exception $error grâce à la fonction getMessage()
        die('Erreur : ' . $error->getMessage());
    }

    // On retourne du json à notre appel ajax 
    header('Content-type: application/json');
    echo json_encode($response_array);
}
else
{
    // Récupération des meilleurs scores en base
    $meilleurs_scores = get_scores();

    // Chargement de la vue représentant notre écran d'accueil et de jeu
    require 'vues/jeu_view.php';
}
