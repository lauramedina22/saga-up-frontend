import apiClient from "../api/apiClient"
import { readList } from "../models/modelUtils.js"
import { toEnrollmentModel } from "../models/enrollmentModel"

// API.md: las matrículas/pagos se exponen en /tuition
const TUITION_ENDPOINT = "/tuition"

function getEnrollmentList(response) {
  const enrollments = readList(
    response,
    "tuition",
    "enrollments",
    "payments",
  )

  if (!Array.isArray(enrollments)) {
    throw new Error(
      "La respuesta del servidor no contiene una lista de matrículas o tuition.",
    )
  }

  return enrollments.map(toEnrollmentModel)
}

export const enrollmentService = {
  // GET /tuition
  async getEnrollmentData() {
    const response = await apiClient.get(TUITION_ENDPOINT)
    return { enrollments: getEnrollmentList(response) }
  },
}
