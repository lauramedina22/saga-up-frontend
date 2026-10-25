import { useState } from "react"
import { useAuth } from "./hooks/useAuth"
import Login from "./screens/Login"
import Register from "./screens/Register"

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
  } = useAuth()
  const [currentScreen, setCurrentScreen] = useState("login")

  if (session) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background p-4">
        <section className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-dialog">
          <h1 className="text-2xl font-extrabold">Sesión iniciada</h1>
          <p className="mt-2 text-muted">Ya te conectaste con SAGA UP.</p>
          {session.roles?.length > 0 && (
            <p className="mt-3 text-sm font-semibold">
              Roles: {session.roles.join(", ")}
            </p>
          )}
        </section>
      </main>
    )
  }

  if (currentScreen === "register") {
    return (
      <Register
        onRegister={register}
        onBackToLogin={() => setCurrentScreen("login")}
        loading={registerLoading}
        error={registerError}
        success={registerSuccess}
      />
    )
  }

  return (
    <Login
      onLogin={login}
      onGoToRegister={() => setCurrentScreen("register")}
      loading={loginLoading}
      error={loginError}
    />
  )
}

export default App
