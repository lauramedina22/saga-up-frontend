# Distribución de Tareas Frontend - SAGA-UP

> Fuente: Swagger `https://saga-up-backend-lr4u.onrender.com/api-docs` (OpenAPI 3.0.3, revisado el 2026-11-08).
> Todas las rutas requieren `Authorization: Bearer <JWT>` (rol ADMIN salvo que se indique).

---

## Inventario: estado actual vs. Swagger

| Módulo / Endpoint | Frontend actual | Brecha |
|---|---|---|
| Catálogos (`/sexes`, `/document-types`, `/child-statuses`, `/legal-statuses`, `/guardianship-types`, `/payment-methods`, `/tuition-statuses`, `/staff-roles`, `/contract-types`, `/staff-statuses`) | Consumiendo endpoints reales del backend dinámicamente vía `catalogService.js` y `catalogModel.js` | ✅ Resuelto en L1 |
| `/staff` + `/staff/document/{number}` + `/staff/{id}/link-account` | Solo `GET`/`POST` dentro de la pestaña de `Workshops.jsx` | Falta vista dedicada, edición (`PUT`/`PATCH`), retiro (`DELETE`), búsqueda por cédula, vinculación de cuenta |
| `/interns` | No existe | Falta vista completa |
| `/staff-assistance` | Solo `GET`/`POST` (pestaña "Turnos" en `Workshops.jsx`) | Faltan filtros `staff_id`/`date_working`, edición y eliminación |
| `/children/document/{number}`, `/guardians/document/{number}` | Búsqueda solo local por texto | Falta búsqueda por cédula contra el backend |
| `/professionals` | No se consume | Falta CRUD de profesionales/talleristas |
| `/professionals-workshops` | Solo `GET`/`POST` | Faltan edición, eliminación y filtros |
| `/children-assistance` | Servicio existe, sin vista operativa | Falta pantalla de toma de asistencia |
| `/tuition` | Solo `GET`/`POST` | Faltan `PUT`/`PATCH`/`DELETE` |
| `/audit-logs` | No existe | Falta bitácora de auditoría (solo lectura, paginada) |

---

## Criterio de reparto
Cada quien continúa los módulos que ya construyó:
- **Laura:** Beneficiarios (`Children.jsx`), Acudientes (`Guardians.jsx`), Matrículas (`Enrollments.jsx`).
- **Yeison:** Dashboard (`Dashboard.jsx`) y Talleristas (`Workshops.jsx`: personal, talleres, horarios, turnos).

## Laura — Catálogos, beneficiarios, acudientes y matrículas

| # | Tarea | Endpoints | Esfuerzo | Estado |
|---|---|---|---|:---:|
| L1 | Catálogos dinámicos desde las tablas intermedias del backend (`catalogService.js`, `useCatalogs.js`, consumidores) | 10 endpoints de catálogo | Alto | ✅ **Completado** |
| L2 | Búsqueda por cédula en Beneficiarios y Acudientes | `/children/document/{number}`, `/guardians/document/{number}` | Bajo | ✅ **Completado** |
| L3 | Matrículas: completar CRUD (editar, eliminar, estados) | `/tuition` | Bajo | ✅ **Completado** |
| L4 | Toma de asistencia a talleres por beneficiario (`Children.jsx` + `ChildrenAssistanceDialog`) | `/children-assistance` (+ lectura de `/professionals-workshops`) | Medio | ✅ **Completado** |
| L5 | Bitácora de auditoría (`AuditLogs.jsx`) | `/audit-logs` | Medio | ⏳ Pendiente |
| L6 | Módulo de Practicantes (`Interns.jsx`) | `/interns` | Medio | ⏳ Pendiente |

## Yeison — Dashboard, talleristas y personal

| # | Tarea | Endpoints | Esfuerzo | Estado |
|---|---|---|---|:---:|
| Y1 | Módulo de Personal: CRUD completo, búsqueda por cédula, vincular/desvincular cuenta | `/staff`, `/staff/document/{number}`, `/staff/{id}/link-account` | Alto | ⏳ Pendiente |
| Y2 | Profesionales/talleristas + edición/eliminación de horarios | `/professionals`, `/professionals-workshops` | Alto | ⏳ Pendiente |
| Y3 | Asistencia de personal completa (filtros, editar, eliminar) | `/staff-assistance` | Medio | ⏳ Pendiente |
| Y5 | Actualizar Dashboard con los nuevos módulos | Lectura de los anteriores | Bajo | ⏳ Pendiente |

> [!NOTE]
> L1 es dependencia de todos: cuando esté integrado en `main`, Yeison debe consumir catálogos (`staff_roles`, `contract_types`, `staff_statuses`, `document_types`) únicamente vía `useCatalogs`, sin IDs en duro.

## Fuera de alcance por ahora
- Integración SUMA 21 y Anamnesis → ver `PENDIENTES.md`.
- Flujos de autorregistro por rol (`/staff/register`, `/children/register`, `/guardians/register`, `/*/link-account` sin `{id}`): requieren JWT de TALLERISTA / ESTUDIANTE / ACUDIENTE, no de ADMIN.
