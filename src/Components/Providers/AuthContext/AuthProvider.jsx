import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import axios from "axios";
import { auth } from "../../../Firebase/firebase_config";

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState(null); // 🔑 JWT token

  // ================= EMAIL REGISTER =================
  const createUser = async (email, password, name, photoURL) => {
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name, photoURL });

    const token = await res.user.getIdToken(); // 🔑 get Firebase JWT
    setJwtToken(token);

    // Save user to backend
    await axios.post(
      "http://localhost:3000/api/users",
      { name, email, role: "user" },
      { headers: { Authorization: `Bearer ${token}` } } // attach JWT
    );

    setUser(res.user);
    setRole("user");
    setLoading(false);

    return res.user;
  };

  // ================= EMAIL LOGIN =================
  const loginUser = async (email, password) => {
    setLoading(true);
    const res = await signInWithEmailAndPassword(auth, email, password);

    const token = await res.user.getIdToken();
    setJwtToken(token);

    // Fetch role from backend
    try {
      const roleRes = await axios.get(
        `http://localhost:3000/api/users/${res.user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRole(roleRes.data?.role || "user");
    } catch (err) {
      console.error("Failed to fetch role:", err.message);
      setRole("user");
    }

    setUser(res.user);
    setLoading(false);
    return res.user;
  };

  // ================= GOOGLE LOGIN =================
  const googleLogin = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    setJwtToken(token);

    // Save Google user to backend if not exists
    await axios.post(
      "http://localhost:3000/api/users",
      {
        name: result.user.displayName,
        email: result.user.email,
        role: "user",
        photoURL: result.user.photoURL,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Fetch role
    try {
      const roleRes = await axios.get(
        `http://localhost:3000/api/users/${result.user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRole(roleRes.data?.role || "user");
    } catch (err) {
      console.error("Failed to fetch role:", err.message);
      setRole("user");
    }

    setUser(result.user);
    setLoading(false);
    return result.user;
  };

  // ================= LOGOUT =================
  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setRole("user");
    setJwtToken(null);
    setLoading(false);
  };

  // ================= OBSERVER =================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const token = await currentUser.getIdToken();
        setJwtToken(token);

        try {
          const roleRes = await axios.get(
            `http://localhost:3000/api/users/${currentUser.email}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setRole(roleRes.data?.role || "user");
        } catch (err) {
          console.error("Failed to fetch role:", err.message);
          setRole("user");
        }
      } else {
        setRole("user");
        setJwtToken(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    role,
    jwtToken, // 🔑 expose JWT
    loading,
    createUser,
    loginUser,
    googleLogin,
    logOut,
    setUser,
    setRole,
    setLoading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
