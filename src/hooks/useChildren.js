import { useEffect, useState } from "react"
import { childGuardianService } from "../services/childGuardianService"
import { childInternalDescriptionService } from "../services/childInternalDescriptionService"
import { childRecordService } from "../services/childRecordService"
import { childService } from "../services/childService"
import { enrollmentService } from "../services/enrollmentService"
import { childrenAssistanceService } from "../services/childrenAssistanceService"
import { guardianService } from "../services/guardianService"
import { toForeignKey } from "../models/modelUtils"

export function useChildren() {
  const [children, setChildren] = useState([])
  const [relationships, setRelationships] = useState([])
  const [guardians, setGuardians] = useState([])
  const [childRecords, setChildRecords] = useState([])
  const [internalDescriptions, setInternalDescriptions] = useState([])
  const [assistanceRecords, setAssistanceRecords] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [childRecordsError, setChildRecordsError] = useState("")
  const [internalDescriptionsError, setInternalDescriptionsError] = useState("")
  const [assistanceError, setAssistanceError] = useState("")
  const [enrollmentError, setEnrollmentError] = useState("")

  const loadChildren = async () => {
    setLoading(true)
    setError("")
    setChildRecordsError("")
    setInternalDescriptionsError("")
    setAssistanceError("")
    setEnrollmentError("")

    try {
      const [
        { children: childList },
        { guardians: guardianRecords },
        relationshipList,
      ] = await Promise.all([
        childService.getChildrenData(),
        guardianService.getGuardianData(),
        childGuardianService.getRelationships(),
      ])
      setChildren(childList)
      setGuardians(guardianRecords)
      setRelationships(relationshipList)

      // Cada colección se consulta una sola vez y la vista filtra por childId
      const [
        recordResults,
        internalDescriptionResults,
        assistanceResults,
        enrollmentResult,
      ] = await Promise.allSettled([
        childRecordService.getRecords(),
        childInternalDescriptionService.getAll(),
        childrenAssistanceService.getAll(),
        enrollmentService.getEnrollmentData(),
      ])
      if (recordResults.status === "fulfilled") {
        setChildRecords(recordResults.value)
        setChildRecordsError("")
      } else {
        setChildRecords([])
        setChildRecordsError(
          recordResults.reason?.message ||
            "No fue posible cargar las fichas de salud.",
        )
      }
      if (internalDescriptionResults.status === "fulfilled") {
        setInternalDescriptions(internalDescriptionResults.value)
      } else {
        setInternalDescriptions([])
        setInternalDescriptionsError(
          internalDescriptionResults.reason?.message ||
            "No fue posible cargar las descripciones internas.",
        )
      }
      if (assistanceResults.status === "fulfilled") {
        setAssistanceRecords(assistanceResults.value)
      } else {
        setAssistanceRecords([])
        setAssistanceError(
          assistanceResults.reason?.message ||
            "No fue posible cargar las asistencias.",
        )
      }
      if (enrollmentResult.status === "fulfilled") {
        setEnrollments(enrollmentResult.value.enrollments)
        setEnrollmentError("")
      } else {
        setEnrollments([])
        setEnrollmentError(
          enrollmentResult.reason?.message ||
            "No fue posible cargar los pagos relacionados.",
        )
      }
    } catch (requestError) {
      setError(
        requestError.message || "No fue posible cargar los beneficiarios.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChildren()
  }, [])

  const createChild = async ({ child, relationship }) => {
    // Se valida el vínculo antes de crear el beneficiario: DELETE /children es
    // un borrado lógico, por lo que no es posible deshacer la creación.
    if (relationship?.guardianId) {
      toForeignKey(relationship.guardianId, "Acudiente")
      toForeignKey(relationship.guardianshipType, "Tipo de vínculo")
    }
    const createdChild = await childService.createChild(child)
    let createdRelationship

    try {
      if (relationship?.guardianId) {
        createdRelationship = await childGuardianService.createRelationship({
          ...relationship,
          childId: createdChild.childId,
        })
      }
    } catch (requestError) {
      try {
        await childService.deleteChild(createdChild.childId)
      } catch (rollbackError) {
        throw new Error(
          `${requestError.message} No fue posible deshacer la creación del beneficiario: ${rollbackError.message}`,
        )
      }
      throw requestError
    }

    setChildren((current) => [...current, createdChild])
    if (createdRelationship) {
      setRelationships((current) => [...current, createdRelationship])
    }
    return createdChild
  }

  const updateChild = async (childId, changes) => {
    try {
      const updatedChild = await childService.updateChild(childId, changes)
      setChildren((current) =>
        current.map((child) =>
          child.childId === childId ? updatedChild : child,
        ),
      )
      return {
        ok: true,
        message: "Beneficiario actualizado correctamente.",
        child: updatedChild,
      }
    } catch (requestError) {
      return {
        ok: false,
        message:
          requestError.message || "No fue posible actualizar el registro.",
      }
    }
  }

  const createChildRecord = async (childId, record) => {
    const createdRecord = await childRecordService.createRecord(childId, record)
    setChildRecords((current) => [...current, createdRecord])
    return createdRecord
  }

  const updateChildRecord = async (childId, recordId, changes) => {
    const updatedRecord = await childRecordService.updateRecord(
      childId,
      recordId,
      changes,
    )
    setChildRecords((current) =>
      current.map((record) =>
        record.recordId === recordId ? updatedRecord : record,
      ),
    )
    return updatedRecord
  }

  const deleteChildRecord = async (childId, recordId) => {
    await childRecordService.deleteRecord(childId, recordId)
    setChildRecords((current) =>
      current.filter((record) => record.recordId !== recordId),
    )
  }

  const createInternalDescription = async (childId, description) => {
    const created = await childInternalDescriptionService.create(
      childId,
      description,
    )
    setInternalDescriptions((current) => [...current, created])
    return created
  }

  const updateInternalDescription = async (childId, descriptionId, changes) => {
    const updated = await childInternalDescriptionService.update(
      childId,
      descriptionId,
      changes,
    )
    setInternalDescriptions((current) =>
      current.map((item) =>
        item.childInternalDescriptionId === descriptionId ? updated : item,
      ),
    )
    return updated
  }

  const deleteInternalDescription = async (childId, descriptionId) => {
    await childInternalDescriptionService.delete(childId, descriptionId)
    setInternalDescriptions((current) =>
      current.filter(
        (item) => item.childInternalDescriptionId !== descriptionId,
      ),
    )
  }

  const createAssistance = async (childId, assistance) => {
    const created = await childrenAssistanceService.create(childId, assistance)
    setAssistanceRecords((current) => [...current, created])
    return created
  }

  const updateAssistance = async (childId, assistanceId, changes) => {
    const updated = await childrenAssistanceService.update(
      childId,
      assistanceId,
      changes,
    )
    setAssistanceRecords((current) =>
      current.map((item) =>
        item.childrenAssistanceId === assistanceId ? updated : item,
      ),
    )
    return updated
  }

  const deleteAssistance = async (childId, assistanceId) => {
    await childrenAssistanceService.delete(childId, assistanceId)
    setAssistanceRecords((current) =>
      current.filter((item) => item.childrenAssistanceId !== assistanceId),
    )
  }

  const deleteChild = async (childId) => {
    try {
      await childService.deleteChild(childId)
      setChildren((current) =>
        current.filter((child) => child.childId !== childId),
      )
      setRelationships((current) =>
        current.filter((relationship) => relationship.childId !== childId),
      )
      setChildRecords((current) =>
        current.filter((record) => record.childId !== childId),
      )
      setInternalDescriptions((current) =>
        current.filter((record) => record.childId !== childId),
      )
      setAssistanceRecords((current) =>
        current.filter((record) => record.childId !== childId),
      )
      setEnrollments((current) =>
        current.filter((enrollment) => enrollment.childId !== childId),
      )
      return { ok: true, message: "Beneficiario eliminado correctamente." }
    } catch (requestError) {
      return {
        ok: false,
        message:
          requestError.message || "No fue posible eliminar el registro.",
      }
    }
  }

  const createRelationship = async (relationship) => {
    const created = await childGuardianService.createRelationship(relationship)
    setRelationships((current) => [...current, created])
    return created
  }

  const deleteRelationship = async (childGuardianId) => {
    try {
      await childGuardianService.deleteRelationship(childGuardianId)
      setRelationships((current) =>
        current.filter(
          (relationship) =>
            String(relationship.childGuardianId) !== String(childGuardianId),
        ),
      )
      return { ok: true, message: "Vínculo eliminado correctamente." }
    } catch (requestError) {
      return {
        ok: false,
        message:
          requestError.message || "No fue posible eliminar el vínculo.",
      }
    }
  }

  const createGuardian = async (guardianData) => {
    const created = await guardianService.createGuardian(guardianData)
    setGuardians((current) => [...current, created])
    return created
  }

  return {
    children,
    guardians,
    relationships,
    childRecords,
    internalDescriptions,
    assistanceRecords,
    enrollments,
    loading,
    error,
    childRecordsError,
    internalDescriptionsError,
    assistanceError,
    enrollmentError,
    loadChildren,
    createChild,
    createRelationship,
    deleteRelationship,
    createGuardian,
    createChildRecord,
    updateChildRecord,
    deleteChildRecord,
    createInternalDescription,
    updateInternalDescription,
    deleteInternalDescription,
    createAssistance,
    updateAssistance,
    deleteAssistance,
    updateChild,
    deleteChild,
  }
}
