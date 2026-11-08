# Registro de Tareas Pendientes - SAGA-UP Frontend

Este documento centraliza los módulos, integraciones o requerimientos que quedan en espera de definición de contratos, especificaciones o fases posteriores del proyecto.

---

## 1. Módulo de Integración con SUMA 21
- **Rutas asociadas:**
  - Proxy en backend: `/api/suma21/...`
  - Documentación Swagger vía Saga-UP: `https://saga-up-backend-lr4u.onrender.com/api-docs/suma21/`
  - Documentación directa de SUMA 21: `https://suma21-backend.onrender.com/api-docs/`
- **Estado:** 🟡 Pendiente de activación en frontend.
- **Descripción:**
  Integración con la plataforma externa SUMA 21 a través de los endpoints proxy expuestos por el backend de Saga-UP. Queda en espera mientras se consolidan los flujos de sincronización de datos o donaciones entre ambas plataformas.

---

## 2. Módulo / Ficha de Anamnesis (Vinculada a Beneficiarios - `children`)
- **Módulo asociado:** Beneficiarios (`children`).
- **Estado:** 🟡 Pendiente de especificación y requerimientos detallados.
- **Descripción:**
  Se requiere implementar el registro y consulta de la **Anamnesis** (historia clínica/psicosocial y de desarrollo evolutivo del niño o niña).
- **Acciones necesarias para desbloqueo:**
  1. Definición exacta de campos requeridos por el equipo pedagógico/psicológico (antecedentes perinatales, desarrollo motor, lenguaje, antecedentes familiares, etc.).
  2. Confirmación de endpoints correspondientes en el backend (si se gestionará bajo un nuevo endpoint `/children/:id/anamnesis` o dentro de `/child-records` / `/child-internal-descriptions`).

