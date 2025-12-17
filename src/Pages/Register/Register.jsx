import React, { useEffect, useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? currentUser : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Email/Password Sign Up
  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const photoURL = e.target.photoURL.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must have at least 6 characters including uppercase and lowercase letters.",
      });
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, {
        displayName: name,
        photoURL: photoURL || null,
      });

      setUser(res.user);

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: `Welcome ${name || "User"} 🎉`,
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
          text: "This email is already registered. Please login instead.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.message || "Something went wrong.",
        });
      }
    }
  };

  // Google Sign-In
  const handleGoogleSign = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);

      Swal.fire({
        icon: "success",
        title: `Welcome ${result.user.displayName || "User"}!`,
        text: "Google Sign-in Successful 🎉",
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
        text: error.message || "Something went wrong.",
      });
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-lg font-semibold">Loading...</p>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {!user && (
        <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Register
          </h1>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              name="name"
              placeholder="Your Name"
              required
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
            />
            <input
              name="photoURL"
              placeholder="Photo URL (optional)"
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition cursor-pointer"
            >
              Register
            </button>
          </form>

          <button
            onClick={handleGoogleSign}
            className="w-full py-2 mt-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-black hover:bg-gray-100 transition cursor-pointer"
          >
            <FaGoogle /> Continue with Google
          </button>

          <div className="mt-4 text-sm text-center text-gray-700">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-blue-500 underline hover:text-blue-600"
            >
              Login
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
