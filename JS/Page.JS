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
// Details popup (for book cards)
const detailsPopup = document.getElementById("popupDetails");
const detailsCloseBtn = document.querySelector(".details-close");
const detailsBody = document.getElementById("detailsBody");
const detailsLink = document.getElementById('detailsLink');
const detailsExpandBtn = document.getElementById('detailsExpand');

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
                img.loading = 'lazy';
                bookDiv.appendChild(img);

                // Titre
                const title = document.createElement("h3");
                title.textContent = book.title || "Titre inconnu";
                bookDiv.appendChild(title);

                // Auteur & Année (simple)
                const author = document.createElement("p");
                author.textContent = book.author_name ? book.author_name.join(", ") : "Auteur inconnu";
                bookDiv.appendChild(author);

                const year = document.createElement("p");
                year.textContent = book.first_publish_year || "Année inconnue";
                bookDiv.appendChild(year);

                // Make card clickable for details and store reference key
                bookDiv.dataset.workKey = book.key || '';
                bookDiv.style.cursor = 'pointer';
                bookDiv.addEventListener('click', () => openBookDetails(book));

                resultsDiv.appendChild(bookDiv);
            });
        })
        .catch(error => {
            resultsDiv.textContent = "Impossible de charger les livres.";
            console.error(error);
        });
}

// Helper to safely escape HTML inserted into the modal
function escapeHtml(str){
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (s) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[s];
    });
}

// Open details modal for a searched book object
function openBookDetails(book){
    if (!detailsPopup || !detailsBody) return;
    detailsPopup.style.display = 'flex';
    detailsBody.innerHTML = '<p>Chargement des détails…</p>';
    if (detailsLink) { detailsLink.href = '#'; detailsLink.setAttribute('aria-disabled','true'); }
    if (detailsExpandBtn) detailsExpandBtn.setAttribute('aria-hidden','true');

    // Prefer work key (/works/OL...W) when available, else try first edition
    let apiUrl = null;
    if (book.key) apiUrl = `https://openlibrary.org${book.key}.json`;
    else if (book.edition_key && book.edition_key[0]) apiUrl = `https://openlibrary.org/books/${book.edition_key[0]}.json`;

    if (!apiUrl){
        // No further details available — show available info
        detailsBody.innerHTML = `<h3>${escapeHtml(book.title || 'Titre inconnu')}</h3>` +
            `<p><strong>Auteur :</strong> ${escapeHtml((book.author_name||[]).join(', ') || '—')}</p>` +
            `<p>Aucune information supplémentaire disponible.</p>`;
        if (detailsLink){ detailsLink.href = '#'; detailsLink.setAttribute('aria-disabled','true'); }
        if (detailsExpandBtn) detailsExpandBtn.setAttribute('aria-hidden','true');
        return;
    }

    fetch(apiUrl)
        .then(r => {
            if (!r.ok) throw new Error('Status ' + r.status);
            return r.json();
        })
        .then(data => {
            // Build content (different props may exist on works or editions)
            const title = data.title || book.title || 'Titre inconnu';
            const authors = (book.author_name ? book.author_name.join(', ') : (data.authors ? data.authors.map(a => a.name).join(', ') : 'Auteur inconnu'));
            let desc = '';
            if (data.description){
                if (typeof data.description === 'string') desc = data.description;
                else if (data.description.value) desc = data.description.value;
            }
            if (!desc && data.excerpts && data.excerpts.length) desc = data.excerpts.map(e=> e.excerpt || e.comment || '').join('\n\n');
            if (!desc && book.subject) desc = (book.subject.slice(0,8)||[]).join(', ');

            const subjects = data.subjects ? data.subjects.slice(0,8).join(', ') : (book.subject ? book.subject.slice(0,8).join(', ') : '—');

            const publish = data.first_publish_date || data.created?.value || book.first_publish_year || '—';

            const olLink = data.key ? `https://openlibrary.org${data.key}` : (book.key ? `https://openlibrary.org${book.key}` : (book.edition_key ? `https://openlibrary.org/books/${book.edition_key[0]}` : '#'));

            // Build the base info
            let html = `
                <h3 style="margin-top:0">${escapeHtml(title)}</h3>
                <p><strong>Auteur · </strong>${escapeHtml(authors)}</p>
                <p><strong>Publié · </strong>${escapeHtml(String(publish))}</p>
            `;

            // Description handling - may be long. We initially show a truncated preview.
            const MAX_PREVIEW = 360; // characters
            if (desc){
                const cleanDesc = escapeHtml(desc);
                if (cleanDesc.length > MAX_PREVIEW){
                    const short = cleanDesc.slice(0, MAX_PREVIEW) + '…';
                    html += `<div id="detailsDescription" style="margin-top:10px; color:#444">${short}</div>`;
                    if (detailsExpandBtn) {
                        detailsExpandBtn.setAttribute('aria-hidden','false');
                        detailsExpandBtn.textContent = 'Lire la suite';
                        // ensure previous click handlers removed
                        detailsExpandBtn.onclick = () => {
                            const descEl = document.getElementById('detailsDescription');
                            if (!descEl) return;
                            if (detailsExpandBtn.dataset.expanded === '1'){
                                descEl.innerHTML = short;
                                detailsExpandBtn.dataset.expanded = '0';
                                detailsExpandBtn.textContent = 'Lire la suite';
                            } else {
                                descEl.innerHTML = cleanDesc;
                                detailsExpandBtn.dataset.expanded = '1';
                                detailsExpandBtn.textContent = 'Réduire';
                            }
                        };
                    }
                } else {
                    html += `<div style="margin-top:10px; color:#444">${cleanDesc}</div>`;
                    if (detailsExpandBtn) detailsExpandBtn.setAttribute('aria-hidden','true');
                }
            }

            if (subjects) html += `<p style="margin-top:12px; color:#666"><strong>Sujets :</strong> ${escapeHtml(subjects)}</p>`;

            detailsBody.innerHTML = html;

            // Set / enable the OpenLibrary link in the modal footer so it's always reachable
            if (detailsLink){
                detailsLink.href = olLink || '#';
                detailsLink.removeAttribute('aria-disabled');
            }
        })
        .catch(err => {
            console.error('Book detail error', err);
            detailsBody.innerHTML = '<p>Impossible de récupérer les détails pour ce livre.</p>';
            if (detailsLink){ detailsLink.href = '#'; detailsLink.setAttribute('aria-disabled','true'); }
            if (detailsExpandBtn) detailsExpandBtn.setAttribute('aria-hidden','true');
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
    if (detailsPopup && e.target === detailsPopup) detailsPopup.style.display = 'none';
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

// details modal close/keyboard
if (detailsCloseBtn) detailsCloseBtn.addEventListener('click', () => detailsPopup.style.display = 'none');
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
        if (detailsPopup && detailsPopup.style.display === 'flex') detailsPopup.style.display = 'none';
        if (popup && popup.style.display === 'flex') popup.style.display = 'none';
    }
});
