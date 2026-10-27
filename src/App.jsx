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
            : "dashboard"
  const userName =
    session?.usuario?.username ||
    session?.usuario?.email ||
    session?.email ||
    "Usuario"
  const userRole = session?.roles?.join(", ") || ""

  const handleNavigate = (screen) => {
    const routes = {
      beneficiarios: "/children",
      acudientes: "/guardians",
      matriculas: "/enrollments",
      talleristas: "/workshops",
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
              <main className="flex min-h-dvh items-center justify-center bg-background p-4">
                <section className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-dialog">
                  <h1 className="text-2xl font-extrabold">Sesión iniciada</h1>
                  <p className="mt-2 text-muted">Ya te conectaste con SAGA UP.</p>
                  {session.roles?.length > 0 && (
                    <p className="mt-3 text-sm font-semibold">
                      Roles: {session.roles.join(", ")}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate("/children")}
                    className="mt-6 min-h-11 rounded-xl bg-primary px-4 py-2.5 font-extrabold text-foreground hover:bg-primary-hover hover:text-white"
                  >
                    Ver beneficiarios
                  </button>
                </section>
              </main>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/children" element={<ChildrenScreen />} />
        <Route path="/guardians" element={<GuardiansScreen />} />
        <Route path="/enrollments" element={<EnrollmentsScreen />} />
        <Route path="/workshops" element={<WorkshopsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
