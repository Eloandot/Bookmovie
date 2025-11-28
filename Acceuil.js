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
  });
