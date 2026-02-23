const track = document.querySelector('.carousel-track');
const prev = document.querySelector('.carousel-arrow.prev');
const next = document.querySelector('.carousel-arrow.next');
let current = 0;

next.addEventListener('click', () => {
    current++;
    track.style.transform = `translateX(-${current * 100}%)`;
});

prev.addEventListener('click', () => {
    current--;
    track.style.transform = `translateX(-${current * 100}%)`;
});