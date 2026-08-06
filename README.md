# Encurtidos El Piquete

Tienda en línea de encurtidos artesanales: catálogo, carrito, checkout, panel administrativo y notificaciones. Monorepo con `frontend/` (React + Vite) y `backend/` (Node.js + Express + MySQL).

## Requisitos

- Node.js 18+
- MySQL 8

## Configuración local

1. Crear la base de datos y las tablas:

   ```bash
   mysql -u root -p < backend/db/schema.sql
   mysql -u root -p < backend/db/seed.sql
   ```

2. Backend:

   ```bash
   cd backend
   cp .env.example .env   # completar con tus credenciales
   npm install
   node scripts/crear-admin.js "Nombre" correo@ejemplo.com contraseña
   npm run dev
   ```

3. Frontend:

   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

O desde la raíz, con ambos servidores a la vez: `npm install && npm run dev`.

## Variables de entorno

**`backend/.env`**

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor Express (default 4000) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexión a MySQL |
| `CORS_ORIGIN` | URL del frontend permitida (en producción, el dominio real) |
| `JWT_SECRET` | Clave para firmar los tokens de administrador — generar una nueva y única en producción |
| `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Cuenta de Gmail (con contraseña de aplicación) para el correo de confirmación de pedidos. Si se deja vacío, el envío de correos se omite sin afectar el resto del sistema |

**`frontend/.env`**

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API (en producción, la URL real del backend + `/api`) |
| `VITE_WHATSAPP_NUMBER` | Número de WhatsApp del negocio (formato `504XXXXXXXX`) |

## Estado del proyecto

Construido por fases — ver el historial de commits para el detalle de cada una:

1. Fundación: estructura, MySQL, API de productos, layout y portada.
2. Catálogo dinámico de productos y combos.
3. Carrito lateral persistente.
4. Checkout (datos, entrega, pago, confirmación).
5. Autenticación de administrador y backend de pedidos.
6. Panel administrativo completo (productos, cupones, zonas, reportes).
7. Correo automático y pago con tarjeta vía BAC Compra-Click (flujo manual).
8. PWA, SEO, optimización de imágenes.

### Pendiente antes de producción

- **Fotografía real de producto** — actualmente se usa una foto de referencia con un sello del logo superpuesto sobre la etiqueta de otro producto.
- **PayPal** — no configurado todavía (pendiente cuenta del negocio).
- **BAC E-commerce** — actualmente el pago con tarjeta usa un enlace de Compra-Click que el administrador genera y envía manualmente por WhatsApp; la integración directa por API requiere contrato y credenciales del banco.
- **Dominio y hosting** — `robots.txt` y `sitemap.xml` usan `https://elpiquete.com/` como marcador de posición; actualizar con el dominio real al desplegar.
- **`JWT_SECRET`** — generar uno nuevo para producción (no reutilizar el de desarrollo).

## Despliegue

El proyecto está listo para desplegarse (builds de producción, variables de entorno documentadas) pero aún no está conectado a ningún proveedor de hosting. `frontend/` se compila con `npm run build` (genera `dist/`, sitio estático + PWA); `backend/` se ejecuta con `npm start`. Cuando se elija el proveedor (hosting compartido, Vercel/Railway, VPS, etc.), se retoma esta fase para configurar el despliegue real.
