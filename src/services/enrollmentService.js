import apiClient from "../api/apiClient"
import { toEnrollmentModel } from "../models/enrollmentModel"

const ENROLLMENTS_ENDPOINT = "/enrollments"

function getEnrollmentList(response) {
  const enrollments = Array.isArray(response)
    ? response
    : response?.enrollments ?? response?.tuition ?? response?.payments

  if (!Array.isArray(enrollments)) {
    throw new Error(
      "La respuesta del servidor no contiene una lista de matrículas o tuition.",
    )
  }

  return enrollments.map(toEnrollmentModel)
}

export const enrollmentService = {
  async getEnrollmentData() {
    const response = await apiClient.get(ENROLLMENTS_ENDPOINT)
    return { enrollments: getEnrollmentList(response) }
  },
}
