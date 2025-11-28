document.addEventListener('DOMContentLoaded', function () {
    new Splide('.splide', {
        type: 'loop',
        perPage: 3,
        gap: '1rem',
        arrows: true,
        autoplay: false,
        pauseOnHover: true,
        pagination: false
    }).mount();

<p id="fact-text"></p>
<button onclick="getRandomQuote()">Nouvelle citation</button>

<script>
const quotes = [
  {quote: "La lecture, c'est la vie.", author: "Victor Hugo"},
  {quote: "Un livre est un jardin que l’on porte en poche.", author: "Proverbe arabe"},
  {quote: "Lire, c'est voyager sans bouger.", author: "Victor Hugo"}
];

function getRandomQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('fact-text').textContent = `"${q.quote}" — ${q.author}`;
}

// Affiche une citation dès le départ
getRandomQuote();
</script>
