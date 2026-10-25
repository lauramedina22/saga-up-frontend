import apiClient from "../api/apiClient"
import {
  toChildrenAssistanceModel,
  toChildrenAssistancePayload,
} from "../models/childrenAssistanceModel.js"

const ASSISTANCE_PATH = (childId) => `/children/${childId}/assistance`

function getAssistanceList(response) {
  const records = Array.isArray(response)
    ? response
    : response?.children_assistance ?? response?.assistance

  if (!Array.isArray(records)) {
    throw new Error(
      "La respuesta del servidor no contiene una lista de children_assistance.",
    )
  }

  return records.map(toChildrenAssistanceModel)
}

function getAssistance(response, childId) {
  const record = toChildrenAssistanceModel(
    response?.children_assistance ?? response?.assistance ?? response,
  )
  if (!record.childrenAssistanceId) {
    throw new Error(
      "La respuesta del servidor no contiene un registro de asistencia válido.",
    )
  }
  return { ...record, childId: String(childId) }
}

export const childrenAssistanceService = {
  async getForChild(childId) {
    return getAssistanceList(await apiClient.get(ASSISTANCE_PATH(childId)))
  },

  async create(childId, assistance) {
    return getAssistance(
      await apiClient.post(
        ASSISTANCE_PATH(childId),
        toChildrenAssistancePayload({ ...assistance, childId }),
      ),
      childId,
    )
  },

  async update(childId, assistanceId, changes) {
    return getAssistance(
      await apiClient.put(
        `${ASSISTANCE_PATH(childId)}/${assistanceId}`,
        toChildrenAssistancePayload({ ...changes, childId }),
      ),
      childId,
    )
  },

  async delete(childId, assistanceId) {
    return apiClient.delete(
      `${ASSISTANCE_PATH(childId)}/${assistanceId}`,
    )
  },
}
