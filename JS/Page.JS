// --- Sélecteurs DOM ---
const resultsDiv = document.getElementById("results");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const choixType = document.getElementById("choixType");
const choixTri = document.getElementById("choixTri");
const filterBtn = document.getElementById("filterBtn");

const popup = document.getElementById("popupInscription");
const joinBtn = document.querySelector(".join-btn");
const closeBtn = document.querySelector(".close");
const formInscription = document.getElementById("formInscription");

const detailsPopup = document.getElementById("popupDetails");
const detailsCloseBtn = document.querySelector(".details-close");
const detailsBody = document.getElementById("detailsBody");
const detailsLink = document.getElementById('detailsLink');
const detailsExpandBtn = document.getElementById('detailsExpand');

const contactForm = document.querySelector('.contactForm');
const contactSuccessMsg = document.getElementById('successMsg');

// --- Fonction de recherche principale ---
function searchBooks(query) {
    const typeFilter = choixType?.value || "";
    let url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;

    if (typeFilter === "mangas") url += "&subject=manga";
    else if (typeFilter === "books") url += "&subject=fiction";

    if(resultsDiv) resultsDiv.textContent = "Chargement...";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if(resultsDiv) resultsDiv.textContent = "";
            let docs = data.docs || [];

            if(choixTri?.value === "title") {
                docs.sort((a,b) => (a.title||"").toLowerCase().localeCompare((b.title||"").toLowerCase()));
            } else if(choixTri?.value === "year") {
                docs.sort((a,b) => (b.first_publish_year||0) - (a.first_publish_year||0));
            }

            docs.slice(0,12).forEach(book => {
                if(!book.cover_i) return;

                const bookDiv = document.createElement("div");
                bookDiv.classList.add("movie-card");
                bookDiv.style.cursor = 'pointer';
                bookDiv.dataset.workKey = book.key || '';

                const img = document.createElement("img");
                img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
                img.classList.add("movie-poster");
                img.loading = 'lazy';
                bookDiv.appendChild(img);

                const title = document.createElement("h3");
                title.textContent = book.title || "Titre inconnu";
                bookDiv.appendChild(title);

                const author = document.createElement("p");
                author.textContent = book.author_name ? book.author_name.join(", ") : "Auteur inconnu";
                bookDiv.appendChild(author);

                const year = document.createElement("p");
                year.textContent = book.first_publish_year || "Année inconnue";
                bookDiv.appendChild(year);

                bookDiv.addEventListener('click', () => openBookDetails(book));

                resultsDiv.appendChild(bookDiv);
            });
        })
        .catch(error => {
            if(resultsDiv) resultsDiv.textContent = "Impossible de charger les livres.";
            console.error(error);
        });
}

// --- Fonction pour sécuriser l’affichage HTML ---
function escapeHtml(str){
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, (s) =>
        ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])
    );
}

// --- Ouverture du popup détails ---
function openBookDetails(book){
    if (!detailsPopup || !detailsBody) return;

    detailsPopup.style.display = 'flex';
    detailsBody.innerHTML = '<p>Chargement des détails…</p>';

    if (detailsLink){
        detailsLink.href = '#';
        detailsLink.setAttribute('aria-disabled','true');
    }
    if (detailsExpandBtn) detailsExpandBtn.setAttribute('aria-hidden','true');

    let apiUrl = null;
    if(book.key) apiUrl = `https://openlibrary.org${book.key}.json`;
    else if(book.edition_key && book.edition_key[0]) apiUrl = `https://openlibrary.org/books/${book.edition_key[0]}.json`;

    if(!apiUrl){
        detailsBody.innerHTML =
            `<h3>${escapeHtml(book.title || 'Titre inconnu')}</h3>` +
            `<p><strong>Auteur :</strong> ${escapeHtml((book.author_name||[]).join(', ') || '—')}</p>` +
            `<p>Aucune information supplémentaire disponible.</p>`;
        return;
    }

    fetch(apiUrl)
        .then(r => { if(!r.ok) throw new Error('Status '+r.status); return r.json(); })
        .then(data => {
            const title = data.title || book.title || 'Titre inconnu';
            const authors = book.author_name ? book.author_name.join(', ') :
                (data.authors ? data.authors.map(a => a.name).join(', ') : 'Auteur inconnu');

            let desc = '';
            if(data.description){
                desc = typeof data.description === 'string' ? data.description : data.description.value;
            }
            if(!desc && data.excerpts) desc = data.excerpts.map(e => e.excerpt || e.comment || '').join("\n\n");
            if(!desc && book.subject) desc = book.subject.slice(0, 8).join(", ");

            const subjects = data.subjects ? data.subjects.slice(0, 8).join(", ") :
                            (book.subject ? book.subject.slice(0, 8).join(", ") : "—");

            const publish = data.first_publish_date || data.created?.value || book.first_publish_year || "—";
            const olLink = data.key ? `https://openlibrary.org${data.key}` : "#";

            let html = `<h3 style="margin-top:0">${escapeHtml(title)}</h3>` +
                       `<p><strong>Auteur · </strong>${escapeHtml(authors)}</p>` +
                       `<p><strong>Publié · </strong>${escapeHtml(String(publish))}</p>`;

            const MAX_PREVIEW = 360;
            if(desc){
                const cleanDesc = escapeHtml(desc);
                if(cleanDesc.length > MAX_PREVIEW){
                    const short = cleanDesc.slice(0, MAX_PREVIEW)+"…";
                    html += `<div id="detailsDescription" style="margin-top:10px; color:#444">${short}</div>`;
                    if(detailsExpandBtn){
                        detailsExpandBtn.setAttribute('aria-hidden','false');
                        detailsExpandBtn.textContent = "Lire la suite";
                        detailsExpandBtn.onclick = () => {
                            const descEl = document.getElementById("detailsDescription");
                            if(!descEl) return;
                            if(detailsExpandBtn.dataset.expanded === "1"){
                                descEl.innerHTML = short;
                                detailsExpandBtn.dataset.expanded="0";
                                detailsExpandBtn.textContent = "Lire la suite";
                            } else {
                                descEl.innerHTML = cleanDesc;
                                detailsExpandBtn.dataset.expanded="1";
                                detailsExpandBtn.textContent = "Réduire";
                            }
                        };
                    }
                } else html += `<div style="margin-top:10px; color:#444">${cleanDesc}</div>`;
            }

            if(subjects) html += `<p style="margin-top:12px; color:#666"><strong>Sujets :</strong> ${escapeHtml(subjects)}</p>`;

            detailsBody.innerHTML = html;
            if(detailsLink){
                detailsLink.href = olLink;
                detailsLink.removeAttribute('aria-disabled');
            }
        })
        .catch(err => {
            console.error("Book detail error", err);
            detailsBody.innerHTML = "<p>Impossible de récupérer les détails pour ce livre.</p>";
        });
}

// --- Recherche et filtres ---
if(searchBtn) searchBtn.addEventListener("click", () => searchBooks(searchInput.value.trim() || ""));
if(filterBtn) filterBtn.addEventListener("click", () => searchBooks(searchInput.value.trim() || ""));
if(location.pathname.endsWith('Page.html')) searchBooks("Manga");

// --- Popup inscription ---
if(joinBtn) joinBtn.addEventListener("click", () => popup.style.display = "flex");
if(closeBtn) closeBtn.addEventListener("click", () => popup.style.display = "none");

if(formInscription)
    formInscription.addEventListener("submit", (e) => {
        e.preventDefault();
        const nom = document.getElementById("nom").value.trim();
        const prenom = document.getElementById("prenom").value.trim();
        const email = document.getElementById("email").value.trim();
        if(!nom || !prenom || !email){
            alert("Merci de remplir tous les champs.");
            return;
        }
        alert(`Merci ${prenom}, votre inscription a bien été envoyée !`);
        popup.style.display = "none";
        formInscription.reset();
    });

// --- Formulaire de contact ---
if(contactForm){
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nom = contactForm.querySelector('[name="nom"]').value.trim();
        const email = contactForm.querySelector('[name="email"]').value.trim();
        const message = contactForm.querySelector('[name="message"]').value.trim();
        if(!nom || !email || !message){
            alert("Merci de remplir tous les champs du formulaire.");
            return;
        }
        contactSuccessMsg.style.display = 'block';
        contactForm.reset();
        setTimeout(() => { contactSuccessMsg.style.display = 'none'; }, 5000);
    });
}

// --- Popup détails ---
if(detailsCloseBtn) detailsCloseBtn.addEventListener('click', () => detailsPopup.style.display = 'none');

// --- Fermeture des popups au clic en dehors ---
window.addEventListener("click", (e) => {
    if(e.target === popup) popup.style.display = 'none';
    if(detailsPopup && e.target === detailsPopup) detailsPopup.style.display = 'none';
});

// --- Fermeture des popups à Échap ---
window.addEventListener("keydown", (e) => {
    if(e.key === 'Escape'){
        if(detailsPopup && detailsPopup.style.display === 'flex') detailsPopup.style.display = 'none';
        if(popup && popup.style.display === 'flex') popup.style.display = 'none';
    }
});
