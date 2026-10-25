import apiClient from "../api/apiClient"
import {
  toGuardianModel,
  toGuardianPayload,
} from "../models/guardianModel.js"

const GUARDIANS_ENDPOINT = "/guardians"

function getGuardianList(response) {
  const guardians = Array.isArray(response) ? response : response?.guardians

  if (!Array.isArray(guardians)) {
    throw new Error(
      "La respuesta del servidor no contiene una lista de guardians.",
    )
  }

  return guardians.map(toGuardianModel)
}

function getGuardianRecord(response) {
  const guardian = toGuardianModel(response?.guardian ?? response)

  if (!guardian.guardianId) {
    throw new Error("La respuesta del servidor no contiene un guardian válido.")
  }

  return guardian
}

export const guardianService = {
  async getGuardianData() {
    const response = await apiClient.get(GUARDIANS_ENDPOINT)
    return { guardians: getGuardianList(response) }
  },

  async createGuardian(guardian) {
    return getGuardianRecord(
      await apiClient.post(
        GUARDIANS_ENDPOINT,
        toGuardianPayload(guardian),
      ),
    )
  },

  async deleteGuardian(guardianId) {
    return apiClient.delete(`${GUARDIANS_ENDPOINT}/${guardianId}`)
  },
}
