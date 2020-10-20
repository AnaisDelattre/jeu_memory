<!DOCTYPE HTML>
<html lang="fr">
    <head>
        <title>Memory Game !</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>    
        
        <!-- Polices -->
        <link href="https://fonts.googleapis.com/css2?family=Jura&family=Krona+One&display=swap" rel="stylesheet">      
        
        <!-- Script persos -->
        <link rel="stylesheet" href="css/style.css" />
        <script src="js/script.js"></script>

    </head>

    <body>
        <section id="container">

            <!-- Ecran d'accueil affichant la présentation et les meilleurs scores -->
            <div class="blocs" id="bloc_presentation">
                <h1>Assemble et mémorise</h1>

                <p>14 paires, 1 objectif : assembler les paires en 1 minute 30 ...</p>
                <p>Prêt(e) à relever le défi ?! Alors clique sur "Commencer" !</p>

                <button id="btn_start"><b>Commencer</b></button>
            </div>

            <div class="blocs" id="bloc_scores">

                <h1>Meilleurs scores</h1>
                <p>Les cinq meilleurs scores à battre !</p>
                <p>
                    <!-- Affichage des meilleurs scores récupérés en amont -->
                    <?php foreach($meilleurs_scores as $score)
                        echo "- <b>" . $score['pseudo'] . "</b> : " . $score['score'] . "<br/>";
                    ?>
                </p>
            </div>
    
            <!-- Ecran de jeu -->
            <div class="game">
                <h1 id="decompte_debut">3</h1>

                <div id="emplacements_cartes"></div>
            </div>         

            <!-- Ecran de score et de temps -->
            <div id="container_scores_temps">
                <p><b>SCORE : <span id="score_actuel">0</span></b></p>
                <div id="barre_temps_restant"></div>          
            </div>
        </section>


    </body>
</html>