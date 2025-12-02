/* ============================================================
   1) INITIALISATION DU CARROUSEL SPLIDE
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {        // Attend que la page soit complètement chargée

  new Splide('.splide', {                                          // Crée un nouveau carrousel Splide dans la zone avec .splide

    type: 'loop',                                                  // Le carrousel recommence au début quand il atteint la fin
    perPage: 3,                                                    // Nombre d’images visibles en même temps
    gap: '1rem',                                                   // Espace entre les images
    arrows: true,                                                  // Affiche les flèches gauche/droite
    autoplay: true,                                                // Le carrousel défile automatiquement
    pauseOnHover: true,                                            // L’autoplay se met en pause quand la souris passe dessus
    pagination: false                                              // Retire les petits points sous le carrousel

  }).mount();                                                      // Active le carrousel pour de vrai
});



/* ============================================================
   2) LISTE DES CITATIONS
   ============================================================ */

const citations = [];                                              // Tableau qui contiendra toutes les citations


// Ajoute une citation dans le tableau à chaque ligne
citations.push("Lire m'a ramené à la vie quand je me suis tuée dans ma réalité. — Marzia Myers");   // 1
citations.push("Les livres sont des miroirs : on n'y voit que ce qu'on porte en soi. — Carlos Ruiz Zafón"); // 2
citations.push("On devrait toujours avoir un livre sous la main, au cas où. — Jules Renard");       // 3
citations.push("Un livre bien choisi vous sauvera de tout, même de vous-même. — Charles Dantzig");  // 4
citations.push("La lecture est une porte ouverte sur un monde enchanté. — François Mauriac");       // 5
citations.push("L'homme qui ne lit pas n'a aucun avantage sur celui qui ne sait pas lire. — Mark Twain"); // 6
citations.push("Les livres sont les compagnons les plus silencieux et constants. — Charles W. Eliot"); // 7
citations.push("Chaque page tournée est une aventure commencée.");                                   // 8
citations.push("Ce que tu lis te façonne plus que ce que tu vois.");                                // 9
citations.push("La lecture est une amitié. — Marcel Proust");                                        // 10
citations.push("Un lecteur vit mille vies avant de mourir. Celui qui ne lit pas n'en vit qu'une. — George R.R. Martin"); // 11
citations.push("Lire, c'est voyager ; voyager, c'est lire. — Victor Hugo");                         // 12
citations.push("Un livre est un rêve que vous tenez entre vos mains. — Neil Gaiman");               // 13
citations.push("Les livres servent à montrer à l'homme qu'il n'est pas seul. — C.S. Lewis");         // 14
citations.push("Le monde appartient à ceux qui lisent. — Rick Holland");                            // 15
citations.push("On ne lit jamais un livre. On se lit à travers les livres. — Alberto Manguel");      // 16
citations.push("La lecture agrandit l'âme. — Voltaire");                                             // 17
citations.push("Une pièce sans livres est comme un corps sans âme. — Cicéron");                     // 18
citations.push("Les mots sont notre plus inépuisable source de magie. — J.K. Rowling");              // 19
citations.push("Un livre doit être la hache qui brise la mer gelée en nous. — Franz Kafka");         // 20



/* ============================================================
   3) AFFICHER UNE CITATION ALÉATOIRE
   ============================================================ */

const quoteText = document.getElementById('quote');               // Zone où la citation va apparaître
const quoteBtn = document.getElementById('quoteBtn');             // Bouton pour changer de citation

quoteBtn.addEventListener('click', () => {                        // Quand on clique sur le bouton...

    const randomIndex = Math.floor(Math.random() * citations.length); // Choisit un nombre au hasard entre 0 et la taille du tableau
    quoteText.textContent = citations[randomIndex];                    // Affiche la citation correspondante
});
