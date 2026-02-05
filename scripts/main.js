const menuBtn = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

if (menuBtn && navList) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navList.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !navList.contains(e.target)) {
            navList.classList.remove('active');
        }
    });
}

function startHeroSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (!slides.length) return;

    let currentIndex = 0;
    setInterval(() => {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('active');
    }, 3000);
}

window.addEventListener('load', startHeroSlideshow);
