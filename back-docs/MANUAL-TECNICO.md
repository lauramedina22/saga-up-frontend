# Manual Técnico de SAGA UP

Este manual es para el equipo de desarrollo y de operaciones que mantiene, amplía o publica el sistema de SAGA UP.

---

## 1. Visión general

SAGA UP es el sistema de administración y gestión de la Fundación ASISCO UP. Este repositorio contiene su servidor (backend): la parte que guarda la información y se la entrega a las aplicaciones por medio de una API REST.

El servidor está construido con Node.js, Express 5 y TypeScript, usando módulos ESM. Los datos se guardan en PostgreSQL, en el esquema saga_up alojado en Supabase, y se consultan con Prisma 7. La API está documentada con Swagger. Además, el servidor sirve de puente protegido hacia Suma21, un servicio externo.

El servidor no guarda sesiones. Cada petición trae un token JWT firmado con el algoritmo HS256, y el propio servidor lo verifica.

### 1.1 Objetivos

- Centralizar el registro de niños, acudientes y personal de la fundación.
- Apoyar la parte pedagógica: talleres, asistencia y expedientes.
- Manejar la información financiera de las pensiones.
- Enlazar las cuentas del servicio de seguridad externo con las personas registradas, por medio del campo security_user_id.
- Ofrecer un único punto de acceso protegido hacia Suma21.

### 1.2 Características principales

- Solo acepta peticiones de sitios web autorizados uno por uno, con su dirección exacta (CORS).
- Controla el acceso por roles (ADMIN, TALLERISTA, ESTUDIANTE, ACUDIENTE y DONANTE). En los módulos de personas, además, filtra qué registros puede ver cada usuario.
- Al eliminar niños o personal no borra el registro: marca su fecha de salida (exit_date).
- Cada tabla guarda quién creó y quién modificó cada registro, y cuándo. También hay una bitácora de auditoría (audit_logs) de solo lectura.
- Los identificadores numéricos grandes (BigInt) siempre se devuelven como texto.
- La documentación OpenAPI 3 está en /api-docs para SAGA UP y en /api-docs/suma21 para Suma21.

---

## 2. Arquitectura

### 2.1 Cómo se conectan las piezas

Las aplicaciones (el sitio web o la app) envían sus peticiones al servidor Express. Antes de llegar a su destino, cada petición pasa por una serie de filtros (middlewares), en este orden: el control de origen (CORS), la lectura del cuerpo en JSON, la verificación del token (requireAuth), la verificación del rol cuando la ruta lo exige (requireRole) y, al final, el manejador de errores.

Si la petición es para un módulo de SAGA UP (niños, acudientes, personal, pensiones, talleres, asistencias, auditoría o catálogos), pasa al controlador de ese módulo. El controlador usa el cliente de Prisma para leer o escribir en la base de datos PostgreSQL de Supabase.

Si la petición empieza por /api/suma21, no toca la base de datos: el servicio de puente (suma21-proxy) la reenvía a Suma21, en https://suma21-backend.onrender.com, con el mismo token.

En resumen, el recorrido normal es: la aplicación, los filtros de Express, el controlador, Prisma y la base de datos.

### 2.2 Dónde está cada cosa en el código

- **src/server.ts:** arranca el servidor, atiende las señales de apagado (SIGINT y SIGTERM) y cierra la conexión de Prisma.
- **src/app.ts:** arma la aplicación Express: CORS, lectura de JSON, Swagger, el enrutador general, la respuesta para rutas inexistentes y el manejador de errores.
- **src/config.ts:** lee y valida las variables de entorno.
- **src/routes/:** un archivo por módulo, donde se declaran las rutas y su documentación para Swagger.
- **src/routes/router.ts:** monta cada módulo en su ruta y le aplica la verificación del token.
- **src/controllers/:** la lógica de cada módulo: validar lo que llega, consultar la base de datos y manejar errores.
- **src/middleware/auth.ts:** verificación del token y control por roles.
- **src/middleware/cors.ts:** la lista de sitios web autorizados.
- **src/middleware/error-handler.ts:** convierte los errores de Prisma y los propios en respuestas HTTP.
- **src/errors/api-error.ts:** la clase ApiError, que guarda un código y un mensaje, y sus funciones de apoyo.
- **src/errors/parsers.ts:** funciones para validar los datos que llegan (textos obligatorios, fechas opcionales, identificadores, etc.).
- **src/services/security-server.ts:** verificación local del token con JWT_SECRET.
- **src/services/suma21-proxy.ts:** el puente hacia Suma21, que reenvía también el token.
- **src/services/person-account-link.ts:** el enlace entre las cuentas de seguridad y los registros de personas.
- **src/services/person-read-access.ts:** las reglas de qué puede ver cada rol.
- **src/docs/swagger.ts:** genera la documentación OpenAPI y la une con la de Suma21.
- **src/prisma.ts:** la única instancia del cliente de Prisma.
- **prisma/schema.prisma:** el modelo de datos.
- **prisma/migrations/:** las migraciones SQL, en orden.
- **generated/prisma/:** el cliente de Prisma generado. No se sube al repositorio.

### 2.3 Recorrido de una petición

1. **Control de origen.** Se revisa de qué sitio web viene la petición. Si no está autorizado, se responde 403.
2. **Lectura del cuerpo.** El contenido se interpreta como JSON.
3. **Enrutamiento.** Según el comienzo de la ruta, la petición se envía al módulo que corresponde.
4. **Verificación del token (requireAuth).** Se toma el token del encabezado Authorization y se comprueba su firma con JWT_SECRET. La comparación se hace en tiempo constante, para no dar pistas a un atacante. Luego se revisan la fecha de vencimiento, la fecha desde la cual es válido, el identificador del usuario y sus roles, y los datos del usuario quedan disponibles para el resto del proceso (req.user).
5. **Verificación del rol (requireRole).** Si la ruta exige un rol y el usuario no lo tiene, se responde 403.
6. **Controlador.** Valida el cuerpo (los campos desconocidos se rechazan con 400), hace la operación en la base de datos respetando lo que el rol puede ver y responde en JSON.
7. **Manejo de errores.** Cuando Prisma no encuentra un registro (P2025) se responde 404. Cuando hay un dato repetido o una relación que impide la operación (P2002 o P2003) se responde 409. Cuando la base de datos no está disponible (errores P10xx) se responde 503. Los errores propios (ApiError) se responden con el código que traen.

---

## 3. Requisitos

### 3.1 Programas

- Node.js 20 LTS (recomendado). La herramienta tsx necesita al menos la versión 18.
- npm 10.
- PostgreSQL 15 o superior (en Supabase).
- Prisma 7, que se instala junto con las demás dependencias.

### 3.2 Red

El servidor necesita poder conectarse por HTTPS a Supabase y a Suma21 (https://suma21-backend.onrender.com, o la dirección que se configure en SUMA_21_API_URL).

---

## 4. Instalación en un equipo local

```bash
git clone <repositorio>
cd saga-up-backend
cp .env.example .env     # llenar los valores
npm install              # al terminar ejecuta prisma generate
npm run dev              # arranca en modo desarrollo
```

Comandos disponibles:

- **npm run dev:** arranca en modo desarrollo y se reinicia solo cada vez que cambia el código.
- **npm run build:** genera el cliente de Prisma y compila el proyecto.
- **npm start:** ejecuta la versión compilada.
- **npm run generate:** vuelve a generar el cliente de Prisma.
- **npm run typecheck:** revisa los tipos sin compilar.
- **npm run test:unit:** corre las pruebas unitarias.
- **npm test:** revisa los tipos y corre las pruebas unitarias.

### 4.1 Comprobar que funciona

```bash
curl http://localhost:3000/health
```

Si todo está bien, la respuesta indica que el servidor y la base de datos están en estado "ok".

---

## 5. Variables de entorno

**DATABASE_URL (obligatoria).** La conexión a PostgreSQL, apuntando al esquema saga_up. La contraseña debe ir codificada para URL y la conexión debe incluir sslmode=require.

**DIRECT_URL (solo para migraciones).** Una conexión directa, sin pasar por pgbouncer, que usa Prisma al migrar.

**JWT_SECRET (obligatoria en producción).** La clave compartida con el servicio de seguridad para verificar los tokens.

**CORS_ORIGINS (obligatoria en producción).** Las direcciones de los sitios web autorizados, separadas por coma. Cada una debe estar completa y exacta: sin rutas, sin asterisco y sin barra al final.

**SUMA_21_API_URL (opcional).** La dirección de Suma21. Si no se define, se usa https://suma21-backend.onrender.com.

**HOST (opcional).** La interfaz en la que escucha el servidor. Por defecto es 0.0.0.0.

**PORT (opcional).** El puerto. Por defecto es 3000.

**NODE_ENV (opcional).** Si vale production, las validaciones se vuelven más estrictas; por ejemplo, CORS_ORIGINS pasa a ser obligatoria.

**PUBLIC_URL (opcional).** La dirección pública que aparece en Swagger. Por defecto es https://saga-up-backend-lr4u.onrender.com.

**TRUST_PROXY_HOPS (opcional).** Reservada para cuando el servidor está detrás de un proxy.

Al arrancar, el servidor revisa que el puerto sea un número entero entre 1 y 65535, que cada dirección en CORS_ORIGINS empiece por http o https y no tenga ruta ni barra final, que CORS_ORIGINS no esté vacía en producción y que SUMA_21_API_URL, si se definió, sea una dirección válida. Si algo no cumple, el servidor no arranca.

---

## 6. Base de datos

### 6.1 Convenciones

- Hay un solo esquema: saga_up.
- Todas las tablas tienen los campos created_at, created_by, updated_at y updated_by.
- Los identificadores son números grandes (BigInt) que aumentan solos.
- Los catálogos (sexos, tipos de documento, estados del niño, etc.) tienen un código único y un nombre.
- Varias tablas tienen activada la seguridad por filas de PostgreSQL (los comentarios en prisma/schema.prisma lo indican). La aplicación, además, aplica sus propios filtros en person-read-access.ts.

### 6.2 Tablas principales

- **children:** los niños atendidos. Al eliminarlos se marca la fecha de salida.
- **guardians:** los acudientes.
- **staff:** el personal, incluidos talleristas y administradores. Al eliminarlos se marca la fecha de salida.
- **professionals:** el rol pedagógico de un miembro del personal.
- **workshops:** los talleres.
- **professionals_workshops:** qué profesional dicta cada taller.
- **children_assistance:** la asistencia de los niños por sesión. Cada niño tiene un solo registro por sesión.
- **staff_assistance:** la asistencia diaria del personal, con hora de entrada y de salida guardadas como número decimal.
- **children_guardians:** el vínculo entre niño y acudiente, con su tipo y vigencia.
- **child_records:** el expediente clínico. No se puede eliminar desde la API.
- **child_internal_description:** notas internas confidenciales. Tampoco se pueden eliminar desde la API.
- **tuition:** las pensiones mensuales.
- **interns:** los practicantes, vinculados a un miembro del personal.
- **audit_logs:** la bitácora de auditoría, de solo lectura.
- **Catálogos:** sexes, document_types, child_statuses, contract_types, staff_roles, staff_statuses, guardianship_types, legal_statuses, payment_methods y tuition_statuses. Desde la API solo se pueden consultar.

### 6.3 Enlace con el servicio de seguridad

Las tablas children, guardians y staff tienen el campo security_user_id, que no se puede repetir. Allí se guarda el identificador del usuario que aparece en el token (sub), y así se sabe qué cuenta corresponde a qué persona registrada.

El enlace se crea de tres maneras:

- Automáticamente, cuando la persona se registra en /staff/register, /children/register o /guardians/register.
- Por la misma persona, con /staff/link-account, /children/link-account o /guardians/link-account.
- Por el administrador, con la ruta /:id/link-account de cada módulo (POST para enlazar y DELETE para quitar el enlace).

### 6.4 Migraciones

```bash
# Aplicar las migraciones pendientes
npx prisma migrate deploy

# Crear una migración nueva (requiere DIRECT_URL)
npx prisma migrate dev --name mi_cambio

# Volver a generar el cliente
npx prisma generate
```

Migraciones actuales:

- 20261108170000_link_staff_security_user
- 20261108190000_link_child_guardian_security_users

### 6.5 Carga de catálogos

La API no permite crear ni modificar catálogos. Eso se hace directamente en la base de datos, con SQL o con un script aparte.

---

## 7. Autenticación y permisos

### 7.1 El token

El token usa el algoritmo HS256 y debe traer tres datos obligatorios: sub, el identificador del usuario en el servicio de seguridad; roles, la lista de roles del usuario; y exp, la fecha de vencimiento, que debe ser futura. De manera opcional puede traer nbf (desde cuándo es válido), email y username.

Se envía en el encabezado Authorization, con la palabra Bearer antes del token.

### 7.2 Cómo se verifica

La verificación está en src/services/security-server.ts. El servidor lee el encabezado y el contenido del token, rechaza cualquier token que no use HS256, comprueba la firma en tiempo constante, revisa las fechas de vencimiento y de inicio, y deja los datos del usuario disponibles en req.user.

### 7.3 Errores

- **401:** el encabezado no llegó o está mal escrito, la firma no es válida o el token venció.
- **403:** el token no trae el rol que exige la ruta, o el sitio web de origen no está autorizado.
- **503:** falta configurar JWT_SECRET.

### 7.4 Roles

ADMIN, TALLERISTA, ESTUDIANTE, ACUDIENTE y DONANTE.

### 7.5 Qué puede ver cada rol en los módulos de personas

El administrador y el tallerista ven a todos los niños, todos los acudientes y todos los vínculos entre ellos.

El estudiante solo ve su propio registro, sus acudientes y sus vínculos vigentes.

El acudiente solo ve su propio registro, los niños con quienes tiene un vínculo vigente y sus vínculos vigentes.

En personal y profesionales, el administrador ve a todos y el tallerista solo se ve a sí mismo. El estudiante y el acudiente no tienen acceso.

El donante no tiene acceso a ninguno de estos módulos.

La búsqueda por número de documento respeta las mismas reglas. Si un registro está fuera de lo que el usuario puede ver, se responde 404.

**Importante:** estas reglas solo aplican a las consultas y a las rutas de enlace de cuentas. Crear, modificar y eliminar en la mayoría de módulos solo exige haber iniciado sesión, sin importar el rol. Si se quiere restringir, hay que acordarlo y agregar los filtros correspondientes. El detalle completo está en [SAGA_ROLES_POR_ENDPOINT.md](./SAGA_ROLES_POR_ENDPOINT.md).

---

## 8. Sitios web autorizados (CORS)

La configuración está en src/middleware/cors.ts y funciona así:

- La lista de sitios autorizados es la que se define en CORS_ORIGINS.
- Se permiten los métodos GET, HEAD, POST, PUT, PATCH, DELETE y OPTIONS.
- Se permiten los encabezados Authorization y Content-Type.
- Las consultas previas del navegador (OPTIONS) se responden con 204.
- Las peticiones que no indican su origen, como las revisiones internas de Render, pasan sin restricción.
- Si el origen no está autorizado, se responde 403 con el mensaje "Origin is not allowed by CORS".

---

## 9. Conexión con Suma21

Todo lo de Suma21 está bajo /api/suma21. El puente funciona así:

1. Verifica el token en el propio servidor, salvo en /api/suma21/health y /api/suma21/payments/wompi/events, que son públicas.
2. Reenvía la petición a Suma21 con el mismo cuerpo, los mismos parámetros y los encabezados Authorization, Content-Type y Accept.
3. Si se están subiendo archivos, los reenvía a medida que llegan, sin esperar a recibirlos completos.
4. De la respuesta de Suma21 conserva los encabezados de tipo de contenido, descarga, caché, versión, ubicación y tiempo de espera para reintentar.
5. Si no logra comunicarse con Suma21, responde 502 con el mensaje "Suma21 service is unreachable".
6. Si la respuesta de Suma21 no se puede leer, responde 502 con el mensaje "Suma21 service returned an unreadable response".

La documentación de Suma21 está en /api-docs/suma21 y /api-docs/suma21.json. Se genera a partir del archivo api-implementation/suma21/gameup-swagger.json.

---

## 10. Publicación

### 10.1 Render (producción actual)

La configuración está en el archivo [render.yaml](./render.yaml):

- Es un servicio web de Node en el plan gratuito.
- Para compilar ejecuta npm ci --include=dev y luego npm run build.
- Para arrancar ejecuta npm start.
- Revisa la salud del servicio en /health.
- Las variables DATABASE_URL, DIRECT_URL y JWT_SECRET se configuran desde el panel de Render.
- Las variables NODE_ENV (production), HOST (0.0.0.0), TRUST_PROXY_HOPS (1) y CORS_ORIGINS (la lista de sitios autorizados) están fijas en el archivo.

Pasos para publicar:

1. Unir los cambios a la rama que vigila Render (production).
2. Render instala las dependencias y compila.
3. Si hay migraciones pendientes, ejecutar npx prisma migrate deploy a mano antes de recibir tráfico.
4. Render arranca el servidor.
5. Revisar /health y los registros del servicio.

Hay más detalles en [DESPLIEGUE-RENDER.md](./DESPLIEGUE-RENDER.md).

### 10.2 Publicación manual en otro proveedor

```bash
npm ci
npm run build
NODE_ENV=production \
  DATABASE_URL=... \
  JWT_SECRET=... \
  CORS_ORIGINS=https://mi-frontend.ejemplo.com \
  node dist/src/server.js
```

Cuando el proceso recibe una señal de apagado (SIGINT o SIGTERM), cierra el servidor y la conexión de Prisma de forma ordenada.

---

## 11. Monitoreo y operación

- **Registros:** al arrancar, el servidor muestra el puerto y si la verificación de tokens quedó configurada. Si falla al apagarse, también lo registra. Se recomienda enviar estos registros a la herramienta de centralización del proveedor.
- **Métricas:** esta versión no exporta métricas.
- **Salud:** las rutas /health y /test-connection hacen una consulta mínima a la base de datos para confirmar que responde.
- **Auditoría:** la tabla audit_logs la llenan procesos internos y disparadores de la base de datos.

---

## 12. Convenciones de código

- Todas las respuestas devuelven los BigInt como texto. Esto se configura en src/app.ts.
- Los campos de control (created y updated) nunca se toman del cuerpo de la petición; los maneja el servidor.
- Si el cuerpo trae campos desconocidos, se responde 400.
- Los filtros por identificador aceptan números enteros positivos escritos como texto.

Equivalencias entre errores de Prisma y respuestas HTTP:

- **400:** datos inválidos (validación propia) o una referencia a un registro que no existe (P2003).
- **404:** registro no encontrado (P2025).
- **409:** dato repetido (P2002) o un registro que no se puede borrar porque otro depende de él (P2003).
- **503:** base de datos no disponible (P10xx).

Las reglas para escribir los mensajes de los commits están en [COMMIT-CONVENTION.md](./COMMIT-CONVENTION.md).

---

## 13. Pruebas

```bash
npm run typecheck     # solo revisa tipos
npm run test:unit     # pruebas de validaciones, autenticación y CORS
npm test              # las dos anteriores
```

- No hay pruebas de integración contra la base de datos, porque la instancia de Supabase es compartida.
- La función createRequireAuth permite usar una clave de prueba en lugar de la real.
- Cada archivo de prueba está junto al archivo que prueba y termina en .test.ts.

---

## 14. Cómo agregar una nueva ruta

La guía completa está en [TUTORIAL-ENDPOINTS.md](./TUTORIAL-ENDPOINTS.md). En resumen:

1. Si hace falta, agregar el modelo en schema.prisma y crear la migración.
2. Crear el controlador en src/controllers, con las funciones para listar, consultar, crear, reemplazar, actualizar y eliminar.
3. Crear el archivo de rutas en src/routes y documentar cada ruta para Swagger.
4. Registrar las rutas en src/routes/router.ts con la verificación del token (y del rol, si aplica).
5. Escribir las pruebas unitarias.
6. Revisar en /api-docs, en el equipo local, que todo aparezca bien.

---

## 15. Riesgos conocidos y pendientes

- **Escrituras sin control de rol.** Casi todas las operaciones de crear, modificar y eliminar solo exigen haber iniciado sesión. No se debe suponer que están limitadas al administrador.
- **Donantes.** No existe una tabla de donantes; el único rastro es el campo time_donor en professionals. Crear una ruta para donantes requiere primero decidir cómo se va a modelar.
- **Horas de asistencia del personal.** Las horas de entrada y salida se guardan como número decimal, y no está definido si representan horas trabajadas o la hora del reloj en formato de 24 horas.
- **Pruebas de integración.** No existen, porque no hay una base de datos separada para pruebas.

---

## 16. Documentos relacionados

- [API.md](./API.md): detalle de todas las rutas.
- [MANUAL-USUARIO.md](./MANUAL-USUARIO.md): guía para el personal de la fundación, sin contenido técnico.
- [SECURITY_SERVER.md](./SECURITY_SERVER.md): el servicio que emite los tokens.
- [SAGA_ROLES_POR_ENDPOINT.md](./SAGA_ROLES_POR_ENDPOINT.md): permisos por rol en cada ruta.
- [TUTORIAL-ENDPOINTS.md](./TUTORIAL-ENDPOINTS.md): cómo agregar rutas nuevas.
- [DESPLIEGUE-RENDER.md](./DESPLIEGUE-RENDER.md): publicación en Render.
- [GUIA-SUPABASE-LOGIN-REGISTRO.md](./GUIA-SUPABASE-LOGIN-REGISTRO.md): registro e inicio de sesión con Supabase.

---

## 17. Guía para quien desarrolla el frontend

Esta sección reúne lo que necesita saber quien construye el sitio web o la app que usa la API. El detalle de cada ruta está en [API.md](./API.md) y en /api-docs.

### 17.1 Reglas generales

- La información se envía y se recibe en JSON.
- Todas las rutas protegidas piden el token en el encabezado Authorization, con la palabra Bearer antes del token.
- Los identificadores se envían como texto: "1" y no 1.
- Las fechas van en formato ISO: 2026-11-05, o 2026-11-05T14:21:00Z cuando incluyen la hora.
- Si se envía un campo que no está documentado, la petición se rechaza con 400.
- Nunca se envían los campos de control (created y updated) ni security_user_id. Si se envían, se responde 400.
- Eliminar un niño o un miembro del personal solo marca la fecha de salida. En los demás módulos, eliminar es definitivo.
- PUT reemplaza el registro completo y exige todos los campos obligatorios. PATCH cambia solo los campos enviados y exige al menos uno.

### 17.2 Respuestas

- **200, 201 y 204:** la operación salió bien (201 indica que se creó un registro; 204, que no hay contenido para mostrar).
- **400:** datos inválidos, un campo desconocido o una referencia a algo que no existe.
- **401:** falta el token, está mal escrito, la firma no es válida o venció. Hay que volver a iniciar sesión.
- **403:** el usuario no tiene el rol necesario, o el sitio web de origen no está autorizado.
- **404:** el registro no existe o el usuario no tiene permiso para verlo. Debe tratarse siempre como "fuera de alcance".
- **409:** dato repetido o un registro que otro todavía usa.
- **502:** falla al comunicarse con Suma21. Se recomienda reintentar más tarde.
- **503:** base de datos no disponible o falta JWT_SECRET.

Los errores que devuelve Suma21 (401, 403 y otros) se pasan tal cual.

### 17.3 Registro de personas

Los niños se registran con POST /children/register, enviando first_name, last_name, document_type_id y document_number. Los talleristas usan POST /staff/register y los acudientes POST /guardians/register (también existe /api/guardians/register). En los dos últimos casos se envían full_name, document_type_id y document_number.

Si la persona no existía, se crea y se enlaza a la cuenta del token, y se responde 201. Si ya existía con ese documento, solo se enlaza la cuenta, sin modificar ningún otro dato, y se responde 200. Si el documento ya está enlazado a otra cuenta, o la cuenta ya está enlazada a otra persona, se responde 409.

### 17.4 Enlace de cuentas

Para que una persona ya registrada enlace su cuenta por sí misma se usan POST /children/link-account (estudiante), POST /guardians/link-account (acudiente) y POST /staff/link-account (tallerista), enviando full_name, document_type_id y document_number. Si no hay coincidencias se responde 404. Si hay varias, o si el registro ya está enlazado a otra cuenta, se responde 409.

El administrador puede enlazar con POST /:id/link-account de cada módulo, enviando security_user_id, y desenlazar con DELETE sobre la misma ruta. También puede buscar a una persona por su cuenta con GET /security-user/:securityUserId de cada módulo.

### 17.5 Asistencia a talleres

Se registra con POST /children-assistance, enviando child_id, professional_workshop_id, will_assist, attended, complete_workshop y behavior. La pareja de niño y sesión no se puede repetir (409). Para corregir un registro existente se usa PATCH /children-assistance/:id.

### 17.6 Bitácora de auditoría

GET /audit-logs acepta filtros como table_name, staff_id (el identificador en la tabla staff, no el sub del token), from y limit. Por ejemplo: /audit-logs?table_name=children&from=2026-01-01&limit=50. La respuesta trae total, limit, offset y la lista de cambios (items).

### 17.7 Catálogos

Cada catálogo tiene dos rutas de solo lectura: la lista completa, ordenada por nombre, y la consulta por identificador. Son /sexes, /document-types, /child-statuses, /contract-types, /staff-roles, /staff-statuses, /guardianship-types, /legal-statuses, /payment-methods y /tuition-statuses. Como casi nunca cambian, conviene guardarlos en el frontend.

### 17.8 Recomendaciones

1. Nunca guardar JWT_SECRET en el frontend. El frontend solo maneja los tokens que entrega el servicio de seguridad.
2. Renovar el token antes de que venza, porque SAGA UP no tiene una ruta para renovarlo.
3. Para usar la API desde un navegador, el sitio debe estar en CORS_ORIGINS. Se solicita al equipo de operaciones con la dirección exacta, sin rutas ni barra final.
4. La carga de archivos (multipart/form-data) solo funciona en las rutas de Suma21 que la permiten.
