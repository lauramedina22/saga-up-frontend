import apiClient from "../api/apiClient"
import { readList } from "../models/modelUtils"
import { findCatalogLabel, fromCatalogApi } from "../models/catalogModel"

// Tablas de catálogo expuestas por el backend: ruta y nombre del identificador
export const CATALOG_ENDPOINTS = {
  sexes: { path: "/sexes", idKey: "sex_id" },
  document_types: { path: "/document-types", idKey: "document_type_id" },
  child_statuses: { path: "/child-statuses", idKey: "child_status_id" },
  legal_statuses: { path: "/legal-statuses", idKey: "legal_status_id" },
  guardianship_types: { path: "/guardianship-types", idKey: "guardianship_type_id" },
  payment_methods: { path: "/payment-methods", idKey: "payment_method_id" },
  tuition_statuses: { path: "/tuition-statuses", idKey: "tuition_status_id" },
  staff_roles: { path: "/staff-roles", idKey: "staff_role_id" },
  contract_types: { path: "/contract-types", idKey: "contract_type_id" },
  staff_statuses: { path: "/staff-statuses", idKey: "staff_status_id" },
}

// Caché de promesas: evita pedir el mismo catálogo varias veces,
// incluso si varias pantallas lo solicitan al mismo tiempo.
const requestCache = new Map()
const loadedCatalogs = new Map()

async function fetchCatalog(catalogKey) {
  const config = CATALOG_ENDPOINTS[catalogKey]
  if (!config) {
    throw new Error(`El catálogo "${catalogKey}" no está configurado.`)
  }

  const response = await apiClient.get(config.path)
  const rawList = readList(response)
  if (!rawList) {
    throw new Error(`La respuesta del catálogo "${catalogKey}" no es válida.`)
  }

  const options = rawList
    .map((item) => fromCatalogApi(item, config.idKey))
    .filter(Boolean)
  loadedCatalogs.set(catalogKey, options)
  return options
}

export const catalogService = {
  // Obtiene las opciones de un catálogo desde el backend
  getCatalog(catalogKey) {
    if (!requestCache.has(catalogKey)) {
      const request = fetchCatalog(catalogKey).catch((error) => {
        // Si falla, se elimina de la caché para permitir reintentar
        requestCache.delete(catalogKey)
        throw error
      })
      requestCache.set(catalogKey, request)
    }
    return requestCache.get(catalogKey)
  },

  // Carga simultánea de varios catálogos
  async getCatalogs(keys = []) {
    const entries = await Promise.all(
      keys.map(async (key) => [key, await this.getCatalog(key)]),
    )
    return Object.fromEntries(entries)
  },

  // Etiqueta legible de un catálogo ya cargado; "" si aún no está disponible
  findLabel(catalogKey, id) {
    return findCatalogLabel(loadedCatalogs.get(catalogKey), id)
  },

  // Limpia la caché (p. ej. al cerrar sesión)
  clearCache() {
    requestCache.clear()
    loadedCatalogs.clear()
  },
}
