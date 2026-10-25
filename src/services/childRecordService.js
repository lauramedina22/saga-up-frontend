import apiClient from "../api/apiClient"
import {
  toChildRecordModel,
  toChildRecordPayload,
} from "../models/childRecordModel.js"

const CHILD_RECORDS_PATH = (childId) => `/children/${childId}/records`

function getRecordList(response) {
  const records = Array.isArray(response)
    ? response
    : response?.child_records ?? response?.records

  if (!Array.isArray(records)) {
    throw new Error(
      "La respuesta del servidor no contiene una lista de child_records.",
    )
  }

  return records.map(toChildRecordModel)
}

function getRecord(response) {
  const record = toChildRecordModel(
    response?.child_record ?? response?.record ?? response,
  )

  if (!record.recordId) {
    throw new Error("La respuesta del servidor no contiene un record válido.")
  }

  return record
}

export const childRecordService = {
  async getRecordsForChild(childId) {
    const response = await apiClient.get(CHILD_RECORDS_PATH(childId))
    return getRecordList(response)
  },

  async createRecord(childId, record) {
    return {
      ...getRecord(
        await apiClient.post(
          CHILD_RECORDS_PATH(childId),
          toChildRecordPayload({ ...record, childId }),
        ),
      ),
      childId: String(childId),
    }
  },

  async updateRecord(childId, recordId, changes) {
    return {
      ...getRecord(
        await apiClient.put(
          `${CHILD_RECORDS_PATH(childId)}/${recordId}`,
          toChildRecordPayload({ ...changes, childId }),
        ),
      ),
      childId: String(childId),
    }
  },

  async deleteRecord(childId, recordId) {
    return apiClient.delete(`${CHILD_RECORDS_PATH(childId)}/${recordId}`)
  },
}
