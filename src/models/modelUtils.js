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
