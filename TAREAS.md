# Distribución y Asignación de Tareas Frontend - SAGA-UP

A continuación se presenta la distribución equitativa (50% / 50%) de las vistas y módulos faltantes identificados a partir del Swagger actualizado del backend de SAGA-UP (`https://saga-up-backend-lr4u.onrender.com/api-docs`).

---

## 👩‍💻 Laura (50%) — Módulo de Talento Humano y Asistencias

### 1. Gestión de Personal / Colaboradores (`/staff`)
- **Endpoints asociados:**
  - `GET /staff` (con soporte para búsqueda por documento/cédula y filtros de rol/estado)
  - `GET /staff/:id`
  - `POST /staff`
  - `PUT /staff/:id`, `PATCH /staff/:id`, `DELETE /staff/:id` (Soft delete)
- **Alcance de la vista (`src/screens/Staff.jsx`):**
  - Tabla de colaboradores con badges de estado, rol y contrato.
  - Barra de búsqueda por número de documento (cédula) y nombre.
  - Modal de creación y edición con validación de campos obligatorios y selectores vinculados a tablas intermedias (`document_types`, `staff_roles`, `contract_types`, `staff_statuses`).
  - Protección de interfaz para evitar modificación o asignación indebida de roles administrativos (ADMIN/SUPERADMIN).
- **Archivos a crear/modificar:**
  - `src/screens/Staff.jsx`
  - `src/services/staffService.js`
  - `src/models/staffModel.js`
  - `src/hooks/useStaff.js`
  - Enrutamiento y enlace en `src/App.jsx` y `src/components/Sidebar.jsx`.

### 2. Registro y Control de Asistencia de Personal (`/staff-assistance`)
- **Endpoints asociados:**
  - `GET /staff-assistance` (filtro `?staff_id=&date_working=`)
  - `GET /staff-assistance/:id`
  - `POST /staff-assistance`
  - `PUT /staff-assistance/:id`, `DELETE /staff-assistance/:id`
- **Alcance de la vista (`src/screens/StaffAssistance.jsx`):**
  - Registro de jornada diaria (`date_working`, `time_in`, `time_out`).
  - Filtro por colaborador y rango de fechas.
  - Tabla de auditoría de asistencia con visualización de horas registradas.
- **Archivos a crear/modificar:**
  - `src/screens/StaffAssistance.jsx`
  - `src/services/staffAssistanceService.js`
  - `src/models/staffAssistanceModel.js`
  - `src/hooks/useStaffAssistance.js`

### 3. Registro y Control de Asistencia a Talleres (`/children-assistance`)
- **Endpoints asociados:**
  - `GET /children-assistance` (filtro `?child_id=&professional_workshop_id=`)
  - `GET /children-assistance/:id`
  - `POST /children-assistance`
  - `PUT /children-assistance/:id`, `DELETE /children-assistance/:id`
- **Alcance de la vista (`src/screens/ChildrenAssistance.jsx`):**
  - Selector de taller y sesión/horario (`professionals-workshops`).
  - Lista de beneficiarios inscritos con controles rápidos (toggles/checkboxes):
    - ¿Asistirá? (`will_assist`)
    - ¿Asistió? (`attended`)
    - ¿Taller completado? (`complete_workshop`)
    - Campo de observación de conducta/participación (`behavior`).
- **Archivos a crear/modificar:**
  - `src/screens/ChildrenAssistance.jsx`
  - `src/services/childrenAssistanceService.js`
  - `src/models/childrenAssistanceModel.js`
  - `src/hooks/useChildrenAssistance.js`

---

## 👨‍💻 Yeison (50%) — Expediente de Beneficiarios, Acudientes y Parámetros

### 1. Expediente Integral de Beneficiarios (`/child-records` y `/child-internal-descriptions`)
- **Endpoints asociados:**
  - `GET/POST/PUT/PATCH /child-records` (Ficha médica: EPS, IPS, alergias, medicamentos, condiciones especiales).
  - `GET/POST/PUT/PATCH /child-internal-descriptions` (Ficha confidencial interna: rutinas, crisis, gustos, terapias, antecedentes escolares).
- **Alcance de la vista:**
  - Integrar en `src/screens/Children.jsx` (o vista modal/expediente `ChildRecordModal.jsx`) pestañas dedicadas para:
    - Ficha de Salud e Historial Médico.
    - Ficha de Información Interna Confidencial.
- **Archivos a intervenir:**
  - `src/screens/Children.jsx` o componente modal dedicado en `src/components/`.
  - `src/services/childRecordService.js` y `src/services/childInternalDescriptionService.js`.
  - `src/models/childRecordModel.js` y `src/models/childInternalDescriptionModel.js`.

### 2. Búsqueda por Cédula y Tablas Intermedias en Beneficiarios y Acudientes
- **Endpoints asociados:**
  - `GET /children?document_number=` y `GET /guardians?document_number=`
  - `/children-guardians` (asociación acudiente - beneficiario y parentesco)
- **Alcance de la vista:**
  - Barra de búsqueda por número de documento en `src/screens/Children.jsx` y `src/screens/Guardians.jsx`.
  - Selectores formales vinculados a tablas intermedias (`sexes`, `document_types`, `legal_statuses`, `guardianship_types`).
  - Vinculación interactiva de beneficiarios con sus acudientes en la interfaz de Acudientes.

### 3. Panel de Catálogos y Parámetros Maestros (`/catalogs`)
- **Endpoints / Catálogos asociados:**
  - Sexos (`sexes`), Tipos de Documento (`document_types`), Estados de Niño (`child_statuses`), Estados Legales (`legal_statuses`), Métodos de Pago (`payment_methods`), etc.
- **Alcance de la vista (`src/screens/Catalogs.jsx`):**
  - Vista de consulta y administración de parámetros maestros del sistema.
  - Sincronización y validación visual con el diccionario de base de datos.

