import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider";
import { updateProfile } from "firebase/auth";
import { auth } from "../../Firebase/firebase_config";
import Swal from "sweetalert2";

const Profile = () => {
  const context = useContext(AuthContext);
  const user = context?.user || null;
  const setUser = context?.setUser || (() => {}); // fallback if setUser is not defined

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(auth.currentUser, { displayName: name, photoURL });
      // Update context if setUser is available
      setUser({ ...user, displayName: name, photoURL });
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        timer: 1800,
        showConfirmButton: false,
      });
      setModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: error.message || "Something went wrong.",
      });
    }
  };

  // Format ISO date to readable string
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="loading loading-spinner loading-xl text-cyan-600"></span>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-white to-blue-100 px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-cyan-200">
        <h2 className="text-3xl font-bold text-center text-cyan-700 mb-6">
          My Profile
        </h2>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={user?.photoURL || "/default-profile.png"}
              alt={user?.displayName || "User"}
              className="w-28 h-28 rounded-full border-4 border-cyan-400 shadow-lg object-cover"
            />
          </div>
          <h3 className="text-2xl font-semibold mt-3">{user?.displayName}</h3>
          <p className="text-gray-600 mt-1">{user?.email}</p>
          {user?.metadata?.creationTime && (
            <p className="text-gray-500 mt-1 text-sm">
              Joined: {formatDate(user.metadata.creationTime)}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 shadow-md transition-all duration-300"
          >
            Update Profile
          </button>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-cyan-200">
              <h3 className="text-xl font-bold mb-4 text-center text-cyan-700">
                Update Profile
              </h3>

              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter new name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full border-cyan-300 focus:ring-2 focus:ring-cyan-500 rounded-lg px-3 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Enter new photo URL"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="input input-bordered w-full border-cyan-300 focus:ring-2 focus:ring-cyan-500 rounded-lg px-3 py-2"
                  required
                />
                <div className="flex justify-between mt-5">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-all duration-300"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow-md transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
