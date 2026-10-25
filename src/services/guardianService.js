import apiClient from "../api/apiClient"
import { toGuardianModel, toGuardianPayload } from "../models/guardianModel"

const GUARDIANS_ENDPOINT = "/guardians"

function getGuardianList(response) {
  const guardians = Array.isArray(response)? response : response?.guardians

  if (!Array.isArray(guardians)) {
    throw new Error("La respuesta del servidor no contiene una lista de guardians.")
  }

  return guardians.map(toGuardianModel)
}

function getGuardianRecord(response) {
  const rawGuardian = response?.guardian ?? response

  if (!rawGuardian || typeof rawGuardian !== "object") {
    throw new Error("La respuesta del servidor no contiene un guardian válido.")
  }

  const guardian = toGuardianModel(rawGuardian)
  if (!guardian.id) {
    throw new Error("La respuesta del servidor no contiene un guardian válido.")
  }
  return guardian
}

export const guardianService = {
  async getGuardianData() {
    const response = await apiClient.get(GUARDIANS_ENDPOINT)
    return { guardians: getGuardianList(response) }
  },

  async createGuardian(data) {
    const { childrenIds, ...guardianData } = data
    return getGuardianRecord(
      await apiClient.post(
        GUARDIANS_ENDPOINT,
        toGuardianPayload(guardianData),
      ),
    )
  },

  async deleteGuardian(id) {
    return apiClient.delete(`${GUARDIANS_ENDPOINT}/${id}`)
  },
}
