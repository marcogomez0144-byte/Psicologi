# Web Profesional para Consulta de Psicología Sanitaria
*Diseño contemporáneo, rigor sanitario, calidez y marketing ético*

Esta web ha sido diseñada y desarrollada siguiendo las mejores prácticas de **experiencia de usuario (UX/UI)**, **accesibilidad (WCAG AAA)**, **comunicación respetuosa en salud mental** y **cumplimiento legal estricto (RGPD, LOPDGDD, LSSI-CE y Código Deontológico de la Psicología)**.

---

## 🌟 Características Destacadas

1. **Dirección artística y visual**:
   - Paleta cromática serena: Marfil (`#FAF8F5`), Arena (`#F2EFE9`), Verde salvia (`#5A725D`) y acentos terracota cálidos (`#C46851`).
   - Tipografía editorial: *Playfair Display* (elegancia humana) y *Plus Jakarta Sans* (máxima legibilidad).
   - Componente multimedia para **vídeo ambiental** en cabecera con botón de pausa accesible, póster estático de respaldo y respeto al modo `prefers-reduced-motion`.
   - Espacio dedicado para **vídeo de presentación de la profesional**, con subtítulos (`.vtt`) y transcripción completa para accesibilidad.

2. **Tono ético y terapéutico**:
   - Textos redactados en español con voz cercana, respetuosa y profesional (tratamiento de "tú", femenino "psicóloga").
   - **Sin diagnósticos al lector, sin promesas milagro ni urgencia artificial**.
   - Integración de frases inspiradoras verificadas para acompañar la lectura:
     - *“Un espacio para hablar de lo que te pasa, a tu ritmo.”*
     - *“No necesitas tenerlo todo claro para empezar.”*
     - *“Podemos explorar juntas o juntos qué necesitas en este momento.”*
     - *“Pedir ayuda también puede ser una forma de cuidarte.”*

3. **Motor interactivo de reserva de citas en 4 pasos**:
   - **Paso 1**: Selección de modalidad (Online por videoconsulta o Presencial) y tipo de sesión.
   - **Paso 2**: Calendario interactivo dinámico con franjas horarias realistas espaciadas.
   - **Paso 3**: Formulario con datos mínimos necesarios (sin solicitar historial clínico invasivo en web).
   - **Paso 4**: Resumen transparente con desglose de tarifas, política de cancelación a 24h y confirmación con descarga de cita para el calendario (`.ics`).
   - **Canal de soporte por WhatsApp** con advertencia expresa de confidencialidad para no remitir datos clínicos.
   - Conmutador para integrar herramientas externas (`[HERRAMIENTA DE RESERVAS]` como Calendly, Doctoralia o TuConsulta).

4. **Seguridad sanitaria y marco legal**:
   - Barra superior permanente con **recursos de urgencia vital gratuitos y 24h** en España: **024** (Conducta suicida), **717 003 717** (Teléfono de la Esperanza) y **112** (Emergencias).
   - Páginas legales completas e independientes en `/legal/`:
     - `aviso-legal.html`: Normativa deontológica, colegiación y LSSI-CE.
     - `privacidad.html`: Cumplimiento RGPD y Art. 9.2.h para datos de salud.
     - `cookies.html`: Tabla transparente de cookies técnicas y analítica anónima.
   - Banner de consentimiento de cookies con configuración granular.

---

## 🚀 Cómo Visualizar y Probar la Web

### Opción A: Servidor local rápido con Python (Recomendada)
Abre un terminal en esta carpeta y ejecuta:
```bash
python server.py
```
Se abrirá automáticamente tu navegador en `http://localhost:8000`.

### Opción B: Directamente en el navegador
Puedes hacer doble clic en el archivo `index.html` para abrirlo en cualquier navegador moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

---

## 📋 Lista de Campos Editables Imprescindibles antes de Publicar

Para garantizar la veracidad y transparencia de la consulta, los siguientes campos deben personalizarse con los datos reales de la psicóloga:

| Campo | Ubicación en archivos | Ejemplo o Descripción |
| :--- | :--- | :--- |
| `[NOMBRE]` | `index.html`, `legal/*.html` | Nombre y dos apellidos de la psicóloga. |
| `[Nº COLEGIADA]` | Cabecera, hero, sobre mí, aviso legal | Ej. `M-32145` (Colegio Oficial de la Psicología). |
| `[CIUDAD]` | Hero, tarifas, mapa, aviso legal | Ciudad donde se ubica la consulta presencial (ej. Madrid, Valencia). |
| `[DIRECCIÓN]` | Sección tarifas, footer, aviso legal | Dirección completa del gabinete presencial, piso y código postal. |
| `[PRECIOS]` | Sección tarifas y `js/booking.js` | Honorarios reales por sesión (ej. 65 € online, 70 € presencial). |
| `[TELÉFONO]` | Barra WhatsApp, datos de contacto, aviso legal | Teléfono profesional para confirmaciones. |
| `[EMAIL]` | Formulario, pie de página, aviso legal | Correo profesional (ej. `contacto@tudominio.com`). |
| `[FOTOGRAFÍAS REALES]` | `assets/images/` | Reemplazar `psicologa-portrait.svg` por retrato real en consulta. |
| `[VÍDEOS REALES]` | `assets/videos/` | Añadir `consultation-ambient.mp4` y `presentation.mp4`. |
| `[HERRAMIENTA DE RESERVAS]` | `index.html` (sección `#reservar`) | Si se utiliza Doctoralia o Calendly, pegar el código embed. |
