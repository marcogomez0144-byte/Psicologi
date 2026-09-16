/**
 * GESTIÓN DE PRIVACIDAD, CONSENTIMIENTO DE COOKIES Y MODALES LEGALES
 * Cumplimiento estricto RGPD, LOPDGDD y LSSI-CE sin registrar datos sensibles
 */

document.addEventListener('DOMContentLoaded', () => {
  initCookieConsent();
  initLegalModals();
});

function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  const acceptAllBtn = document.getElementById('cookieAcceptAllBtn');
  const acceptEssentialBtn = document.getElementById('cookieAcceptEssentialBtn');
  const configBtn = document.getElementById('cookieConfigBtn');
  const reopenBtn = document.getElementById('reopenCookieSettings');

  if (!banner) return;

  const savedConsent = localStorage.getItem('psico_cookie_consent');

  // Si no hay decisión previa, mostrar banner tras breve pausa cordial
  if (!savedConsent) {
    setTimeout(() => {
      banner.style.display = 'block';
    }, 1200);
  }

  if (acceptAllBtn) {
    acceptAllBtn.addEventListener('click', () => {
      saveConsent({ necessary: true, analytics: true });
      banner.style.display = 'none';
    });
  }

  if (acceptEssentialBtn) {
    acceptEssentialBtn.addEventListener('click', () => {
      saveConsent({ necessary: true, analytics: false });
      banner.style.display = 'none';
    });
  }

  if (configBtn) {
    configBtn.addEventListener('click', () => {
      const modal = document.getElementById('cookieConfigModal');
      if (modal) {
        modal.classList.add('active');
        banner.style.display = 'none';
      }
    });
  }

  if (reopenBtn) {
    reopenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.getElementById('cookieConfigModal');
      if (modal) {
        modal.classList.add('active');
      }
    });
  }

  function saveConsent(preferences) {
    localStorage.setItem('psico_cookie_consent', JSON.stringify({
      date: new Date().toISOString(),
      preferences
    }));
  }
}

/**
 * Control accesible de modales legales (Aviso Legal, Privacidad, Cookies)
 */
function initLegalModals() {
  const modalTriggers = document.querySelectorAll('[data-legal-modal]');
  const modals = document.querySelectorAll('.legal-modal');
  const closeButtons = document.querySelectorAll('.modal-close-btn');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const modalId = trigger.getAttribute('data-legal-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        e.preventDefault();
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.modal-overlay');
      if (parentModal) {
        parentModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}
