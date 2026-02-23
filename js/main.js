const toggle = document.getElementById('mobile-menu-toggle');
const menu = document.getElementById('mobile-menu');

// Listen for clicks to open the nav menu.
toggle.addEventListener('click', (e) =>
{
    e.stopPropagation();
    menu.classList.toggle('hidden');
});

// Close nav menu when clicking outside.
document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

// Close nav menu on scroll.
window.addEventListener('scroll', () => {
    menu.classList.add('hidden');
});


// Send-to-top button logic.
const scrollBtn = document.getElementById('scroll-top-btn');

window.addEventListener('scroll', () =>
{
    // Once the window is past 300px, show the scroll-to-top button.
    scrollBtn.classList.toggle('visible', window.scrollY > 300);
});

if (window.matchMedia('(prefers-color-scheme: dark)').matches)
{
    document.documentElement.setAttribute('data-theme', 'dark');
}