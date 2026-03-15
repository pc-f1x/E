/**
 * ============================================================
 * ELECTRIC TOOLS - Professional Website JavaScript
 * ============================================================
 * Features:
 * - Sticky Header with scroll detection
 * - Mobile hamburger menu
 * - Smooth scroll navigation
 * - Active link highlighting
 * - FAQ accordion
 * - Scroll-based animations (Intersection Observer)
 * - Counter animation
 * - Floating buttons visibility
 * - Contact form validation
 * - Dynamic year in footer
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


    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    /**
     * Debounce function to limit execution rate
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    function debounce(func, wait = 100) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }


    // ========================================
    // HEADER - Sticky & Scroll Detection
    // ========================================
    function initHeader() {
        const scrollThreshold = 50;

        function handleScroll() {
            const scrolled = window.scrollY > scrollThreshold;
            DOM.header.classList.toggle('header--scrolled', scrolled);
        }

        window.addEventListener('scroll', debounce(handleScroll, 10));
        handleScroll(); // Initial check
    }


    // ========================================
    // MOBILE MENU
    // ========================================
    function initMobileMenu() {
        const { burgerBtn, mainNav, mobileOverlay } = DOM;

        function toggleMenu() {
            const isOpen = mainNav.classList.contains('active');

            burgerBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');

            burgerBtn.setAttribute('aria-expanded', !isOpen);
        }

        function closeMenu() {
            burgerBtn.classList.remove('active');
            mainNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            burgerBtn.setAttribute('aria-expanded', 'false');
        }

        // Toggle on burger click
        burgerBtn.addEventListener('click', toggleMenu);

        // Close on overlay click
        mobileOverlay.addEventListener('click', closeMenu);

        // Close on nav link click
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                closeMenu();
            }
        });
    }


    // ========================================
    // SMOOTH SCROLL NAVIGATION
    // ========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }


    // ========================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ========================================
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');

        function updateActiveLink() {
            const scrollPos = window.scrollY + window.innerHeight / 3;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos < top + height) {
                    DOM.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
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
        DOM.faqItems.forEach(item => {
            const question = item.querySelector('.faq__question');
            const answer = item.querySelector('.faq__answer');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all FAQ items
                DOM.faqItems.forEach(otherItem => {
                    const otherAnswer = otherItem.querySelector('.faq__answer');
                    otherItem.classList.remove('active');
                    otherAnswer.style.maxHeight = null;
                    otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
                });

                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }


    // ========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ========================================
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements
            DOM.animatedElements.forEach(el => el.classList.add('animated'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.getAttribute('data-delay') || 0;
                        setTimeout(() => {
                            entry.target.classList.add('animated');
                        }, parseInt(delay));
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        DOM.animatedElements.forEach(el => observer.observe(el));
    }


    // ========================================
    // COUNTER ANIMATION
    // ========================================
    function initCounters() {
        if (!('IntersectionObserver' in window)) {
            DOM.counters.forEach(counter => {
                counter.textContent = counter.getAttribute('data-count');
            });
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        DOM.counters.forEach(counter => observer.observe(counter));
    }

    /**
     * Animate a counter from 0 to target value
     * @param {HTMLElement} element - Counter element
     */
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // ~60fps
        let current = 0;

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
    // FLOATING BUTTONS VISIBILITY
    // ========================================
    function initFloatingButtons() {
        const showThreshold = 400;

        function handleScroll() {
            const visible = window.scrollY > showThreshold;
            DOM.floatingButtons.classList.toggle('visible', visible);
        }

        window.addEventListener('scroll', debounce(handleScroll, 50));
        handleScroll();
    }


    // ========================================
    // CONTACT FORM VALIDATION
    // ========================================
    function initContactForm() {
        if (!DOM.contactForm) return;

        DOM.contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name');
            const phone = document.getElementById('phone');
            const email = document.getElementById('email');
            let isValid = true;

            // Reset states
            [name, phone, email].forEach(input => {
                input.classList.remove('error', 'success');
            });

            // Validate name
            if (!name.value.trim()) {
                name.classList.add('error');
                isValid = false;
            } else {
                name.classList.add('success');
            }

            // Validate phone
            const phoneRegex = /^[\d\-+() ]{9,15}$/;
            if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
                phone.classList.add('error');
                isValid = false;
            } else {
                phone.classList.add('success');
            }

            // Validate email (optional)
            if (email.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email.value.trim())) {
                    email.classList.add('error');
                    isValid = false;
                } else {
                    email.classList.add('success');
                }
            }

            if (isValid) {
                // Prepare WhatsApp message
                const service = document.getElementById('service');
                const message = document.getElementById('message');

                const whatsappMessage = encodeURIComponent(
                    `שלום, אשמח לקבל הצעת מחיר.\n` +
                    `שם: ${name.value.trim()}\n` +
                    `טלפון: ${phone.value.trim()}\n` +
                    (email.value.trim() ? `אימייל: ${email.value.trim()}\n` : '') +
                    (service.value ? `שירות: ${service.options[service.selectedIndex].text}\n` : '') +
                    (message.value.trim() ? `פרטים: ${message.value.trim()}` : '')
                );

                // Open WhatsApp with the message
                window.open(`https://wa.me/972528945500?text=${whatsappMessage}`, '_blank');

                // Show success feedback
                const submitBtn = DOM.contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    ההודעה נשלחה בהצלחה
                `;
                submitBtn.style.background = 'var(--color-success)';
                submitBtn.style.borderColor = 'var(--color-success)';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    DOM.contactForm.reset();
                    [name, phone, email].forEach(input => {
                        input.classList.remove('success');
                    });
                }, 3000);
            }
        });

        // Real-time validation feedback
        const inputs = DOM.contactForm.querySelectorAll('.contact__input');
        inputs.forEach(input => {
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
    // DYNAMIC YEAR
    // ========================================
    function initYear() {
        if (DOM.currentYear) {
            DOM.currentYear.textContent = new Date().getFullYear();
        }
    }


    // ========================================
    // INITIALIZE ALL MODULES
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
        initYear();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
