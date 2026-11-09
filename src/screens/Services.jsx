// Componente auxiliar de ilustraciones vectoriales temáticas y consistentes
function ServiceIllustration({ serviceId }) {
  switch (serviceId) {
    case "asisconnection":
      return (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E7F7F5] to-[#D0F0EC]">
          {/* Círculos decorativos de fondo */}
          <div className="absolute size-28 rounded-full bg-[#008375]/10 animate-pulse" />
          <div className="absolute size-20 rounded-full bg-[#F2A900]/15" />
          {/* Ilustración central: Red comunitaria / Conexión de personas */}
          <svg
            className="relative size-20 text-[#008375]"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Persona central */}
            <circle cx="40" cy="30" r="10" fill="#008375" />
            <path
              d="M24 58C24 49.1634 31.1634 42 40 42C48.8366 42 56 49.1634 56 58V62H24V58Z"
              fill="#008375"
            />
            {/* Persona lateral izquierda */}
            <circle cx="18" cy="36" r="7" fill="#E87722" />
            <path
              d="M8 58C8 51.3726 13.3726 46 20 46C22.4 46 24.6 46.7 26.5 48C25 50.8 24 54.2 24 58H8Z"
              fill="#E87722"
              fillOpacity="0.85"
            />
            {/* Persona lateral derecha */}
            <circle cx="62" cy="36" r="7" fill="#F2A900" />
            <path
              d="M60 46C66.6274 46 72 51.3726 72 58H56C56 54.2 55 50.8 53.5 48C55.4 46.7 57.6 46 60 46Z"
              fill="#F2A900"
              fillOpacity="0.9"
            />
            {/* Línea de enlace */}
            <circle cx="40" cy="14" r="3" fill="#E87722" />
            <path
              d="M20 25L32 18M60 25L48 18"
              stroke="#008375"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
            />
          </svg>
        </div>
      )

    case "suma21":
      return (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFF4E3] to-[#FCE3B4]/60">
          <div className="absolute size-28 rounded-full bg-[#E87722]/10" />
          <div className="absolute size-18 rounded-full bg-[#F2A900]/20" />
          {/* Ilustración: Donaciones solidarias y tienda */}
          <svg
            className="relative size-20"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Caja de donaciones / Tienda */}
            <rect
              x="18"
              y="32"
              width="44"
              height="34"
              rx="6"
              fill="#E87722"
            />
            <rect
              x="14"
              y="26"
              width="52"
              height="10"
              rx="4"
              fill="#F2A900"
            />
            <path
              d="M36 26V36M44 26V36"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Corazón solidario superior */}
            <path
              d="M40 22C40 22 34 16 29 16C24 16 20 20 20 25C20 32 40 44 40 44C40 44 60 32 60 25C60 20 56 16 51 16C46 16 40 22 40 22Z"
              fill="#008375"
            />
            {/* Moneda / Símbolo de aporte */}
            <circle cx="40" cy="48" r="9" fill="#F2A900" />
            <path
              d="M40 43V53M36.5 45.5C36.5 45.5 38 44.5 40 44.5C42 44.5 43.5 45.5 43.5 47C43.5 50 36.5 49 36.5 51.5C36.5 53 38 54 40 54C42 54 43.5 53 43.5 53"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )

    case "aulaup":
      return (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]">
          <div className="absolute size-28 rounded-full bg-[#F2A900]/15" />
          <div className="absolute size-20 rounded-full bg-[#008375]/10" />
          {/* Ilustración: Educación / Aprendizaje / Libro abierto */}
          <svg
            className="relative size-20"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Birrete / Graduación */}
            <path
              d="M40 14L16 26L40 38L64 26L40 14Z"
              fill="#008375"
            />
            <path
              d="M58 29.5V42C58 42 51 47 40 47C29 47 22 42 22 42V29.5"
              stroke="#008375"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M64 26V40"
              stroke="#E87722"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="64" cy="42" r="3" fill="#E87722" />
            {/* Libro abierto */}
            <path
              d="M40 50C33 46 22 47 16 50V68C22 65 33 64 40 67C47 64 58 65 64 68V50C58 47 47 46 40 50Z"
              fill="#E87722"
            />
            <path
              d="M40 50V67"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
            <path
              d="M24 56H34M24 61H32M46 56H56M48 61H56"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )

    case "sonup":
      return (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E7F7F5] to-[#D5EFEA]">
          <div className="absolute size-28 rounded-full bg-[#008375]/15" />
          <div className="absolute size-18 rounded-full bg-[#E87722]/15" />
          {/* Ilustración: Seguimiento, métricas y crecimiento humano */}
          <svg
            className="relative size-20"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Gráfico de barras ascendente */}
            <rect x="18" y="46" width="9" height="20" rx="3" fill="#008375" fillOpacity="0.5" />
            <rect x="31" y="36" width="9" height="30" rx="3" fill="#008375" fillOpacity="0.8" />
            <rect x="44" y="26" width="9" height="40" rx="3" fill="#008375" />
            <rect x="57" y="16" width="9" height="50" rx="3" fill="#E87722" />
            {/* Flecha de desarrollo continuo */}
            <path
              d="M16 42L33 30L46 36L64 14"
              stroke="#F2A900"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M52 14H64V26"
              stroke="#F2A900"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Estrella de logro */}
            <circle cx="64" cy="14" r="5" fill="#F2A900" />
          </svg>
        </div>
      )

    case "lupe":
      return (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFF4E3] to-[#FCE3B4]/70">
          <div className="absolute size-28 rounded-full bg-[#E87722]/15 animate-pulse" />
          <div className="absolute size-20 rounded-full bg-[#008375]/15" />
          {/* Ilustración: Asistente IA / Inteligencia & Ideas */}
          <svg
            className="relative size-20"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cabeza / Cerebro tecnológico robot */}
            <rect
              x="22"
              y="26"
              width="36"
              height="36"
              rx="10"
              fill="#008375"
            />
            {/* Ojos inteligentes */}
            <circle cx="33" cy="40" r="4.5" fill="#F2A900" />
            <circle cx="47" cy="40" r="4.5" fill="#F2A900" />
            <path
              d="M34 50C36 52 38 53 40 53C42 53 44 52 46 50"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Antena / Foco de idea */}
            <path
              d="M40 26V18"
              stroke="#008375"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="40" cy="14" r="5" fill="#E87722" />
            {/* Destellos de IA */}
            <path
              d="M64 26L60 30M64 34L60 30M60 30H68"
              stroke="#E87722"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M16 26L20 30M16 34L20 30M20 30H12"
              stroke="#F2A900"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )

    default:
      return null
  }
}

// Configuración de los 5 servicios con enlaces configurables
const EXTERNAL_SERVICES = [
  {
    id: "asisconnection",
    title: "ASISCONNECTION",
    category: "Comunidad UP",
    badgeLabel: "Comunidad",
    badgeBg: "bg-[#E7F7F5] text-[#008375] border-[#008375]/30",
    description:
      "Plataforma de comunicación, integración y red comunitaria para beneficiarios, voluntarios y aliados de la fundación.",
    url: "https://asisconnection.fundacionasisco.org",
  },
  {
    id: "suma21",
    title: "SUMA 21",
    category: "Donaciones y Ventas",
    badgeLabel: "Finanzas & Tienda",
    badgeBg: "bg-[#FFF4E3] text-[#E87722] border-[#E87722]/30",
    description:
      "Sistema de gestión de donaciones monetarias, insumos en especie y ventas solidarias para la sostenibilidad de programas.",
    url: "https://suma21-backend.onrender.com",
  },
  {
    id: "aulaup",
    title: "AULA UP",
    category: "Educación",
    badgeLabel: "Educación",
    badgeBg: "bg-[#FFFBEB] text-[#8A5A00] border-[#F2A900]/30",
    description:
      "Entorno virtual de aprendizaje y formación pedagógica adaptada con recursos educativos interactivos.",
    url: "https://aulaup.fundacionasisco.org",
  },
  {
    id: "sonup",
    title: "SON UP",
    category: "Seguimiento y Desarrollo",
    badgeLabel: "Seguimiento",
    badgeBg: "bg-[#E7F7F5] text-[#008375] border-[#008375]/30",
    description:
      "Monitoreo del desarrollo individual, evolución de habilidades y progreso continuo de cada joven beneficiario.",
    url: "https://sonup.fundacionasisco.org",
  },
  {
    id: "lupe",
    title: "LUPE",
    category: "Inteligencia Artificial",
    badgeLabel: "IA & Proyectos",
    badgeBg: "bg-[#FFF4E3] text-[#E87722] border-[#E87722]/30",
    description:
      "Asistente inteligente con Inteligencia Artificial para la formulación de proyectos, convocatorias y propuestas sociales.",
    url: "https://lupe-ai.fundacionasisco.org",
  },
]

export default function ServicesScreen() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* 2. ENCABEZADO (conservado tal como está) */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">
          Más Servicios
        </h1>
        <p className="mt-1 text-sm font-semibold text-muted">
          Ecosistema digital de proyectos integrados de la Fundación ASISCO UP
        </p>
      </div>

      {/* 3 & 4. CUADRÍCULA RESPONSIVE CON TARJETAS DE ALTURA UNIFORME */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {EXTERNAL_SERVICES.map((service) => (
          <article
            key={service.id}
            className="flex flex-col h-full overflow-hidden rounded-3xl border border-border bg-surface shadow-card hover:border-[#008375]/40 hover:shadow-md transition-all duration-200"
          >
            {/* Ilustración genérica grande consistente (altura fija h-44) */}
            <div className="relative h-44 w-full shrink-0 overflow-hidden border-b border-border/60">
              <ServiceIllustration serviceId={service.id} />
              {/* Etiqueta pequeña flotante con su categoría */}
              <div className="absolute top-3.5 right-3.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold border shadow-xs ${service.badgeBg}`}
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-current"
                  />
                  {service.badgeLabel}
                </span>
              </div>
            </div>

            {/* Cuerpo de la tarjeta con jerarquía tipográfica limpia */}
            <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
              <div>
                {/* Nombre del servicio */}
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                  {service.title}
                </h2>
                {/* Nombre de su categoría */}
                <p className="text-xs font-bold text-[#E87722] mt-0.5">
                  {service.category}
                </p>

                {/* Descripción breve */}
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Botón de redireccionamiento a la plataforma */}
              <div className="mt-6 pt-4 border-t border-border">
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#008375] px-4 py-2 text-sm font-extrabold text-white shadow-xs transition-all hover:bg-[#086B65] hover:brightness-105 active:scale-[0.98]"
                >
                  <span>Ir a la plataforma</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.2}
                    stroke="currentColor"
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
