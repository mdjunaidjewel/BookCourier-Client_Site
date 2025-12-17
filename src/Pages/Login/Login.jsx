import { useContext } from "react";
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider";

const Login = () => {
  const { loginUser, googleLogin } = useContext(AuthContext);

  const handleLogin = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    loginUser(email, password)
      .then(() => alert("Login Successful"))
      .catch(err => alert(err.message));
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <form onSubmit={handleLogin} className="card bg-base-100 shadow p-5">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input input-bordered mb-3"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input input-bordered mb-3"
          required
        />

        <button className="btn btn-primary w-full">Login</button>

        <div className="divider">OR</div>

        <button
          type="button"
          onClick={googleLogin}
          className="btn btn-outline w-full"
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
