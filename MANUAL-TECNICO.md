# Manual Técnico del Frontend de SAGA UP

Este manual es para el equipo de desarrollo y de operaciones que mantiene, amplía o publica la aplicación web (`saga-up-frontend`) del sistema SAGA UP.

---

## 1. Visión general

SAGA UP es el sistema de administración y gestión de la Fundación ASISCO UP. Este repositorio contiene su aplicación web (frontend): una aplicación de una sola página (SPA) que permite al equipo de la fundación interactuar de forma visual e intuitiva con el servidor de negocio y con los servicios aliados.

La aplicación está construida con React 19 y Vite 8 utilizando módulos ESM, React Router DOM v7 para la navegación entre vistas y Tailwind CSS v4 para el diseño visual. No utiliza librerías pesadas de estado global: se apoya en hooks personalizados de React, servicios por dominio y adaptadores de datos propios.

La sesión del usuario se mantiene en el navegador mediante `sessionStorage` y cada petición al backend incluye automáticamente el token JWT en el encabezado `Authorization`.

### 1.1 Objetivos

- Ofrecer una interfaz clara, rápida y accesible para gestionar beneficiarios, acudientes, personal, practicantes, talleres y matrículas.
- Adaptar la experiencia tanto a computadores de escritorio como a tablets y teléfonos móviles (diseño responsivo *Mobile-First*).
- Aislar el formato de datos del servidor (`snake_case`) del formato interno de los componentes (`camelCase`) mediante una capa de modelos.
- Centralizar las consultas a las listas de opciones (catálogos) con caché en memoria para evitar peticiones repetidas.
- Integrar de manera transparente las consultas de productos, inventario, ventas y donaciones de Suma21, así como el acceso al resto de plataformas de la fundación.

### 1.2 Características principales

- **Arquitectura modular en capas:** separación estricta entre vistas (`screens`), componentes reutilizables (`components`), lógica reactiva (`hooks`), llamadas HTTP (`services` y `api`) y adaptadores de datos (`models`).
- **Doble cliente HTTP:** soporte nativo en `apiClient.js` para comunicarse tanto con el servidor de autenticación (`VITE_AUTH_API_URL`) como con el servidor de negocio (`VITE_API_URL`).
- **Caché de catálogos:** `catalogService.js` guarda en memoria las promesas y resultados de los 10 catálogos del backend para que múltiples pantallas los reutilicen sin recargar la red.
- **Vigilancia activa de sesión:** `useAuth.js` detecta si el token fue eliminado o alterado en `sessionStorage` y fuerza el cierre limpio de la sesión.
- **Navegación adaptable:** menú lateral fijo en pantallas grandes y barra superior con menú desplegable (*drawer*) en dispositivos móviles.

---

## 2. Arquitectura

### 2.1 Cómo se conectan las piezas

Cuando el usuario interactúa con la pantalla, los datos siguen un recorrido ordenado en cinco capas:

1. **Pantalla (`src/screens/`):** muestra la información al usuario y recoge sus acciones (clics, búsquedas, envío de formularios) apoyándose en componentes visuales (`src/components/`).
2. **Hook (`src/hooks/`):** guarda el estado de la vista (listas de datos, indicadores de carga `loading`, mensajes de error) y expone funciones listas para usar (crear, editar, eliminar, recargar).
3. **Servicio (`src/services/`):** conoce la ruta exacta del backend que debe llamar para cada operación de su módulo y coordina la conversión de los datos.
4. **Modelo (`src/models/`):** traduce los datos que llegan del servidor (`snake_case`, identificadores como texto, fechas ISO) a objetos limpios en `camelCase` para React, y viceversa cuando se envía un formulario al servidor.
5. **Cliente HTTP (`src/api/apiClient.js`):** construye la petición `fetch`, adjunta los encabezados `Content-Type: application/json` y `Authorization: Bearer <token>`, lee la respuesta JSON y estandariza cualquier error HTTP.

Ningún componente visual ni pantalla hace llamadas `fetch` directas ni construye direcciones URL por su cuenta.

### 2.2 Dónde está cada cosa en el código

- **`index.html`:** documento HTML raíz donde se monta la aplicación y se define el título e ícono de pestaña.
- **`vite.config.js`:** configuración de Vite con los plugins de React, Tailwind CSS v4 y certificado SSL básico para desarrollo.
- **`src/main.jsx`:** punto de entrada de React; envuelve la aplicación en `BrowserRouter` y carga los estilos globales.
- **`src/App.jsx`:** define el contenedor general (`AppLayout`), la barra superior móvil, el menú lateral (`Sidebar`) y la tabla de rutas (`Routes`).
- **`src/App.css`:** configuración del tema de Tailwind CSS v4, variables de color institucionales, sombras y estilos base.
- **`src/data.js`:** funciones utilitarias de formato para moneda peso colombiano (`formatCOP`) y fechas legibles (`formatFecha`).
- **`src/api/apiClient.js`:** cliente HTTP centralizado con dos instancias: `apiClient` (hacia `VITE_API_URL`) y `authApiClient` (hacia `VITE_AUTH_API_URL`).
- **`src/components/`:**
  - **`ui.jsx`:** componentes base del sistema de diseño (`Button`, `Card`, `Badge`, `Avatar`, `Field`, `PasswordField`, `SelectField`, `TextArea`, `EmptyState`, `Icon`).
  - **`Sidebar.jsx`:** menú de navegación principal con soporte fijo en escritorio y *drawer* deslizable en móvil.
  - **`EntityDialogs.jsx`:** ventanas modales para crear, editar, vincular y desactivar registros de niños, acudientes, fichas de salud, descripciones internas, asistencias y matrículas.
  - **`ServiceIllustration.jsx`:** ilustraciones vectoriales (SVG) institucionales para las tarjetas de la vista "Más Servicios".
- **`src/hooks/`:** un hook por dominio (`useAuth`, `useCatalogs`, `useDashboard`, `useChildren`, `useGuardians`, `useEnrollments`, `useWorkshops`, `useStaff`, `useProfessionals`, `useInterns`, `useSuma21`, `useAuditLogs`).
- **`src/services/`:** un servicio por entidad (`authService`, `catalogService`, `childService`, `guardianService`, `childGuardianService`, `childRecordService`, `childInternalDescriptionService`, `childrenAssistanceService`, `enrollmentService`, `staffService`, `staffWorkshopService`, `suma21Service`, `auditService`).
- **`src/models/`:** adaptadores de entrada y salida (`modelUtils`, `catalogModel`, `childModel`, `guardianModel`, `childGuardianModel`, `childRecordModel`, `childInternalDescriptionModel`, `childrenAssistanceModel`, `enrollmentModel`, `staffModel`, `workshopModel`, `suma21Model`, `auditModel`).
- **`src/screens/`:** las vistas completas de la aplicación (`Login`, `Register`, `Dashboard`, `Children`, `Guardians`, `Enrollments`, `Workshops`, `Staff`, `Interns`, `Sales`, `Donations`, `AuditLogs`, `Services`).
- **`src/imports/`:** logotipos, fotografías de respaldo y recursos gráficos estáticos.

### 2.3 Recorrido de una operación

1. **Acción del usuario.** El usuario llena un formulario en un diálogo (por ejemplo, `CreateChildDialog`) y pulsa "Guardar".
2. **Validación en cliente.** El componente verifica que los campos obligatorios estén completos y llama a la función entregada por el hook (por ejemplo, `onCreateChild(formValues)`).
3. **Transformación a payload.** El servicio invoca al modelo (`toChildPayload`) para convertir los nombres de campos a `snake_case`, normalizar fechas a `YYYY-MM-DD`, números e identificadores, y omitir campos no permitidos por el backend.
4. **Petición HTTP.** `apiClient.post("/children", payload)` busca el token en `sessionStorage`, arma el encabezado `Authorization: Bearer <token>` y envía la solicitud a `VITE_API_URL`.
5. **Lectura y adaptación de respuesta.** Si el servidor responde `200` o `201`, el servicio pasa el JSON recibido por `toChildModel` y lo devuelve al hook.
6. **Actualización de interfaz.** El hook actualiza su estado local en React, el modal se cierra y la pantalla muestra una notificación de confirmación (*toast*). Si ocurre un error HTTP, `apiClient` lanza un objeto `Error` con el mensaje del servidor y el modal lo muestra en pantalla sin cerrar el formulario.

---

## 3. Requisitos

### 3.1 Programas

- **Node.js:** versión 20 LTS o superior recomendada.
- **npm:** versión 10 o superior (incluido con Node.js).
- **Navegador web moderno:** Chrome, Edge, Firefox o Safari actualizados.

### 3.2 Red y servicios externos

Para funcionar con datos reales, el navegador donde se abre la aplicación necesita conectarse por HTTPS a:

- El servidor de negocio configurado en `VITE_API_URL`.
- El servidor de autenticación configurado en `VITE_AUTH_API_URL`.

Además, el origen desde el cual se abre el frontend (por ejemplo `http://localhost:5173`, `https://localhost:5173` o el dominio en Render) debe estar incluido en la variable `CORS_ORIGINS` de ambos servidores backend.

---

## 4. Instalación en un equipo local

```bash
git clone https://github.com/lauramedina22/saga-up-frontend.git
cd saga-up-frontend
cp .env.example .env     # verificar o ajustar las URLs de los servidores
npm install              # instala dependencias de React, Vite y Tailwind
npm run dev              # arranca el servidor de desarrollo de Vite
```

Comandos disponibles en `package.json`:

- **`npm run dev`:** levanta el servidor local de desarrollo con recarga instantánea (HMR).
- **`npm run build`:** compila y optimiza la aplicación para producción dentro de la carpeta `dist/`.
- **`npm test`:** comando reservado (actualmente informa que no hay pruebas automatizadas configuradas).

### 4.1 Comprobar que funciona

1. Ejecutar `npm run dev` y abrir la dirección que muestra la consola en el navegador.
2. Verificar que cargue la pantalla de inicio de sesión (`/login`).
3. Ejecutar `npm run build` para confirmar que todos los módulos y hojas de estilo compilan sin errores.

---

## 5. Variables de entorno

Las variables se definen en un archivo `.env` en la raíz del proyecto (nunca se debe subir `.env` al repositorio; como plantilla se incluye `.env.example`). Como se usa Vite, todas empiezan por el prefijo `VITE_`:

**`VITE_API_URL` (obligatoria).** Dirección base del servidor de negocio de SAGA UP y puente hacia Suma21, sin barra final. Ejemplo: `https://saga-up-backend-lr4u.onrender.com` (o `http://localhost:3000` si se corre el backend localmente).

**`VITE_AUTH_API_URL` (obligatoria).** Dirección base del servidor de seguridad que atiende el inicio de sesión y el registro de cuentas, sin barra final. Ejemplo: `https://proyecto-integrador-backend-g2.onrender.com`.

Si alguna de estas dos variables no está definida al momento de hacer una petición a su respectivo servidor, `apiClient.js` detiene la solicitud e informa explícitamente qué variable falta configurar en el archivo `.env`.

---

## 6. Pantallas y enrutamiento

Las rutas están declaradas en `src/App.jsx` mediante React Router DOM v7:

### 6.1 Rutas públicas

- **`/login` (`Login.jsx`):** formulario de ingreso con correo electrónico y contraseña. Si ya existe una sesión activa, redirige automáticamente a `/`.
- **`/register` (`Register.jsx`):** formulario para crear una cuenta nueva indicando nombre de usuario, correo, rol (`ACUDIENTE`, `ESTUDIANTE`, `TALLERISTA`, `DONANTE`) y contraseña de mínimo 12 caracteres con confirmación en tiempo real.

### 6.2 Rutas dentro del contenedor principal (`AppLayout`)

- **`/` (`Dashboard.jsx`):** panel principal. Requiere sesión activa (si no la hay, redirige a `/login`). Muestra métricas globales, alertas médicas y conductuales prioritarias, talleres destacados, barras de distribución de población y accesos rápidos.
- **`/children` (`Children.jsx`):** gestión de beneficiarios. Permite alternar entre activos y retirados, buscar en tiempo real o consultar por documento en el backend, registrar niños nuevos y abrir el expediente detallado organizado en 6 pestañas (*General*, *Acudientes*, *Salud*, *Asistencia*, *Rutina & Pedagogía* y *Pagos*).
- **`/guardians` (`Guardians.jsx`):** gestión de acudientes. Lista general, búsqueda por nombre o documento, creación, edición, eliminación y ficha detallada con los niños vinculados.
- **`/enrollments` (`Enrollments.jsx`):** gestión de matrículas y pensiones (`/tuition`). Tarjetas de recaudo total, filtros dinámicos por estado de pago y CRUD completo de registros de pago.
- **`/workshops` (`Workshops.jsx`):** gestión de talleres, programación de horarios (`professionals-workshops`) y control de turnos/asistencia.
- **`/staff` o `/personal` (`Staff.jsx`):** directorio y administración del personal de la fundación (`/staff` y `/professionals`), búsqueda por documento, vinculación con cuentas de seguridad y desactivación.
- **`/interns` o `/practicantes` (`Interns.jsx`):** gestión de practicantes universitarios (`/interns`), carrera, universidad, meses de práctica y vinculación con su registro de personal.
- **`/sales` o `/ventas` (`Sales.jsx`):** Tienda Solidaria conectada con Suma21. Se divide en pestañas para consultar el catálogo de productos con detalle modal, el control de inventario, el historial de ventas aprobadas y las cuentas.
- **`/donations` o `/donaciones` (`Donations.jsx`):** reporte de donaciones monetarias aprobadas en Suma21, con cálculo de total recaudado, donación promedio, filtro por método de pago y buscador por comprobante.
- **`/audit-logs` o `/auditoria` (`AuditLogs.jsx`):** bitácora de auditoría del sistema (`/audit-logs`). Muestra contadores de creaciones, modificaciones y eliminaciones, filtros rápidos y tabla con fecha, módulo, registro afectado y responsable.
- **`/services` o `/servicios` (`Services.jsx`):** directorio de plataformas aliadas del ecosistema ASISCO UP (ASISCONNECTION, SUMA 21, AULA UP, SON UP, LUPE y el Podcast en Spotify).
- **`*` (cualquier otra ruta):** redirige automáticamente a `/`.

---

## 7. Autenticación y manejo de sesión

### 7.1 Inicio de sesión y almacenamiento

1. El usuario ingresa su correo y contraseña en `Login.jsx`.
2. `useAuth.js` invoca `authService.login({ email, clave: password })` (traduciendo el campo `password` a `clave`, como lo exige el servidor de autenticación).
3. `authService.js` envía `POST /auth/login` usando `authApiClient` (`VITE_AUTH_API_URL`).
4. Si la respuesta contiene un `token` válido, se guarda el objeto completo de sesión en `sessionStorage` bajo la clave `saga-up-session`.

### 7.2 Uso del token en las peticiones

Cada vez que cualquier servicio llama a `apiClient.get`, `post`, `put`, `patch` o `delete`, la función `getAuthorizationHeader()` en `src/api/apiClient.js` lee `sessionStorage.getItem("saga-up-session")`, extrae `session.token` y agrega el encabezado:

```http
Authorization: Bearer <token>
```

Si el JSON guardado en `sessionStorage` está corrupto o no contiene un token válido, `apiClient` limpia automáticamente la clave `saga-up-session`.

### 7.3 Vigilancia y cierre de sesión

El hook `useAuth.js` mantiene un efecto activo mientras exista sesión que escucha el evento `storage` de la ventana y verifica periódicamente (cada 250 ms) que el token siga presente en `sessionStorage`. Si el token desaparece o el usuario pulsa "Cerrar sesión" en el menú lateral, se limpia la sesión y la aplicación regresa a `/login`.

---

## 8. Capa de datos: Servicios, Modelos y Catálogos

### 8.1 Utilidades de transformación (`src/models/modelUtils.js`)

Para evitar errores de tipos al comunicarse con el backend (donde los `BigInt` llegan como texto y los campos desconocidos o con formato incorrecto se rechazan con `400`), todos los modelos usan funciones centralizadas:

- **`readValue(source, ...keys)`:** busca el primer campo disponible entre varios nombres posibles (útil cuando un endpoint devuelve `child_id` o `id`).
- **`normalizeId(value)`:** convierte identificadores a texto (`String`) o devuelve `null` si están vacíos.
- **`normalizeNumber(value)`:** convierte a `Number` finito o devuelve `null`.
- **`normalizeDate(value)`:** extrae siempre la fecha en formato `YYYY-MM-DD` requerido por el backend.
- **`normalizeBoolean(value)`:** interpreta booleanos reales, números (`1`/`0`) o textos (`"true"`, `"si"`, `"sí"`).
- **`normalizeOptionalText(value)`:** limpia espacios en extremos y devuelve `null` si la cadena queda vacía.
- **`readList(response)`:** extrae el arreglo de registros sin importar si el backend devuelve un arreglo directo `[...]` o un objeto paginado `{ items: [...] }`, `{ data: [...] }` o `{ results: [...] }`.

### 8.2 Caché de catálogos (`src/services/catalogService.js` y `src/hooks/useCatalogs.js`)

El backend expone 10 tablas de catálogo de solo lectura:

- `sexes` (`/sexes`)
- `document_types` (`/document-types`)
- `child_statuses` (`/child-statuses`)
- `legal_statuses` (`/legal-statuses`)
- `guardianship_types` (`/guardianship-types`)
- `payment_methods` (`/payment-methods`)
- `tuition_statuses` (`/tuition-statuses`)
- `staff_roles` (`/staff-roles`)
- `contract_types` (`/contract-types`)
- `staff_statuses` (`/staff-statuses`)

`catalogService.js` mantiene dos mapas en memoria (`requestCache` y `loadedCatalogs`). Cuando una pantalla pide catálogos mediante `useCatalogs(["sexes", "document_types"])`, si el catálogo ya fue descargado o su petición ya está en vuelo, se reutiliza la misma promesa sin hacer otra llamada de red. Si una petición falla, se retira de `requestCache` para permitir reintentos posteriores.

### 8.3 Reglas de eliminación y edición frente al backend

- **Niños (`children`) y Personal (`staff`):** al pulsar "Desactivar", el frontend llama a `DELETE /children/:id` o `DELETE /staff/:id`. El backend no borra la fila, sino que asigna `exit_date` (borrado lógico). En la pantalla de Beneficiarios, el niño pasa automáticamente de la pestaña *Activos* a la pestaña *Retirados*.
- **Anamnesis de beneficiarios:** el concepto clínico de *Anamnesis* se almacena en el campo `notes` de la tabla `children` y se presenta bajo el nombre **Anamnesis** tanto en la pestaña *General* del niño como en los formularios de creación y edición.
- **Asistencia a talleres (`children_assistance`):** dado que el par `(child_id, professional_workshop_id)` es único en la base de datos, las correcciones sobre una asistencia ya tomada se envían como actualización (`PUT`/`PATCH`) sobre el registro existente.

---

## 9. Integración con Suma21 y Ecosistema Externo

### 9.1 Consumo de Suma21 (`src/services/suma21Service.js`)

El frontend nunca llama directamente al servidor de Suma21; todas las consultas pasan por el proxy del backend de SAGA UP (`VITE_API_URL`) reutilizando el mismo token JWT:

- **Productos:** `GET /api/suma21/products`
- **Cuentas:** `GET /api/suma21/accounts`
- **Inventario:** `GET /api/suma21/inventory`
- **Historial de ventas:** `GET /api/suma21/transactions/sales?page=1&limit=50`
- **Historial de donaciones:** `GET /api/suma21/transactions/donations?page=1&limit=50`

En `suma21Model.js`, los valores monetarios reportados por Suma21 en `amount_in_cents` o `unit_price` se toman directamente en pesos colombianos (COP) sin dividir entre 100, de acuerdo con la convención de datos del servicio aliado. Si un producto no trae imagen o su enlace falla al cargar, `Sales.jsx` muestra automáticamente la imagen local de respaldo (`src/imports/bisuteria.jpg`).

### 9.2 Directorio "Más Servicios" (`src/screens/Services.jsx`)

La pantalla `Services.jsx` centraliza las tarjetas de acceso hacia las plataformas hermanas del ecosistema ASISCO UP (configuradas en la constante `EXTERNAL_SERVICES`):

1. **ASISCONNECTION** (Comunidad UP)
2. **SUMA 21** (Donaciones y Ventas)
3. **AULA UP** (Educación)
4. **SON UP** (Seguimiento y Desarrollo)
5. **LUPE** (Asistente de Inteligencia Artificial)
6. **PODCAST ASISCO UP** (Programa oficial en Spotify)

Cada tarjeta utiliza una ilustración SVG propia definida en `src/components/ServiceIllustration.jsx` y abre el servicio correspondiente en una pestaña nueva con atributos de seguridad `target="_blank" rel="noopener noreferrer"`.

---

## 10. Sistema de diseño e interfaz responsiva

### 10.1 Paleta y tema (`src/App.css`)

El proyecto usa Tailwind CSS v4 con variables de tema personalizadas (`@theme`) inspiradas en la identidad visual de la Fundación ASISCO UP:

- **`primary` (`#2ec4b6`) y `primary-hover` (`#0e9f94`):** turquesa institucional para botones principales, navegación activa y acentos.
- **`info` (`#1d63b8`):** azul de apoyo para enlaces e indicadores informativos.
- **`success` (`#1f9d6a`), `warning` (`#d9822b`) y `danger` (`#d64545`):** colores semánticos para estados de pagos, alertas médicas y acciones destructivas.
- **`background` (`#f4fbfa`) y `surface` (`#ffffff`):** fondos suaves que facilitan la lectura prolongada.

### 10.2 Adaptabilidad móvil (*Responsive Design*)

- **Menú y contenedor (`App.jsx` y `Sidebar.jsx`):** en pantallas móviles (`< 640px`), el menú lateral se oculta fuera del lienzo (`-translate-x-full`) y aparece una barra superior fija (`sm:hidden`) con el botón hamburguesa (`☰`). Al abrirlo, se despliega como un cajón lateral (*drawer*) con fondo oscurecido (*backdrop*), permitiendo que las vistas aprovechen el 100% del ancho del teléfono (`pl-0 sm:pl-64`).
- **Diálogos (`EntityDialogs.jsx` y `Sales.jsx`):** en pantallas pequeñas se muestran acoplados al borde inferior tipo *bottom-sheet* (`items-end rounded-t-3xl`) y en escritorio se centran como modales tradicionales (`sm:items-center sm:rounded-3xl`).
- **Tablas y pestañas:** las barras de pestañas y filtros usan desplazamiento horizontal táctil (`overflow-x-auto`), y las tablas de datos están envueltas en contenedores desplazables para evitar desbordamientos.

---

## 11. Publicación

### 11.1 Compilación para producción

```bash
npm ci
npm run build
```

Vite genera en la carpeta `dist/` el archivo `index.html` y los recursos empaquetados y minificados (`dist/assets/`).

### 11.2 Despliegue en Render o servidor estático

1. Configurar en el panel del proveedor las variables de entorno `VITE_API_URL` y `VITE_AUTH_API_URL` (Vite las inyecta durante el `npm run build`).
2. Configurar el comando de construcción: `npm install && npm run build`.
3. Configurar el directorio de publicación: `dist`.
4. Configurar una regla de reescritura (*Rewrite Rule*) para aplicaciones SPA: cualquier ruta `/*` debe redirigirse a `/index.html` (con estado `200`) para que React Router DOM maneje las rutas al recargar el navegador.
5. Solicitar al administrador del backend y del servidor de autenticación que agreguen el dominio público del frontend (sin barra final) en su variable `CORS_ORIGINS`. El detalle del lado del servidor está en [DESPLIEGUE-RENDER.md](./DESPLIEGUE-RENDER.md).

---

## 12. Convenciones de código y Git

- **Nombres de archivos:**
  - Pantallas (`src/screens/`) y componentes visuales (`src/components/`): `PascalCase` (ej. `Children.jsx`, `EntityDialogs.jsx`).
  - Hooks (`src/hooks/`), servicios (`src/services/`) y modelos (`src/models/`): `camelCase` (ej. `useChildren.js`, `childService.js`, `childModel.js`).
- **Estrategia de ramas:** trabajar cada módulo o ajuste en su propia rama `feature/<modulo>` o `fix/<modulo>`, manteniendo `main` estable.
- **Mensajes de commit:** formato Conventional Commits en inglés (`<type>(<scope>): <description>`, por ejemplo `feat(sales): add sales dashboard`). Ver [COMMIT-CONVENTION.md](./COMMIT-CONVENTION.md).
- **Seguridad:** nunca subir archivos `.env` ni credenciales al repositorio.

---

## 13. Cómo agregar una nueva pantalla o módulo

Para agregar un módulo nuevo manteniendo el orden del proyecto, siga estos pasos en orden:

1. **Crear el modelo en `src/models/<modulo>Model.js`:** definir las funciones `to<Modulo>Model(raw)` y `to<Modulo>Payload(model)` apoyándose en `modelUtils.js`.
2. **Crear el servicio en `src/services/<modulo>Service.js`:** importar `apiClient` y el modelo, y exponer las funciones asíncronas (`list`, `getById`, `create`, `update`, `remove`).
3. **Crear el hook en `src/hooks/use<Modulo>.js`:** manejar los estados `items`, `loading` y `error`, cargar los datos en un `useEffect` y exponer las operaciones CRUD.
4. **Crear la pantalla en `src/screens/<Modulo>.jsx`:** construir la interfaz reutilizando los componentes de `src/components/ui.jsx` (`Card`, `Button`, `Field`, `Badge`, `EmptyState`) y cuidando que sea responsiva en móvil y escritorio.
5. **Registrar la ruta:**
   - Agregar el `<Route path="/mi-ruta" element={<MiPantalla />} />` dentro de `AppLayout` en `src/App.jsx` y actualizar el mapa `routes` y `currentScreen`.
   - Agregar el botón de navegación con su ícono SVG en el arreglo `navItems` de `src/components/Sidebar.jsx`.
6. **Verificar la compilación:** ejecutar `npm run build` para comprobar que no existan errores de importación ni de sintaxis.

---

## 14. Riesgos conocidos y pendientes

- **Protección de rutas por rol en el cliente:** actualmente el inicio de sesión protege el ingreso al sistema, pero las rutas internas (`/children`, `/guardians`, `/enrollments`, etc.) son accesibles en la interfaz sin ocultar opciones del menú según el rol del usuario. Aunque el backend aplica sus propios filtros de seguridad por rol, conviene restringir también las vistas en el frontend antes del cierre definitivo a producción.
- **Renovación de token:** cuando el token JWT vence, las peticiones al backend responden `401`. El usuario debe cerrar sesión y volver a ingresar, ya que el servicio de autenticación externo no expone una ruta de refresco automático.
- **Enlaces finales del ecosistema y formato de horas en talleres:** quedan registrados en [PENDIENTES.md](./PENDIENTES.md) la actualización de los dominios definitivos de despliegue de algunos proyectos en `Services.jsx` y el ajuste visual de horas en la vista de talleres.

---

## 15. Documentos relacionados

- [DOCUMENTACION.md](./DOCUMENTACION.md): guía general y punto de partida.
- [MANUAL-USUARIO.md](./MANUAL-USUARIO.md): manual paso a paso para el personal de la fundación, sin contenido técnico.
- [AGENTS.md](./AGENTS.md): reglas de arquitectura y flujo de trabajo del repositorio.
- [API.md](./API.md): detalle de todas las rutas del backend.
- [DESPLIEGUE-RENDER.md](./DESPLIEGUE-RENDER.md): configuración de despliegue y CORS en Render.
- [COMMIT-CONVENTION.md](./COMMIT-CONVENTION.md): convención para mensajes de commit.
- [PENDIENTES.md](./PENDIENTES.md) y [TAREAS.md](./TAREAS.md): seguimiento de avances y pendientes del frontend.

