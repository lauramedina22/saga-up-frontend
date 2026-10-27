import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useDashboard } from "../hooks/useDashboard"
import { Avatar, Badge, Button, Card, Icon } from "../components/ui"
import { formatCOP, formatFecha } from "../data"

export default function DashboardScreen({ session }) {
  const navigate = useNavigate()
  const {
    children,
    guardians,
    workshops,
    schedules,
    enrollments,
    healthRecords,
    crisisDescriptions,
    loading,
    error,
    refresh,
  } = useDashboard()

  const userName =
    session?.usuario?.first_name ||
    session?.usuario?.username ||
    session?.usuario?.email ||
    "Equipo SAGA UP"

  // Cálculos estadísticos
  const stats = useMemo(() => {
    const totalChildren = children.length
    const activeChildren = children.filter(
      (c) => c.statusId === 1 || c.statusId === "1" || !c.exitDate,
    ).length
    const totalGuardians = guardians.length
    const totalWorkshops = workshops.length
    const totalEnrollments = enrollments.length

    // Pagos
    const paidEnrollments = enrollments.filter(
      (e) => e.status === "pagado" || e.status === "completado",
    ).length
    const pendingEnrollments = enrollments.filter(
      (e) => e.status === "pendiente" || e.status === "por_pagar",
    ).length
    const totalRevenue = enrollments.reduce(
      (sum, e) => sum + (Number(e.amount) || 0),
      0,
    )

    // Distribución por género
    const maleCount = children.filter((c) => c.sex === 1 || c.sex === "1").length
    const femaleCount = children.filter(
      (c) => c.sex === 2 || c.sex === "2",
    ).length
    const otherCount = totalChildren - (maleCount + femaleCount)

    return {
      totalChildren,
      activeChildren,
      totalGuardians,
      totalWorkshops,
      totalEnrollments,
      paidEnrollments,
      pendingEnrollments,
      totalRevenue,
      maleCount,
      femaleCount,
      otherCount,
    }
  }, [children, guardians, workshops, enrollments])

  // Alertas de salud o consideraciones especiales
  const criticalAlerts = useMemo(() => {
    const alerts = []

    healthRecords.forEach((record) => {
      const child = children.find((c) => String(c.childId) === String(record.childId))
      const childName = child ? `${child.firstName} ${child.lastName}` : `Niño #${record.childId}`

      if (record.allergies && record.allergies.toLowerCase() !== "ninguna" && record.allergies.trim()) {
        alerts.push({
          id: `allergy-${record.recordId || Math.random()}`,
          childId: record.childId,
          childName,
          type: "Alergia",
          tone: "danger",
          detail: record.allergies,
        })
      }
      if (record.specialConditions && record.specialConditions.trim()) {
        alerts.push({
          id: `condition-${record.recordId || Math.random()}`,
          childId: record.childId,
          childName,
          type: "Condición especial",
          tone: "warning",
          detail: record.specialConditions,
        })
      }
      if (record.medicines && record.medicines.trim() && record.medicines.toLowerCase() !== "ninguno") {
        alerts.push({
          id: `meds-${record.recordId || Math.random()}`,
          childId: record.childId,
          childName,
          type: "Medicación",
          tone: "info",
          detail: record.medicines,
        })
      }
    })

    crisisDescriptions.forEach((desc) => {
      const child = children.find((c) => String(c.childId) === String(desc.childId))
      const childName = child ? `${child.firstName} ${child.lastName}` : `Niño #${desc.childId}`

      if (desc.crisisManagement && desc.crisisManagement.trim()) {
        alerts.push({
          id: `crisis-${desc.descriptionId || Math.random()}`,
          childId: desc.childId,
          childName,
          type: "Protocolo de crisis",
          tone: "primary",
          detail: desc.crisisManagement,
        })
      }
    })

    return alerts.slice(0, 5) // Mostramos hasta 5 alertas destacadas
  }, [healthRecords, crisisDescriptions, children])

  const todayStr = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date())

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. ENCABEZADO Y BIENVENIDA */}
      <header className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Fundación ASISCO UP
            </span>
            <span className="text-muted">•</span>
            <span className="text-xs capitalize text-muted">{todayStr}</span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold text-foreground sm:text-4xl">
            Bienvenido, {userName}
          </h1>
          <p className="mt-1 text-sm font-medium text-muted">
            Panel de gestión y seguimiento integral de beneficiarios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={refresh}
            loading={loading}
            className="text-sm"
            title="Recargar métricas"
          >
            <Icon
              path="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              className="size-4"
            />
            <span>Actualizar</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate("/children")}
            className="text-sm shadow-md"
          >
            <Icon
              path="M12 4.5v15m7.5-7.5h-15"
              className="size-4"
            />
            <span>Nuevo Beneficiario</span>
          </Button>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center justify-between rounded-2xl bg-danger-soft p-4 text-sm font-semibold text-danger border border-danger/20"
        >
          <div className="flex items-center gap-2">
            <Icon path="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={refresh}
            className="text-xs underline hover:no-underline font-extrabold"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* 2. TARJETAS DE MÉTRICAS (KPIS) */}
      <section aria-label="Métricas Principales" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Beneficiarios */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/children")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/children")}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-card transition-all hover:border-primary/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Beneficiarios
            </span>
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary-soft text-primary transition-transform group-hover:scale-110">
              <Icon
                path="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                className="size-5"
              />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-foreground">
            {stats.totalChildren}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-muted">
            <span className="text-success font-bold">
              ● {stats.activeChildren} activos
            </span>
            <span className="text-primary group-hover:underline">Ver listado →</span>
          </div>
        </div>

        {/* Acudientes */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/guardians")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/guardians")}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-card transition-all hover:border-info/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Acudientes
            </span>
            <span className="flex size-10 items-center justify-center rounded-2xl bg-info-soft text-info transition-transform group-hover:scale-110">
              <Icon
                path="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                className="size-5"
              />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-foreground">
            {stats.totalGuardians}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-muted">
            <span>Redes de apoyo familiar</span>
            <span className="text-info group-hover:underline">Gestionar →</span>
          </div>
        </div>

        {/* Talleres */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/workshops")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/workshops")}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-card transition-all hover:border-warning/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Talleres y Programas
            </span>
            <span className="flex size-10 items-center justify-center rounded-2xl bg-warning-soft text-warning transition-transform group-hover:scale-110">
              <Icon
                path="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                className="size-5"
              />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-foreground">
            {stats.totalWorkshops}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-muted">
            <span>{schedules.length} sesiones agendadas</span>
            <span className="text-warning group-hover:underline">Explorar →</span>
          </div>
        </div>

        {/* Matrículas & Pensión */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/enrollments")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/enrollments")}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-card transition-all hover:border-success/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Matrículas y Pagos
            </span>
            <span className="flex size-10 items-center justify-center rounded-2xl bg-success-soft text-success transition-transform group-hover:scale-110">
              <Icon
                path="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6H2.25m0 0H3m-1 0h1m20.25 0h-.75A.75.75 0 0121 5.25V4.5m0 0h-1m1 0h-1m-18 15h18"
                className="size-5"
              />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-foreground">
            {stats.totalEnrollments}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-muted">
            <span>{stats.paidEnrollments} al día / {stats.pendingEnrollments} pend.</span>
            <span className="text-success group-hover:underline">Detalles →</span>
          </div>
        </div>
      </section>

      {/* 3. ALERTAS DE SALUD Y ATENCIÓN PRIORITARIA */}
      {criticalAlerts.length > 0 && (
        <section aria-label="Atención Prioritaria" className="mb-8">
          <div className="rounded-3xl border border-warning/30 bg-warning-soft/40 p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-warning font-extrabold">
                <Icon
                  path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  className="size-5 shrink-0"
                />
                <h2 className="text-base font-extrabold text-foreground">
                  Alertas de Salud y Atención Prioritaria ({criticalAlerts.length})
                </h2>
              </div>
              <span className="text-xs font-semibold text-muted">
                Información médica y conductual clave para el equipo
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => navigate("/children")}
                  role="button"
                  tabIndex={0}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-3.5 shadow-xs transition hover:border-primary/40 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-extrabold text-foreground text-sm">
                      {alert.childName}
                    </span>
                    <Badge tone={alert.tone}>{alert.type}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted line-clamp-2">
                    {alert.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. SECCIÓN PRINCIPAL: TALLERES + ESTADÍSTICAS + ACCESOS RÁPIDOS */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* COLUMNA IZQUIERDA (7 columnas): Catálogo de Talleres y Métricas */}
        <section aria-label="Talleres y Programas" className="flex flex-col gap-8 lg:col-span-7">
          <Card className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">
                  Talleres y Programas Destacados
                </h2>
                <p className="text-xs text-muted">
                  Sesiones formativas y terapéuticas ofrecidas por la fundación
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate("/workshops")}
                className="text-xs py-1.5 px-3 min-h-9"
              >
                Ver todos
              </Button>
            </div>

            {workshops.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
                <p className="text-sm">No hay talleres registrados en el catálogo.</p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/workshops")}
                  className="mt-3 text-xs"
                >
                  Crear primer taller
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {workshops.slice(0, 4).map((w) => (
                  <div
                    key={w.workshopId || w.name}
                    className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-surface-muted/30 p-4 transition hover:bg-surface-muted/70 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary font-extrabold">
                        {w.name?.charAt(0) || "T"}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">
                          {w.name}
                        </h3>
                        <p className="text-xs text-muted line-clamp-1">
                          {w.description || "Sin descripción registrada."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="flex items-center gap-1 text-xs font-semibold text-muted bg-surface px-2.5 py-1 rounded-lg border border-border">
                        <Icon path="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" className="size-3.5 text-muted" />
                        <span>{w.durationMinutes || 60} min</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Gráfico / Distribución de la Población */}
          <Card className="p-6">
            <h2 className="text-lg font-extrabold text-foreground mb-1">
              Distribución y Población Atendida
            </h2>
            <p className="text-xs text-muted mb-4">
              Composición general de los beneficiarios vinculados
            </p>

            <div className="space-y-4">
              {/* Activos vs Inactivos */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-foreground">Estado en la Fundación</span>
                  <span className="text-muted">
                    {stats.activeChildren} de {stats.totalChildren} activos (
                    {stats.totalChildren > 0
                      ? Math.round((stats.activeChildren / stats.totalChildren) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full bg-success transition-all duration-500"
                    style={{
                      width: `${
                        stats.totalChildren > 0
                          ? (stats.activeChildren / stats.totalChildren) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Distribución por Sexo */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-foreground">Distribución por Sexo</span>
                  <span className="text-muted">
                    Masculino: {stats.maleCount} • Femenino: {stats.femaleCount}
                  </span>
                </div>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="bg-info transition-all duration-500"
                    style={{
                      width: `${
                        stats.totalChildren > 0
                          ? (stats.maleCount / stats.totalChildren) * 100
                          : 0
                      }%`,
                    }}
                    title="Masculino"
                  />
                  <div
                    className="bg-primary transition-all duration-500"
                    style={{
                      width: `${
                        stats.totalChildren > 0
                          ? (stats.femaleCount / stats.totalChildren) * 100
                          : 0
                      }%`,
                    }}
                    title="Femenino"
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] font-semibold text-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-info inline-block" /> Masculino ({stats.maleCount})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-primary inline-block" /> Femenino ({stats.femaleCount})
                  </span>
                </div>
              </div>

              {/* Estado de Pagos / Matrículas */}
              {stats.totalEnrollments > 0 && (
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-foreground">Estado de Matrículas / Pensiones</span>
                    <span className="text-muted">
                      {formatCOP(stats.totalRevenue)} recaudado
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{
                        width: `${
                          stats.totalEnrollments > 0
                            ? (stats.paidEnrollments / stats.totalEnrollments) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* COLUMNA DERECHA (5 columnas): Accesos Rápidos y Últimos Niños */}
        <section aria-label="Accesos Rápidos y Actividad" className="flex flex-col gap-8 lg:col-span-5">
          {/* Accesos Rápidos */}
          <Card className="p-6">
            <h2 className="text-lg font-extrabold text-foreground mb-1">
              Accesos Rápidos
            </h2>
            <p className="text-xs text-muted mb-4">
              Acciones operativas más frecuentes
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate("/children")}
                className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface p-4 text-center transition hover:border-primary/50 hover:bg-primary-soft/30 hover:shadow-sm"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition group-hover:scale-105">
                  <Icon
                    path="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                    className="size-5"
                  />
                </span>
                <span className="text-xs font-bold text-foreground">
                  Beneficiarios
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/guardians")}
                className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface p-4 text-center transition hover:border-info/50 hover:bg-info-soft/30 hover:shadow-sm"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-info-soft text-info transition group-hover:scale-105">
                  <Icon
                    path="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    className="size-5"
                  />
                </span>
                <span className="text-xs font-bold text-foreground">
                  Acudientes
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/workshops")}
                className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface p-4 text-center transition hover:border-warning/50 hover:bg-warning-soft/30 hover:shadow-sm"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-warning-soft text-warning transition group-hover:scale-105">
                  <Icon
                    path="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                    className="size-5"
                  />
                </span>
                <span className="text-xs font-bold text-foreground">
                  Talleres y Turnos
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/enrollments")}
                className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface p-4 text-center transition hover:border-success/50 hover:bg-success-soft/30 hover:shadow-sm"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-success-soft text-success transition group-hover:scale-105">
                  <Icon
                    path="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6H2.25m0 0H3m-1 0h1m20.25 0h-.75A.75.75 0 0121 5.25V4.5m0 0h-1m1 0h-1m-18 15h18"
                    className="size-5"
                  />
                </span>
                <span className="text-xs font-bold text-foreground">
                  Matrículas
                </span>
              </button>
            </div>
          </Card>

          {/* Últimos Beneficiarios */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-foreground">
                  Beneficiarios Recientes
                </h2>
                <p className="text-xs text-muted">Últimos registros en la fundación</p>
              </div>
              <Button
                variant="tertiary"
                onClick={() => navigate("/children")}
                className="text-xs px-2 py-1 min-h-8"
              >
                Ver todos
              </Button>
            </div>

            {children.length === 0 ? (
              <p className="text-xs text-muted text-center py-4">
                No hay beneficiarios registrados en el sistema.
              </p>
            ) : (
              <div className="space-y-3">
                {children.slice(0, 5).map((child) => (
                  <div
                    key={child.childId}
                    onClick={() => navigate("/children")}
                    role="button"
                    tabIndex={0}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3 transition hover:bg-surface-muted/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={`${child.firstName} ${child.lastName}`} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">
                          {child.firstName} {child.lastName}
                        </p>
                        <p className="truncate text-xs text-muted">
                          Doc: {child.documentNumber || "S/D"} • Ingreso: {formatFecha(child.admissionDate)}
                        </p>
                      </div>
                    </div>
                    <Badge tone={child.statusId === 1 || child.statusId === "1" ? "success" : "neutral"}>
                      {child.statusId === 1 || child.statusId === "1" ? "Activo" : "Retirado"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  )
}
