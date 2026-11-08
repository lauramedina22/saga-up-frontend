# Reglas del Proyecto (AGENTS.md) - SAGA-UP Frontend

## 1. Flujo de Trabajo del Agente
- **Autorización previa obligatoria:** Nunca crear, modificar ni eliminar archivos de código sin antes explicar qué archivos se van a tocar, mostrar la propuesta y recibir confirmación explícita del usuario.
- **Alcance acotado:** Implementar únicamente la tarea o funcionalidad que el usuario indique en el momento, sin adelantarse a tareas no solicitadas.

---

## 2. Convenciones de Git y Ramas
- **Estrategia de ramas:** Trabajar cada funcionalidad o módulo en su propia rama `feature/<modulo>` (ej. `feature/sales`, `feature/children`, `feature/guardians`, `feature/workshops`), manteniendo `main` estable.
- **Conventional Commits:** Usar siempre el formato `<tipo>(<scope>): <descripción en inglés>` (ej. `feat(sales): add sales dashboard`, `fix(api): handle token expiration`).
- **Archivos sensibles:** Nunca subir `.env` ni credenciales personales al repositorio.

---

## 3. Stack Tecnológico del Frontend
- **Librería y Build Tool:** React 19 (`^19.3.1`) + Vite (`^8.3.4`).
- **Enrutamiento:** React Router DOM v7 (`^7.18.4`).
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/vite`).
- **Entorno de API:**
  - `VITE_API_URL`: Backend de negocio (por defecto `http://localhost:3000`).
  - `VITE_AUTH_API_URL`: Servicio de autenticación externo (Render).

---

## 4. Estándares y Arquitectura Modular del Frontend
El proyecto sigue una arquitectura modular y desacoplada organizada en `src/`:

1. **Pantallas y Vistas (`src/screens/`):**
   - Componentes principales de vista nombrados en `PascalCase` (ej. `Children.jsx`, `Guardians.jsx`, `Sales.jsx`, `Workshops.jsx`, `Login.jsx`).
   - Coordinan la lógica de la pantalla apoyándose en hooks y componentes reutilizables.
   - Las rutas principales se declaran en `src/App.jsx`.

2. **Componentes Reutilizables (`src/components/`):**
   - Elementos visuales modulares compartidos como `Sidebar.jsx`, `EntityDialogs.jsx`, `ui.jsx`.
   - Deben ser componentes de interfaz reutilizables sin llamadas directas a APIs con URLs quemadas.

3. **Capa de Red y Servicios HTTP (`src/api/` y `src/services/`):**
   - **Cliente HTTP (`src/api/apiClient.js`):** Centraliza la configuración de llamadas `fetch`, inyección de encabezados de sesión (`Authorization: Bearer`), gestión de `sessionStorage` (`saga-up-session`) y estandarización de errores.
   - **Servicios por Dominio (`src/services/`):** Funciones organizadas en archivos `camelCase` por cada entidad o módulo (ej. `childService.js`, `guardianService.js`, `enrollmentService.js`, `authService.js`, `staffWorkshopService.js`).
   - Ningún componente visual debe hacer `fetch` directo a URLs quemadas.

4. **Modelos y Adaptadores de Datos (`src/models/`):**
   - Funciones y utilidades en `camelCase` (ej. `childModel.js`, `guardianModel.js`, `modelUtils.js`).
   - Responsables de transformar y adaptar datos entre el formato del Backend (snake_case / DTOs) y el formato del Frontend (camelCase).

5. **Hooks de Lógica y Estado (`src/hooks/`):**
   - Custom hooks en `camelCase` (ej. `useAuth.js`, `useChildren.js`, `useGuardians.js`, `useWorkshops.js`) para aislar la lógica reactiva y asíncrona de la presentación visual.

6. **Recursos Estáticos (`src/imports/`):**
   - Centraliza imágenes, logotipos y recursos gráficos (`logo.png`, `texto.png`, etc.).
