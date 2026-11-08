import apiClient from "../api/apiClient"
import { readList, readRecord } from "../models/modelUtils.js"
import { toEnrollmentModel, toTuitionPayload } from "../models/enrollmentModel"

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

  // POST /tuition
  async createTuition(tuition) {
    const response = await apiClient.post(
      TUITION_ENDPOINT,
      toTuitionPayload(tuition),
    )
    return toEnrollmentModel(readRecord(response, "tuition", "payment"))
  },

  // PUT /tuition/:id
  async updateTuition(tuitionId, tuition) {
    const response = await apiClient.put(
      `${TUITION_ENDPOINT}/${tuitionId}`,
      toTuitionPayload(tuition),
    )
    return toEnrollmentModel(readRecord(response, "tuition", "payment"))
  },

  // DELETE /tuition/:id
  async deleteTuition(tuitionId) {
    return apiClient.delete(`${TUITION_ENDPOINT}/${tuitionId}`)
  },
}
