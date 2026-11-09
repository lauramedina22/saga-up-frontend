import { ServiceIllustration } from "../components/ServiceIllustration"

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
    buttonText: "Ir a la plataforma",
  },
  {
    id: "podcast",
    title: "PODCAST ASISCO UP",
    category: "Historias & Voces",
    badgeLabel: "Spotify",
    badgeBg: "bg-[#E7F7F5] text-[#008375] border-[#008375]/30",
    description:
      "Espacio de audio con testimonios, reflexiones y vivencias de los beneficiarios, familias y equipo de la fundación.",
    url: "https://open.spotify.com/show/6zx1TrmAWPFzaIhjaDCmZI?si=0bf11d39b5e54517",
    buttonText: "Ir a Spotify",
  },
]

export default function ServicesScreen() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">
          Más Servicios
        </h1>
      </div>

      {/* Cuadrícula Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {EXTERNAL_SERVICES.map((service) => (
          <article
            key={service.id}
            className="flex flex-col h-full overflow-hidden rounded-3xl border border-border bg-surface shadow-card hover:border-[#008375]/40 hover:shadow-md transition-all duration-200"
          >
            {/* Ilustración genérica consistente */}
            <div className="relative h-44 w-full shrink-0 overflow-hidden border-b border-border/60">
              <ServiceIllustration serviceId={service.id} />
              {/* Etiqueta flotante con su categoría */}
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

            {/* Cuerpo de la tarjeta */}
            <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                  {service.title}
                </h2>
                <p className="text-xs font-bold text-[#E87722] mt-0.5">
                  {service.category}
                </p>

                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Botón de redireccionamiento */}
              <div className="mt-6 pt-4 border-t border-border">
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#008375] px-4 py-2 text-sm font-extrabold text-white shadow-xs transition-all hover:bg-[#086B65] hover:brightness-105 active:scale-[0.98]"
                >
                  <span>{service.buttonText || "Ir a la plataforma"}</span>
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
