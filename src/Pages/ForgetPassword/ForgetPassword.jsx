import React, { useState } from "react";
import { auth } from "../../Firebase/firebase_config";
import { sendPasswordResetEmail } from "firebase/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      return Swal.fire("Error", "Please enter your email address!", "error");
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);

      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: `Password reset link has been sent to ${email}`,
        showConfirmButton: true,
      });

      setEmail("");
      navigate("/login");
    } catch (error) {
      let message = error.message || "Failed to send reset email.";
      switch (error.code) {
        case "auth/user-not-found":
          message = "No user found with this email.";
          break;
        case "auth/invalid-email":
          message = "Invalid email address.";
          break;
        default:
          break;
      }
      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Reset Password
        </h1>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            type="submit"
            className={`w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Remembered your password?{" "}
          <span
            className="text-cyan-600 underline hover:text-cyan-700 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
