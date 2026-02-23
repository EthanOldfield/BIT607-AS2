const track = document.querySelector('.carousel-track');
const prev = document.querySelector('.carousel-arrow.prev');
const next = document.querySelector('.carousel-arrow.next');
let current = 0;

// Card generation logic.
const workImages = [
    { title: 'Haircuts & Styling', desc: 'Dog with sunglasses', base: 'dog_sunglasses', ext: 'full' },
    { title: 'Full Grooming', desc: 'Dog getting haircut.', base: 'dog_haircut', ext: 'full' },
    { title: 'Spa Treatments', desc: 'Dog getting cleaned.', base: 'dog_wash', ext: 'full' },
    { title: 'Brushing & De-shed', desc: 'Dog getting brushed.', base: 'dog_brushing', ext: 'full' }
];

workImages.forEach(img => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `
        <picture>
            <source srcset="images/gallery/${img.base}_low.webp 480w, images/gallery/${img.base}_medium.webp 768w, images/gallery/${img.base}_${img.ext}.webp 2000w" type="image/webp">
            <img src="images/gallery/${img.base}_${img.ext}.webp" class="placeholder-image" alt="${img.title}" loading="lazy">
        </picture>
        <div class="carousel-slide-body">
            <h3>${img.title}</h3>
            <p>${img.desc}</p>
        </div>`;
    track.appendChild(slide);
});

// Card sliding logic.
next.addEventListener('click', () => {
    current++;
    track.style.transform = `translateX(-${current * 100}%)`;
});

prev.addEventListener('click', () => {
    current--;
    track.style.transform = `translateX(-${current * 100}%)`;
});