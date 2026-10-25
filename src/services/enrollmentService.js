import apiClient from "../api/apiClient"

const ENROLLMENTS_ENDPOINT = "/enrollments"

function getEnrollmentList(response) {
  const enrollments = Array.isArray(response)
    ? response
    : response?.enrollments

  if (!Array.isArray(enrollments)) {
    throw new Error(
      "La respuesta del servidor no contiene una lista de enrollments.",
    )
  }

  return enrollments
}

export const enrollmentService = {
  async getEnrollmentData() {
    const response = await apiClient.get(ENROLLMENTS_ENDPOINT)
    return { enrollments: getEnrollmentList(response) }
  },
}
