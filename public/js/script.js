// Инициализация AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Плавная прокрутка для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Изменение навигации при скролле
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Обработка формы
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Собираем данные формы
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    // В реальном проекте здесь был бы AJAX запрос к серверу
    console.log('Данные формы:', { name, phone, email, message });
    
    // Показываем уведомление
    alert('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.');
    
    // Очищаем форму
    this.reset();
});

// Бегущая строка - улучшенная версия
function initMarquee() {
    const marquee = document.querySelector('.marquee');
    const marqueeItems = marquee.querySelectorAll('.marquee-item');
    const itemWidth = marqueeItems[0].offsetWidth + 80; // width + margin
    
    // Рассчитываем общую ширину для правильной анимации
    const totalWidth = itemWidth * marqueeItems.length;
    marquee.style.width = totalWidth + 'px';
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initMarquee();
    
    // Переинициализация при изменении размера окна
    window.addEventListener('resize', initMarquee);
});

// Добавляем класс для navbar при скролле
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});