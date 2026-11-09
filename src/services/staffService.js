import apiClient from "../api/apiClient"
import {
  toInternModel,
  toInternPayload,
  toProfessionalModel,
  toProfessionalPayload,
  toStaffModel,
  toStaffPayload,
} from "../models/staffModel.js"

function listFrom(response, keys = []) {
  if (Array.isArray(response)) return response
  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key]
  }
  if (Array.isArray(response?.data)) return response.data
  return []
}

function modelId(model, key) {
  return model?.[key] ?? model?.id
}

export const staffService = {
  async getStaff() {
    return listFrom(await apiClient.get("/staff"), ["staff"]).map(toStaffModel)
  },

  async getStaffByDocument(documentNumber) {
    return toStaffModel(await apiClient.get(`/staff/document/${encodeURIComponent(documentNumber)}`))
  },

  async createStaff(model) {
    return toStaffModel(await apiClient.post("/staff", toStaffPayload(model)))
  },

  async updateStaff(id, model, partial = false) {
    const payload = toStaffPayload(model)
    const response = partial
      ? await apiClient.patch(`/staff/${id}`, payload)
      : await apiClient.put(`/staff/${id}`, payload)
    return toStaffModel(response)
  },

  async deleteStaff(id) {
    return apiClient.delete(`/staff/${id}`)
  },

  async linkAccount(id, securityUserId) {
    return apiClient.post(`/staff/${id}/link-account`, {
      security_user_id: securityUserId,
    })
  },

  async unlinkAccount(id) {
    return apiClient.delete(`/staff/${id}/link-account`)
  },

  async getProfessionals() {
    return listFrom(await apiClient.get("/professionals"), ["professionals"]).map(
      toProfessionalModel,
    )
  },

  async createProfessional(model) {
    return toProfessionalModel(
      await apiClient.post("/professionals", toProfessionalPayload(model)),
    )
  },

  async updateProfessional(id, model, partial = true) {
    const payload = toProfessionalPayload(model)
    const response = partial
      ? await apiClient.patch(`/professionals/${id}`, payload)
      : await apiClient.put(`/professionals/${id}`, payload)
    return toProfessionalModel(response)
  },

  async deleteProfessional(id) {
    return apiClient.delete(`/professionals/${id}`)
  },

  async getInterns(staffId = "") {
    const query = staffId ? `?staff_id=${encodeURIComponent(staffId)}` : ""
    return listFrom(await apiClient.get(`/interns${query}`), ["interns"]).map(
      toInternModel,
    )
  },

  async createIntern(model) {
    return toInternModel(await apiClient.post("/interns", toInternPayload(model)))
  },

  async updateIntern(id, model, partial = true) {
    const payload = toInternPayload(model)
    const response = partial
      ? await apiClient.patch(`/interns/${id}`, payload)
      : await apiClient.put(`/interns/${id}`, payload)
    return toInternModel(response)
  },

  async deleteIntern(id) {
    return apiClient.delete(`/interns/${id}`)
  },
}

export function getEntityId(entity, type) {
  return modelId(entity, type)
}
