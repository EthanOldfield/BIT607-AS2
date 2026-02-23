const wrapper = document.querySelector('.carousel-track-wrapper');
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

// Dot markers for mobile views.
const dotsEl = document.querySelector('.carousel-dots');

function buildDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i < workImages.length; i++) {
        const d = document.createElement('button');
        d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
    }
}

function updateDots() {
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
    });
}

// Card sliding logic.
function getSlideWidth() {
    const gap = parseFloat(getComputedStyle(track).gap);
    return document.querySelector('.carousel-slide').offsetWidth + gap;
}

buildDots();

function goTo(index) {
    const max = document.querySelectorAll('.carousel-slide').length - getVisible();
    current = Math.max(0, Math.min(index, max));
    track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
    prev.disabled = current === 0;
    next.disabled = current >= max;
    updateDots();
}

function getVisible() {
    return window.innerWidth >= 769 ? 3 : 1;
}

requestAnimationFrame(() => goTo(0));

next.addEventListener('click', () => goTo(current + 1));
prev.addEventListener('click', () => goTo(current - 1));

// Drag / swipe logic.
let dragStartX = 0, dragDeltaX = 0, isDragging = false;

wrapper.addEventListener('mousedown', e => {
    e.preventDefault();
    dragStartX = e.clientX;
    dragDeltaX = 0;
    isDragging = true;
    track.classList.add('no-transition');
    wrapper.classList.add('dragging');
});

window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    dragDeltaX = e.clientX - dragStartX;
    track.style.transform = `translateX(-${current * getSlideWidth() - dragDeltaX}px)`;
});

window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('no-transition');
    wrapper.classList.remove('dragging');
    const threshold = getSlideWidth() * 0.15;
    dragDeltaX < -threshold ? goTo(current + 1) : dragDeltaX > threshold ? goTo(current - 1) : goTo(current);
});

wrapper.addEventListener('touchstart', e => {
    dragStartX = e.touches[0].clientX;
    dragDeltaX = 0;
    isDragging = true;
    track.classList.add('no-transition');
}, { passive: true });

wrapper.addEventListener('touchmove', e => {
    if (!isDragging) return;
    dragDeltaX = e.touches[0].clientX - dragStartX;
    track.style.transform = `translateX(-${current * getSlideWidth() - dragDeltaX}px)`;
}, { passive: true });

wrapper.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('no-transition');
    const threshold = getSlideWidth() * 0.15;
    dragDeltaX < -threshold ? goTo(current + 1) : dragDeltaX > threshold ? goTo(current - 1) : goTo(current);
});