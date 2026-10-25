import {
  acudientes as initialGuardians,
  matriculas as initialEnrollments,
  padrinos as initialSponsors,
  pagos as initialPayments,
  students as initialStudents,
} from "../data"

const copy = (value) => JSON.parse(JSON.stringify(value))

let students = copy(initialStudents)
let acudientes = copy(initialGuardians)
let matriculas = copy(initialEnrollments)
let pagos = copy(initialPayments)
let padrinos = copy(initialSponsors)

function calculateAge(dateOfBirth) {
  const birthDate = new Date(`${dateOfBirth}T00:00:00`)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1
  }

  return age
}

function toStudentRecord(data) {
  return {
    ...data,
    id: data.id ?? `student-${Date.now()}`,
    nombre: `${data.nombres} ${data.apellidos}`.trim(),
    edad: calculateAge(data.fechaNacimiento),
    nivelPago: data.nivelPago ?? "pendiente",
    documentos: data.documentos ?? [],
  }
}

function createGuardianRecord(data) {
  const id = `guardian-${Date.now()}`
  return {
    ...data,
    id,
    nombre: `${data.nombres} ${data.apellidos}`.trim(),
    studentsIds: data.ninosIds ?? [],
  }
}

export const studentService = {
  async getStudentData() {
    return copy({ students, acudientes, matriculas, pagos, padrinos })
  },

  async createStudent(data) {
    const student = toStudentRecord(data)
    students = [...students, student]
    return copy(student)
  },

  async createStudentWithAcudiente(studentData, guardianData) {
    const guardian = createGuardianRecord(guardianData)
    const student = toStudentRecord({
      ...studentData,
      acudienteId: guardian.id,
    })
    guardian.studentsIds = [student.id]
    acudientes = [...acudientes, guardian]
    students = [...students, student]
    return copy(student)
  },

  async createAcudiente(data) {
    const guardian = createGuardianRecord(data)
    acudientes = [...acudientes, guardian]
    return copy(guardian)
  },

  async updateStudent(id, changes) {
    const existing = students.find((student) => student.id === id)
    if (!existing) throw new Error("No se encontró el beneficiario.")

    const updated = { ...existing, ...changes }
    if (changes.nombres || changes.apellidos) {
      updated.nombre = [changes.nombres, changes.apellidos]
        .filter(Boolean)
        .join(" ")
    }
    students = students.map((student) => (student.id === id ? updated : student))
    return copy(updated)
  },

  async deleteStudent(id) {
    const hasEnrollment = matriculas.some((item) => item.studentId === id)
    const hasPayment = pagos.some((item) => item.studentId === id)
    const hasSponsor = padrinos.some(
      (item) =>
        item.studentId === id ||
        item.asignaciones?.some((assignment) => assignment.destinoId === id),
    )

    if (hasEnrollment || hasPayment || hasSponsor) {
      throw new Error(
        "No se puede eliminar: el registro tiene matrículas, pagos o padrinos relacionados.",
      )
    }

    students = students.filter((student) => student.id !== id)
    acudientes = acudientes.map((guardian) => ({
      ...guardian,
      studentsIds: (guardian.studentsIds ?? []).filter(
        (studentId) => studentId !== id,
      ),
    }))
  },
}
