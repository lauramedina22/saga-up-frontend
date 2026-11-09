# Pendientes - SAGA-UP Frontend

## 1. Integración con SUMA 21
- **Estado:** 🟢 En progreso / Avanzado (Productos, Inventario y Cuentas completados).
- **Acceso:** siempre a través de nuestro backend (proxy), nunca directo a SUMA 21.
- **Documentación:**
  - Proxy Saga UP: https://saga-up-backend-lr4u.onrender.com/api-docs/suma21/
  - SUMA 21 directo: https://suma21-backend.onrender.com/api-docs/
- **Endpoints implementados en el frontend (`Sales.jsx` / `useSuma21.js`):**
  - ✅ `GET /api/suma21/products`: Catálogo visual con imágenes de Supabase, precios en COP y stock en tiempo real.
  - ✅ `GET /api/suma21/inventory`: Control de existencias de insumos e ítems (`inventory_item_id`, nombre, descripción y estado de disponibilidad).
  - ✅ `GET /api/suma21/accounts`: Listado de cuentas con saldo de apertura (`account_id`, nombre y saldo).
- **Pendiente de integración:**
  - 🟡 **Transacciones:** Mostrar el historial de transacciones o movimientos realizados en SUMA 21 (ventas, pagos, donaciones).
  - 🟡 **Flujo de Checkout / Salidas:** Definir si se habilitará la pasarela de pagos (Wompi) o si se registrarán ventas/salidas directamente vía `POST /api/suma21/sales`.

## 2. Anamnesis (vinculada a Beneficiarios — `children`)
- **Estado:** 🟡 Pendiente de clarificación.
- **Situación:** el Swagger actual no expone ningún endpoint ni esquema de anamnesis.
- **Por aclarar:**
  1. Campos requeridos (antecedentes perinatales, desarrollo, familiares, médicos, etc.).
  2. Si será un endpoint nuevo o se extenderá `/child-records` o `/child-internal-descriptions`.
  3. Quién puede registrarla/consultarla (roles).
