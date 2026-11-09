export function readValue(source, ...keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source[key] !== null) {
      return source[key]
    }
  }
  return undefined
}

export function normalizeDate(value) {
  if (value === undefined || value === null || value === "") return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value.toISOString().slice(0, 10)
  }

  const dateText = String(value)
  const dateOnly = dateText.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
  if (dateOnly) return dateOnly

  const parsedDate = new Date(dateText)
  return Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate.toISOString().slice(0, 10)
}

export function normalizeNumber(value) {
  if (value === undefined || value === null || value === "") return null
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

export function normalizeId(value) {
  if (value === undefined || value === null || value === "") return null
  return String(value)
}

export function normalizeBoolean(value) {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value !== 0
  if (typeof value === "string") {
    return ["true", "1", "yes", "si", "sí"].includes(
      value.trim().toLowerCase(),
    )
  }
  return false
}

// Texto opcional: el backend acepta string o null
export function normalizeText(value) {
  if (value === undefined || value === null) return null
  const text = String(value).trim()
  return text === "" ? null : text
}

// Llaves foráneas (FK): el backend exige un entero positivo o null
export function toForeignKey(value, label) {
  if (value === undefined || value === null || value === "") return null
  const text = String(value).trim()
  if (text === "") return null
  if (!/^[1-9]\d*$/.test(text)) {
    throw new Error(
      `El campo "${label}" debe ser el código numérico registrado en el sistema.`,
    )
  }
  return text
}

// Lee la etiqueta legible de una relación incluida por el backend
// (p. ej. document_types: { name: "Cédula" }). Si no existe, usa el id.
export function readRelationLabel(source, relationKeys, idKey) {
  for (const key of relationKeys) {
    const relation = source?.[key]
    if (relation && typeof relation === "object") {
      const label = readValue(relation, "name", "description", "label", "code")
      if (label !== undefined) return String(label)
    }
    if (typeof relation === "string" && relation) return relation
  }
  const id = source?.[idKey]
  return id === undefined || id === null ? "" : String(id)
}

// Extrae la lista de una respuesta (arreglo directo o envuelto)
export function readList(response, ...keys) {
  if (Array.isArray(response)) return response
  for (const key of [...keys, "data", "items"]) {
    if (Array.isArray(response?.[key])) return response[key]
  }
  return null
}

// Extrae un registro de una respuesta (directo o envuelto)
export function readRecord(response, ...keys) {
  for (const key of [...keys, "data"]) {
    const value = response?.[key]
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value
    }
  }
  return response
}
