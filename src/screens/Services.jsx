import asisconnectionImg from "../imports/otros/asisconnection.jpg"
import suma21Img from "../imports/otros/suma21.jpg"
import aulaupImg from "../imports/otros/aulaup.jpg"
import sonupImg from "../imports/otros/sonup.jpg"
import lupeImg from "../imports/otros/lupe.jpg"
import { Badge, Button } from "../components/ui"

// Enlaces configurables de las plataformas externas del ecosistema UP
const EXTERNAL_SERVICES = [
  {
    id: "asisconnection",
    title: "ASISCONNECTION",
    subtitle: "Comunidad UP",
    description:
      "Plataforma de comunicación, integración y red comunitaria para beneficiarios, voluntarios y aliados de la fundación.",
    image: asisconnectionImg,
    category: "Comunidad",
    tone: "info",
    url: "https://asisconnection.fundacionasisco.org", // URL configurable
  },
  {
    id: "suma21",
    title: "SUMA 21",
    subtitle: "Donaciones y Ventas",
    description:
      "Sistema de gestión de donaciones monetarias, insumos en especie y ventas solidarias para la sostenibilidad de programas.",
    image: suma21Img,
    category: "Finanzas & Tienda",
    tone: "success",
    url: "https://suma21-backend.onrender.com", // URL configurable
  },
  {
    id: "aulaup",
    title: "AULA UP",
    subtitle: "Educación",
    description:
      "Entorno virtual de aprendizaje y formación pedagógica adaptada con recursos educativos interactivos.",
    image: aulaupImg,
    category: "Educación",
    tone: "warning",
    url: "https://aulaup.fundacionasisco.org", // URL configurable
  },
  {
    id: "sonup",
    title: "SON UP",
    subtitle: "Seguimiento y Desarrollo",
    description:
      "Monitoreo integral del desarrollo integral, evolución de habilidades y progreso continuo de cada joven.",
    image: sonupImg,
    category: "Desarrollo",
    tone: "primary",
    url: "https://sonup.fundacionasisco.org", // URL configurable
  },
  {
    id: "lupe",
    title: "LUPE",
    subtitle: "Asistente IA para Proyectos",
    description:
      "Asistente inteligente con Inteligencia Artificial diseñado para estructurar propuestas, proyectos y postulaciones a convocatorias.",
    image: lupeImg,
    category: "Inteligencia Artificial",
    tone: "danger",
    url: "https://lupe-ai.fundacionasisco.org", // URL configurable
  },
]

export default function ServicesScreen() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">
          Más Servicios
        </h1>
        <p className="mt-1 text-sm font-semibold text-muted">
          Ecosistema digital de proyectos integrados de la Fundación ASISCO UP
        </p>
      </div>

      {/* Cuadrícula de proyectos */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {EXTERNAL_SERVICES.map((service) => (
          <article
            key={service.id}
            className="flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm hover:border-primary/40 hover:shadow-md transition-all"
          >
            {/* Imagen del proyecto */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-surface-muted">
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <Badge tone={service.tone}>{service.category}</Badge>
              </div>
            </div>

            {/* Contenido descriptivo */}
            <div className="flex flex-1 flex-col p-5">
              <div>
                <h2 className="text-lg font-extrabold text-foreground">
                  {service.title}
                </h2>
                <p className="text-xs font-bold text-primary">
                  {service.subtitle}
                </p>
              </div>

              <p className="mt-3 flex-1 text-xs text-muted leading-relaxed">
                {service.description}
              </p>

              {/* Botón de redireccionamiento */}
              <div className="mt-5 pt-4 border-t border-border">
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-foreground text-xs font-extrabold shadow-sm hover:bg-primary-hover hover:text-white transition-all active:scale-98"
                >
                  <span>Ir a la plataforma</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="size-3.5"
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
