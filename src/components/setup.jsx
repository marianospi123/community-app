// src/pages/Setup.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Setup = () => {
  const { currentUser, setCurrentUser, logout } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [logo, setLogo] = useState(null);
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState(""); // Nuevo campo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Evitar que un usuario no logueado acceda
  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let logoURL = "";
      if (logo) {
        const logoRef = ref(storage, `logos/${currentUser.uid}_${logo.name}`);
        await uploadBytes(logoRef, logo);
        logoURL = await getDownloadURL(logoRef);
      }

      const businessRef = doc(db, "infoNegocio", currentUser.uid);
      await setDoc(businessRef, {
        businessName,
        description,
        contactEmail: email,
        phone,
        instagram,
        facebook,
        tiktok,               // Guardamos TikTok
        logo: logoURL,
        isConfigured: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Obtener datos actualizados
      const updatedDoc = await getDoc(businessRef);
      const data = updatedDoc.data();

      // Actualizar currentUser con toda la info
      setCurrentUser({
        uid: currentUser.uid,
        email: currentUser.email,
        role: currentUser.role,
        isConfigured: !!data.isConfigured,
        businessName: data.businessName || "",
        description: data.description || "",
        contactEmail: data.contactEmail || "",
        phone: data.phone || "",
        instagram: data.instagram || "",
        facebook: data.facebook || "",
        tiktok: data.tiktok || "",
        logo: data.logo || "",
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Hubo un problema guardando la configuración");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>Configuración Inicial</h2>
      <p>Completa esta información básica para personalizar tu cuenta.</p>

      <button
        onClick={handleLogout}
        style={{ padding: "10px 20px", marginBottom: "20px", cursor: "pointer" }}
      >
        Cerrar sesión
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Nombre del negocio:</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Logo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Descripción breve:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email de contacto:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Teléfono de contacto:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Instagram:</label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@tuusuario"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Facebook:</label>
          <input
            type="text"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            placeholder="https://facebook.com/tu-pagina"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>TikTok:</label>
          <input
            type="text"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
            placeholder="@tuusuario"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Guardando..." : "Guardar y continuar"}
        </button>
      </form>
    </div>
  );
};

export default Setup;
