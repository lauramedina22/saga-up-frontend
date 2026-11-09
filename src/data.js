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
