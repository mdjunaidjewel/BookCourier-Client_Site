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

  // Email Register
  const createUser = async (email, password, name, photoURL) => {
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name, photoURL });
    // Save user to backend with default role "user"
    await axios.post("http://localhost:3000/api/users", {
      name,
      email,
      role: "user",
    });
    return res.user;
  };

  // Email Login
  const loginUser = async (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const googleLogin = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    // Save user to backend (if not exists)
    await axios.post("http://localhost:3000/api/users", {
      name: result.user.displayName,
      email: result.user.email,
      role: "user",
    });
    return result.user;
  };

  // Logout
  const logOut = async () => {
    setLoading(true);
    return signOut(auth);
  };

  // Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const res = await axios.get(
            `http://localhost:3000/api/users/${currentUser.email}`
          );
          setRole(res.data?.role || "user");
        } catch (err) {
          console.error("Failed to fetch role:", err.message);
          setRole("user");
        }
      } else {
        setRole("user");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    role,
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
