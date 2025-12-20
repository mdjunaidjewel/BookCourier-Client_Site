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
  const [jwtToken, setJwtToken] = useState(null);

  const fetchRole = async (email, token) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/users/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(res.data?.role || "user");
    } catch (err) {
      console.error("Fetch role error:", err);
      setRole("user");
    }
  };

  const createUser = async (email, password, name, photoURL) => {
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name, photoURL });

    const token = await res.user.getIdToken();
    setJwtToken(token);

    await axios.post(
      "http://localhost:3000/api/users",
      { name, email, role: "user" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUser(res.user);
    setRole("user");
    setLoading(false);
    return res.user;
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    const res = await signInWithEmailAndPassword(auth, email, password);
    const token = await res.user.getIdToken();
    setJwtToken(token);
    await fetchRole(res.user.email, token);

    setUser(res.user);
    setLoading(false);
    return res.user;
  };

  const googleLogin = async () => {
    setLoading(true);
    const res = await signInWithPopup(auth, googleProvider);
    const token = await res.user.getIdToken();
    setJwtToken(token);

    await axios.post(
      "http://localhost:3000/api/users",
      {
        name: res.user.displayName,
        email: res.user.email,
        role: "user",
        photoURL: res.user.photoURL,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await fetchRole(res.user.email, token);

    setUser(res.user);
    setLoading(false);
    return res.user;
  };

  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setRole("user");
    setJwtToken(null);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const token = await currentUser.getIdToken();
        setJwtToken(token);
        await fetchRole(currentUser.email, token);
      } else {
        setRole("user");
        setJwtToken(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        jwtToken,
        loading,
        createUser,
        loginUser,
        googleLogin,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
