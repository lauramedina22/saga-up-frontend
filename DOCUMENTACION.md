# Documentación del Frontend de SAGA UP

Este documento es la puerta de entrada a toda la documentación de la aplicación web (frontend) de SAGA UP. Aquí encontrará qué es el proyecto, qué documentos existen y por cuál conviene empezar según lo que usted necesite.

ASISCO UP es una fundación, y SAGA UP es el sistema que utiliza para su administración y gestión. Este proyecto, llamado `saga-up-frontend`, es la interfaz visual del sistema: el sitio web desde el cual el equipo administrativo, los talleristas y los colaboradores registran y consultan la información de los niños beneficiarios, sus acudientes, el personal, los talleres, las asistencias, las matrículas y la bitácora de auditoría.

Además, la aplicación se conecta con el puente de Suma21 para mostrar en tiempo real el catálogo de la Tienda Solidaria, el inventario, las ventas y las donaciones, e integra un directorio directo hacia las demás plataformas del ecosistema de la fundación.

---

## 1. Datos del proyecto

- **Nombre:** `saga-up-frontend`, versión 1.0.0.
- **Librería de interfaz:** React 19 (`^19.3.1`), con módulos ESM.
- **Empaquetador y servidor de desarrollo:** Vite 8 (`^8.3.4`), con soporte de HTTPS local mediante `@vitejs/plugin-basic-ssl`.
- **Enrutamiento:** React Router DOM v7 (`^7.18.4`).
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/vite`).
- **Inicio de sesión y sesión:** autenticación contra el servicio de seguridad externo (`VITE_AUTH_API_URL`), almacenando el token JWT en `sessionStorage` bajo la clave `saga-up-session`.
- **Consumo de datos:** peticiones REST en JSON hacia el backend de negocio (`VITE_API_URL`), enviando automáticamente el encabezado `Authorization: Bearer <token>`.
- **Repositorio:** la rama principal estable es `main`. Cada funcionalidad se desarrolla en ramas `feature/<modulo>` o `fix/<modulo>`.

---

## 2. Por dónde empezar

**Si es un desarrollador que llega al proyecto,** lea las secciones 1 a 8 del [Manual Técnico](./MANUAL-TECNICO.md) y revise las reglas de arquitectura en [AGENTS.md](./AGENTS.md).

**Si se encarga de publicar y mantener la aplicación en funcionamiento,** lea la sección de publicación del [Manual Técnico](./MANUAL-TECNICO.md) y la [guía de despliegue en Render](./DESPLIEGUE-RENDER.md).

**Si trabaja en la fundación y usa el sistema en su día a día,** lea el [Manual de Usuario](./MANUAL-USUARIO.md). Está explicado paso a paso desde las pantallas y no requiere conocimientos técnicos.

**Si necesita conocer los contratos del servidor que consume esta aplicación,** consulte la [referencia de la API](./API.md) o la documentación interactiva del backend en `/api-docs`.

**Si va a crear o modificar pantallas,** siga la sección 13 del [Manual Técnico](./MANUAL-TECNICO.md) y las convenciones de commits en [COMMIT-CONVENTION.md](./COMMIT-CONVENTION.md).

---

## 3. Documentos disponibles

- **[DOCUMENTACION.md](./DOCUMENTACION.md):** este documento, la guía general del frontend.
- **[MANUAL-TECNICO.md](./MANUAL-TECNICO.md):** cómo está construida la aplicación en React, cómo instalarla, configurarla y compilarla, cómo funciona su arquitectura en capas (`screens`, `hooks`, `services`, `models`, `api`) y cómo agregar pantallas nuevas.
- **[MANUAL-USUARIO.md](./MANUAL-USUARIO.md):** guía práctica para el personal de la fundación: cómo iniciar sesión, cómo navegar desde computador o celular y cómo usar cada pantalla del sistema.
- **[AGENTS.md](./AGENTS.md):** estándares de arquitectura modular, reglas de ramas y flujo de trabajo del repositorio.
- **[API.md](./API.md):** referencia detallada de las rutas del backend que consume el frontend.
- **[DESPLIEGUE-RENDER.md](./DESPLIEGUE-RENDER.md):** guía de publicación y configuración de orígenes permitidos (`CORS_ORIGINS`) en Render.
- **[COMMIT-CONVENTION.md](./COMMIT-CONVENTION.md):** reglas para redactar los mensajes de los commits siguiendo Conventional Commits.
- **[PENDIENTES.md](./PENDIENTES.md):** registro actualizado del estado de integración con Suma21, enlaces del ecosistema y ajustes pendientes.
- **[TAREAS.md](./TAREAS.md):** distribución de tareas por módulos e inventario de cobertura frente a la API.

---

## 4. Direcciones útiles

- **Backend de negocio en producción (`VITE_API_URL`):** `https://saga-up-backend-lr4u.onrender.com`
- **Servicio de autenticación (`VITE_AUTH_API_URL`):** `https://proyecto-integrador-backend-g2.onrender.com`
- **Documentación interactiva del backend (Swagger):** `https://saga-up-backend-lr4u.onrender.com/api-docs`
- **Documentación interactiva de Suma21:** `https://saga-up-backend-lr4u.onrender.com/api-docs/suma21`
- **Servidor de desarrollo local (Vite):** `https://localhost:5173` (o `http://localhost:5173`)

---

## 5. Qué cubre la aplicación web

**Acceso y seguridad (`/login`, `/register`).** Pantallas para iniciar sesión con correo y contraseña, y para registrar nuevas cuentas de usuario con validación de contraseña segura.

**Inicio / Panel principal (`/`).** Resumen general con indicadores de beneficiarios, acudientes, talleres y matrículas, alertas prioritarias de salud y atención, distribución de la población atendida y accesos rápidos.

**Beneficiarios (`/children`).** Listado con filtro entre activos y retirados, búsqueda por nombre o documento, registro de nuevos beneficiarios y expediente individual dividido en seis pestañas: *General (incluyendo Anamnesis)*, *Acudientes*, *Salud*, *Asistencia*, *Rutina & Pedagogía* y *Pagos*.

**Acudientes (`/guardians`).** Gestión de familiares y responsables legales, con su situación jurídica y vinculación directa a los beneficiarios a su cargo.

**Matrículas (`/enrollments`).** Control de pagos de matrículas y mensualidades, con indicadores de recaudo total, filtros por estado de pago y registro, edición o eliminación de cobros.

**Talleristas y Talleres (`/workshops`).** Gestión del catálogo de talleres, asignación de horarios a profesionales, programación semanal y toma de asistencia.

**Personal y Practicantes (`/staff`, `/interns`).** Administración del equipo humano de la fundación, control de contratos, estado laboral, vinculación de cuentas, registro de turnos de asistencia y seguimiento de practicantes universitarios.

**Tienda Solidaria (`/sales`) y Donaciones (`/donations`).** Consulta en tiempo real de productos, existencias de inventario, cuentas, ventas aprobadas y donaciones monetarias provenientes de Suma21.

**Auditoría (`/audit-logs`).** Bitácora de solo lectura para consultar las creaciones, modificaciones y eliminaciones realizadas en el sistema, con filtros por tipo de acción y buscador.

**Más Servicios (`/services`).** Directorio visual con acceso directo a las plataformas del ecosistema de la fundación: ASISCONNECTION, SUMA 21, AULA UP, SON UP, LUPE y el Podcast oficial en Spotify.

