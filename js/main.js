/* ============================================
   ZAIKA RESTAURANT — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ----- Navbar Scroll Effect ----- */
  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }
    }, { passive: true });
  }

  /* ----- Mobile Menu ----- */
  function initMobileMenu() {
    var checkbox = document.getElementById('nav-toggle');
    var menu = document.querySelector('.navbar__menu');
    var overlay = document.querySelector('.navbar__overlay');
    if (!checkbox || !menu) return;

    function closeMenu() {
      checkbox.checked = false;
      document.body.style.overflow = '';
    }

    checkbox.addEventListener('change', function () {
      document.body.style.overflow = checkbox.checked ? 'hidden' : '';
    });

    // Close on link click
    menu.querySelectorAll('.navbar__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on overlay click
    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }
  }

  /* ----- Scroll Animations (IntersectionObserver) ----- */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(function (el) {
        el.classList.add('fade-in--visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----- Gallery Lightbox ----- */
  function initLightbox() {
    var galleryItems = document.querySelectorAll('.gallery__item');
    if (!galleryItems.length) return;

    // Create lightbox DOM
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image viewer');
    lightbox.innerHTML =
      '<button class="lightbox__close" aria-label="Close image viewer">&times;</button>' +
      '<button class="lightbox__prev" aria-label="Previous image">&#10094;</button>' +
      '<button class="lightbox__next" aria-label="Next image">&#10095;</button>' +
      '<img class="lightbox__img" src="" alt="">' +
      '<p class="lightbox__caption"></p>';
    document.body.appendChild(lightbox);

    var img = lightbox.querySelector('.lightbox__img');
    var caption = lightbox.querySelector('.lightbox__caption');
    var currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      var item = galleryItems[index];
      var itemImg = item.querySelector('img');
      img.src = itemImg.dataset.full || itemImg.src;
      img.alt = itemImg.alt;
      caption.textContent = itemImg.alt;
      lightbox.classList.add('lightbox--active');
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('.lightbox__close').focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('lightbox--active');
      document.body.style.overflow = '';
      galleryItems[currentIndex].focus();
    }

    function navigate(direction) {
      currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
      openLightbox(currentIndex);
    }

    galleryItems.forEach(function (item, index) {
      item.setAttribute('tabindex', '0');
      item.addEventListener('click', function () {
        openLightbox(index);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') openLightbox(index);
      });
    });

    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__prev').addEventListener('click', function () { navigate(-1); });
    lightbox.querySelector('.lightbox__next').addEventListener('click', function () { navigate(1); });

    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ----- Active Nav Link ----- */
  function initActiveNavLink() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('navbar__link--active');
      }
    });
  }

  /* ----- WhatsApp FAB Visibility ----- */
  function initWhatsAppButton() {
    var btn = document.querySelector('.whatsapp-fab');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        btn.classList.add('whatsapp-fab--visible');
      } else {
        btn.classList.remove('whatsapp-fab--visible');
      }
    }, { passive: true });
  }

  /* ----- Initialize All ----- */
  document.addEventListener('DOMContentLoaded', function () {
    initNavbarScroll();
    initMobileMenu();
    initScrollAnimations();
    initActiveNavLink();
    initWhatsAppButton();

    if (document.querySelector('.gallery__grid')) {
      initLightbox();
    }
  });

})();
