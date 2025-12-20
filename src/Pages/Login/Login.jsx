import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider";
import { NavLink, useNavigate } from "react-router";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../Firebase/firebase_config";

const Login = () => {
  const { user, loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  // ================= EMAIL LOGIN =================
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser(email, password);
      const loggedUser = result.user;

      // save email user to mongodb (if not exists)
      await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: loggedUser.displayName || "User",
          email: loggedUser.email,
          provider: "email",
        }),
      });

      Swal.fire("Success", "Login successful", "success");
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;

      // save google user to mongodb
      await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: loggedUser.displayName,
          email: loggedUser.email,
          photoURL: loggedUser.photoURL,
          provider: "google",
        }),
      });

      Swal.fire("Success", "Logged in with Google successfully", "success");
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border p-2 rounded pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="w-full bg-cyan-600 text-white py-2 rounded">
            Login
          </button>
        </form>

        <div className="my-4 text-center">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border py-2 rounded flex items-center justify-center gap-2"
        >
          <FaGoogle /> Continue with Google
        </button>

        <p className="text-center mt-4">
          New user?{" "}
          <NavLink to="/register" className="text-cyan-600 underline">
            Register
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
