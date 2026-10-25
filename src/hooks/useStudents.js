import { useEffect, useState } from "react"
import { studentService } from "../services/studentService"

export function useStudents() {
  const [students, setStudents] = useState([])
  const [acudientes, setAcudientes] = useState([])
  const [matriculas, setMatriculas] = useState([])
  const [pagos, setPagos] = useState([])
  const [padrinos, setPadrinos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadStudents = async () => {
    setLoading(true)
    setError("")

    try {
      const data = await studentService.getStudentData()
      setStudents(data.students)
      setAcudientes(data.acudientes)
      setMatriculas(data.matriculas)
      setPagos(data.pagos)
      setPadrinos(data.padrinos)
    } catch (requestError) {
      setError(requestError.message || "No fue posible cargar los beneficiarios.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const createStudent = async (studentData) => {
    const student = await studentService.createStudent(studentData)
    setStudents((current) => [...current, student])
    return student
  }

  const createStudentWithAcudiente = async (studentData, guardianData) => {
    const student = await studentService.createStudentWithAcudiente(
      studentData,
      guardianData,
    )
    const data = await studentService.getStudentData()
    setStudents(data.students)
    setAcudientes(data.acudientes)
    return student
  }

  const createAcudiente = async (guardianData) => {
    const guardian = await studentService.createAcudiente(guardianData)
    setAcudientes((current) => [...current, guardian])
    return guardian
  }

  const updateStudent = async (id, changes) => {
    try {
      const updated = await studentService.updateStudent(id, changes)
      setStudents((current) =>
        current.map((student) => (student.id === id ? updated : student)),
      )
      return { ok: true, message: "Beneficiario actualizado correctamente." }
    } catch (requestError) {
      return {
        ok: false,
        message: requestError.message || "No fue posible actualizar el registro.",
      }
    }
  }

  const deleteStudent = async (id) => {
    try {
      await studentService.deleteStudent(id)
      setStudents((current) => current.filter((student) => student.id !== id))
      return { ok: true, message: "Beneficiario eliminado correctamente." }
    } catch (requestError) {
      return {
        ok: false,
        message: requestError.message || "No fue posible eliminar el registro.",
      }
    }
  }

  return {
    students,
    acudientes,
    matriculas,
    pagos,
    padrinos,
    loading,
    error,
    loadStudents,
    createStudent,
    createStudentWithAcudiente,
    createAcudiente,
    updateStudent,
    deleteStudent,
  }
}
