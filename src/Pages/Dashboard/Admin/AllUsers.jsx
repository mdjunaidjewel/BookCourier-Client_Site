import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";

const AllUsers = () => {
  const { jwtToken, user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://bookscourier.vercel.app/api/users",
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );

        // Filter out the logged-in admin using email
        const filteredUsers = res.data.filter(
          (u) => u.email !== currentUser.email
        );

        setUsers(filteredUsers || []);
      } catch (err) {
        console.error("Failed to fetch users:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [jwtToken, currentUser]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await axios.patch(
        `https://bookscourier.vercel.app/api/users/${userId}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? res.data : user))
      );
      Swal.fire("Success", `User role updated to ${newRole}`, "success");
    } catch (err) {
      console.error("Failed to update role:", err.message);
      Swal.fire("Error", "Failed to update user role", "error");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading users...</p>
      </div>
    );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        All Users
      </h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-3">{user.name || "No Name"}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-white font-medium ${
                        user.role === "admin"
                          ? "bg-red-500"
                          : user.role === "librarian"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2 flex-wrap">
                    {user.role !== "librarian" && (
                      <button
                        onClick={() => handleRoleChange(user._id, "librarian")}
                        className=" cursor-pointer px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
                      >
                        Make Librarian
                      </button>
                    )}
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleRoleChange(user._id, "admin")}
                        className=" cursor-pointer px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
