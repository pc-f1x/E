/* ============================================
   ELECTRIC TOOLS - Professional Website Scripts
   ============================================ */

// ===== PAGE LOADER =====
window.addEventListener('load', function () {
    setTimeout(function () {
        document.getElementById('pageLoader').classList.add('hidden');
    }, 800);
});

// ===== DOM ELEMENTS =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const backToTopBtn = document.getElementById('backToTop');

// ===== CREATE PARTICLES =====
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        container.appendChild(particle);
    }
}

createParticles();

// ===== SCROLL EVENTS =====
window.addEventListener('scroll', function () {
    // Navbar scroll effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }

    // Update active navigation link
    updateActiveNavLink();
});

// ===== MOBILE MENU =====
hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navOverlay.addEventListener('click', closeMenu);

function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
});

// ===== ACTIVE NAV LINK ON SCROLL =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-links a').forEach(function (a) {
                a.classList.remove('active');
                if (a.getAttribute('href') === '#' + id) {
                    a.classList.add('active');
                }
            });
        }
    });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.counter-animated');

    counters.forEach(function (counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // easeOutCubic easing
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            counter.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// ===== INTERSECTION OBSERVER =====
var observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            // Service cards and gallery items - staggered animation
            if (entry.target.classList.contains('service-card') ||
                entry.target.classList.contains('gallery-item')) {
                var children = Array.from(entry.target.parentElement.children);
                var index = children.indexOf(entry.target);
                var delay = index * 100;

                setTimeout(function () {
                    entry.target.classList.add('visible');
                }, delay);
            }

            // Counter animation trigger
            if (entry.target.classList.contains('hero-stats')) {
                animateCounters();
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe service cards and gallery items
document.querySelectorAll('.service-card, .gallery-item').forEach(function (el) {
    observer.observe(el);
});

// Observe hero stats for counter animation
var heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    observer.observe(heroStats);
}

// ===== GALLERY LIGHTBOX =====
var galleryData = [
    { emoji: '🔧', title: 'ליפוף מנוע תעשייתי - שיפוץ וליפוף מנוע 50 כ"ס' },
    { emoji: '💧', title: 'תיקון משאבת מים - שיפוץ משאבה טבולה' },
    { emoji: '⚡', title: 'תיקון ציוד חשמלי - אבחון ותיקון לוח חשמל' },
    { emoji: '🍳', title: 'ציוד מטבח תעשייתי - שיפוץ ציוד למטבח מוסדי' },
    { emoji: '🔨', title: 'תיקון כלי עבודה - שיפוץ מדחס תעשייתי' },
    { emoji: '🚚', title: 'שירות שטח - תיקון באתר הלקוח' },
    { emoji: '🛡️', title: 'תחזוקה שוטפת - בדיקת ציוד תקופתית' }
];

var currentLightboxIndex = 0;

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightbox();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function changeLightbox(dir) {
    currentLightboxIndex = (currentLightboxIndex + dir + galleryData.length) % galleryData.length;
    updateLightbox();
}

function updateLightbox() {
    var item = galleryData[currentLightboxIndex];
    document.getElementById('lightboxEmoji').textContent = item.emoji;
    document.getElementById('lightboxTitle').textContent = item.title;
}

// Close lightbox on background click
document.getElementById('lightbox').addEventListener('click', function (e) {
    if (e.target === document.getElementById('lightbox')) {
        closeLightbox();
    }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', function (e) {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeLightbox(1);
    if (e.key === 'ArrowRight') changeLightbox(-1);
});

// Make lightbox functions globally accessible
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.changeLightbox = changeLightbox;

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;
    var form = this;

    // Build WhatsApp message
    var waMessage = 'שלום, פנייה חדשה מהאתר:%0A';
    waMessage += 'שם: ' + name + '%0A';
    waMessage += 'טלפון: ' + phone + '%0A';
    if (email) waMessage += 'אימייל: ' + email + '%0A';
    waMessage += 'הודעה: ' + message;

    // Show success message
    form.style.display = 'none';
    document.getElementById('formSuccess').classList.add('show');

    // Open WhatsApp with the message
    setTimeout(function () {
        window.open('https://wa.me/972528945500?text=' + waMessage, '_blank');
    }, 1000);

    // Reset after 5 seconds
    setTimeout(function () {
        form.style.display = 'block';
        document.getElementById('formSuccess').classList.remove('show');
        form.reset();
    }, 5000);
});

// ===== BACK TO TOP =====
backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var targetSelector = this.getAttribute('href');
        var target = document.querySelector(targetSelector);

        if (target) {
            var offset = 75;
            var targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
    });
});
