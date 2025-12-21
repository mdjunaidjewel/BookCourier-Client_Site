import React, { useContext, useState, useEffect } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../Firebase/firebase_config";
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider";
import Swal from "sweetalert2";

const Login = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      Swal.fire({
        icon: "info",
        title: "Already Logged In",
        text: "Redirecting to Home...",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/", { replace: true });
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  // ================= HANDLE EMAIL LOGIN =================
  const handleEmailLogin = async (event) => {
    event.preventDefault();

    if (!email) return Swal.fire("Error", "Email is required!", "error");
    if (!password) return Swal.fire("Error", "Password is required!", "error");

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      Swal.fire({
        icon: "success",
        title: `Welcome ${res.user.displayName || "User"}!`,
        text: "Login successful!",
        showConfirmButton: false,
        timer: 2000,
      });

      // Navigate to Home page
      navigate("/", { replace: true });
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
          Swal.fire("Error", "Email or Password Wrong.", "error");
          break;
        case "auth/wrong-password":
          Swal.fire("Error", "Incorrect password.", "error");
          break;
        default:
          Swal.fire(
            "Error",
            error.message || "Login failed. Try again.",
            "error"
          );
      }
    }
  };

  // ================= HANDLE GOOGLE LOGIN =================
  const handleGoogleSign = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);

      Swal.fire({
        icon: "success",
        title: `Welcome ${result.user.displayName || "User"}!`,
        text: "Login successful with Google!",
        showConfirmButton: false,
        timer: 2000,
      });

      // Navigate to Home page
      navigate("/", { replace: true });
    } catch (error) {
      switch (error.code) {
        case "auth/popup-closed-by-user":
        case "auth/cancelled-popup-request":
          Swal.fire("Info", "Google login was cancelled.", "info");
          break;
        default:
          Swal.fire("Error", error.message || "Google login failed.", "error");
      }
    }
  };

  if (loading) return <p className="text-center mt-20 text-lg">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-cyan-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-right text-cyan-600 hover:text-cyan-700 underline cursor-pointer"
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          onClick={handleGoogleSign}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <FaGoogle className="text-red-500" /> Continue with Google
        </button>

        <p className="text-center mt-4 text-gray-600 text-sm">
          New user?{" "}
          <NavLink
            to="/register"
            className="text-cyan-600 underline hover:text-cyan-700"
          >
            Create account here
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
