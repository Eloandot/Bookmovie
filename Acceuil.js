document.addEventListener('DOMContentLoaded', function() {
    new ChannelSplitterNode(' .splide', {
        type       : 'loop',
        perPage    : 3,
        gap: '1rem',
        arrows: true,
        autoplay: true,
        pauseOnHover: true,
        resetProgress: false,
        pagination: false,
    }).mount();
});

const apiKey = 'VOTRE_CLE_API_GOOGLE_BOOKS';
const query = 'Harry Potter'; // ou le livre que tu veux

fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('reviews-list');
    data.items.forEach(item => {
      const title = item.volumeInfo.title || 'Titre inconnu';
      const authors = item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Auteur inconnu';
      const rating = item.volumeInfo.averageRating ? item.volumeInfo.averageRating + ' ⭐' : 'Pas de note';
      const img = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150x220?text=No+Image';
      
      const div = document.createElement('div');
      div.classList.add('review-card');
      div.innerHTML = `
        <img src="${img}" alt="${title}">
        <p><strong>${title}</strong></p>
        <p>${authors}</p>
        <p>${rating}</p>
      `;
      list.appendChild(div);
    });
  })
  .catch(err => console.error(err));
