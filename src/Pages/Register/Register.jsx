import React, { useEffect, useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../Firebase/firebase_config";
import Swal from "sweetalert2";

const Register = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 🔹 Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ================= EMAIL / PASSWORD REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const photoURL = e.target.photoURL.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must contain at least 6 characters including uppercase & lowercase letters.",
      });
      return;
    }

    try {
      // 🔹 Create user in Firebase
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // 🔹 Update Firebase profile
      await updateProfile(res.user, {
        displayName: name,
        photoURL: photoURL || null,
      });

      // 🔹 Save user to MongoDB with role = user
      await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          role: "user",
        }),
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful 🎉",
        text: `Welcome ${name}`,
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1800);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Swal.fire({
          icon: "error",
          title: "Email Already Registered",
          text: "Please login instead.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.message,
        });
      }
    }
  };

  // ================= GOOGLE SIGN IN =================
  const handleGoogleSign = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // 🔹 Save Google user to MongoDB
      await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          role: "user",
        }),
      });

      Swal.fire({
        icon: "success",
        title: `Welcome ${result.user.displayName}!`,
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1800);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Sign-in Failed",
        text: error.message,
      });
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {!user && (
        <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              name="name"
              placeholder="Your Name"
              required
              className="input input-bordered w-full"
            />

            <input
              name="photoURL"
              placeholder="Photo URL (optional)"
              className="input input-bordered w-full"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="input input-bordered w-full"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                className="input input-bordered w-full pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button className="btn btn-primary w-full mt-2">Register</button>
          </form>

          <button
            onClick={handleGoogleSign}
            className="btn btn-outline w-full mt-4 flex items-center gap-2"
          >
            <FaGoogle /> Continue with Google
          </button>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <NavLink to="/login" className="text-blue-600 underline">
              Login
            </NavLink>
          </p>
        </div>
      )}
    </div>
  );
};

export default Register;
