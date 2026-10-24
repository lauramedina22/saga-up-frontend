Frontend del sistema SAGA-UP desarrollado con React y Vite. Este proyecto se encarga de la capa visual y la interacción con el usuario, permitiendo la gestión de la información del sistema de una manera moderna, organizada y reutilizable.

## Descripción del proyecto

SAGA-UP es un sistema orientado a la gestión de procesos y operaciones dentro de una organización. El frontend representa la interfaz con la que los usuarios interactúan, mostrando pantallas, formularios, paneles y componentes reutilizables para facilitar la navegación y el uso de la aplicación.

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- HTML5
- CSS
- npm

## Estructura del proyecto

```bash
saga-up-frontend/
├── node_modules/          # Dependencias instaladas del proyecto
├── src/                   # Código principal de la aplicación
│   ├── components/        # Componentes reutilizables
│   ├── hooks/             # Hooks personalizados
│   ├── imports/           # Imports y módulos auxiliares
│   ├── screens/           # Pantallas principales del sistema
│   ├── App.jsx            # Componente principal de la app
│   ├── main.jsx           # Punto de entrada de React
│   └── App.css            # Estilos globales de la aplicación
├── .gitignore             # Archivos ignorados por Git
├── index.html             # Archivo HTML base de la aplicación
├── package.json           # Dependencias y scripts del proyecto
├── package-lock.json      # Versión exacta de dependencias instaladas
├── vite.config.js         # Configuración de Vite
├── README.md              # Documentación del proyecto
└── tutorial.txt           # Guía y documentación del frontend
```

## Carpeta principal: src

### src/components
Contiene componentes reutilizables de la interfaz, como botones, tarjetas, barras de navegación, formularios y otros elementos que pueden reutilizarse en distintas pantallas.

### src/hooks
Aquí se colocan hooks personalizados para manejar lógica reutilizable, estados y eventos, como autenticación, validación de formularios o consumo de APIs.

### src/imports
Se usan para centralizar importaciones o archivos auxiliares necesarios en varias partes del proyecto.

### src/screens
Contiene las pantallas principales de la aplicación, como login, dashboard, perfil de usuario, administración, entre otras.

## Requisitos previos

Antes de iniciar el proyecto, asegúrate de tener instalado:

- Node.js
- npm

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/lauramedina22/saga-up-frontend.git
```

2. Entrar a la carpeta del proyecto:

```bash
cd saga-up-frontend
```

3. Instalar dependencias:

```bash
npm install
```

## Ejecutar el proyecto

Para iniciar la aplicación en modo desarrollo:

```bash
npm run dev
```

Esto levantará el servidor de Vite y permitirá ver la aplicación en el navegador.

## Scripts disponibles

En el archivo `package.json` se pueden definir scripts para ejecutar tareas del proyecto. Actualmente, el más importante es:

```bash
npm run dev
```

## Convención de commits

Se recomienda usar Conventional Commits para mantener un historial ordenado y profesional en GitHub.

### Tipos de commit

- `feat`: agrega una nueva funcionalidad
- `fix`: corrige un error
- `docs`: modifica documentación
- `style`: cambios de formato o legibilidad sin afectar lógica
- `refactor`: reorganiza código sin cambiar comportamiento
- `perf`: mejora el rendimiento
- `test`: agrega o corrige pruebas
- `build`: cambios en dependencias o compilación
- `ci`: cambios en integración continua
- `chore`: tareas rutinarias
- `revert`: revierte un commit anterior

### Ejemplos

```bash
feat(auth): add login form
fix(api): resolve token refresh error
docs(readme): update project documentation
style(navbar): improve spacing and alignment
```

### Estructura recomendada

```bash
<tipo>(<scope>): <descripción>
```

Ejemplo:

```bash
feat(user-profile): add edit profile form
```

## Estrategia de ramas

Se recomienda organizar el flujo de trabajo en ramas para separar el código estable del desarrollo activo.

### Ramas recomendadas

- `main`: versión estable y lista para producción
- `feature/`: para nuevas funcionalidades
- `fix/`: para correcciones de bugs
- `hotfix/`: para cambios urgentes en producción

Ejemplos:

```bash
feature/login
feature/dashboard
fix/auth-session
hotfix/login-error
```


## Estado del proyecto

El proyecto se encuentra en etapa inicial de desarrollo del frontend, con la estructura base creada y la documentación inicial establecida.

## Autor

Proyecto desarrollado como parte del Proyecto Integrador de la carrera de Ingeniería en Sistemas.

## Nota

La carpeta `node_modules` no se sube a GitHub porque puede regenerarse fácilmente con `npm install`, y se encuentra en el archivo `.gitignore`.