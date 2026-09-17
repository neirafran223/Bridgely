import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy loading de páginas
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegistroPage = lazy(() => import("./pages/RegistroPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const IdeaDetallePage = lazy(() => import("./pages/IdeaDetallePage"));
const MisPostulacionesPage = lazy(() => import("./pages/MisPostulacionesPage"));
const PerfilDeveloperPage = lazy(() => import("./pages/PerfilDeveloperPage"));
const PerfilPublicoDeveloperPage = lazy(() => import("./pages/PerfilPublicoDeveloperPage"));
const PerfilClientePage = lazy(() => import("./pages/PerfilClientePage"));
const MisEquiposPage = lazy(() => import("./pages/MisEquiposPage"));
const MisTransaccionesPage = lazy(() => import("./pages/MisTransaccionesPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const TerminosPage = lazy(() => import("./pages/TerminosPage"));
const PrivacidadPage = lazy(() => import("./pages/PrivacidadPage"));
const AvisoLegalPage = lazy(() => import("./pages/AvisoLegalPage"));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-3 border-[#787FF6] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Cargando...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegistroPage />} />
              <Route
                path="/perfil-cliente"
                element={
                  <ProtectedRoute rolesPermitidos={["cliente"]}>
                    <PerfilClientePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mis-postulaciones"
                element={
                  <ProtectedRoute rolesPermitidos={["cliente", "developer"]}>
                    <MisPostulacionesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil-developer"
                element={
                  <ProtectedRoute rolesPermitidos={["cliente", "developer"]}>
                    <PerfilDeveloperPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mis-equipos"
                element={
                  <ProtectedRoute rolesPermitidos={["cliente", "developer"]}>
                    <MisEquiposPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mis-transacciones"
                element={
                  <ProtectedRoute rolesPermitidos={["cliente", "developer"]}>
                    <MisTransaccionesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/developers/:id/publico"
                element={
                  <ProtectedRoute rolesPermitidos={["cliente", "developer"]}>
                    <PerfilPublicoDeveloperPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ideas/:id"
                element={
                  <ProtectedRoute rolesPermitidos={["cliente", "developer"]}>
                    <IdeaDetallePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:postulacionId"
                element={
                  <ProtectedRoute rolesPermitidos={["cliente", "developer"]}>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute rolesPermitidos={["cliente", "developer"]}>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute rolesPermitidos={["admin"]}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/terminos" element={<TerminosPage />} />
              <Route path="/privacidad" element={<PrivacidadPage />} />
              <Route path="/aviso-legal" element={<AvisoLegalPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
