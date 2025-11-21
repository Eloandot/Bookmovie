const resultsDiv = document.getElementById("results");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const choixType = document.getElementById("choixType");
const choixTri = document.getElementById("choixTri");

// Fonction pour rechercher les livres via Open Library
function searchBooks(query) {
    // Ajouter le filtre Type
    let typeFilter = choixType.value;
    if(typeFilter === "mangas") query = "manga " + query;
    else if(typeFilter === "books" && query.trim() === "") query = "book";

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;

    resultsDiv.textContent = "Chargement...";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            resultsDiv.textContent = ""; // vide le loader

            // Tri des résultats
            let tri = choixTri.value;
            if(tri === "title") {
                data.docs.sort((a, b) => a.title.localeCompare(b.title));
            } else if(tri === "year") {
                data.docs.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
            }

            data.docs.slice(0, 12).forEach(book => { // max 12 résultats
                const bookDiv = document.createElement("div");
                bookDiv.classList.add("movie-card"); // réutilisation du style existant

                // Couverture du livre
                if (book.cover_i) {
                    const img = document.createElement("img");
                    img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
                    img.classList.add("movie-poster");
                    bookDiv.appendChild(img);
                }

                // Titre
                const title = document.createElement("h3");
                title.textContent = book.title;
                bookDiv.appendChild(title);

                // Auteur(s)
                const author = document.createElement("p");
                author.textContent = book.author_name ? book.author_name.join(", ") : "Auteur inconnu";
                bookDiv.appendChild(author);

                // Année de publication
                const year = document.createElement("p");
                year.textContent = book.first_publish_year || "Année inconnue";
                bookDiv.appendChild(year);

                resultsDiv.appendChild(bookDiv);
            });
        })
        .catch(error => {
            resultsDiv.textContent = "Impossible de charger les livres.";
            console.error(error);
        });
}

// Lancer la recherche lors du clic sur le bouton
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if(query || choixType.value !== "all") searchBooks(query);
});

// Recherche automatique au chargement si tu veux afficher quelques livres par défaut
searchBooks("Manga");
