import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig.js";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "Usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            role: data.role || null,
            isConfigured: !!data.isConfigured,
          });
        } else {
          setCurrentUser({ uid: user.uid, email: user.email, role: null, isConfigured: false });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, "Usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    let role = null;
    let isConfigured = false;

    if (docSnap.exists()) {
      const data = docSnap.data();
      role = data.role || null;
      isConfigured = !!data.isConfigured;
    }

    setCurrentUser({ uid: user.uid, email: user.email, role, isConfigured });
    return { role, isConfigured };
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const value = { currentUser, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
