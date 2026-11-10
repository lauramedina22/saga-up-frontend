# Documentación de SAGA UP

Este documento es la puerta de entrada a toda la documentación del servidor de SAGA UP. Aquí encontrará qué es el proyecto, qué documentos existen y por cuál conviene empezar según lo que usted necesite.

ASISCO UP es una fundación, y SAGA UP es el sistema que utiliza para su administración y gestión. Este proyecto, llamado saga-up-backend, es el servidor del sistema: guarda la información y se la entrega a las aplicaciones por medio de una API. Con él se gestionan los niños, los acudientes, el personal, los talleres, las asistencias, las mensualidades y las listas de opciones (catálogos).

Además, el servidor sirve de puente protegido hacia Suma21, un servicio externo que maneja donaciones, inventario, productos, ventas, pagos y transacciones.

---

## 1. Datos del proyecto

- **Nombre:** saga-up-backend, versión 1.0.0.
- **Lenguaje:** TypeScript, sobre Node.js con módulos ESM.
- **Servidor web:** Express 5.
- **Acceso a la base de datos:** Prisma 7, con el adaptador para PostgreSQL.
- **Base de datos:** PostgreSQL, en el esquema saga_up alojado en Supabase.
- **Inicio de sesión:** tokens JWT firmados con HS256, que el propio servidor verifica con la clave JWT_SECRET.
- **Documentación interactiva:** en /api-docs (y su versión JSON en /api-docs.json). La de Suma21 está en /api-docs/suma21.
- **Publicación:** en Render, según el archivo [render.yaml](./render.yaml).
- **Repositorio:** la rama principal es production. Los cambios se proponen sobre master.

---

## 2. Por dónde empezar

**Si es un desarrollador que llega al proyecto,** lea las secciones 1 a 6 del [Manual Técnico](./MANUAL-TECNICO.md).

**Si se encarga de publicar y mantener el servidor en funcionamiento,** lea la sección de publicación del [Manual Técnico](./MANUAL-TECNICO.md) y la [guía de despliegue en Render](./DESPLIEGUE-RENDER.md).

**Si trabaja en la fundación y usa el sistema en su día a día,** lea el [Manual de Usuario](./MANUAL-USUARIO.md). No requiere conocimientos técnicos.

**Si construye el sitio web u otra aplicación que usa la API,** empiece por la sección 17 del [Manual Técnico](./MANUAL-TECNICO.md) y apóyese en la documentación interactiva de /api-docs.

**Si es responsable de la seguridad o del inicio de sesión,** consulte el documento sobre el [servicio de seguridad](./SECURITY_SERVER.md) y el de [permisos por rol](./SAGA_ROLES_POR_ENDPOINT.md).

**Si necesita conocer cada ruta en detalle,** vaya a la [referencia de la API](./API.md).

**Si va a agregar una ruta nueva,** siga el [tutorial para crear rutas](./TUTORIAL-ENDPOINTS.md).

---

## 3. Documentos disponibles

- **[DOCUMENTACION.md](./DOCUMENTACION.md):** este documento, la guía general.
- **[MANUAL-TECNICO.md](./MANUAL-TECNICO.md):** cómo está construido el servidor, cómo instalarlo, configurarlo y publicarlo, cómo está organizada la base de datos y cómo usar la API desde el frontend.
- **[MANUAL-USUARIO.md](./MANUAL-USUARIO.md):** guía para el personal de la fundación: qué hace el sistema, qué ve cada persona, cuidados y problemas frecuentes.
- **[API.md](./API.md):** la descripción detallada de cada ruta.
- **[TUTORIAL-ENDPOINTS.md](./TUTORIAL-ENDPOINTS.md):** paso a paso para agregar una ruta nueva.
- **[SECURITY_SERVER.md](./SECURITY_SERVER.md):** cómo se conecta el sistema con el servicio de seguridad que entrega los tokens.
- **[SAGA_ROLES_POR_ENDPOINT.md](./SAGA_ROLES_POR_ENDPOINT.md):** qué rol puede usar cada ruta.
- **[GUIA-SUPABASE-LOGIN-REGISTRO.md](./GUIA-SUPABASE-LOGIN-REGISTRO.md):** cómo funcionan el registro y el inicio de sesión con Supabase.
- **[DESPLIEGUE-RENDER.md](./DESPLIEGUE-RENDER.md):** cómo publicar el servidor en Render.
- **[COMMIT-CONVENTION.md](./COMMIT-CONVENTION.md):** las reglas para escribir los mensajes de los commits.
- **[ISSUE.md](./ISSUE.md):** la plantilla y el registro de problemas o tareas pendientes.

---

## 4. Direcciones útiles

- **Servidor en producción:** https://saga-up-backend-lr4u.onrender.com
- **Documentación interactiva de SAGA UP:** /api-docs
- **Documentación interactiva de Suma21:** /api-docs/suma21
- **Comprobar que el servidor y la base de datos funcionan:** /health o /test-connection
- **Comprobar que Suma21 funciona:** /api/suma21/health

---

## 5. Qué cubre el sistema

**Personas.** Niños, acudientes, personal, profesionales y practicantes.

**Relaciones.** El vínculo entre cada niño y sus acudientes, con su tipo y su vigencia, y la asignación de profesionales a los talleres.

**Parte pedagógica.** Los talleres y la asistencia tanto de los niños como del personal.

**Expedientes.** Las historias clínicas de los niños y sus notas internas confidenciales.

**Parte financiera.** Las pensiones o mensualidades.

**Listas de opciones (catálogos).** Sexos, tipos de documento, estados del niño, tipos de contrato, roles del personal, estados del personal, tipos de acudencia, estados legales, métodos de pago y estados de pensión. Solo se pueden consultar.

**Auditoría.** La bitácora con los cambios hechos en el sistema, que también es solo de consulta.

**Conexión con Suma21.** Cuentas, donaciones, inventario, métodos de pago, pagos, productos, ventas y transacciones, usando la misma sesión de SAGA UP.

**Registro de personas.** Niños, acudientes y personal pueden registrarse por su cuenta, y su registro queda enlazado automáticamente con la cuenta que usan para iniciar sesión.
