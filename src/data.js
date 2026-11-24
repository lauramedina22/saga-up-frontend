export const formatCOP = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value)

export const formatFecha = (date) => {
  if (!date) return "Sin registrar"
  const parsedDate = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsedDate.getTime())
    ? "Sin registrar"
    : new Intl.DateTimeFormat("es-CO").format(parsedDate)
}

export const formatTime = (time) => {
  if (!time) return ""
  const match = String(time).match(/(?:T|\b)(\d{2}:\d{2})/)
  return match ? match[1] : String(time).slice(0, 5)
}

export const formatTime12 = (time) => {
  const normalized = formatTime(time)
  if (!normalized) return "--:--"
  const [hourText, minute] = normalized.split(":")
  const hour = Number(hourText)
  if (!Number.isFinite(hour)) return normalized
  const suffix = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  return `${String(hour12).padStart(2, "0")}:${minute} ${suffix}`
}

export const plantillas = [
  {
    tipo: "confirmacion_datos",
    contenido: `Hola {{acudiente}}, 😊

Desde SAGA UP queremos asegurarnos de tener tu información actualizada para estar siempre en contacto contigo.

Por favor, confírmanos si estos datos siguen siendo correctos:
- Teléfono: {{telefono}}
- Correo: {{correo}}
- Dirección: {{direccion}}

¡Gracias por confiar en nosotros!`,
  },
]
