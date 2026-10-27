import apiClient from "../api/apiClient"
import { readList, readValue } from "../models/modelUtils"

// Diccionario oficial de catálogos sincronizado con el modelo de base de datos
export const CATALOG_DICTIONARY = {
  sexes: [
    { id: "1", code: "M", name: "Masculino" },
    { id: "2", code: "F", name: "Femenino" },
    { id: "3", code: "OTRO", name: "Otro" },
  ],
  document_types: [
    { id: "1", code: "RC", name: "Registro Civil (RC)" },
    { id: "2", code: "TI", name: "Tarjeta de Identidad (TI)" },
    { id: "3", code: "CC", name: "Cédula de Ciudadanía (CC)" },
    { id: "4", code: "CE", name: "Cédula de Extranjería (CE)" },
    { id: "5", code: "PA", name: "Pasaporte (PA)" },
    { id: "6", code: "PPT", name: "Permiso por Protección Temporal (PPT)" },
  ],
  child_statuses: [
    { id: "1", code: "ACTIVO", name: "Activo" },
    { id: "2", code: "INACTIVO", name: "Inactivo" },
    { id: "3", code: "EGRESADO", name: "Retirado / Egresado" },
    { id: "4", code: "EN_PROCESO", name: "En proceso" },
  ],
  legal_statuses: [
    { id: "1", code: "PADRE_MADRE", name: "Padre / Madre" },
    { id: "2", code: "TUTOR_LEGAL", name: "Tutor legal" },
    { id: "3", code: "CUSTODIO", name: "Pariente / Custodio" },
    { id: "4", code: "OTRO", name: "Otro" },
  ],
  guardianship_types: [
    { id: "1", code: "PADRE", name: "Padre" },
    { id: "2", code: "MADRE", name: "Madre" },
    { id: "3", code: "ABUELO", name: "Abuelo/a" },
    { id: "4", code: "TIO", name: "Tío/a" },
    { id: "5", code: "TUTOR", name: "Tutor legal" },
    { id: "6", code: "HERMANO", name: "Hermano/a" },
    { id: "7", code: "OTRO", name: "Otro" },
  ],
  payment_methods: [
    { id: "1", code: "EFECTIVO", name: "Efectivo" },
    { id: "2", code: "TRANSFERENCIA", name: "Transferencia bancaria" },
    { id: "3", code: "NEQUI_DAVIPLATA", name: "Nequi / Daviplata" },
    { id: "4", code: "TARJETA", name: "Tarjeta débito / crédito" },
  ],
  tuition_statuses: [
    { id: "1", code: "PENDIENTE", name: "Pendiente" },
    { id: "2", code: "PAGADO", name: "Pagado" },
    { id: "3", code: "VENCIDO", name: "Vencido" },
    { id: "4", code: "ANULADO", name: "Anulado" },
  ],
  staff_roles: [
    { id: "1", code: "DOCENTE", name: "Tallerista / Docente" },
    { id: "2", code: "PSICOLOGO", name: "Psicólogo / Terapeuta" },
    { id: "3", code: "COORDINADOR", name: "Coordinador" },
    { id: "4", code: "ADMINISTRATIVO", name: "Personal administrativo" },
  ],
  contract_types: [
    { id: "1", code: "INDEFINIDO", name: "Término indefinido" },
    { id: "2", code: "FIJO", name: "Término fijo" },
    { id: "3", code: "PRESTACION_SERVICIOS", name: "Prestación de servicios" },
    { id: "4", code: "VOLUNTARIADO", name: "Voluntariado" },
  ],
  staff_statuses: [
    { id: "1", code: "ACTIVO", name: "Activo" },
    { id: "2", code: "INACTIVO", name: "Inactivo" },
    { id: "3", code: "LICENCIA", name: "En licencia" },
    { id: "4", code: "RETIRADO", name: "Retirado" },
  ],
}

// Rutas habituales candidatas en la API para cada catálogo
const CATALOG_PATHS = {
  sexes: ["/catalogs/sexes", "/sexes", "/api/sexes"],
  document_types: ["/catalogs/document-types", "/document-types", "/document_types", "/api/document-types"],
  child_statuses: ["/catalogs/child-statuses", "/child-statuses", "/child_statuses", "/api/child-statuses"],
  legal_statuses: ["/catalogs/legal-statuses", "/legal-statuses", "/legal_statuses", "/api/legal-statuses"],
  guardianship_types: ["/catalogs/guardianship-types", "/guardianship-types", "/guardianship_types", "/api/guardianship-types"],
  payment_methods: ["/catalogs/payment-methods", "/payment-methods", "/payment_methods", "/api/payment-methods"],
  tuition_statuses: ["/catalogs/tuition-statuses", "/tuition-statuses", "/tuition_statuses", "/api/tuition-statuses"],
  staff_roles: ["/catalogs/staff-roles", "/staff-roles", "/staff_roles", "/api/staff-roles"],
  contract_types: ["/catalogs/contract-types", "/contract-types", "/contract_types", "/api/contract-types"],
  staff_statuses: ["/catalogs/staff-statuses", "/staff-statuses", "/staff_statuses", "/api/staff-statuses"],
}

const memoryCache = new Map()

function normalizeCatalogItem(item, catalogKey) {
  if (!item || typeof item !== "object") return null
  const singular = catalogKey.endsWith("es")
    ? catalogKey.slice(0, -2)
    : catalogKey.endsWith("s")
      ? catalogKey.slice(0, -1)
      : catalogKey

  const rawId = readValue(
    item,
    "id",
    `${singular}_id`,
    `${catalogKey}_id`,
    "value",
    "key",
  )
  const id = rawId !== undefined && rawId !== null ? String(rawId) : ""
  const code = String(readValue(item, "code", "slug", "key") ?? "").trim()
  const name = String(
    readValue(item, "name", "nombre", "label", "description", "title") ?? code,
  ).trim()

  return id ? { id, code, name: name || `Opción ${id}` } : null
}

export const catalogService = {
  // Obtiene los elementos de un catálogo. Intenta consumir de la API y si no
  // está disponible o falla, utiliza el catálogo sincronizado del diccionario de datos.
  async getCatalog(catalogKey) {
    if (memoryCache.has(catalogKey)) {
      return memoryCache.get(catalogKey)
    }

    const fallbackOptions = CATALOG_DICTIONARY[catalogKey] ?? []
    const paths = CATALOG_PATHS[catalogKey] ?? [`/${catalogKey}`]

    for (const path of paths) {
      try {
        const response = await apiClient.get(path)
        const rawList = readList(response, catalogKey, "items", "data")
        if (Array.isArray(rawList) && rawList.length > 0) {
          const normalized = rawList
            .map((item) => normalizeCatalogItem(item, catalogKey))
            .filter(Boolean)
          if (normalized.length > 0) {
            memoryCache.set(catalogKey, normalized)
            return normalized
          }
        }
      } catch {
        // Continuar al siguiente endpoint o al fallback del diccionario
      }
    }

    // Usar catálogo de diccionario como valor por defecto garantizado
    memoryCache.set(catalogKey, fallbackOptions)
    return fallbackOptions
  },

  // Carga simultánea de múltiples catálogos
  async getCatalogs(keys = []) {
    const entries = await Promise.all(
      keys.map(async (key) => [key, await this.getCatalog(key)]),
    )
    return Object.fromEntries(entries)
  },

  // Retorna la etiqueta para mostrar en UI dada la llave y el ID
  findLabel(catalogKey, id) {
    if (id === undefined || id === null || id === "") return ""
    const stringId = String(id)
    const options = memoryCache.get(catalogKey) ?? CATALOG_DICTIONARY[catalogKey] ?? []
    const found = options.find((opt) => String(opt.id) === stringId)
    return found?.name ?? stringId
  },

  // Limpia el caché en memoria si se requiere refrescar
  clearCache() {
    memoryCache.clear()
  },
}
