import { normalizeId, readValue } from "./modelUtils"

// Adapta una fila de catálogo del backend al formato usado por los selectores.
// El backend envía el identificador con el nombre de su columna
// (p. ej. { sex_id, code, name }), aunque el Swagger documenta "id".
export function fromCatalogApi(item, idKey) {
  if (!item || typeof item !== "object") return null

  const id = normalizeId(readValue(item, idKey, "id"))
  if (!id) return null

  const code = String(readValue(item, "code") ?? "").trim()
  const name = String(readValue(item, "name") ?? "").trim()

  return { id, code, name: name || code || `Opción ${id}` }
}

// Devuelve el nombre legible de una opción del catálogo o "" si no existe
export function findCatalogLabel(options, id) {
  if (id === undefined || id === null || id === "") return ""
  const found = options?.find((option) => option.id === String(id))
  return found?.name ?? ""
}

