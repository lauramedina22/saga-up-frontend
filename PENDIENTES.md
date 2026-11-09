# Pendientes - SAGA-UP Frontend

## 1. Integración con SUMA 21
- **Estado:** 🟢 Completado en Frontend (Productos, Inventario, Cuentas, Ventas y Donaciones).
- **Acceso:** siempre a través de nuestro backend (proxy), nunca directo a SUMA 21.
- **Documentación:**
  - Proxy Saga UP: https://saga-up-backend-lr4u.onrender.com/api-docs/suma21/
  - SUMA 21 directo: https://suma21-backend.onrender.com/api-docs/
- **Endpoints implementados en el frontend (`Sales.jsx`, `Donations.jsx` / `useSuma21.js`):**
  - ✅ `GET /api/suma21/products`: Catálogo visual con imágenes de Supabase, precios en COP y stock en tiempo real.
  - ✅ `GET /api/suma21/inventory`: Control de existencias de insumos e ítems (`inventory_item_id`, nombre, descripción y estado de disponibilidad).
  - ✅ `GET /api/suma21/accounts`: Listado de cuentas con saldo de apertura (`account_id`, nombre y saldo).
  - ✅ `GET /api/suma21/transactions/sales`: Historial de ventas aprobadas con monto, medio de pago, fecha y productos.
  - ✅ `GET /api/suma21/transactions/donations`: Pantalla dedicada de Donaciones con métricas, comprobantes y montos.

## 2. Ecosistema de Plataformas ("Más Servicios" — `Services.jsx`)
- **Estado:** 🟡 Pendiente de URLs de despliegue final.
- **Por actualizar:**
  - Reemplazar las URLs por defecto configuradas en `EXTERNAL_SERVICES` por los enlaces (URLs) oficiales de los frontends reales desplegados por cada equipo:
    1. **ASISCONNECTION** (Comunidad UP)
    2. **SUMA 21** (Donaciones y Ventas)
    3. **AULA UP** (Educación)
    4. **SON UP** (Seguimiento y Desarrollo)
    5. **LUPE** (Asistente IA para Proyectos y Convocatorias)

## 3. Formato de Horarios en Talleres (`Workshops.jsx` / Yeison)
- **Estado:** 🟡 Pendiente de formatear en la vista de Talleres.
- **Situación:** En la pantalla de Talleres y Turnos, los horarios se muestran con el formato crudo de PostgreSQL que incluye la fecha de época ficticia (ej. `1970-01-01T10:30:00.000Z - 1970-01-01T11:30:00.000Z`).
- **Por solucionar:** Aplicar la función de formateo (`formatTime` que extrae solo `HH:mm`) para que muestre únicamente la hora legible (ej. `10:30 - 11:30`).

## 4. Anamnesis (vinculada a Beneficiarios — `children`)
- **Estado:** 🟢 Resuelto en Frontend.
- **Implementación:** Mapeada directamente en el frontend sobre el campo `notes` de la tabla `children`. Ahora tanto en la visualización como en los modales de creación y edición se expone como **"Anamnesis"**.
