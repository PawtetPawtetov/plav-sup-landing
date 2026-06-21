(() => {
  // Бургер-меню
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true' || false;
      burger.setAttribute('aria-expanded', !expanded);
      burger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    document.querySelectorAll('[data-nav]').forEach(link => {
      link.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        burger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Intersection Observer для fade-up анимаций
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Карусели в карточках услуг
  function updateCarouselHeight(viewport) {
    if (!viewport) return;
    const slides = viewport.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;
    const index = Math.round(viewport.scrollLeft / viewport.clientWidth) || 0;
    const currentSlide = slides[Math.min(index, slides.length - 1)];
    const img = currentSlide?.querySelector('img');
    if (!img) return;
    if (img.complete && img.naturalHeight) {
      viewport.style.height = img.clientHeight + 'px';
    } else {
      img.addEventListener('load', function handler() {
        viewport.style.height = img.clientHeight + 'px';
        img.removeEventListener('load', handler);
      }, { once: true });
    }
  }

  function updateButtons(viewport, prevBtn, nextBtn) {
    if (!viewport || !prevBtn || !nextBtn) return;
    const tolerance = 2;
    prevBtn.hidden = viewport.scrollLeft <= tolerance;
    nextBtn.hidden = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - tolerance;
  }

  document.querySelectorAll('.service-photo-carousel').forEach(carousel => {
    const viewport = carousel.querySelector('[data-carousel]');
    const prev = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    if (!viewport || !prev || !next) return;

    viewport.addEventListener('scroll', () => {
      updateCarouselHeight(viewport);
      updateButtons(viewport, prev, next);
    }, { passive: true });

    prev.addEventListener('click', () => viewport.scrollBy({ left: -viewport.clientWidth, behavior: 'smooth' }));
    next.addEventListener('click', () => viewport.scrollBy({ left: viewport.clientWidth, behavior: 'smooth' }));

    viewport.querySelectorAll('.carousel-slide img').forEach(img => {
      const open = () => { if (typeof openLightbox === 'function') openLightbox(img.src); };
      img.addEventListener('click', (e) => { e.stopPropagation(); open(); });
      img.addEventListener('touchend', (e) => { e.preventDefault(); open(); });
    });

    window.addEventListener('load', () => { updateCarouselHeight(viewport); updateButtons(viewport, prev, next); });
    window.addEventListener('resize', () => { updateCarouselHeight(viewport); updateButtons(viewport, prev, next); });
    updateCarouselHeight(viewport);
    updateButtons(viewport, prev, next);
  });

  // Лайтбокс
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const full = item.getAttribute('data-full');
      if (full) openLightbox(full);
    });
  });

  const rentImage = document.querySelector('.rent-image');
  if (rentImage) {
    const openRent = () => {
      const full = rentImage.getAttribute('data-full');
      if (full) openLightbox(full);
    };
    rentImage.addEventListener('click', openRent);
    rentImage.addEventListener('keydown', (e) => { if (e.key === 'Enter') openRent(); });
    const img = rentImage.querySelector('img');
    if (img) img.addEventListener('click', (e) => { e.stopPropagation(); openRent(); });
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  // Модальное окно контактов
  const contactModal = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');

  function openContactModal(e) {
    e.preventDefault();
    if (contactModal) {
      contactModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeContactModal() {
    if (contactModal) {
      contactModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.open-contact-modal').forEach(btn => {
    btn.addEventListener('click', openContactModal);
  });

  const floatBtn = document.getElementById('floatContactBtn');
  if (floatBtn) floatBtn.addEventListener('click', openContactModal);

  if (modalClose) modalClose.addEventListener('click', closeContactModal);
  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeContactModal();
    });
  }

  // Кнопка "Наверх"
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.display = window.scrollY > 500 ? 'inline-block' : 'none';
    });
  }

  window.openLightbox = openLightbox;
})();