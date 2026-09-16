/**
 * MOTOR INTERACTIVO DE RESERVA DE CITAS Y CALENDARIO ÉTICO
 * Flujo en 4 pasos con generación de citas, selector horario y exportación .ics
 */

const BookingState = {
  step: 1,
  service: {
    id: 'primera-online',
    title: 'Primera sesión online',
    modality: 'Online (Videoconsulta confidencial)',
    duration: '60 minutos',
    price: 65,
    priceFormatted: '65 €' // Campo editable: [PRECIO]
  },
  selectedDate: null,
  selectedDateFormatted: '',
  selectedTime: null,
  client: {
    name: '',
    email: '',
    phone: '',
    note: '',
    privacyAccepted: false,
    newsletterAccepted: false
  },
  confirmedRef: ''
};

document.addEventListener('DOMContentLoaded', () => {
  initBookingWizard();
});

function initBookingWizard() {
  const wizard = document.getElementById('bookingWizard');
  if (!wizard) return;

  renderCalendar();
  setupServiceSelection();
  setupNavigationButtons();
  setupFormValidation();
  setupExternalToolToggle();
}

/**
 * Paso 1: Selección de modalidad y tipo de sesión
 */
function setupServiceSelection() {
  const serviceRadios = document.querySelectorAll('input[name="booking_service"]');

  serviceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const card = e.target.closest('.service-card-label');
      if (!card) return;

      const title = card.querySelector('.service-card-title')?.textContent.trim() || '';
      const modality = card.dataset.modality || 'Online';
      const duration = card.dataset.duration || '60 minutos';
      const price = parseInt(card.dataset.price, 10) || 65;
      const priceFormatted = card.dataset.priceFormatted || `${price} €`;

      BookingState.service = {
        id: e.target.value,
        title,
        modality,
        duration,
        price,
        priceFormatted
      };

      updateSummary();
    });
  });
}

/**
 * Paso 2: Generación del Calendario Dinámico y Franjas Horarias
 */
function renderCalendar() {
  const monthLabel = document.getElementById('calendarMonthName');
  const daysGrid = document.getElementById('calendarDaysGrid');
  const slotsGrid = document.getElementById('timeSlotsGrid');

  if (!daysGrid || !slotsGrid) return;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Nombres de meses en español
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (monthLabel) {
    monthLabel.textContent = `${monthNames[currentMonth]} ${currentYear}`;
  }

  daysGrid.innerHTML = '';

  // Calcular días del mes actual
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 domingo, 1 lunes...
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Ajuste para comenzar en lunes (L=0, M=1... D=6)
  const offset = (firstDayIndex === 0 ? 6 : firstDayIndex - 1);

  // Celdas vacías para el desfase inicial
  for (let i = 0; i < offset; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day-empty';
    daysGrid.appendChild(emptyCell);
  }

  // Días del mes
  for (let day = 1; day <= totalDays; day++) {
    const dayDate = new Date(currentYear, currentMonth, day);
    const dayOfWeek = dayDate.getDay(); // 0 domingo, 6 sábado
    const isPast = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'calendar-day-btn';
    btn.textContent = day;

    if (isPast || isWeekend) {
      btn.disabled = true;
      btn.title = isPast ? 'Fecha pasada' : 'Fines de semana sin consulta habitual';
    } else {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.calendar-day-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        const formatted = dayDate.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        });

        BookingState.selectedDate = dayDate;
        BookingState.selectedDateFormatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);

        renderTimeSlots();
        updateSummary();
      });
    }

    daysGrid.appendChild(btn);
  }

  // Si no hay fecha seleccionada, seleccionar el primer día disponible
  const firstAvailableBtn = daysGrid.querySelector('.calendar-day-btn:not(:disabled)');
  if (firstAvailableBtn) {
    firstAvailableBtn.click();
  }
}

function renderTimeSlots() {
  const slotsContainer = document.getElementById('timeSlotsGrid');
  if (!slotsContainer) return;

  slotsContainer.innerHTML = '';

  // Franjas horarias realistas para consulta de psicología (espaciadas con descanso)
  const slots = ['09:30', '11:00', '12:30', '16:00', '17:30', '19:00'];

  slots.forEach((time, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'time-slot-btn';
    btn.textContent = time;

    // Seleccionar la primera por defecto
    if (index === 0 && !BookingState.selectedTime) {
      btn.classList.add('selected');
      BookingState.selectedTime = time;
    } else if (BookingState.selectedTime === time) {
      btn.classList.add('selected');
    }

    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      BookingState.selectedTime = time;
      updateSummary();
    });

    slotsContainer.appendChild(btn);
  });

  if (!BookingState.selectedTime && slots.length > 0) {
    BookingState.selectedTime = slots[0];
  }
}

/**
 * Paso 3: Validación y captura de datos mínimos del paciente
 */
function setupFormValidation() {
  const nameInput = document.getElementById('bookingName');
  const emailInput = document.getElementById('bookingEmail');
  const phoneInput = document.getElementById('bookingPhone');
  const noteInput = document.getElementById('bookingNote');
  const privacyCheck = document.getElementById('bookingPrivacy');
  const newsletterCheck = document.getElementById('bookingNewsletter');

  if (!nameInput) return;

  const updateClientState = () => {
    BookingState.client.name = nameInput.value.trim();
    BookingState.client.email = emailInput.value.trim();
    BookingState.client.phone = phoneInput.value.trim();
    BookingState.client.note = noteInput?.value.trim() || '';
    BookingState.client.privacyAccepted = privacyCheck ? privacyCheck.checked : false;
    BookingState.client.newsletterAccepted = newsletterCheck ? newsletterCheck.checked : false;
    updateSummary();
  };

  [nameInput, emailInput, phoneInput, noteInput].forEach(el => {
    if (el) el.addEventListener('input', updateClientState);
  });

  if (privacyCheck) privacyCheck.addEventListener('change', updateClientState);
  if (newsletterCheck) newsletterCheck.addEventListener('change', updateClientState);
}

/**
 * Actualizar tarjeta de resumen del Paso 4
 */
function updateSummary() {
  const summaryService = document.getElementById('summaryService');
  const summaryModality = document.getElementById('summaryModality');
  const summaryDateTime = document.getElementById('summaryDateTime');
  const summaryDuration = document.getElementById('summaryDuration');
  const summaryPrice = document.getElementById('summaryPrice');
  const summaryClient = document.getElementById('summaryClient');

  if (summaryService) summaryService.textContent = BookingState.service.title;
  if (summaryModality) summaryModality.textContent = BookingState.service.modality;
  if (summaryDuration) summaryDuration.textContent = BookingState.service.duration;
  if (summaryPrice) summaryPrice.textContent = BookingState.service.priceFormatted;

  if (summaryDateTime) {
    if (BookingState.selectedDateFormatted && BookingState.selectedTime) {
      summaryDateTime.textContent = `${BookingState.selectedDateFormatted} a las ${BookingState.selectedTime} h`;
    } else {
      summaryDateTime.textContent = 'Fecha y hora pendientes de selección';
    }
  }

  if (summaryClient) {
    if (BookingState.client.name) {
      summaryClient.textContent = `${BookingState.client.name} (${BookingState.client.email || 'Email pendiente'})`;
    } else {
      summaryClient.textContent = 'Pendiente de rellenar';
    }
  }
}

/**
 * Navegación entre pasos (Anterior / Siguiente)
 */
function setupNavigationButtons() {
  const nextBtns = document.querySelectorAll('.booking-next-btn');
  const prevBtns = document.querySelectorAll('.booking-prev-btn');
  const confirmBtn = document.getElementById('bookingConfirmBtn');

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(BookingState.step)) {
        goToStep(BookingState.step + 1);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(BookingState.step - 1);
    });
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', handleConfirmBooking);
  }
}

function validateStep(step) {
  if (step === 1) {
    return true; // Ya hay un servicio seleccionado por defecto
  }

  if (step === 2) {
    if (!BookingState.selectedDate || !BookingState.selectedTime) {
      alert('Por favor, selecciona un día y una franja horaria para tu sesión.');
      return false;
    }
    return true;
  }

  if (step === 3) {
    const nameInput = document.getElementById('bookingName');
    const emailInput = document.getElementById('bookingEmail');
    const phoneInput = document.getElementById('bookingPhone');
    const privacyCheck = document.getElementById('bookingPrivacy');

    if (!nameInput.value.trim()) {
      alert('Por favor, introduce tu nombre y apellidos.');
      nameInput.focus();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      alert('Por favor, introduce un correo electrónico válido para confirmar la cita.');
      emailInput.focus();
      return false;
    }

    if (!phoneInput.value.trim() || phoneInput.value.trim().length < 9) {
      alert('Por favor, introduce un número de teléfono de contacto para el recordatorio.');
      phoneInput.focus();
      return false;
    }

    if (!privacyCheck.checked) {
      alert('Es necesario aceptar la política de privacidad para gestionar la cita con seguridad.');
      privacyCheck.focus();
      return false;
    }

    return true;
  }

  return true;
}

function goToStep(targetStep) {
  if (targetStep < 1 || targetStep > 4) return;

  BookingState.step = targetStep;

  // Actualizar indicadores visuales de pasos
  document.querySelectorAll('.booking-step-tab').forEach((tab, idx) => {
    const stepNum = idx + 1;
    tab.classList.remove('active', 'completed');
    if (stepNum === targetStep) {
      tab.classList.add('active');
    } else if (stepNum < targetStep) {
      tab.classList.add('completed');
    }
  });

  // Mostrar el panel adecuado
  document.querySelectorAll('.booking-step-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  const activePanel = document.getElementById(`bookingStep${targetStep}`);
  if (activePanel) {
    activePanel.classList.add('active');
    // Scroll suave si está fuera de pantalla
    activePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  updateSummary();
}

/**
 * Confirmación final y generación de comprobante interactivo
 */
function handleConfirmBooking() {
  const confirmBtn = document.getElementById('bookingConfirmBtn');
  if (!confirmBtn) return;

  // Estado de carga realista
  confirmBtn.disabled = true;
  const originalText = confirmBtn.innerHTML;
  confirmBtn.innerHTML = `
    <span class="spinner" style="display:inline-block;width:16px;height:16px;border:2px solid #FFF;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;margin-right:8px;vertical-align:middle;"></span>
    Tramitando tu cita con seguridad...
  `;

  setTimeout(() => {
    // Generar código de referencia único
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    BookingState.confirmedRef = `PSI-2026-${randomCode}`;

    // Ocultar paneles y mostrar éxito
    document.getElementById('bookingStep4').style.display = 'none';
    document.querySelector('.booking-progress-bar').style.display = 'none';

    const successContainer = document.getElementById('bookingSuccessState');
    if (successContainer) {
      successContainer.style.display = 'block';

      // Rellenar datos en el comprobante
      document.getElementById('confirmedRefCode').textContent = BookingState.confirmedRef;
      document.getElementById('confirmedServiceTitle').textContent = BookingState.service.title;
      document.getElementById('confirmedDateTime').textContent = `${BookingState.selectedDateFormatted} a las ${BookingState.selectedTime} h`;
      document.getElementById('confirmedClientEmail').textContent = BookingState.client.email;

      // Configurar descarga de archivo .ics (calendario de Google / Apple / Outlook)
      setupIcsDownload();
    }
  }, 1200);
}

/**
 * Generador accesible de archivo iCalendar (.ics) en cliente
 */
function setupIcsDownload() {
  const downloadBtn = document.getElementById('downloadCalendarBtn');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', () => {
    const d = BookingState.selectedDate || new Date();
    const timeParts = (BookingState.selectedTime || '10:00').split(':');
    const startHour = parseInt(timeParts[0], 10);
    const startMinute = parseInt(timeParts[1], 10);

    const startDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), startHour, startMinute);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 60 min

    const formatIcsDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Consulta de Psicologia//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${BookingState.confirmedRef}@consultapsicologia.com`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(startDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      `SUMMARY:${BookingState.service.title} con Psicóloga [NOMBRE]`,
      `DESCRIPTION:Cita de psicología sanitaria. Modalidad: ${BookingState.service.modality}. Ref: ${BookingState.confirmedRef}. Se enviará el enlace o recordatorio con antelación.`,
      `LOCATION:${BookingState.service.modality.includes('Online') ? 'Videoconsulta (enlace cifrado remitido por correo)' : 'Consulta en [CIUDAD]'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cita-psicologia-${BookingState.confirmedRef}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

/**
 * Conmutador para integrar [HERRAMIENTA DE RESERVAS] si la profesional utiliza Calendly / Doctoralia / TuConsulta
 */
function setupExternalToolToggle() {
  const toggleBtn = document.getElementById('toggleExternalToolBtn');
  const externalContainer = document.getElementById('externalBookingToolContainer');
  const nativeContainer = document.getElementById('nativeBookingToolContainer');

  if (!toggleBtn || !externalContainer) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = externalContainer.style.display === 'none';
    if (isHidden) {
      externalContainer.style.display = 'block';
      if (nativeContainer) nativeContainer.style.display = 'none';
      toggleBtn.textContent = 'Volver al formulario de reserva guiado';
    } else {
      externalContainer.style.display = 'none';
      if (nativeContainer) nativeContainer.style.display = 'block';
      toggleBtn.textContent = '¿Prefieres usar [HERRAMIENTA DE RESERVAS]? (Calendly / Doctoralia / TuConsulta)';
    }
  });
}
