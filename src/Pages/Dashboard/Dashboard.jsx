import React, { useContext, useState } from "react";
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
  const { role } = useContext(AuthContext);
  const [activePage, setActivePage] = useState("home");
  const navigate = useNavigate();

  // Sidebar menu based on role
  const sidebarItems = {
    user: [
      {
        label: "My Orders",
        key: "orders",
        path: "/dashboard/orders",
        icon: <FaShoppingCart />,
      },
      {
        label: "Profile",
        key: "profile",
        path: "/dashboard/profile",
        icon: <FaUser />,
      },
      {
        label: "Invoice",
        key: "invoice",
        path: "/dashboard/invoice",
        icon: <FaFileInvoice />,
      },
    ],
    librarian: [
      {
        label: "Add Book",
        key: "addBook",
        path: "/dashboard/add-book",
        icon: <FaPlus />,
      },
      {
        label: "My Books",
        key: "myBooks",
        path: "/dashboard/my-books",
        icon: <FaBook />,
      },
      {
        label: "Orders",
        key: "orders",
        path: "/dashboard/orders",
        icon: <FaShoppingCart />,
      },
    ],
    admin: [
      {
        label: "All Users",
        key: "users",
        path: "/dashboard/users",
        icon: <FaUsers />,
      },
      {
        label: "All Books",
        key: "books",
        path: "/dashboard/books",
        icon: <FaBook />,
      },
      {
        label: "All Orders",
        key: "orders",
        path: "/dashboard/orders",
        icon: <FaShoppingCart />,
      },
    ],
  };

  const handleSidebarClick = (item) => {
    setActivePage(item.key);
    navigate(item.path);
  };

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-gray-50">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <nav className="navbar bg-base-300 w-full shadow-md px-4">
          <label
            htmlFor="my-drawer"
            className="btn btn-square btn-ghost lg:hidden"
          >
            ☰
          </label>
          <span className="font-bold text-lg ml-2">Dashboard</span>
        </nav>

        {/* Page content */}
        <div className="p-6 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="bg-white w-64 shadow-lg p-4 flex flex-col">
          <h2 className="text-2xl font-bold text-cyan-700 mb-6 text-center">
            Menu
          </h2>
          {(sidebarItems[role] || []).map((item) => (
            <button
              key={item.key}
              onClick={() => handleSidebarClick(item)}
              className={`cursor-pointer flex items-center gap-3 px-4 py-2 mb-2 rounded-lg hover:bg-cyan-100 transition-all ${
                activePage === item.key
                  ? "bg-cyan-200 font-semibold shadow-inner"
                  : "text-gray-700"
              }`}
            >
              <span className="text-cyan-600 cursor-pointer">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
