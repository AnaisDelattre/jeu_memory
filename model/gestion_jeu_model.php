<?php

/**
 * Modèle d'accès aux données de notre base de données
 * Utilisation d'un PDO (PHP Data Objects) qui est une extension permettant d'accéder à n'importe quel type de base de données.
 */

/**
 * Effectue la connexion à la BDD 
 * 
 * @return object $bdd
 */
function connexion_bdd() 
{
    // Le bloc try catch va nous permettre de "capturer" les erreurs qui auraient pu survenir lors de la connexion à la base (dans le bloc try)
    try
    {
        // On indique ici le type de bdd sur lequel on se connect (mysql)
        // Le nom de l'hôte (localhost)
        // Le nom de la base de donnée (jeu_memory)
        // Le login, puis le mot de passe (vide ici puisque nous sommes en local)
        $bdd = new PDO('mysql:host=localhost;dbname=jeu_memory;charset=utf8', 'root', '');

        // On retourne l'objet qui nous permettra d'exécuter de communiquer avec notre base de données
        return $bdd;
    }
    catch (Exception $error)
    {
        // die permet d'arrêter l'exécution du script. On peut alors récupérer le message d'erreur dans exception $error grâce à la fonction getMessage()
        die('Erreur : ' . $error->getMessage());
    }
}

/**
 * Récupération des scores enregistrés en base de donnée
 * On utilise ici une requête préparée. Celles-ci permettent d'empêcher les injections SQL et sont plus rapides.
 * 
 * @return array scores
 */
function get_scores() 
{
    $bdd = connexion_bdd();

    // On prépare notre requête SQL
    $scores = $bdd->prepare('SELECT pseudo, score FROM scores ORDER BY score desc LIMIT 5');
    // On l'exécute
    $scores->execute();

    return $scores->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Insertion du score du joueur en base 
 * 
 * @param string $pseudo
 * @param int $score
 */
function inserer_score($pseudo, $score)
{
    $bdd = connexion_bdd();
    
    // Dans ma requête, je prépare les arguments que je souhaite insérer en les nommant (les ":" sont obligatoires)
    $req = $bdd->prepare('INSERT INTO scores(pseudo, score) VALUES(:pseudo, :score)');

    // La fonction execute() peut contenir des arguments comme ci dessous
    // Je crée le tableau qui contiendra les données correspondant à chaque arguments tel que je les ai définis dans mon prepare()
    // :pseudo est liée à la variable qui contient le $pseudo et :score à la variable qui contient le $score
    $req->execute(array(
        'pseudo' => $pseudo,
        'score' => $score
    ));
}
