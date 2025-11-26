// --- Sélecteurs DOM ---
const resultsDiv = document.getElementById("results");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const choixType = document.getElementById("choixType");
const choixTri = document.getElementById("choixTri");
const filterBtn = document.getElementById("filterBtn");

// Popup inscription
const popup = document.getElementById("popupInscription");
const joinBtn = document.querySelector(".join-btn");
const closeBtn = document.querySelector(".close");
const formInscription = document.getElementById("formInscription");

// --- Fonction de recherche précise ---
function searchBooks(query) {
    const typeFilter = choixType.value;
    let url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;

    // Ajouter un filtre précis selon le type
    if (typeFilter === "mangas") {
        url += "&subject=manga";
    } else if (typeFilter === "books") {
        url += "&subject=fiction";
    }

    resultsDiv.textContent = "Chargement...";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            resultsDiv.textContent = "";

            // --- Tri précis ---
            if (choixTri.value === "title") {
                data.docs.sort((a, b) => {
                    const titleA = a.title ? a.title.toLowerCase() : "";
                    const titleB = b.title ? b.title.toLowerCase() : "";
                    return titleA.localeCompare(titleB);
                });
            } else if (choixTri.value === "year") {
                data.docs.sort((a, b) => {
                    const yearA = a.first_publish_year || 0;
                    const yearB = b.first_publish_year || 0;
                    return yearB - yearA; // Du plus récent au plus ancien
                });
            }

            // Limite à 12 résultats
            data.docs.slice(0, 12).forEach(book => {
                const bookDiv = document.createElement("div");
                bookDiv.classList.add("movie-card");

                // Image
                const img = document.createElement("img");
                img.src = book.cover_i ? 
                          `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 
                          "image/placeholder.jpg";
                img.classList.add("movie-poster");
                bookDiv.appendChild(img);

                // Titre
                const title = document.createElement("h3");
                title.textContent = book.title || "Titre inconnu";
                bookDiv.appendChild(title);

                // Auteur
                const author = document.createElement("p");
                author.textContent = book.author_name ? book.author_name.join(", ") : "Auteur inconnu";
                bookDiv.appendChild(author);

                // Année
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

// --- Bouton Rechercher ---
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim() || "";
    searchBooks(query);
});

// --- Bouton Filtrer ---
filterBtn.addEventListener("click", () => {
    const query = searchInput.value.trim() || "";
    searchBooks(query);
});

// --- Afficher quelques mangas par défaut ---
searchBooks("Manga");

// --- Popup inscription ---
joinBtn.addEventListener("click", () => popup.style.display = "flex");
closeBtn.addEventListener("click", () => popup.style.display = "none");
window.addEventListener("click", (e) => {
    if (e.target === popup) popup.style.display = "none";
});

// --- Formulaire d'inscription ---
formInscription.addEventListener("submit", (e) => {
    e.preventDefault();
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nom || !prenom || !email) {
        alert("Merci de remplir tous les champs.");
        return;
    }

    alert(`Merci ${prenom}, votre inscription a bien été envoyée !`);
    popup.style.display = "none";
    formInscription.reset();
});
