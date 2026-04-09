/* ===========================
   ROBOMIRACLE - script.js
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Init Lucide Icons ── */
    if (typeof lucide !== 'undefined') lucide.createIcons();

    /* ══════════════════════════════
       MOBILE HERO IMAGE SETUP
    ══════════════════════════════ */
    document.querySelectorAll('.hero-slide[data-mobile-bg]').forEach(slide => {
        slide.style.setProperty('--mobile-bg', slide.dataset.mobileBg);
    });

    /* ══════════════════════════════
       HAMBURGER MENU & MOBILE DRAWER
    ══════════════════════════════ */
    const hamburgerBtn    = document.getElementById('hamburgerBtn');
    const mobileMenu      = document.getElementById('mobileMenu');
    const logoBtn         = document.getElementById('logoBtn');

    function openMobileMenu() {
        hamburgerBtn.classList.add('open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Close products submenu when closing main menu
        const productsSubmenu = document.getElementById('mobileProductsSubmenu');
        const productsToggle = document.getElementById('mobileProductsToggle');
        if (productsSubmenu) productsSubmenu.classList.remove('open');
        if (productsToggle) productsToggle.classList.remove('open');
    }

    function toggleMobileMenu() {
        if (mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMobileMenu);

    /* Logo click → open mobile menu (only on mobile) */
    if (logoBtn) {
        logoBtn.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                toggleMobileMenu();
            }
        });
    }

    /* Close menu when a link is tapped */
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    /* Close on Escape key */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    /* Click outside to close mobile menu */
    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenu.classList.contains('open')) {
            if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });

    /* Close menu on window resize */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth >= 768 && mobileMenu && mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        }, 250);
    });

    /* ══════════════════════════════
       PRODUCTS SUB-MENU TOGGLE (FIXED)
    ══════════════════════════════ */
    const productsToggle  = document.getElementById('mobileProductsToggle');
    const productsSubmenu = document.getElementById('mobileProductsSubmenu');

    if (productsToggle && productsSubmenu) {
        productsToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = productsSubmenu.classList.contains('open');
            
            if (!isOpen) {
                productsSubmenu.classList.add('open');
                productsToggle.classList.add('open');
                productsToggle.setAttribute('aria-expanded', 'true');
            } else {
                productsSubmenu.classList.remove('open');
                productsToggle.classList.remove('open');
                productsToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ══════════════════════════════
       HERO SLIDE DATA
    ══════════════════════════════ */
    const SLIDE_DATA = [
        {
            eyebrow:   'Welcome to Robomiracle',
            title:     'Leading Robotics Company in India<br><em class="accent">Custom Robots & Rental Services</em>',
            titleClass:'title-white',
            desc:      'Precision Manufacturing. Crafted in India.',
            descClass: 'desc-white',
            btnText:   'Explore Our Robots',
            btnLink:   'Products.html',
            position:  'pos-center',
            extraTop:  '<span class="slide-tagline-line"></span>'
        },
        {
            eyebrow:   'Meet',
            title:     'Nova',
            titleClass:'title-product',
            desc:      '',
            descClass: 'desc-white',
            btnText:   'Discover Nova',
            btnLink:   './products/nova.html',
            position:  'pos-left',
            extraTop:  ''
        },
        {
            eyebrow:   'Meet',
            title:     'Nexus',
            titleClass:'title-product',
            desc:      '',
            descClass: 'desc-white',
            btnText:   'Discover Nexus',
            btnLink:   './products/nexus.html',
            position:  'pos-left',
            extraTop:  ''
        },
               
        {
            eyebrow:   'Meet',
            title:     'Aurra',
            titleClass:'title-product',
            desc:      '',
            descClass: 'desc-white',
            btnText:   'Discover Aurra',
            btnLink:   './products/aurra.html',
            position:  'pos-left',
            extraTop:  ''
        },
        {
            eyebrow:   'Meet',
            title:     'Nila',
            titleClass:'title-product',
            desc:      "",
            descClass: 'desc-white',
            btnText:   'Discover Nila',
            btnLink:   './products/nila.html',
            position:  'pos-left',
            extraTop:  ''
        },
    ];

    /* ══════════════════════════════
       RENDER CONTENT INTO BOX
    ══════════════════════════════ */
    const contentBox = document.getElementById('slideContentBox');

    function renderSlideContent(index) {
        const d = SLIDE_DATA[index];
        if (!contentBox || !d) return;

        contentBox.innerHTML = `
            <span class="slide-eyebrow">${d.eyebrow}</span>
            <h2 class="slide-title ${d.titleClass}">${d.title}</h2>
            ${d.extraTop || ''}
            <p class="slide-desc ${d.descClass}">${d.desc}</p>
            <a href="${d.btnLink}" class="slide-btn">${d.btnText} &rarr;</a>
        `;

        contentBox.className = `slide-content-box ${d.position} fade-in`;
    }

    /* ══════════════════════════════
       SLIDER LOGIC
    ══════════════════════════════ */
    const slides     = document.querySelectorAll('.hero-slide');
    const dots       = document.querySelectorAll('.hero-dot');
    const arrowLeft  = document.getElementById('hero-arrow-left');
    const arrowRight = document.getElementById('hero-arrow-right');

    let currentSlide = 0;
    let autoplayTimer = null;
    const INTERVAL = 5000;

    function goToSlide(index) {
        index = (index + slides.length) % slides.length;
        if (index === currentSlide) return;

        if (contentBox) {
            contentBox.classList.remove('fade-in');
            contentBox.classList.add('fade-out');
        }

        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

        currentSlide = index;

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                renderSlideContent(currentSlide);
            });
        });
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function resetAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = setInterval(nextSlide, INTERVAL);
    }

    if (arrowLeft)  arrowLeft.addEventListener('click',  () => { prevSlide(); resetAutoplay(); });
    if (arrowRight) arrowRight.addEventListener('click', () => { nextSlide(); resetAutoplay(); });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goToSlide(i); resetAutoplay(); });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  { prevSlide(); resetAutoplay(); }
        if (e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
    });

    /* Touch swipe */
    let touchStartX = 0;
    const heroEl = document.getElementById('heroContainer');
    if (heroEl) {
        heroEl.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        heroEl.addEventListener('touchend', (e) => {
            const delta = e.changedTouches[0].screenX - touchStartX;
            if (Math.abs(delta) > 40) {
                delta < 0 ? nextSlide() : prevSlide();
                resetAutoplay();
            }
        }, { passive: true });
    }

    /* Initial render + start autoplay */
    renderSlideContent(0);
    resetAutoplay();

    /* ══════════════════════════════
       SCROLL TO TOP BUTTON
    ══════════════════════════════ */
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            scrollBtn.classList.toggle('show', window.scrollY > 300);
        });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ══════════════════════════════
       FADE-UP SCROLL OBSERVER
    ══════════════════════════════ */
    const fadeEls = document.querySelectorAll('.fade-up');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), 100);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => fadeObserver.observe(el));

    /* ══════════════════════════════
       STATS COUNTER ANIMATION
    ══════════════════════════════ */
    function animateCounter(el, target, suffix, duration = 1800) {
        const start = performance.now();
        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target + suffix;
        };
        requestAnimationFrame(update);
    }

    const statItems = document.querySelectorAll('.stat-item');
    const stats = [
        { target: 8,   suffix: '+' },
        { target: 50,  suffix: '+' },
        { target: 10,  suffix: '+' },
        { target: 100, suffix: '%' },
    ];

    const statsSection = document.querySelector('.stats-section');
    if (statsSection && statItems.length) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                statsObserver.disconnect();
                statItems.forEach((item, i) => {
                    const numEl = item.querySelector('.stat-number');
                    if (!numEl || !stats[i]) return;
                    const { target, suffix } = stats[i];
                    setTimeout(() => animateCounter(numEl, target, suffix), i * 200);
                });
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    /* ══════════════════════════════
       3D TILT + PARALLAX EFFECT
    ══════════════════════════════ */
    const wrapper   = document.getElementById('threeD-wrapper');
    const container = document.querySelector('.catalog-3d-container');

    if (wrapper && container) {
        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 1200) return;

            const rect    = container.getBoundingClientRect();
            const centerX = rect.left + rect.width  / 2;
            const centerY = rect.top  + rect.height / 2;

            const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) * 15;
            const rotateX = ((centerY - e.clientY) / (rect.height / 2)) * 15;

            wrapper.style.animation  = 'none';
            wrapper.style.transform  = `translateZ(0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            wrapper.classList.add('tilted');
        });

        container.addEventListener('mouseleave', () => {
            wrapper.style.animation = '';
            wrapper.style.transform = '';
            wrapper.classList.remove('tilted');
        });

        window.addEventListener('scroll', () => {
            if (window.innerWidth < 1200) return;

            const scrollY       = window.scrollY;
            const scrollPercent = scrollY / window.innerHeight;

            if (scrollPercent < 0.5) {
                wrapper.style.opacity   = 1 - (scrollPercent * 0.5);
                wrapper.style.transform = `translateZ(0px) translateY(${scrollY * 0.3}px)`;
            }
        });
    }

    /* ══════════════════════════════
       ABOUT STATS COUNTER
    ══════════════════════════════ */
    function animateAboutCounters() {
        const stats = document.querySelectorAll('.about-stat-num');
        
        stats.forEach(stat => {
            const target = stat.textContent.trim();
            const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
            const suffix = target.replace(/[0-9.]/g, '');
            const duration = 1800;
            const steps = 60;
            const increment = numericValue / steps;
            let current = 0;
            let step = 0;
            
            const isDecimal = target.includes('.');
            
            const timer = setInterval(() => {
                step++;
                current += increment;
                
                if (step >= steps) {
                    stat.textContent = (isDecimal ? numericValue.toFixed(1) : Math.round(numericValue)) + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
                }
            }, duration / steps);
        });
    }
    
    const aboutStatsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateAboutCounters();
                aboutStatsObserver.disconnect();
            }
        });
    }, { threshold: 0.4 });
    
    const statsRow = document.querySelector('.about-stats-row');
    if (statsRow) aboutStatsObserver.observe(statsRow);

});