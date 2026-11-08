# Pendientes - SAGA-UP Frontend

## 1. Integración con SUMA 21
- **Estado:** 🟡 Pendiente.
- **Acceso:** siempre a través de nuestro backend (proxy), nunca directo a SUMA 21. Hoy la única conexión confirmada es el listado de productos.
- **Documentación:**
  - Proxy Saga UP: https://saga-up-backend-lr4u.onrender.com/api-docs/suma21/
  - SUMA 21 directo: https://suma21-backend.onrender.com/api-docs/
- **Endpoints expuestos por el proxy:**
  - `GET/POST /api/suma21/products`, `GET/PATCH/DELETE /api/suma21/products/{id}`
  - `GET/POST /api/suma21/payment-methods`, `GET/POST /api/suma21/accounts`, `GET/POST /api/suma21/inventory`
  - `POST /api/suma21/sales`, `POST /api/suma21/donations/monetary`, `POST /api/suma21/donations/inkind`
  - `POST /api/suma21/payments/checkout`, `GET /api/suma21/payments/{reference}`
- **Impacto previsto:** `Sales.jsx` hoy usa un arreglo `PRODUCTS` local; debe pasar a `GET /api/suma21/products`. Las opciones del menú "Pagos" y "Donaciones" podrían depender de este módulo.
- **Por definir:** alcance de ventas/donaciones/pagos y si se usará checkout (Wompi).

## 2. Anamnesis (vinculada a Beneficiarios — `children`)
- **Estado:** 🟡 Pendiente de clarificación.
- **Situación:** el Swagger actual no expone ningún endpoint ni esquema de anamnesis.
- **Por aclarar:**
  1. Campos requeridos (antecedentes perinatales, desarrollo, familiares, médicos, etc.).
  2. Si será un endpoint nuevo o se extenderá `/child-records` o `/child-internal-descriptions`.
  3. Quién puede registrarla/consultarla (roles).
