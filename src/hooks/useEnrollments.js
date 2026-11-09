import { useEffect, useState } from "react"
import { childService } from "../services/childService"
import { enrollmentService } from "../services/enrollmentService"

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState([])
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadEnrollments = async () => {
    setLoading(true)
    setError("")

    try {
      const [enrollmentData, childData] = await Promise.all([
        enrollmentService.getEnrollmentData(),
        childService.getChildrenData(),
      ])
      setEnrollments(enrollmentData.enrollments)
      setChildren(childData.children)
    } catch (requestError) {
      setError(
        requestError.message || "No fue posible cargar las matrículas.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnrollments()
  }, [])

  const createTuition = async (tuitionData) => {
    const created = await enrollmentService.createTuition(tuitionData)
    setEnrollments((current) => [...current, created])
    return created
  }

  const updateTuition = async (tuitionId, tuitionData) => {
    const updated = await enrollmentService.updateTuition(tuitionId, tuitionData)
    setEnrollments((current) =>
      current.map((item) => (item.id === tuitionId ? updated : item)),
    )
    return updated
  }

  const deleteTuition = async (tuitionId) => {
    try {
      await enrollmentService.deleteTuition(tuitionId)
      setEnrollments((current) =>
        current.filter((item) => item.id !== tuitionId),
      )
      return { ok: true, message: "Pago de matrícula eliminado correctamente." }
    } catch (requestError) {
      return {
        ok: false,
        message:
          requestError.message || "No fue posible eliminar la matrícula.",
      }
    }
  }

  return {
    enrollments,
    children,
    loading,
    error,
    loadEnrollments,
    createTuition,
    updateTuition,
    deleteTuition,
  }
}
