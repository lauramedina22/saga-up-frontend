import logo from "../imports/texto.png"

const Icon = ({ path, className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
)

const navItems = [
  {
    screen: "dashboard",
    label: "Inicio",
    icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  },
  {
    screen: "beneficiarios",
    label: "Beneficiarios",
    icon: "M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z",
  },
  {
    screen: "acudientes",
    label: "Acudientes",
    icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
  },
  {
    screen: "matriculas",
    label: "Matrículas",
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  },
  {
    screen: "pagos",
    label: "Pagos",
    icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
  },
  {
    screen: "padrinos",
    label: "Padrinos",
    icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
  },
  {
    screen: "donaciones",
    label: "Donaciones",
    icon: "M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
  },
  {
    screen: "mensajes",
    label: "Mensajes",
    icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
  },
]

export default function Sidebar({
  currentScreen,
  onNavigate,
  onLogout,
  userName = "Usuario",
  userRole = "",
}) {
  const initials = userName.trim().charAt(0).toLocaleUpperCase("es-CO") || "U"

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-dvh w-20 flex-col border-r border-border bg-surface sm:w-64">
      <div className="border-b border-border px-3 py-5 sm:px-5 sm:py-6">
        <img
          src={logo}
          alt="Fundación ASISCO UP"
          className="mx-auto w-12 object-contain sm:mx-0 sm:w-36"
        />
      </div>

      <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto px-2 py-3">
        {navItems.map((item) => {
          const active = currentScreen === item.screen
          const available = item.screen === "beneficiarios"

          return (
            <button
              key={item.screen}
              type="button"
              onClick={() => onNavigate(item.screen)}
              disabled={!available}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              title={available ? item.label : `${item.label} (próximamente)`}
              className={`mb-1 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl px-2 py-3 text-left text-[15px] font-bold transition-colors sm:justify-start sm:px-4 ${
                active
                  ? "bg-primary text-foreground shadow-sm"
                  : "text-foreground hover:bg-primary-soft hover:text-primary-hover"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Icon path={item.icon} className="h-5 w-5 shrink-0" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-border p-2 sm:p-3">
        <div className="mb-1 flex items-center justify-center gap-3 px-2 py-2 sm:justify-start sm:px-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-foreground">
            {initials}
          </div>
          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="truncate text-sm font-semibold text-foreground">{userName}</p>
            <p className="truncate text-xs text-muted">{userRole}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          aria-label="Cerrar sesión"
          className="flex min-h-11 w-full items-center justify-center gap-3 rounded-xl px-2 py-2 text-sm font-bold text-muted transition-colors hover:bg-danger-soft hover:text-danger sm:justify-start sm:px-4"
        >
          <Icon
            path="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3H15"
            className="h-4 w-4"
          />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
