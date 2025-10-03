import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Setup from "./components/setup";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./components/AdminPanel";

// Wrapper para mostrar "Cargando..." mientras loading es true
const LoadingWrapper = ({ children }) => {
  const { loading } = useAuth();
  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Cargando...</p>;
  return children;
};

// Redirige automáticamente desde /login según el estado del usuario
const LoginRedirect = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Login />;

  if (currentUser.role === "admin") return <Navigate to="/admin" replace />;
  return currentUser.isConfigured ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/setup" replace />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <LoadingWrapper>
          <Routes>
            {/* Login */}
            <Route path="/login" element={<LoginRedirect />} />

            {/* Setup */}
            <Route path="/setup" element={<Setup />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminPanel />} />

            {/* Redirigir raíz */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LoadingWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
