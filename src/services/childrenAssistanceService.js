import apiClient from "../api/apiClient"
import { readList, readRecord } from "../models/modelUtils.js"
import {
  toChildrenAssistanceModel,
  toChildrenAssistancePayload,
} from "../models/childrenAssistanceModel.js"

const ASSISTANCE_ENDPOINT = "/children-assistance"

function getAssistanceList(response) {
  const records = readList(response, "children_assistance", "assistance")

  if (!Array.isArray(records)) {
    throw new Error(
      "La respuesta del servidor no contiene una lista de children_assistance.",
    )
  }

  return records.map(toChildrenAssistanceModel)
}

function getAssistance(response, childId) {
  const record = toChildrenAssistanceModel(
    readRecord(response, "children_assistance", "assistance"),
  )
  if (!record.childrenAssistanceId) {
    throw new Error(
      "La respuesta del servidor no contiene un registro de asistencia válido.",
    )
  }
  return { ...record, childId: String(childId) }
}

export const childrenAssistanceService = {
  // GET /children-assistance
  async getAll() {
    return getAssistanceList(await apiClient.get(ASSISTANCE_ENDPOINT))
  },

  // GET /children-assistance?child_id=
  async getForChild(childId) {
    const query = new URLSearchParams({ child_id: String(childId) })
    return getAssistanceList(
      await apiClient.get(`${ASSISTANCE_ENDPOINT}?${query}`),
    )
  },

  // POST /children-assistance
  async create(childId, assistance) {
    return getAssistance(
      await apiClient.post(
        ASSISTANCE_ENDPOINT,
        toChildrenAssistancePayload({ ...assistance, childId }),
      ),
      childId,
    )
  },

  // PUT /children-assistance/:id
  async update(childId, assistanceId, changes) {
    return getAssistance(
      await apiClient.put(
        `${ASSISTANCE_ENDPOINT}/${assistanceId}`,
        toChildrenAssistancePayload({ ...changes, childId }),
      ),
      childId,
    )
  },

  // DELETE /children-assistance/:id
  async delete(childId, assistanceId) {
    return apiClient.delete(`${ASSISTANCE_ENDPOINT}/${assistanceId}`)
  },
}
