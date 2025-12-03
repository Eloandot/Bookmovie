document.addEventListener("DOMContentLoaded", function () {

    const cityInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("libSearchBtn");
    const resultContainer = document.getElementById("resultContainer");

    let map = L.map("map").setView([48.8566, 2.3522], 12); // Paris par défaut
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let markers = [];

    function addMarker(lat, lon, name) {
        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(name);
        markers.push(marker);
    }

    async function searchLibraries() {
        const city = cityInput.value.trim();
        if (!city) return alert("Veuillez entrer une ville !");

        resultContainer.innerHTML = "Recherche en cours...";

        try {
            // Géocodage de la ville
            const geoResp = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${city}&apiKey=bfd370e336da49d68a0e8b29da954f20`);
            const geoData = await geoResp.json();

            if (!geoData.features || geoData.features.length === 0) {
                resultContainer.innerHTML = "Ville introuvable.";
                return;
            }

            const { lat, lon } = geoData.features[0].properties;
            map.setView([lat, lon], 13);

            // Supprime les anciens marqueurs
            markers.forEach(m => map.removeLayer(m));
            markers = [];

            // Recherche des librairies dans un rayon de 10 km
            const apiUrl = `https://api.geoapify.com/v2/places?categories=education.library&filter=circle:${lon},${lat},5000&apiKey=bfd370e336da49d68a0e8b29da954f20`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.features || data.features.length === 0) {
                resultContainer.innerHTML = "Aucune librairie trouvée dans cette ville.";
                return;
            }

            resultContainer.innerHTML = "";
            data.features.forEach(lib => {
                const libName = lib.properties.name || "Nom inconnu";
                const libAddress = lib.properties.address_line1 || "";
                const libCity = lib.properties.city || "";
                resultContainer.innerHTML += `<p><strong>${libName}</strong> - ${libAddress}, ${libCity}</p>`;
                addMarker(lib.properties.lat, lib.properties.lon, libName);
            });

        } catch (err) {
            console.error(err);
            resultContainer.innerHTML = "Erreur lors de la recherche.";
        }
    }

    searchBtn.addEventListener("click", searchLibraries);
    cityInput.addEventListener("keypress", e => {
        if (e.key === "Enter") searchLibraries();
    });
});
