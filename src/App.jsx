import { lazy, Suspense } from "react"
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { AuthProvider, useAuth } from "./hooks/useAuth"
import FloatingOrbs from "./components/FloatingOrbs"
import BottomNav from "./components/BottomNav"
import Welcome from "./pages/Welcome"
import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import Stretch from "./pages/Stretch"

const Journal = lazy(() => import("./pages/Journal"))
const History = lazy(() => import("./pages/History"))
const Settings = lazy(() => import("./pages/Settings"))

function LoadingFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center">
      <div className="skeleton w-16 h-16 rounded-full" />
    </div>
  )
}

const authPages = ["/", "/auth"]

function AppRoutes() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const showNav = user && !authPages.includes(location.pathname)

  if (loading) return <LoadingFallback />

  return (
    <>
      <FloatingOrbs />
      <div className="relative z-10 flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Welcome />} />
              <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
              <Route path="/stretch" element={user ? <Stretch /> : <Navigate to="/auth" />} />
              <Route path="/journal" element={user ? <Journal /> : <Navigate to="/auth" />} />
              <Route path="/history" element={user ? <History /> : <Navigate to="/auth" />} />
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
      {showNav && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  )
}