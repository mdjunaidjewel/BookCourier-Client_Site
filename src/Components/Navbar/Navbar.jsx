import React from "react";
import { Link } from "react-router";
import Logo from "../../assets/book-logo.png";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* Navbar Start (Logo + Mobile Toggle) */}
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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

          {/* Mobile Menu */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow lg:hidden"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/books">Books</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/login" className="btn btn-sm btn-primary mt-2">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <img className="w-14" src={Logo} alt="logo" />
        <Link to="/" className="btn btn-ghost text-xl">
          BookCourier
        </Link>
      </div>

      {/* Navbar End (Right Side Menu) */}
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1 items-center">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/books">Books</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/login" className="btn btn-primary ml-2">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
