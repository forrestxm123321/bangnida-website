/* ============================================================
   Bangnida CNC Machining - Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ---- Mobile Menu Toggle ----
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      nav.classList.toggle('open');
      this.classList.toggle('active');
      const expanded = nav.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', expanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Mobile dropdown toggles — click on .nav-link toggles submenu
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const parent = this.closest('li');
          if (parent) {
            const menu = parent.querySelector('.dropdown-menu');
            if (menu) {
              menu.classList.toggle('open');
            }
          }
        }
      });
    });

    // Close menu when clicking a direct link (not dropdown parent)
    nav.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768 && !this.classList.contains('nav-link')) {
          nav.classList.remove('open');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ---- Desktop dropdown hover (CSS handles all; this ensures touch devices trigger on tap) ----
  if ('ontouchstart' in window) {
    document.querySelectorAll('.nav > ul > li').forEach(li => {
      li.addEventListener('click', function(e) {
        if (this.querySelector('.dropdown-menu')) {
          const all = this.parentElement.querySelectorAll('li');
          all.forEach(l => { if (l !== this) l.classList.remove('touch-open'); });
          this.classList.toggle('touch-open');
        }
      });
    });
  }

  // ---- Hero Carousel ----
  const carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.hero-slide');
    const dots = carousel.querySelectorAll('.hero-dot');
    let current = 0;
    let interval;

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      current = index;
    }

    function startAutoPlay() {
      stopAutoPlay();
      interval = setInterval(() => goToSlide(current + 1), 5000);
    }
    function stopAutoPlay() { clearInterval(interval); }

    dots.forEach(dot => {
      dot.addEventListener('click', function() {
        goToSlide(parseInt(this.dataset.slide));
        startAutoPlay();
      });
    });

    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    startAutoPlay();
  }

  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ---- Back to Top Button ----
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Header scroll effect ----
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ---- Scroll Progress Bar ----
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', function() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    });
  }

  // ---- Scroll Reveal Animations ----
  const revealElements = document.querySelectorAll('.card, .why-item, .process-step, .industry-card, .equipment-item, .gallery-item, .cert-item, .service-card, .hero-stat, .section-header');
  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Current year in footer ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
