import apiClient from "../api/apiClient"
import { readList, readRecord } from "../models/modelUtils.js"
import {
  toChildRecordModel,
  toChildRecordPayload,
} from "../models/childRecordModel.js"

const CHILD_RECORDS_ENDPOINT = "/child-records"

function getRecordList(response) {
  const records = readList(response, "child_records", "records")

  if (!Array.isArray(records)) {
    throw new Error(
      "La respuesta del servidor no contiene una lista de child_records.",
    )
  }

  return records.map(toChildRecordModel)
}

function getRecord(response) {
  const record = toChildRecordModel(
    readRecord(response, "child_record", "record"),
  )

  if (!record.recordId) {
    throw new Error("La respuesta del servidor no contiene un record válido.")
  }

  return record
}

export const childRecordService = {
  // GET /child-records
  async getRecords() {
    return getRecordList(await apiClient.get(CHILD_RECORDS_ENDPOINT))
  },

  // GET /child-records?child_id=
  async getRecordsForChild(childId) {
    const query = new URLSearchParams({ child_id: String(childId) })
    return getRecordList(
      await apiClient.get(`${CHILD_RECORDS_ENDPOINT}?${query}`),
    )
  },

  // POST /child-records
  async createRecord(childId, record) {
    return {
      ...getRecord(
        await apiClient.post(
          CHILD_RECORDS_ENDPOINT,
          toChildRecordPayload({ ...record, childId }, { includeChildId: true }),
        ),
      ),
      childId: String(childId),
    }
  },

  // PUT /child-records/:id (child_id no es editable)
  async updateRecord(childId, recordId, changes) {
    return {
      ...getRecord(
        await apiClient.put(
          `${CHILD_RECORDS_ENDPOINT}/${recordId}`,
          toChildRecordPayload(changes),
        ),
      ),
      childId: String(childId),
    }
  },

  // API.md: /child-records NO tiene DELETE (el historial debe conservarse)
  async deleteRecord() {
    throw new Error(
      "El backend no permite eliminar fichas de salud: el historial debe conservarse.",
    )
  },
}
