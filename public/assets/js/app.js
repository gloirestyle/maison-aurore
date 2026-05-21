/* ═══════════════════════════════════════════════════════════════
   MAISON AURORE — Core Application
   Scroll reveals, navbar, preloader, mobile nav, parallax
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Preloader ─── */
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    const dismissPreloader = () => {
      preloader.classList.add('is-loaded');
      document.body.classList.remove('is-loading');
      setTimeout(() => { preloader.style.display = 'none'; }, 900);
    };

    // Wait for fonts + images or max 3s
    Promise.race([
      Promise.all([
        document.fonts ? document.fonts.ready : Promise.resolve(),
        new Promise(resolve => {
          const imgs = document.querySelectorAll('img');
          let loaded = 0;
          if (imgs.length === 0) return resolve();
          imgs.forEach(img => {
            if (img.complete) { loaded++; if (loaded >= imgs.length) resolve(); }
            else {
              img.addEventListener('load', () => { loaded++; if (loaded >= imgs.length) resolve(); });
              img.addEventListener('error', () => { loaded++; if (loaded >= imgs.length) resolve(); });
            }
          });
        })
      ]),
      new Promise(resolve => setTimeout(resolve, 3000))
    ]).then(dismissPreloader);
  }

  /* ─── Announcement Bar Rotator ─── */
  const announcementItems = document.querySelectorAll('.announcement__item');
  if (announcementItems.length > 1) {
    let currentAnnouncement = 0;
    announcementItems[0].classList.add('is-active');

    setInterval(() => {
      announcementItems[currentAnnouncement].classList.remove('is-active');
      currentAnnouncement = (currentAnnouncement + 1) % announcementItems.length;
      announcementItems[currentAnnouncement].classList.add('is-active');
    }, 4000);
  } else if (announcementItems.length === 1) {
    announcementItems[0].classList.add('is-active');
  }

  /* ─── Navbar Scroll Behavior ─── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScroll = 0;
    let ticking = false;

    const updateNavbar = () => {
      const currentScroll = window.pageYOffset;

      // Theme switching
      if (currentScroll > 100) {
        navbar.classList.remove('navbar--dark');
        navbar.classList.add('navbar--light');
      } else {
        navbar.classList.remove('navbar--light');
        navbar.classList.add('navbar--dark');
      }

      // Hide/show on scroll direction
      if (currentScroll > 300) {
        if (currentScroll > lastScroll && currentScroll - lastScroll > 5) {
          navbar.classList.add('navbar--hidden');
        } else if (lastScroll > currentScroll && lastScroll - currentScroll > 5) {
          navbar.classList.remove('navbar--hidden');
        }
      } else {
        navbar.classList.remove('navbar--hidden');
      }

      lastScroll = currentScroll;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });

    // Initial state
    updateNavbar();
  }

  /* ─── Scroll Reveal System ─── */
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal, .reveal-line, .reveal-fade, .reveal-scale');

    if (revealElements.length > 0) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Check for stagger
            const stagger = entry.target.dataset.stagger;
            if (stagger) {
              entry.target.style.transitionDelay = `${parseInt(stagger) * 0.1}s`;
            }
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    }
  } else {
    // If reduced motion, make everything visible immediately
    document.querySelectorAll('.reveal, .reveal-line, .reveal-fade, .reveal-scale').forEach(el => {
      el.classList.add('is-visible');
    });
  }

  /* ─── Parallax System ─── */
  if (!prefersReducedMotion) {
    const parallaxElements = document.querySelectorAll('.parallax-drift');

    if (parallaxElements.length > 0) {
      let parallaxTicking = false;

      const updateParallax = () => {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;

        parallaxElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const offset = (elementCenter - viewportCenter) * 0.05;
          el.style.transform = `translateY(${offset}px)`;
        });

        parallaxTicking = false;
      };

      window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
          requestAnimationFrame(updateParallax);
          parallaxTicking = true;
        }
      }, { passive: true });
    }
  }

  /* ─── Mobile Navigation ─── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    const toggleMobileNav = () => {
      const isOpen = mobileNav.classList.contains('is-open');

      if (isOpen) {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        document.body.classList.remove('no-scroll');
      } else {
        mobileNav.classList.add('is-open');
        hamburger.classList.add('is-active');
        document.body.classList.add('no-scroll');
      }
    };

    hamburger.addEventListener('click', toggleMobileNav);

    // Close on link click
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        document.body.classList.remove('no-scroll');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  /* ─── Smooth Scroll for Anchor Links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  /* ─── Marquee Clone for Infinite Loop ─── */
  document.querySelectorAll('.marquee__track').forEach(track => {
    const items = track.innerHTML;
    track.innerHTML = items + items;
  });

  /* ─── Image Lazy Loading ─── */
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length > 0) {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.addEventListener('load', () => img.classList.add('is-loaded'));
          lazyObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px'
    });

    lazyImages.forEach(img => lazyObserver.observe(img));
  }

  /* ─── Carousel ─── */
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel__track');
    const dots = carousel.querySelectorAll('.carousel__dot');

    if (!track || dots.length === 0) return;

    const updateDots = () => {
      const scrollLeft = track.scrollLeft;
      const itemWidth = track.querySelector('.carousel__item')?.offsetWidth || 1;
      const gap = 32; // 2rem
      const activeIndex = Math.round(scrollLeft / (itemWidth + gap));

      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === activeIndex);
      });
    };

    track.addEventListener('scroll', updateDots, { passive: true });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const items = track.querySelectorAll('.carousel__item');
        if (items[i]) {
          items[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
      });
    });

    // Initial state
    if (dots.length > 0) dots[0].classList.add('is-active');
  });

  /* ─── Current Year in Footer ─── */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── Video Autoplay Handling ─── */
  document.querySelectorAll('video[autoplay]').forEach(video => {
    video.play().catch(() => {
      // Autoplay blocked — add poster fallback
      video.setAttribute('controls', '');
    });
  });

});
