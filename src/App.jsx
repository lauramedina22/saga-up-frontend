import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom"
import Sidebar from "./components/Sidebar"
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

function AppLayout({ session, onLogout }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
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
              : pathname === "/audit-logs" || pathname === "/auditoria"
                ? "auditoria"
                : pathname === "/services" || pathname === "/servicios"
                  ? "servicios"
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
      auditoria: "/audit-logs",
      servicios: "/services",
    }
    if (routes[screen]) navigate(routes[screen])
  }

  return (
    <div className="min-h-dvh pl-20 sm:pl-64">
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        userName={userName}
        userRole={userRole}
      />
      <Outlet />
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
        <Route path="/audit-logs" element={<AuditLogsScreen />} />
        <Route path="/auditoria" element={<AuditLogsScreen />} />
        <Route path="/services" element={<ServicesScreen />} />
        <Route path="/servicios" element={<ServicesScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
