import { useCallback, useEffect, useState } from "react"
import { childService } from "../services/childService"
import { guardianService } from "../services/guardianService"
import { enrollmentService } from "../services/enrollmentService"
import { staffWorkshopService } from "../services/staffWorkshopService"
import { childRecordService } from "../services/childRecordService"
import { childInternalDescriptionService } from "../services/childInternalDescriptionService"

export function useDashboard() {
  const [data, setData] = useState({
    children: [],
    guardians: [],
    workshops: [],
    schedules: [],
    enrollments: [],
    healthRecords: [],
    crisisDescriptions: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // 1. Cargar entidades principales en paralelo con tolerancia a fallos
      const [
        childrenRes,
        guardiansRes,
        workshopsRes,
        schedulesRes,
        enrollmentsRes,
      ] = await Promise.allSettled([
        childService.getChildrenData(),
        guardianService.getGuardianData(),
        staffWorkshopService.getWorkshops(),
        staffWorkshopService.getSchedules(),
        enrollmentService.getEnrollmentData(),
      ])

      const children =
        childrenRes.status === "fulfilled"
          ? childrenRes.value?.children || []
          : []
      const guardians =
        guardiansRes.status === "fulfilled"
          ? guardiansRes.value?.guardians || []
          : []
      const workshops =
        workshopsRes.status === "fulfilled" ? workshopsRes.value || [] : []
      const schedules =
        schedulesRes.status === "fulfilled" ? schedulesRes.value || [] : []
      const enrollments =
        enrollmentsRes.status === "fulfilled"
          ? enrollmentsRes.value?.enrollments || []
          : []

      // 2. Si tenemos niños, intentamos traer fichas de salud y descripciones para alertas críticas
      let healthRecords = []
      let crisisDescriptions = []

      if (children.length > 0) {
        // Tomar hasta los primeros 15 niños para no sobrecargar si hay muchos
        const sampleChildren = children.slice(0, 15)

        const [recordsSettled, descriptionsSettled] = await Promise.allSettled([
          Promise.all(
            sampleChildren.map((c) =>
              childRecordService.getRecordsForChild(c.childId).catch(() => []),
            ),
          ),
          Promise.all(
            sampleChildren.map((c) =>
              childInternalDescriptionService
                .getForChild(c.childId)
                .catch(() => []),
            ),
          ),
        ])

        if (recordsSettled.status === "fulfilled") {
          healthRecords = recordsSettled.value.flat().filter(Boolean)
        }
        if (descriptionsSettled.status === "fulfilled") {
          crisisDescriptions = descriptionsSettled.value
            .flat()
            .filter(Boolean)
        }
      }

      setData({
        children,
        guardians,
        workshops,
        schedules,
        enrollments,
        healthRecords,
        crisisDescriptions,
      })
    } catch (err) {
      setError(err?.message || "No se pudo cargar la información del panel.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  return {
    ...data,
    loading,
    error,
    refresh: loadDashboardData,
  }
}
