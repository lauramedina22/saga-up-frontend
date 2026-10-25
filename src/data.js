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

export const students = [
  {
    id: "student-demo-1",
    nombre: "Beneficiario de prueba 1",
    fechaNacimiento: "2016-03-14",
    edad: 10,
    acudienteId: "guardian-demo-1",
    estadoMatricula: "activa",
    nivelPago: "al_dia",
    direccion: "Dirección ficticia 1",
    barrio: "Barrio de prueba",
    ciudad: "Ciudad de prueba",
    observaciones: "Registro ficticio para probar la pantalla.",
    eps: "EPS de prueba",
    estadoAfiliacion: "Activa",
    condicionesSalud: "",
    alergias: "",
    medicamentos: "",
    restriccionesAlimentarias: "",
    apoyos: "Apoyo de prueba",
    formasComunicacion: "Comunicación de prueba",
    apoyosRutina: "",
    leGusta: "Actividad de prueba",
    manejoCrisis: "",
    institucionEducativa: "Institución de prueba",
    grado: "Primero",
    jornada: "Mañana",
    terapiasExternas: "",
    documentos: [],
  },
  {
    id: "student-demo-2",
    nombre: "Beneficiario de prueba 2",
    fechaNacimiento: "2018-07-22",
    edad: 8,
    acudienteId: "guardian-demo-2",
    estadoMatricula: "pendiente",
    nivelPago: "pendiente",
    direccion: "Dirección ficticia 2",
    barrio: "Barrio de prueba",
    ciudad: "Ciudad de prueba",
    observaciones: "Segundo registro ficticio.",
    eps: "",
    estadoAfiliacion: "",
    condicionesSalud: "",
    alergias: "",
    medicamentos: "",
    restriccionesAlimentarias: "",
    apoyos: "",
    formasComunicacion: "",
    apoyosRutina: "",
    leGusta: "",
    manejoCrisis: "",
    institucionEducativa: "",
    grado: "",
    jornada: "",
    terapiasExternas: "",
    documentos: [],
  },
]

export const acudientes = [
  {
    id: "guardian-demo-1",
    nombre: "Acudiente de prueba 1",
    parentesco: "Familiar",
    telefono: "0000000000",
    whatsapp: "0000000000",
    correo: "acudiente1@example.test",
    studentsIds: ["student-demo-1"],
  },
  {
    id: "guardian-demo-2",
    nombre: "Acudiente de prueba 2",
    parentesco: "Familiar",
    telefono: "0000000000",
    whatsapp: "0000000000",
    correo: "acudiente2@example.test",
    studentsIds: ["student-demo-2"],
  },
]

export const matriculas = [
  {
    id: "enrollment-demo-1",
    studentId: "student-demo-1",
    anio: 2026,
    fechaInicio: "2026-02-03",
    valor: 350000,
  },
  {
    id: "enrollment-demo-2",
    studentId: "student-demo-2",
    anio: 2026,
    fechaInicio: "2026-02-03",
    valor: 350000,
  },
]

export const pagos = [
  {
    id: "payment-demo-1",
    studentId: "student-demo-1",
    mes: "2026-05",
    valor: 120000,
    estado: "pagado",
  },
  {
    id: "payment-demo-2",
    studentId: "student-demo-1",
    mes: "2026-06",
    valor: 120000,
    estado: "pagado",
  },
  {
    id: "payment-demo-3",
    studentId: "student-demo-2",
    mes: "2026-06",
    valor: 120000,
    estado: "pendiente",
  },
]

export const padrinos = [
  {
    id: "sponsor-demo-1",
    studentId: "student-demo-1",
    nombre: "Padrino de prueba",
    contacto: "Contacto ficticio",
    correo: "padrino@example.test",
    asignaciones: [
      {
        id: "assignment-demo-1",
        destinoId: "student-demo-1",
        monto: 150000,
        periodicidad: "Mensual",
        estado: "Activo",
      },
    ],
  },
]
