# Guía de implementación frontend --- Yeison (Y1--Y5)

Esta guía mapea las tareas del tablero contra los endpoints reales del
backend (`src/routes/*`) e indica payloads, roles y notas importantes.
Todo lo demás (IDs de catálogos) se resuelve en runtime con
`useCatalogs` --- nunca hardcodear.

------------------------------------------------------------------------

## 0. Preliminares (válido para Y1--Y5)

### 0.1 Base y autenticación

-   **Base URL:** la que ya usan en frontend (p. ej. `VITE_API_URL`).
    Las rutas van **sin** `/api/v1/` salvo las de Suma21.

-   Todos los endpoints de personal/profesionales/interns/catálogos
    pasan por `requireAuth` --- hay que mandar:

    ``` http
    Authorization: Bearer <access_token>
    ```

-   El token es el JWT que ya emite el security-server tras login.

-   Códigos relevantes: `400` validación, `401` sin token, `403` rol
    insuficiente, `404` no existe, `409` conflicto, `502/503`
    security-server caído / no configurado.

-   Roles que el back distingue para estas rutas: `ADMIN` (ve todo),
    `TALLERISTA` (ve solo su registro propio en `/staff`,
    `/professionals`, etc.). Las rutas de link/unlink requieren `ADMIN`;
    `link-account` sin id requiere `TALLERISTA`.

### 0.2 Cliente HTTP mínimo

``` ts
// src/api/client.ts
export async function api<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(body?.error ?? res.statusText), {
      status: res.status,
      body,
    });
  }
  return body as T;
}
```

### 0.3 `useCatalogs` (dependencia L1)

Los catálogos son GET-only y vuelven como `[{ id, code, name }]`
ordenados por nombre. Carga una sola vez y cachea.

``` ts
// src/hooks/useCatalogs.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

type CatalogEntry = { id: string; code: string; name: string };

const CATALOGS = {
  staff_roles: "/staff-roles",
  contract_types: "/contract-types",
  staff_statuses: "/staff-statuses",
  document_types: "/document-types",
} as const;

export function useCatalogs() {
  const query = useQuery({
    queryKey: ["catalogs"],
    staleTime: Infinity, // casi nunca cambian
    queryFn: async () => {
      const entries = await Promise.all(
        Object.entries(CATALOGS).map(async ([key, path]) => {
          const data = await api<CatalogEntry[]>(path);
          return [key, data] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<
        keyof typeof CATALOGS,
        CatalogEntry[]
      >;
    },
  });

  // helper para mapear code → id
  const idByCode = (catalog: keyof typeof CATALOGS, code: string) =>
    query.data?.[catalog]?.find((e) => e.code === code)?.id ?? null;

  return { ...query, idByCode };
}
```

> **Regla:** nunca envíen un `staff_role_id`, `contract_type_id`,
> `staff_status_id` ni `document_type_id` hardcodeado. Siempre vienen de
> `useCatalogs`.

------------------------------------------------------------------------

## Y1 --- Módulo de Personal (Staff)

Base: `/staff` --- lookups incluidos en la respuesta
(`document_types_*`, `staff_roles_*`, `contract_types_*`,
`staff_statuses_*`).

### Endpoints

  ----------------------------------------------------------------------------------------------
  Acción            Método            Path                                     Rol
  ----------------- ----------------- ---------------------------------------- -----------------
  Listar            GET               `/staff`                                 ADMIN ve todo,
                                                                               TALLERISTA solo
                                                                               su registro

  Obtener por id    GET               `/staff/:id`                             ADMIN /
                                                                               TALLERISTA
                                                                               (propio)

  **Buscar por      GET               `/staff/document/:number`                ADMIN /
  cédula**                                                                     TALLERISTA
                                                                               (propio)

  Buscar por cuenta GET               `/staff/security-user/:securityUserId`   ADMIN

  Crear             POST              `/staff`                                 ADMIN (no permite
                                                                               rol de admin)

  Reemplazar        PUT               `/staff/:id`                             ADMIN

  Patch parcial     PATCH             `/staff/:id`                             ADMIN

  Soft-delete (pone DELETE            `/staff/:id`                             ADMIN
  `exit_date`)                                                                 

  **Vincular cuenta POST              `/staff/:id/link-account`                ADMIN
  (admin)**                                                                    

  **Desvincular     DELETE            `/staff/:id/link-account`                ADMIN
  cuenta**                                                                     

  Vincular cuenta   POST              `/staff/link-account`                    TALLERISTA
  propia                                                                       
  (tallerista)                                                                 
  ----------------------------------------------------------------------------------------------

### Payload de creación/edición

``` ts
type StaffInput = {
  full_name: string;              // requerido
  document_type_id: string | null; // bigint como string
  document_number: string | null;
  staff_role_id: string | null;    // NO puede ser el id de ADMIN
  hire_date: string | null;        // YYYY-MM-DD
  contract_type_id: string | null;
  staff_status_id: string | null;
  phone: string | null;
  email: string | null;            // debe pasar regex de email
};
```

-   Para **PATCH** mandar solo las keys que cambian;
    `at least one field required`.

-   Para `DELETE /staff/:id`: el back no borra fila, solo setea
    `exit_date = hoy`. En la UI, si quieren "reactivar", hagan un PATCH
    con `exit_date: null`.

-   **Vincular cuenta**: el back exige que el admin haya verificado el
    `security_user_id` contra el security-server antes:

    ``` json
    {
      "security_user_id": "<uuid-del-security-server>"
    }
    ```

    Desvincular es `DELETE /staff/:id/link-account` (devuelve 204).

### Esqueleto React (buscar por cédula + CRUD)

``` tsx
// src/features/staff/StaffPage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useCatalogs } from "../../hooks/useCatalogs";

export function StaffPage() {
  const qc = useQueryClient();
  const catalogs = useCatalogs();
  const [doc, setDoc] = useState("");

  const list = useQuery({
    queryKey: ["staff"],
    queryFn: () => api<any[]>("/staff"),
  });

  const byDoc = useQuery({
    enabled: doc.length > 0,
    queryKey: ["staff", "doc", doc],
    queryFn: () => api<any[]>(`/staff/document/${encodeURIComponent(doc)}`),
  });

  const create = useMutation({
    mutationFn: (payload: any) =>
      api("/staff", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });

  const patch = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      api(`/staff/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });

  const softDelete = useMutation({
    mutationFn: (id: string) => api(`/staff/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });

  const linkAccount = useMutation({
    mutationFn: ({
      id,
      security_user_id,
    }: {
      id: string;
      security_user_id: string;
    }) =>
      api(`/staff/${id}/link-account`, {
        method: "POST",
        body: JSON.stringify({ security_user_id }),
      }),
  });

  const unlinkAccount = useMutation({
    mutationFn: (id: string) =>
      api(`/staff/${id}/link-account`, { method: "DELETE" }),
  });

  // ...render con catalogs.data.staff_roles etc. en los <select>
}
```

### Validaciones a replicar en UI (ahorran 400 del back)

-   `full_name`: no vacío.
-   `email`: regex básica (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), \<255.
-   `document_number` / `phone`: strings cortos, pueden ser null.
-   `hire_date` / `exit_date`: formato `YYYY-MM-DD`.
-   En el `<select>` de rol, **excluir** cualquier `code` que empiece
    por `ADMIN`/`SUPER_ADMIN` --- el back los rechaza.

------------------------------------------------------------------------

## Y2 --- Profesionales/Talleristas + horarios

### 2.1 Profesionales

Base: `/professionals` --- devuelve
`staff_professionals_staff_idTostaff` embebido.

  Acción                                  Método   Path
  --------------------------------------- -------- ----------------------
  Listar                                  GET      `/professionals`
  Obtener                                 GET      `/professionals/:id`
  Crear (con staff existente o anidado)   POST     `/professionals`
  Reemplazar                              PUT      `/professionals/:id`
  Patch parcial                           PATCH    `/professionals/:id`
  Borrar                                  DELETE   `/professionals/:id`

**Payload create** --- una de las dos variantes, **no las dos**:

``` json
{
  "staff_id": "123",
  "titles": "Psicóloga",
  "institutions": "U. Nacional",
  "observations": null,
  "time_donor": false
}
```

O creando el `staff` atómicamente:

``` json
{
  "staff": {
    "full_name": "...",
    "document_type_id": "1",
    "document_number": "...",
    "staff_role_id": "<id de TALLERISTA>",
    "hire_date": "2026-01-15",
    "contract_type_id": "2",
    "staff_status_id": "1",
    "phone": null,
    "email": null
  },
  "titles": "...",
  "institutions": "...",
  "observations": null,
  "time_donor": true
}
```

Mandar ambos dispara `400`. Para **PATCH** aceptan solo `staff_id`,
`titles`, `institutions`, `observations`, `time_donor`.

### 2.2 Horarios (professionals ↔ workshops)

Base: `/professionals-workshops` --- tabla pivote con horario y
vigencia.

  ------------------------------------------------------------------------------------------------------------
  Acción                  Método                  Path
  ----------------------- ----------------------- ------------------------------------------------------------
  Listar (filtros         GET                     `/professionals-workshops?professional_id=…&workshop_id=…`
  opcionales)                                     

  Obtener                 GET                     `/professionals-workshops/:id`

  Crear                   POST                    `/professionals-workshops`

  Reemplazar              PUT                     `/professionals-workshops/:id`

  Patch parcial           PATCH                   `/professionals-workshops/:id`

  Eliminar                DELETE                  `/professionals-workshops/:id`
  ------------------------------------------------------------------------------------------------------------

Payload:

``` ts
type PWInput = {
  professional_id: string;    // requerido
  workshop_id: string;        // requerido
  day_week: string | null;    // "LUN","MAR",… (convención de su UI)
  ends_on: string | null;     // YYYY-MM-DD; null = asignación activa
  time_starts: string | null; // "HH:MM" o "HH:MM:SS"
  time_ends: string | null;
  observations: string | null;
};
```

Reglas:

-   Solo puede haber **una asignación activa** (`ends_on == null`) por
    par `(professional_id, workshop_id)`; si crean otra, el back
    responde `409`.
-   **Editar horario** = `PATCH /professionals-workshops/:id` con las
    keys cambiadas.
-   **Eliminar horario** = `DELETE /professionals-workshops/:id`. Si hay
    asistencia de niños vinculada, responde `409` --- en ese caso lo
    correcto es **cerrar** la asignación con `PATCH { ends_on: hoy }` en
    lugar de borrar.
-   Catálogo de talleres: `GET /workshops` (también disponible).

Patrón UI recomendado para "edición de horarios de una tallerista":

1.  Carga profesional: `GET /professionals/:id`.
2.  Carga asignaciones activas:
    `GET /professionals-workshops?professional_id=<id>`.
3.  Tabla editable con fila por `professionals_workshop`. Botones:
    "Guardar" → PATCH; "Cerrar" → PATCH `{ ends_on: hoy }`; "Eliminar" →
    DELETE (con fallback a cerrar si llega 409).

------------------------------------------------------------------------

## Y3 --- Asistencia de personal

Base: `/staff-assistance`.

  --------------------------------------------------------------------------------------------------------
  Acción                  Método                  Path
  ----------------------- ----------------------- --------------------------------------------------------
  Listar con filtros      GET                     `/staff-assistance?staff_id=…&date_working=YYYY-MM-DD`

  Obtener                 GET                     `/staff-assistance/:id`

  Crear                   POST                    `/staff-assistance`

  Reemplazar              PUT                     `/staff-assistance/:id`

  Patch parcial           PATCH                   `/staff-assistance/:id`

  Eliminar                DELETE                  `/staff-assistance/:id`
  --------------------------------------------------------------------------------------------------------

Payload:

``` ts
type StaffAssistanceInput = {
  staff_id: string;             // requerido (positivo)
  date_working: string | null;  // YYYY-MM-DD
  time_in: string | null;       // DECIMAL(5,2), horas (ej. "8", "7.5", "8.25")
  time_out: string | null;      // mismo formato
};
```

Notas:

-   `time_in`/`time_out` **no son horas HH:MM**, son horas como decimal
    (el schema es `Decimal`). El back valida `[0..999.99]`, máximo 2
    decimales.
-   Si el formulario muestra HH:MM, conviertan antes de enviar (ej.
    `08:30` → `"8.5"`).
-   **Filtros**: `staff_id` (positivo) y `date_working` (date).
    Combínenlos para "asistencia de una tallerista en un día".
-   La UI del listado debería ofrecer: filtro por `staff_id`
    (autocomplete sobre `/staff`), por rango de fechas (haciendo
    múltiples llamadas o un filtro client-side), botones editar (PATCH)
    / eliminar (DELETE).

Ejemplo de query key con React Query:

``` ts
useQuery({
  queryKey: ["staff-assistance", { staff_id, date_working }],
  queryFn: () => {
    const params = new URLSearchParams();
    if (staff_id) params.set("staff_id", staff_id);
    if (date_working) params.set("date_working", date_working);
    return api(`/staff-assistance?${params}`);
  },
});
```

------------------------------------------------------------------------

## Y4 --- Módulo de Practicantes (Interns.jsx)

Base: `/interns`. Un intern **no** sustituye al staff: es una capa extra
con datos académicos ligados a un `staff_id`.

  Acción          Método   Path
  --------------- -------- -----------------------
  Listar          GET      `/interns?staff_id=…`
  Obtener         GET      `/interns/:id`
  Crear           POST     `/interns`
  Reemplazar      PUT      `/interns/:id`
  Patch parcial   PATCH    `/interns/:id`
  Eliminar        DELETE   `/interns/:id`

Payload:

``` ts
type InternInput = {
  staff_id: string | null;       // FK a staff; el back valida que exista si va no-null
  university: string | null;
  career: string | null;
  foundation_role: string | null;
  duration_months: number | null; // smallint no negativo, 0..32767
};
```

Flujo típico en UI:

1.  Crear primero el `staff` del practicante (POST `/staff` con rol
    tallerista/practicante del catálogo).
2.  Luego POST `/interns` con ese `staff_id` y los datos académicos.
3.  Listado: `GET /interns` trae `staff_interns_staff_idTostaff`
    embebido para pintar nombre/documento.

------------------------------------------------------------------------

## Y5 --- Dashboard

Como señala la nota del tablero, el Dashboard solo **lee** de los
anteriores. Para KPIs típicos:

-   Total de personal activo: `GET /staff` y filtrar `exit_date == null`
    client-side (o usar `staff_statuses` como filtro visual).
-   Talleristas con cuenta vinculada: `/staff` → contar los que tienen
    `security_user_id` no nulo.
-   Asignaciones activas: `GET /professionals-workshops?...` y filtrar
    `ends_on == null`.
-   Asistencias de hoy: `GET /staff-assistance?date_working=<hoy>`.
-   Practicantes activos: `GET /interns`.

Si quieren bajar carga, usen `queryClient.getQueryData` para derivar
KPIs de las queries ya cacheadas en Y1--Y4 en lugar de volver a llamar.

------------------------------------------------------------------------

## Checklist de implementación (orden sugerido)

1.  **L1 bis**: integrar `useCatalogs` consumiendo `/staff-roles`,
    `/contract-types`, `/staff-statuses`, `/document-types` y exponer
    `idByCode`.
2.  **Y1** Staff: listado + buscar por cédula
    (`/staff/document/:number`) + CRUD + link/unlink account (modal con
    `security_user_id` que el admin obtiene aparte).
3.  **Y2** Profesionales: CRUD con selector "usar staff existente
    vs. crear nuevo" + subpágina de horarios
    (`/professionals-workshops`).
4.  **Y3** Asistencia: tabla con filtros `staff_id` + `date_working`,
    formularios con `time_in/time_out` como decimal.
5.  **Y4** Interns: formulario que exige `staff_id` existente
    (autocomplete sobre `/staff`).
6.  **Y5** Dashboard: derivar métricas de queries ya cacheadas.

## Errores a manejar de forma consistente

-   `400`: mostrar `body.error` tal cual (los parsers del back dan
    mensajes claros tipo `email must be a valid email address`).
-   `401`: forzar logout / refresh de token.
-   `403`: ocultar acción en UI según rol del usuario; si llega, mostrar
    "sin permisos".
-   `404`: tratar como "no encontrado".
-   `409`: dos casos frecuentes: (a) duplicado (ej. cédula) o (b) FK en
    uso (asignación con asistencia): en (b) ofrecer "cerrar vigencia" en
    vez de eliminar.
-   `502/503`: banner "Servicio de autenticación no disponible,
    reintenta en un momento".

Con esto cubren Y1--Y5 contra el back actual sin necesidad de endpoints
nuevos.
