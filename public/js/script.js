if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
}

document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offset = 80;
            const top = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    });
});

function updateNavbarState() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled', 'navbar-scrolled');
    } else {
        navbar.classList.remove('scrolled', 'navbar-scrolled');
    }
}
window.addEventListener('scroll', updateNavbarState);

function initMarquee() {
    const marquee = document.querySelector('.marquee');
    if (!marquee) return;

    if (!marquee.dataset.originalHtml) {
        marquee.dataset.originalHtml = marquee.innerHTML;
    } else {
        marquee.innerHTML = marquee.dataset.originalHtml;
    }

    let items = Array.from(marquee.querySelectorAll('.marquee-item'));
    if (items.length === 0) {
        marquee.style.animationPlayState = 'paused';
        return;
    }

    const computeTotalWidth = () => {
        const allItems = Array.from(marquee.querySelectorAll('.marquee-item'));
        let total = 0;
        allItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const style = window.getComputedStyle(item);
            const ml = parseFloat(style.marginLeft) || 0;
            const mr = parseFloat(style.marginRight) || 0;
            total += rect.width + ml + mr;
        });
        return { total, count: allItems.length };
    };

    const containerWidth = marquee.parentElement ? marquee.parentElement.clientWidth : window.innerWidth;
    let { total: totalWidth } = computeTotalWidth();
    const maxClones = 50;
    let cloneIndex = 0;
    const sourceItems = Array.from(marquee.querySelectorAll('.marquee-item'));

    while (totalWidth < containerWidth * 2 && cloneIndex < maxClones) {
        const nodeToClone = sourceItems[cloneIndex % sourceItems.length].cloneNode(true);
        marquee.appendChild(nodeToClone);
        totalWidth = computeTotalWidth().total;
        cloneIndex++;
    }

    if (totalWidth <= containerWidth) {
        marquee.style.animationPlayState = 'paused';
        return;
    } else {
        marquee.style.animationPlayState = 'running';
    }

    const speedPxPerSec = 220;
    const durationSeconds = Math.max(8, Math.round((totalWidth / 2) / speedPxPerSec));
    marquee.style.animationDuration = durationSeconds + 's';
    marquee.style.animationTimingFunction = 'linear';
    marquee.style.willChange = 'transform';
}

function handleLogos() {
    const logos = document.querySelectorAll('.partner-logo');
    if (!logos) return;
    logos.forEach(img => {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');

        img.addEventListener('error', function () {
            this.style.filter = 'grayscale(100%)';
            this.style.opacity = '0.6';
            this.alt = this.alt ? this.alt + ' (логотип недоступен)' : 'Логотип недоступен';
        });
    });
}

function initHeroSlider() {
    const heroCarousel = document.getElementById('heroCarousel');

    if (!heroCarousel) return;
    if (typeof bootstrap === 'undefined' || !bootstrap.Carousel) return;

    const carousel = new bootstrap.Carousel(heroCarousel, {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        touch: true
    });

    const carouselImages = heroCarousel.querySelectorAll('.hero-slide-img');
    carouselImages.forEach((img, index) => {
        img.addEventListener('error', function () {
            console.warn(`Carousel image ${index + 1} failed to load:`, this.src);
            this.style.display = 'none';
        });
    });

    heroCarousel.addEventListener('mouseenter', () => carousel.pause());
    heroCarousel.addEventListener('mouseleave', () => carousel.cycle());
}

document.addEventListener('DOMContentLoaded', function () {
    initMarquee();
    handleLogos();
    initHeroSlider();
    updateNavbarState();

    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initMarquee, 200);
    });
});