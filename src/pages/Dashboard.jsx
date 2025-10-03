// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h1>Bienvenido {currentUser?.email}</h1>
      <p>Tu rol: {userRole || "Usuario"}</p>
      <button 
        onClick={handleLogout} 
        style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer" }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
