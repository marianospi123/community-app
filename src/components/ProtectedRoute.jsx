import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login";

// Ruta protegida para usuarios normales
export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Cargando...</p>;

  if (!currentUser) return <Navigate to="/login" replace />;

  // Usuarios normales deben pasar por setup si no configuraron la cuenta
  if (currentUser.role !== "admin" && !currentUser.isConfigured) {
    return <Navigate to="/setup" replace />;
  }

  return children;
};

// Ruta protegida solo para admins
export const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Cargando...</p>;

  if (!currentUser) return <Navigate to="/login" replace />;

  if (currentUser.role !== "admin") return <Navigate to="/dashboard" replace />;

  // Admin nunca pasa por setup
  return children;
};

// Pantalla de login con redirección posterior al login
export const LoginRedirect = () => {
  const { currentUser, loading } = useAuth();

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Cargando...</p>;

  // Si ya inició sesión
  if (currentUser) {
    if (currentUser.role === "admin") return <Navigate to="/admin" replace />;
    if (!currentUser.isConfigured) return <Navigate to="/setup" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // Si no hay usuario logueado, mostrar login
  return <Login />;
};
