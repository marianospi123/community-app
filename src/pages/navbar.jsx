import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </nav>
  );
}
