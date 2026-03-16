/**
 * ============================================================
 * ELECTRIC TOOLS - Professional Website JavaScript
 * ALL MOBILE BUGS FIXED VERSION
 * ============================================================
 */

(function () {
    'use strict';

    // ========================================
    // DOM ELEMENT REFERENCES
    // ========================================
    const DOM = {
        header: document.getElementById('header'),
        burgerBtn: document.getElementById('burgerBtn'),
        mainNav: document.getElementById('mainNav'),
        mobileOverlay: document.getElementById('mobileOverlay'),
        navLinks: document.querySelectorAll('.header__nav-link'),
        floatingButtons: document.getElementById('floatingButtons'),
        faqItems: document.querySelectorAll('.faq__item'),
        contactForm: document.getElementById('contactForm'),
        currentYear: document.getElementById('currentYear'),
        animatedElements: document.querySelectorAll('[data-animate]'),
        counters: document.querySelectorAll('[data-count]'),
    };

    let scrollPosition = 0;


    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    function debounce(func, wait = 100) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }


    // ========================================
    // HEADER
    // ========================================
    function initHeader() {
        const scrollThreshold = 50;

        function handleScroll() {
            if (document.body.classList.contains('menu-open')) return;
            DOM.header.classList.toggle('header--scrolled', window.scrollY > scrollThreshold);
        }

        window.addEventListener('scroll', debounce(handleScroll, 10));
        handleScroll();
    }


    // ========================================
    // MOBILE MENU - FIX מלא
    // ========================================
    function initMobileMenu() {
        const { burgerBtn, mainNav, mobileOverlay } = DOM;

        function openMenu() {
            scrollPosition = window.scrollY;

            burgerBtn.classList.add('active');
            mainNav.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.classList.add('menu-open');
            document.body.style.top = `-${scrollPosition}px`;

            burgerBtn.setAttribute('aria-expanded', 'true');
        }

        function closeMenu() {
            burgerBtn.classList.remove('active');
            mainNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.top = '';

            // חזרה למיקום הגלילה המקורי
            window.scrollTo({
                top: scrollPosition,
                behavior: 'instant'
            });

            burgerBtn.setAttribute('aria-expanded', 'false');
        }

        function toggleMenu(e) {
            e.stopPropagation();
            if (mainNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        burgerBtn.addEventListener('click', toggleMenu);

        mobileOverlay.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });

        DOM.navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (mainNav.classList.contains('active')) {
                    closeMenu();
                }
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                closeMenu();
            }
        });

        // מניעת גלילה על ה-overlay
        mobileOverlay.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, { passive: false });

        // סגירת תפריט בשינוי גודל מסך
        window.addEventListener('resize', debounce(function () {
            if (window.innerWidth > 1024 && mainNav.classList.contains('active')) {
                closeMenu();
            }
        }, 200));
    }


    // ========================================
    // SMOOTH SCROLL NAVIGATION
    // ========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                var headerHeight = DOM.header.offsetHeight;
                var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }


    // ========================================
    // ACTIVE NAV LINK
    // ========================================
    function initActiveNav() {
        var sections = document.querySelectorAll('section[id]');

        function updateActiveLink() {
            if (document.body.classList.contains('menu-open')) return;

            var scrollPos = window.scrollY + window.innerHeight / 3;

            sections.forEach(function (section) {
                var top = section.offsetTop;
                var height = section.offsetHeight;
                var id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos < top + height) {
                    DOM.navLinks.forEach(function (link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', debounce(updateActiveLink, 50));
        updateActiveLink();
    }


    // ========================================
    // FAQ ACCORDION
    // ========================================
    function initFAQ() {
        DOM.faqItems.forEach(function (item) {
            var question = item.querySelector('.faq__question');
            var answer = item.querySelector('.faq__answer');

            question.addEventListener('click', function () {
                var isActive = item.classList.contains('active');

                DOM.faqItems.forEach(function (otherItem) {
                    var otherAnswer = otherItem.querySelector('.faq__answer');
                    otherItem.classList.remove('active');
                    otherAnswer.style.maxHeight = null;
                    otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
                });

                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }


    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            DOM.animatedElements.forEach(function (el) {
                el.classList.add('animated');
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var delay = entry.target.getAttribute('data-delay') || 0;
                        setTimeout(function () {
                            entry.target.classList.add('animated');
                        }, parseInt(delay));
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -30px 0px',
            }
        );

        DOM.animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    }


    // ========================================
    // COUNTER ANIMATION
    // ========================================
    function initCounters() {
        if (!('IntersectionObserver' in window)) {
            DOM.counters.forEach(function (counter) {
                counter.textContent = counter.getAttribute('data-count');
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        DOM.counters.forEach(function (counter) {
            observer.observe(counter);
        });
    }

    function animateCounter(element) {
        var target = parseInt(element.getAttribute('data-count'));
        var duration = 2000;
        var step = target / (duration / 16);
        var current = 0;

        function update() {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }


    // ========================================
    // FLOATING BUTTONS
    // ========================================
    function initFloatingButtons() {
        var showThreshold = 400;

        function handleScroll() {
            if (document.body.classList.contains('menu-open')) return;
            DOM.floatingButtons.classList.toggle('visible', window.scrollY > showThreshold);
        }

        window.addEventListener('scroll', debounce(handleScroll, 50));
        handleScroll();
    }


    // ========================================
    // CONTACT FORM
    // ========================================
    function initContactForm() {
        if (!DOM.contactForm) return;

        DOM.contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('name');
            var phone = document.getElementById('phone');
            var email = document.getElementById('email');
            var isValid = true;

            [name, phone, email].forEach(function (input) {
                input.classList.remove('error', 'success');
            });

            if (!name.value.trim()) {
                name.classList.add('error');
                isValid = false;
            } else {
                name.classList.add('success');
            }

            var phoneRegex = /^[\d\-+() ]{9,15}$/;
            if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
                phone.classList.add('error');
                isValid = false;
            } else {
                phone.classList.add('success');
            }

            if (email.value.trim()) {
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email.value.trim())) {
                    email.classList.add('error');
                    isValid = false;
                } else {
                    email.classList.add('success');
                }
            }

            if (isValid) {
                var service = document.getElementById('service');
                var message = document.getElementById('message');

                var whatsappMessage = encodeURIComponent(
                    'שלום, אשמח לקבל הצעת מחיר.\n' +
                    'שם: ' + name.value.trim() + '\n' +
                    'טלפון: ' + phone.value.trim() + '\n' +
                    (email.value.trim() ? 'אימייל: ' + email.value.trim() + '\n' : '') +
                    (service.value ? 'שירות: ' + service.options[service.selectedIndex].text + '\n' : '') +
                    (message.value.trim() ? 'פרטים: ' + message.value.trim() : '')
                );

                window.open('https://wa.me/972528945500?text=' + whatsappMessage, '_blank');

                var submitBtn = DOM.contactForm.querySelector('button[type="submit"]');
                var originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> ההודעה נשלחה בהצלחה';
                submitBtn.style.background = 'var(--color-success)';
                submitBtn.style.borderColor = 'var(--color-success)';

                setTimeout(function () {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    DOM.contactForm.reset();
                    [name, phone, email].forEach(function (input) {
                        input.classList.remove('success');
                    });
                }, 3000);
            }
        });

        var inputs = DOM.contactForm.querySelectorAll('.contact__input');
        inputs.forEach(function (input) {
            input.addEventListener('blur', function () {
                if (this.value.trim() && this.required) {
                    this.classList.remove('error');
                    this.classList.add('success');
                }
            });

            input.addEventListener('input', function () {
                this.classList.remove('error');
            });
        });
    }


    // ========================================
    // IMAGE ERROR HANDLING
    // ========================================
    function initImageErrorHandling() {
        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', function () {
                if (this.dataset.errorHandled) return;
                this.dataset.errorHandled = 'true';
                this.style.display = 'none';
            });
        });
    }


    // ========================================
    // GALLERY LIGHTBOX
    // ========================================
    function initGalleryLightbox() {
        document.querySelectorAll('.gallery__item').forEach(function (item) {
            item.addEventListener('click', function () {
                var img = this.querySelector('.gallery__image');
                if (!img || !img.src || img.style.display === 'none') return;

                var lightbox = document.createElement('div');
                lightbox.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;opacity:0;transition:opacity 0.3s ease;';

                lightbox.innerHTML =
                    '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.92);" class="lb-bg"></div>' +
                    '<div style="position:relative;max-width:90vw;max-height:90vh;z-index:1;">' +
                    '<img src="' + img.src + '" alt="' + img.alt + '" style="max-width:100%;max-height:85vh;object-fit:contain;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5);">' +
                    '<button style="position:absolute;top:-40px;left:0;background:rgba(255,255,255,0.15);border:none;color:white;font-size:1.5rem;cursor:pointer;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:50%;-webkit-tap-highlight-color:transparent;" class="lb-x">&times;</button>' +
                    '</div>';

                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';

                requestAnimationFrame(function () {
                    lightbox.style.opacity = '1';
                });

                function closeLB() {
                    lightbox.style.opacity = '0';
                    setTimeout(function () {
                        if (lightbox.parentNode) lightbox.parentNode.removeChild(lightbox);
                        document.body.style.overflow = '';
                    }, 300);
                }

                lightbox.querySelector('.lb-x').addEventListener('click', closeLB);
                lightbox.querySelector('.lb-bg').addEventListener('click', closeLB);

                var escHandler = function (e) {
                    if (e.key === 'Escape') {
                        closeLB();
                        document.removeEventListener('keydown', escHandler);
                    }
                };
                document.addEventListener('keydown', escHandler);
            });
        });
    }


    // ========================================
    // DYNAMIC YEAR
    // ========================================
    function initYear() {
        if (DOM.currentYear) {
            DOM.currentYear.textContent = new Date().getFullYear();
        }
    }


    // ========================================
    // INIT
    // ========================================
    function init() {
        initHeader();
        initMobileMenu();
        initSmoothScroll();
        initActiveNav();
        initFAQ();
        initScrollAnimations();
        initCounters();
        initFloatingButtons();
        initContactForm();
        initImageErrorHandling();
        initGalleryLightbox();
        initYear();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
