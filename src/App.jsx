import { useState } from "react"
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom"
import Sidebar from "./components/Sidebar"
import logo from "./imports/sidebar.jpg"
import { useAuth } from "./hooks/useAuth"
import Login from "./screens/Login"
import Register from "./screens/Register"
import GuardiansScreen from "./screens/Guardians"
import ChildrenScreen from "./screens/Children"
import EnrollmentsScreen from "./screens/Enrollments"
import WorkshopsScreen from "./screens/Workshops"
import SalesScreen from "./screens/Sales"
import DashboardScreen from "./screens/Dashboard"
import AuditLogsScreen from "./screens/AuditLogs"
import ServicesScreen from "./screens/Services"
import DonationsScreen from "./screens/Donations"
import StaffScreen from "./screens/Staff"
import InternsScreen from "./screens/Interns"

function AppLayout({ session, onLogout }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const currentScreen =
    pathname === "/children"
      ? "beneficiarios"
      : pathname === "/guardians"
        ? "acudientes"
        : pathname === "/enrollments"
          ? "matriculas"
          : pathname === "/workshops"
            ? "talleristas"
            : pathname === "/sales" || pathname === "/ventas"
              ? "ventas"
              : pathname === "/donations" || pathname === "/donaciones"
                ? "donaciones"
                : pathname === "/audit-logs" || pathname === "/auditoria"
                  ? "auditoria"
                  : pathname === "/services" || pathname === "/servicios"
                    ? "servicios"
                      : pathname === "/staff" || pathname === "/personal"
                        ? "personal"
                        : pathname === "/interns" || pathname === "/practicantes"
                          ? "practicantes"
                      : "dashboard"
  const userName =
    session?.usuario?.username ||
    session?.usuario?.email ||
    session?.email ||
    "Usuario"
  const userRole = session?.roles?.join(", ") || ""

  const handleNavigate = (screen) => {
    const routes = {
      dashboard: "/",
      beneficiarios: "/children",
      acudientes: "/guardians",
      matriculas: "/enrollments",
      talleristas: "/workshops",
      ventas: "/sales",
      donaciones: "/donations",
      auditoria: "/audit-logs",
      servicios: "/services",
      personal: "/staff",
      practicantes: "/interns",
    }
    if (routes[screen]) {
      navigate(routes[screen])
      setMobileMenuOpen(false)
    }
  }

  const userInitial = userName.trim().charAt(0).toUpperCase() || "U"

  return (
    <div className="min-h-dvh pl-0 sm:pl-64">
      {/* Barra superior para dispositivos móviles */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-4 shadow-xs sm:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex size-10 items-center justify-center rounded-xl text-foreground hover:bg-surface-muted active:scale-95 transition-all"
          aria-label="Abrir menú de navegación"
        >
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img src={logo} alt="Fundación ASISCO UP" className="h-8 object-contain" />
        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-foreground shadow-xs">
          {userInitial}
        </div>
      </header>

      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        userName={userName}
        userRole={userRole}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  )
}

const App = () => {
  const {
    session,
    login,
    loginLoading,
    loginError,
    register,
    registerLoading,
    registerError,
    registerSuccess,
    logout,
  } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (email, password) => {
    const authenticated = await login(email, password)
    if (authenticated) navigate("/")
  }

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          session ? (
            <Navigate to="/" replace />
          ) : (
            <Login
              onLogin={handleLogin}
              onGoToRegister={() => navigate("/register")}
              loading={loginLoading}
              error={loginError}
            />
          )
        }
      />
      <Route
        path="/register"
        element={
          <Register
            onRegister={register}
            onBackToLogin={() => navigate("/login")}
            loading={registerLoading}
            error={registerError}
            success={registerSuccess}
          />
        }
      />
      <Route element={<AppLayout session={session} onLogout={handleLogout} />}>
        <Route
          path="/"
          element={
            session ? (
              <DashboardScreen session={session} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/children" element={<ChildrenScreen />} />
        <Route path="/guardians" element={<GuardiansScreen />} />
        <Route path="/enrollments" element={<EnrollmentsScreen />} />
        <Route path="/workshops" element={<WorkshopsScreen />} />
        <Route path="/sales" element={<SalesScreen />} />
        <Route path="/ventas" element={<SalesScreen />} />
        <Route path="/donations" element={<DonationsScreen />} />
        <Route path="/donaciones" element={<DonationsScreen />} />
        <Route path="/audit-logs" element={<AuditLogsScreen />} />
        <Route path="/auditoria" element={<AuditLogsScreen />} />
        <Route path="/services" element={<ServicesScreen />} />
        <Route path="/servicios" element={<ServicesScreen />} />
        <Route path="/staff" element={<StaffScreen />} />
        <Route path="/personal" element={<StaffScreen />} />
        <Route path="/interns" element={<InternsScreen />} />
        <Route path="/practicantes" element={<InternsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
