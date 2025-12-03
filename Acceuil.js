document.addEventListener('DOMContentLoaded', function () {
  new Splide('.splide', {
    type: 'loop',
    perPage: 3,
    gap: '1rem',
    arrows: true,
    autoplay: true,
    pauseOnHover: true,
    pagination: false
  }).mount();
});

const citations = [];

//CITATIONS
citations.push("Lire m'a ramené a la vie quand je me suis tuée dans ma réalité. — Marzia myers");
citations.push("Les livres sont des miroirs : on n'y voit que ce qu'on porte en soi. — Carlos Ruiz Zafón");
citations.push("On devrait toujours avoir un livre sous la main, au cas où. — Jules Renard");
citations.push("Un livre bien choisi vous sauvera de tout, même de vous-même. — Charles Dantzig");
citations.push("La lecture est une porte ouverte sur un monde enchanté. — François Mauriac");
citations.push("L'homme qui ne lit pas n'a aucun avantage sur celui qui ne sait pas lire. — Mark Twain");
citations.push("Les livres sont les compagnons les plus silencieux et constants. — Charles W. Eliot");
citations.push("Chaque page tournée est une aventure commencée.");
citations.push("Ce que tu lis te façonne plus que ce que tu vois.");
citations.push("La lecture est une amitié. — Marcel Proust");
citations.push("Un lecteur vit mille vies avant de mourir. Celui qui ne lit pas n'en vit qu'une. — George R.R. Martin");
citations.push("Lire, c'est voyager ; voyager, c'est lire. — Victor Hugo");
citations.push("Un livre est un rêve que vous tenez entre vos mains. — Neil Gaiman");
citations.push("Les livres servent à montrer à l'homme qu'il n'est pas seul. — C.S. Lewis");
citations.push("Le monde appartient à ceux qui lisent. — Rick Holland");
citations.push("On ne lit jamais un livre. On se lit à travers les livres. — Alberto Manguel");
citations.push("La lecture agrandit l'âme. — Voltaire");
citations.push("Une pièce sans livres est comme un corps sans âme. — Cicéron");
citations.push("Les mots sont notre plus inépuisable source de magie. — J.K. Rowling");
citations.push("Un livre doit être la hache qui brise la mer gelée en nous. — Franz Kafka");



// ------------------ AFFICHAGE ------------------
const quoteText = document.getElementById('quote');
const quoteBtn = document.getElementById('quoteBtn');

quoteBtn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * citations.length);
    quoteText.textContent = citations[randomIndex];
});

document.addEventListener('DOMContentLoaded', () => {

    // ---------------- Carrousel Splide ----------------
    new Splide('.splide', {
        type: 'loop',
        perPage: 5,
        autoplay: true,
        interval: 3000,
        pauseOnHover: true,
        breakpoints: {
            1024: { perPage: 3 },
            768: { perPage: 2 },
            480: { perPage: 1 }
        }
    }).mount();

    // ---------------- Carte Leaflet ----------------
    let map = L.map('map').setView([46.2276, 2.2137], 6); // France
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let markers = [];

    const apiKey = "7802a2b523554d69809f64e605f22e51"; // <-- Ta clé Geoapify

    // ---------------- Recherche librairies ----------------
    const findBtn = document.getElementById("findLibraryBtn");
    findBtn.addEventListener("click", () => {
        const city = document.getElementById("cityInput").value.trim();
        if (!city) {
            alert("Veuillez entrer une ville.");
            return;
        }

        // 1️⃣ Obtenir les coordonnées de la ville avec Geocoding
        const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city + ', France')}&apiKey=${apiKey}`;

        
        fetch(geoUrl)
            .then(res => res.json())
            .then(geoData => {
                if (!geoData.features || geoData.features.length === 0) {
                    alert("Ville introuvable.");
                    return;
                }

                const { lat, lon } = geoData.features[0].properties;

                // 2️⃣ Calculer un petit rectangle autour de la ville
                const delta = 0.1; // ~10 km
                const minLat = lat - delta;
                const maxLat = lat + delta;
                const minLon = lon - delta;
                const maxLon = lon + delta;

                // 3️⃣ Rechercher les librairies
                const libUrl = `https://api.geoapify.com/v2/places?categories=shop.book&filter=rect:${minLon},${minLat},${maxLon},${maxLat}&limit=10&apiKey=${apiKey}`;

                return fetch(libUrl);
            })
            .then(res => res.json())
            .then(data => {

                // Supprimer anciens marqueurs
                markers.forEach(m => map.removeLayer(m));
                markers = [];

                if (!data.features || data.features.length === 0) {
                    alert("Aucune librairie trouvée dans cette ville.");
                    return;
                }

                data.features.forEach(place => {
                    const coords = [place.geometry.coordinates[1], place.geometry.coordinates[0]];
                    const marker = L.marker(coords).addTo(map)
                        .bindPopup(`<b>${place.properties.name}</b><br>${place.properties.address_line1 || ''} ${place.properties.city || ''}`);
                    markers.push(marker);
                });

                // Recentrer la carte sur les librairies
                const group = new L.featureGroup(markers);
                map.fitBounds(group.getBounds().pad(0.5));

            })
            .catch(err => {
                console.error("Erreur API:", err);
                alert("Erreur lors de la recherche. Vérifiez votre clé API.");
            });
    });

});
