/**
 * APLICACIÓN WEB - CONSULTA DE PSICOLOGÍA
 * Interacciones de interfaz, accesibilidad, acordeón FAQ, vídeo ambiental y presentación.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientVideo();
  initFaqAccordion();
  initMobileNav();
  initPresentationVideoModal();
  initSmoothScroll();
});

/**
 * 1. Control del Vídeo Ambiental Hero con Pausa Accesible
 */
function initAmbientVideo() {
  const video = document.getElementById('ambientVideo');
  const toggleBtn = document.getElementById('ambientToggleBtn');
  const fallbackImg = document.getElementById('ambientFallbackImg');

  if (!video || !toggleBtn) return;

  // Si el usuario tiene activado prefers-reduced-motion, pausar por defecto
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    video.pause();
    updateButtonState(false);
  }

  toggleBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play().then(() => {
        updateButtonState(true);
        if (fallbackImg) fallbackImg.style.display = 'none';
      }).catch(err => {
        console.log('Autoplay prevenido o error en vídeo:', err);
      });
    } else {
      video.pause();
      updateButtonState(false);
    }
  });

  function updateButtonState(isPlaying) {
    const icon = toggleBtn.querySelector('.icon-state');
    const label = toggleBtn.querySelector('.btn-label');
    if (isPlaying) {
      if (icon) icon.innerHTML = '<use href="assets/icons/icons.svg#icon-pause"></use>';
      if (label) label.textContent = 'Pausar fondo';
      toggleBtn.setAttribute('aria-label', 'Pausar vídeo ambiental de fondo');
    } else {
      if (icon) icon.innerHTML = '<use href="assets/icons/icons.svg#icon-play"></use>';
      if (label) label.textContent = 'Reanudar fondo';
      toggleBtn.setAttribute('aria-label', 'Reanudar vídeo ambiental de fondo');
    }
  }

  // Gestión robusta de respaldo: si el vídeo falla o no existe el archivo local
  const handleVideoError = () => {
    video.style.display = 'none';
    if (fallbackImg) fallbackImg.style.display = 'block';
    if (toggleBtn) {
      toggleBtn.innerHTML = `
        <span class="icon-state"><svg class="icon" aria-hidden="true" style="width: 12px; height: 12px;"><use href="assets/icons/icons.svg#icon-heart-hand"></use></svg></span>
        <span class="btn-label">Ambiente de consulta</span>
      `;
      toggleBtn.style.pointerEvents = 'none';
    }
  };

  video.addEventListener('error', handleVideoError);
  const source = video.querySelector('source');
  if (source) {
    source.addEventListener('error', handleVideoError);
  }

  // Verificación proactiva tras carga inicial
  setTimeout(() => {
    if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE || video.readyState === 0) {
      if (video.paused && (!video.currentTime || video.currentTime === 0)) {
        // Si el archivo físico aún no ha sido provisto por la profesional, mostrar imagen de respaldo
        if (fallbackImg) fallbackImg.style.display = 'block';
      }
    }
  }, 1000);
}

/**
 * 2. Acordeón de Preguntas Frecuentes (FAQ) Accesible con Teclado
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Cerrar otros acordeones si se desea comportamiento exclusivo
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Alternar estado actual
      if (isOpen) {
        item.classList.remove('open');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Soporte para teclas Flecha Arriba / Flecha Abajo
    questionBtn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = item.nextElementSibling?.querySelector('.faq-question');
        if (next) next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = item.previousElementSibling?.querySelector('.faq-question');
        if (prev) prev.focus();
      }
    });
  });
}

/**
 * 3. Menú Móvil
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('nav-open');
  });

  // Cerrar menú al hacer clic en un enlace
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * 4. Modal de Vídeo de Presentación de la Psicóloga con Subtítulos y Transcripción
 */
function initPresentationVideoModal() {
  const openBtn = document.getElementById('openPresentationVideoBtn');
  const modal = document.getElementById('presentationVideoModal');
  const closeBtn = document.getElementById('closePresentationVideoBtn');
  const modalVideo = document.getElementById('presentationVideo');

  if (!openBtn || !modal) return;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modalVideo) {
      modalVideo.pause();
    }
    openBtn.focus();
  }

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * 5. Navegación Suave y Enlaces Activos
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        // Foco para accesibilidad
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }
    });
  });
}
