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

function startFactorySlideshow() {
    const carousel = document.getElementById('factory-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.showcase-slide');
    if (slides.length < 2) return;

    let current = 0;
    let timer;

    function goTo(index) {
        // Remove active from all slides and all dots
        slides.forEach((s) => {
            s.classList.remove('active');
        });
        // Add active to the target slide
        slides[index].classList.add('active');
        // Sync all carousel-dots groups
        carousel.querySelectorAll('.carousel-dots .dot').forEach((dot) => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
            dot.classList.toggle('active', slideIndex === index);
        });
        current = index;
    }

    function next() {
        goTo((current + 1) % slides.length);
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(next, 4000);
    }

    // Bind dot clicks
    carousel.querySelectorAll('.carousel-dots .dot').forEach((dot) => {
        dot.addEventListener('click', () => {
            const target = parseInt(dot.getAttribute('data-slide'), 10);
            goTo(target);
            startTimer(); // restart auto-rotate from this slide
        });
    });

    startTimer();
}

function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');

        if (toggle) {
            toggle.addEventListener('click', (e) => {
                const isMobile = window.innerWidth <= 992;
                const isHash = toggle.getAttribute('href') === '#';
                
                if (isMobile || isHash) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    dropdowns.forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('active');
                        }
                    });

                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
}

window.addEventListener('load', () => {
    startHeroSlideshow();
    startFactorySlideshow();
    initDropdowns();
});

