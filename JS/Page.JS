const resultsDiv = document.getElementById("results");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const choixType = document.getElementById("choixType");
const choixTri = document.getElementById("choixTri");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const carousel = resultsDiv;

/* Recherche de livres */
function searchBooks(query) {
    let typeFilter = choixType.value;
    if (typeFilter === "mangas") query = "manga " + query;

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    resultsDiv.textContent = "Chargement...";

    fetch(url)
        .then(res => res.json())
        .then(data => {
            resultsDiv.textContent = "";
            
            if (!data.docs.length) {
                resultsDiv.textContent = "Aucun résultat.";
                return;
            }

            if (choixTri.value === "title")
                data.docs.sort((a,b)=>a.title.localeCompare(b.title));
            else if (choixTri.value === "year")
                data.docs.sort((a,b)=>(b.first_publish_year||0)-(a.first_publish_year||0));

            data.docs.slice(0,12).forEach(book=>{
                const card = document.createElement("div");
                card.className = "movie-card";

                card.innerHTML = `
                    <img class="movie-poster" src="${book.cover_i ? 
                        `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 
                        "image/placeholder.jpg"}">
                    <h3>${book.title}</h3>
                    <p>${book.author_name ? book.author_name.join(", ") : "Auteur inconnu"}</p>
                    <p>${book.first_publish_year || "Année inconnue"}</p>
                `;
                resultsDiv.appendChild(card);
            });
        })
        .catch(() => {
            resultsDiv.textContent = "Impossible de charger les livres.";
        });
}

/* Événement recherche */
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    searchBooks(query || "book");
});

/* Recherche par défaut */
searchBooks("Manga");

/* Carrousel */
prevBtn.addEventListener("click",()=>carousel.scrollBy({left:-220,behavior:'smooth'}));
nextBtn.addEventListener("click",()=>carousel.scrollBy({left:220,behavior:'smooth'}));

/* Popup inscription */
const popup = document.getElementById("popupInscription");
const joinBtn = document.querySelector(".join-btn");
const closeBtn = document.querySelector(".close");
const formInscription = document.getElementById("formInscription");

if (joinBtn) joinBtn.addEventListener("click",()=>popup.style.display="flex");
closeBtn.addEventListener("click",()=>popup.style.display="none");

window.addEventListener("click",e=>{
    if (e.target === popup) popup.style.display="none";
});

formInscription.addEventListener("submit",(e)=>{
    e.preventDefault();
    const nom = nom.value.trim();
    const prenom = prenom.value.trim();
    const email = email.value.trim();

    alert(`Merci ${prenom}, votre inscription a bien été envoyée !`);
    popup.style.display="none";
    formInscription.reset();
});
