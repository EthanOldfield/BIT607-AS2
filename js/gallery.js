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

const teamImages = [
    { title: 'Sarah', desc: 'Lead Groomer', base: 'dog_sunglasses', ext: 'full' },
    { title: 'James', desc: 'Senior Stylist', base: 'dog_haircut', ext: 'full' },
    { title: 'Mia', desc: 'Spa Specialist', base: 'dog_wash', ext: 'full' },
    { title: 'Tom', desc: 'De-shed Expert', base: 'dog_brushing', ext: 'full' },
    { title: 'Sarah', desc: 'Lead Groomer', base: 'dog_sunglasses', ext: 'full' },
    { title: 'James', desc: 'Senior Stylist', base: 'dog_haircut', ext: 'full' },
    { title: 'Mia', desc: 'Spa Specialist', base: 'dog_wash', ext: 'full' },
    { title: 'Tom', desc: 'De-shed Expert', base: 'dog_brushing', ext: 'full' }
];

const salonImages = [
    { title: 'Bathing Stations', desc: 'Purpose-built tubs with warm water and gentle pet-safe shampoos.', base: 'dog_wash', ext: 'full' },
    { title: 'Grooming Tables', desc: 'Non-slip, height-adjustable tables for safe and comfortable grooming.', base: 'dog_haircut', ext: 'full' },
    { title: 'Relaxation Area', desc: 'A calm space where pets can settle in before their appointment.', base: 'dog_brushing', ext: 'full' }
];

function buildSlide(img)
{
    return `
        <picture>
            <source srcset="${getSrcset(img.base, img.ext, true)}" type="image/webp">
            <img src="images/gallery/${img.base}_${img.ext}.webp" class="placeholder-image" alt="${img.title}" loading="lazy">
        </picture>
        <div class="carousel-slide-body">
            <h3>${img.title}</h3>
            <p>${img.desc}</p>
        </div>`;
}

workImages.forEach(img =>
{
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = buildSlide(img);
    track.appendChild(slide);
});

// Dot markers for mobile views.
const dotsEl = document.querySelector('.carousel-dots');

function buildDots()
{
    dotsEl.innerHTML = '';
    for (let i = 0; i < workImages.length; i++)
    {
        const d = document.createElement('button');
        d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
    }
}

function updateDots()
{
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) =>
    {
        d.classList.toggle('active', i === current);
    });
}

// Card sliding logic.
function getSlideWidth()
{
    const gap = parseFloat(getComputedStyle(track).gap);
    return document.querySelector('.carousel-slide').offsetWidth + gap;
}

buildDots();

function goTo(index)
{
    const max = document.querySelectorAll('.carousel-slide').length - getVisible();
    current = Math.max(0, Math.min(index, max));
    track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
    prev.disabled = current === 0;
    next.disabled = current >= max;
    updateDots();
}

function getVisible()
{
    return window.innerWidth >= 769 ? 3 : 1;
}

requestAnimationFrame(() => goTo(0));

next.addEventListener('click', () => goTo(current + 1));
prev.addEventListener('click', () => goTo(current - 1));

// Drag / swipe logic.
let dragStartX = 0, dragDeltaX = 0, isDragging = false;

wrapper.addEventListener('mousedown', e =>
{
    e.preventDefault();
    dragStartX = e.clientX;
    dragDeltaX = 0;
    isDragging = true;
    track.classList.add('no-transition');
    wrapper.classList.add('dragging');
});

window.addEventListener('mousemove', e =>
{
    if (!isDragging) return;
    dragDeltaX = e.clientX - dragStartX;
    track.style.transform = `translateX(-${current * getSlideWidth() - dragDeltaX}px)`;
});

window.addEventListener('mouseup', () =>
{
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('no-transition');
    wrapper.classList.remove('dragging');
    const threshold = getSlideWidth() * 0.15;
    dragDeltaX < -threshold ? goTo(current + 1) : dragDeltaX > threshold ? goTo(current - 1) : goTo(current);
});

wrapper.addEventListener('touchstart', e =>
{
    dragStartX = e.touches[0].clientX;
    dragDeltaX = 0;
    isDragging = true;
    track.classList.add('no-transition');
}, { passive: true });

wrapper.addEventListener('touchmove', e =>
{
    if (!isDragging) return;
    dragDeltaX = e.touches[0].clientX - dragStartX;
    track.style.transform = `translateX(-${current * getSlideWidth() - dragDeltaX}px)`;
}, { passive: true });

wrapper.addEventListener('touchend', () =>
{
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('no-transition');
    const threshold = getSlideWidth() * 0.15;
    dragDeltaX < -threshold ? goTo(current + 1) : dragDeltaX > threshold ? goTo(current - 1) : goTo(current);
});

// Team and salon section rendering.
function buildGrid(containerId, images)
{
    const container = document.getElementById(containerId);
    const grid = document.createElement('div');
    grid.className = 'card-grid';
    images.forEach(img =>
    {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = buildSlide(img);
        grid.appendChild(card);
    });
    container.appendChild(grid);
}

function buildCarousel(containerId, images)
{
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="carousel-outer">
            <button class="carousel-arrow prev" aria-label="Previous">&#8249;</button>
            <div class="carousel-track-wrapper">
                <div class="carousel-track"></div>
            </div>
            <button class="carousel-arrow next" aria-label="Next">&#8250;</button>
        </div>
        <div class="carousel-dots"></div>`;

    const cTrack = container.querySelector('.carousel-track');
    const cPrev = container.querySelector('.carousel-arrow.prev');
    const cNext = container.querySelector('.carousel-arrow.next');
    const cWrapper = container.querySelector('.carousel-track-wrapper');
    const cDotsEl = container.querySelector('.carousel-dots');
    let cCurrent = 0;

    images.forEach(img =>
    {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = buildSlide(img);
        cTrack.appendChild(slide);
    });

    function cGetSlideWidth()
    {
        const gap = parseFloat(getComputedStyle(cTrack).gap);
        return cTrack.querySelector('.carousel-slide').offsetWidth + gap;
    }

    function cGetVisible()
    {
        return window.innerWidth >= 769 ? 3 : 1;
    }

    function cUpdateDots()
    {
        cDotsEl.querySelectorAll('.carousel-dot').forEach((d, i) =>
        {
            d.classList.toggle('active', i === cCurrent);
        });
    }

    function cGoTo(index)
    {
        const max = images.length - cGetVisible();
        cCurrent = Math.max(0, Math.min(index, max));
        cTrack.style.transform = `translateX(-${cCurrent * cGetSlideWidth()}px)`;
        cPrev.disabled = cCurrent === 0;
        cNext.disabled = cCurrent >= max;
        cUpdateDots();
    }

    function cBuildDots()
    {
        cDotsEl.innerHTML = '';
        for (let i = 0; i < images.length; i++)
        {
            const d = document.createElement('button');
            d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            d.addEventListener('click', () => cGoTo(i));
            cDotsEl.appendChild(d);
        }
    }

    cNext.addEventListener('click', () => cGoTo(cCurrent + 1));
    cPrev.addEventListener('click', () => cGoTo(cCurrent - 1));

    let cDragStartX = 0, cDragDeltaX = 0, cIsDragging = false;

    cWrapper.addEventListener('mousedown', e => { e.preventDefault(); cDragStartX = e.clientX; cDragDeltaX = 0; cIsDragging = true; cTrack.classList.add('no-transition'); cWrapper.classList.add('dragging'); });
    window.addEventListener('mousemove', e => { if (!cIsDragging) return; cDragDeltaX = e.clientX - cDragStartX; cTrack.style.transform = `translateX(-${cCurrent * cGetSlideWidth() - cDragDeltaX}px)`; });
    window.addEventListener('mouseup', () => { if (!cIsDragging) return; cIsDragging = false; cTrack.classList.remove('no-transition'); cWrapper.classList.remove('dragging'); const t = cGetSlideWidth() * 0.15; cDragDeltaX < -t ? cGoTo(cCurrent + 1) : cDragDeltaX > t ? cGoTo(cCurrent - 1) : cGoTo(cCurrent); });

    cWrapper.addEventListener('touchstart', e => { cDragStartX = e.touches[0].clientX; cDragDeltaX = 0; cIsDragging = true; cTrack.classList.add('no-transition'); }, { passive: true });
    cWrapper.addEventListener('touchmove', e => { if (!cIsDragging) return; cDragDeltaX = e.touches[0].clientX - cDragStartX; cTrack.style.transform = `translateX(-${cCurrent * cGetSlideWidth() - cDragDeltaX}px)`; }, { passive: true });
    cWrapper.addEventListener('touchend', () => { if (!cIsDragging) return; cIsDragging = false; cTrack.classList.remove('no-transition'); const t = cGetSlideWidth() * 0.15; cDragDeltaX < -t ? cGoTo(cCurrent + 1) : cDragDeltaX > t ? cGoTo(cCurrent - 1) : cGoTo(cCurrent); });

    cBuildDots();
    requestAnimationFrame(() => cGoTo(0));
}

function initSection(containerId, images, threshold)
{
    const isMobile = window.innerWidth < 769;
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (isMobile || images.length >= threshold)
    {
        buildCarousel(containerId, images);
    } else
    {
        buildGrid(containerId, images);
    }
}

initSection('team-section', teamImages, Infinity);
initSection('salon-section', salonImages, 4);

window.addEventListener('resize', () =>
{
    initSection('team-section', teamImages, Infinity);
    initSection('salon-section', salonImages, 4);
});