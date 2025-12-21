import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import Logo from "../../assets/book-logo.png";
import { AuthContext } from "../Providers/AuthContext/AuthProvider";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();

      Swal.fire({
        icon: "success",
        title: "Logged out successfully!",
        text: "You have been logged out.",
        confirmButtonText: "OK",
        position: "center",
        timer: 2500,
        showConfirmButton: true,
      });

      navigate("/", { replace: true });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Logout failed!",
        text: err.message,
        confirmButtonText: "OK",
        position: "center",
      });
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      {/* Navbar Start */}
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <div tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow lg:hidden"
          >
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/books">Books</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>

            {loading ? (
              <li>Loading...</li>
            ) : !user ? (
              <li>
                <NavLink to="/login" className="btn btn-sm btn-primary mt-2">
                  Login
                </NavLink>
              </li>
            ) : (
              <li className="flex flex-col items-center">
                <img
                  src={user.photoURL || "/default-profile.png"}
                  alt="Profile"
                  className="w-14 h-14 rounded-full mb-2 cursor-pointer"
                  onClick={() => navigate("/profile")}
                />
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-error w-full cursor-pointer"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Logo */}
        <img className="w-14" src={Logo} alt="logo" />
        <Link to="/" className="btn btn-ghost text-xl ml-2">
          Books<span className="text-yellow-600">Courier</span>
        </Link>
      </div>

      {/* Navbar End */}
      <div className="navbar-end hidden lg:flex items-center">
        <ul className="menu menu-horizontal px-1 items-center gap-2">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/books">Books</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>

          {loading ? (
            <li>Loading...</li>
          ) : !user ? (
            <li>
              <NavLink to="/login" className="btn btn-primary ml-2">
                Login
              </NavLink>
            </li>
          ) : (
            <li className="dropdown dropdown-end">
              <img
                src={user.photoURL || "/default-profile.png"}
                alt="Profile"
                className="w-12 h-12 rounded-full cursor-pointer"
                tabIndex={0}
              />

              {/* Dropdown menu */}
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 mt-2 flex flex-col items-center"
              >
                <button
                  onClick={handleLogout}
                  className="btn btn-error btn-sm w-full cursor-pointer"
                >
                  Logout
                </button>
              </ul>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
