import { useContext, useState } from "react";
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider";
import { NavLink, useNavigate } from "react-router";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

const Register = () => {
  const { createUser, googleLogin, jwtToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target.name.value.trim();
    const photoURL = e.target.photoURL.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must contain at least 6 characters including uppercase & lowercase letters.",
      });
      setLoading(false);
      return;
    }

    try {
      const user = await createUser(email, password, name, photoURL);

      // Backend call to ensure user is saved
      await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ name, email, role: "user", photoURL }),
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful 🎉",
        text: `Welcome ${name}`,
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/", { replace: true }), 1800);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    }
    setLoading(false);
  };

  const handleGoogleSign = async () => {
    setLoading(true);
    try {
      const gUser = await googleLogin();

      await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          name: gUser.displayName || "User",
          email: gUser.email,
          photoURL: gUser.photoURL,
          role: "user",
        }),
      });

      Swal.fire({
        icon: "success",
        title: `Welcome ${gUser.displayName || "User"}!`,
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/", { replace: true }), 1800);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Google Sign-in Failed",
        text: error.message,
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
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
          <button className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <button
          onClick={handleGoogleSign}
          className="btn btn-outline w-full mt-4 flex items-center gap-2"
          disabled={loading}
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
    </div>
  );
};

export default Register;
