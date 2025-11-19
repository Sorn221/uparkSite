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

function imagesLoaded(container) {
    const imgs = Array.from(container.querySelectorAll('img'));
    if (imgs.length === 0) return Promise.resolve();
    return Promise.all(imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
        });
    }));
}

function stopMarqueeAnimator(marquee) {
    if (!marquee) return;
    if (marquee._marqueeRafId) {
        cancelAnimationFrame(marquee._marqueeRafId);
    }
    marquee._marqueeRafId = null;
    marquee._marqueeState = null;
    if (marquee._marqueeHandlers) {
        marquee.removeEventListener('mouseenter', marquee._marqueeHandlers.enter);
        marquee.removeEventListener('mouseleave', marquee._marqueeHandlers.leave);
    }
    marquee._marqueeHandlers = null;
    marquee.style.transform = '';
}

function startMarqueeAnimator(marquee, sequenceWidth, speedPxPerSec) {
    stopMarqueeAnimator(marquee);

    let last = null;
    let offset = 0;
    let paused = false;

    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };

    marquee.addEventListener('mouseenter', onEnter, { passive: true });
    marquee.addEventListener('mouseleave', onLeave, { passive: true });
    marquee._marqueeHandlers = { enter: onEnter, leave: onLeave };

    function step(ts) {
        if (last === null) last = ts;
        const dt = ts - last;
        last = ts;

        if (!paused) {
            offset += speedPxPerSec * (dt / 1000);
            if (offset >= sequenceWidth) offset -= sequenceWidth;
            marquee.style.transform = `translateX(${-offset}px)`;
        }

        marquee._marqueeRafId = requestAnimationFrame(step);
    }

    marquee._marqueeRafId = requestAnimationFrame(step);
}

function initMarquee() {
    const marquee = document.querySelector('.marquee');
    if (!marquee) return;

    stopMarqueeAnimator(marquee);

    if (!marquee.dataset.originalHtml) {
        marquee.dataset.originalHtml = marquee.innerHTML;
    } else {
        marquee.innerHTML = marquee.dataset.originalHtml;
    }

    imagesLoaded(marquee).then(() => {
        const sourceItems = Array.from(marquee.querySelectorAll('.marquee-item'));
        if (sourceItems.length === 0) return;

        const computeWidth = items => {
            let total = 0;
            items.forEach(item => {
                const rect = item.getBoundingClientRect();
                const style = window.getComputedStyle(item);
                const ml = parseFloat(style.marginLeft) || 0;
                const mr = parseFloat(style.marginRight) || 0;
                total += rect.width + ml + mr;
            });
            return total;
        };

        const containerWidth = marquee.parentElement ? marquee.parentElement.clientWidth : window.innerWidth;

        const originalCount = sourceItems.length;
        let sequenceWidth = computeWidth(sourceItems);

        const maxLoops = 10;
        let loops = 0;
        while (computeWidth(Array.from(marquee.querySelectorAll('.marquee-item'))) < containerWidth * 2 && loops < maxLoops) {
            sourceItems.forEach(it => marquee.appendChild(it.cloneNode(true)));
            loops++;
        }

        const allItems = Array.from(marquee.querySelectorAll('.marquee-item'));
        const firstSeq = allItems.slice(0, originalCount);
        sequenceWidth = computeWidth(firstSeq);

        if (sequenceWidth <= 0) {
            marquee.style.transform = '';
            return;
        }

        const speedPxPerSec = 100;

        startMarqueeAnimator(marquee, sequenceWidth, speedPxPerSec);
    }).catch(() => {
        marquee.style.transform = '';
    });
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
        resizeTimer = setTimeout(() => {
            initMarquee();
        }, 220);
    });
});