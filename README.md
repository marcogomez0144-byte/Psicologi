WEB DE PSICOLOGÍA SANITARIA

PUBLICACIÓN
La web pública se sirve con GitHub Pages. El repositorio no debe contener contraseñas,
tokens, claves API, archivos .env ni información clínica de pacientes.

EDICIÓN
- Los textos públicos se mantienen en content.js.
- Las imágenes públicas deben estar en assets/ o embebidas en content.js.
- No existe un panel de administración público.
- Para editar con una herramienta visual, usa únicamente una copia local privada y no la
  subas al repositorio.

SEGURIDAD
- El servidor de previsualización server.py solo escucha en 127.0.0.1.
- La web aplica una Content Security Policy básica.
- Los enlaces dinámicos web solo aceptan HTTPS.
- Las imágenes dinámicas no cargan recursos remotos de terceros.
- No introduzcas secretos ni datos de pacientes en GitHub.

CITAS Y CONTACTO
Las reservas se derivan a los canales configurados en content.js (WhatsApp, correo y
agenda externa HTTPS). La web no mantiene una base de datos de pacientes ni procesa pagos.

PRUEBA LOCAL
Ejecuta:
  python server.py
y abre:
  http://localhost:8000/

IMPORTANTE
Los textos legales deben mantenerse actualizados con los datos reales de la profesional
y con los servicios externos que se utilicen. No publiques NIF, domicilio u otros datos
obligatorios hasta confirmar cuáles deben mostrarse legalmente y cuáles son los correctos.
