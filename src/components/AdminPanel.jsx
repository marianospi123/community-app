// src/components/AdminPanel.jsx
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar datos en Firestore con rol (colección consistente: "Usuarios")
      await setDoc(doc(db, "Usuarios", user.uid), {
  email: user.email,
  role: role.toLowerCase(), // consistente con AuthContext
  isConfigured: false,      // usuario nuevo no ha hecho setup
});


      alert("Usuario creado con éxito ✅");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error creando usuario:", error.message);
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto", textAlign: "center" }}>
      <h2>Panel de Admin 👑</h2>
      <p>Sesión iniciada como: {currentUser?.email}</p>
      <p>Rol actual: {userRole}</p>

      <form onSubmit={handleCreateUser} style={{ marginTop: "20px" }}>
        <input
          type="email"
          placeholder="Email del usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Crear Usuario</button>
      </form>

      <button
        onClick={handleLogout}
        style={{ marginTop: "30px", padding: "10px 20px", cursor: "pointer" }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default AdminPanel;
