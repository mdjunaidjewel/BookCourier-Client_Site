import React, { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router";
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider";
import {
  FaBook,
  FaUser,
  FaShoppingCart,
  FaUsers,
  FaPlus,
  FaFileInvoice,
} from "react-icons/fa";

const Dashboard = () => {
  const { role, jwtToken } = useContext(AuthContext); // JWT & role
  const navigate = useNavigate();
  const [active, setActive] = useState("");

  // ---------- ROLE BASED MENUS ----------
  const menus = {
    user: [
      {
        key: "orders",
        label: "My Orders",
        path: "/dashboard/orders",
        icon: <FaShoppingCart />,
      },
      {
        key: "profile",
        label: "Profile",
        path: "/dashboard/profile",
        icon: <FaUser />,
      },
      {
        key: "invoice",
        label: "Invoice",
        path: "/dashboard/invoice",
        icon: <FaFileInvoice />,
      },
    ],

    librarian: [
      {
        key: "add-book",
        label: "Add Book",
        path: "/dashboard/add-book",
        icon: <FaPlus />,
      },
      {
        key: "my-books",
        label: "My Books",
        path: "/dashboard/my-books",
        icon: <FaBook />,
      },
      {
        key: "orders",
        label: "Orders",
        path: "/dashboard/librarian-orders",
        icon: <FaShoppingCart />,
      },
    ],

    admin: [
      {
        key: "users",
        label: "All Users",
        path: "/dashboard/admin/users",
        icon: <FaUsers />,
      },
      {
        key: "books",
        label: "Manage Books",
        path: "/dashboard/admin/books",
        icon: <FaBook />,
      },
      {
        key: "orders",
        label: "My Profile",
        path: "/dashboard/profile",
        icon: <FaShoppingCart />,
      },
    ],
  };

  // ---------- HANDLE NAVIGATION ----------
  const handleNavigate = (item) => {
    setActive(item.key);
    navigate(item.path);
  };

  // ---------- FETCH WITH JWT HELPER ----------
  const fetchWithJWT = async (url, options = {}) => {
    if (!jwtToken) throw new Error("No JWT token found");
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Request failed");
    }

    return res.json();
  };

  // ---------- REDIRECT IF NO ROLE ----------
  useEffect(() => {
    if (!role) {
      navigate("/login"); // যদি role undefined হয়
    }
  }, [role, navigate]);

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-gray-100">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="drawer-content flex flex-col">
        <nav className="navbar bg-white shadow px-4">
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-square btn-ghost lg:hidden"
          >
            ☰
          </label>
          <h1 className="text-xl font-bold ml-2">Dashboard</h1>
        </nav>

        <div className="p-6 flex-1 overflow-auto">
          {/* Outlet passes JWT & role to child routes */}
          <Outlet context={{ fetchWithJWT, role, jwtToken }} />
        </div>
      </div>

      {/* ---------- SIDEBAR ---------- */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay" />
        <aside className="w-64 bg-white shadow-lg p-4">
          <h2 className="text-2xl font-bold text-center text-cyan-700 mb-6">
            {role?.toUpperCase()} PANEL
          </h2>

          {(menus[role] || []).map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavigate(item)}
              className={`flex items-center gap-3 w-full px-4 py-2 mb-2 rounded-lg transition
                ${
                  active === item.key
                    ? "bg-cyan-200 font-semibold"
                    : "hover:bg-cyan-100 text-gray-700"
                }`}
            >
              <span className="text-lg text-cyan-600">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
