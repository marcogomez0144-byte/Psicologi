"""
Servidor local ligero para previsualización de la web de psicología.
Ejecuta: python server.py
Y abre en tu navegador http://localhost:8000
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Desactivar caché local durante el desarrollo para ver cambios instantáneamente
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run_server():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 65)
        print(f"  Consulta de Psicología - Servidor Local de Previsualización")
        print(f"  URL: http://localhost:{PORT}")
        print(f"  Directorio: {DIRECTORY}")
        print("  Pulsa Ctrl+C para detener el servidor.")
        print("=" * 65)
        try:
            webbrowser.open(f"http://localhost:{PORT}")
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido correctamente.")
            httpd.server_close()

if __name__ == "__main__":
    run_server()
