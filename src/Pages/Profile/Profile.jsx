import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider";
import { updateProfile } from "firebase/auth";
import { auth } from "../../Firebase/firebase_config";
import Swal from "sweetalert2";

const Profile = () => {
  const context = useContext(AuthContext);
  const user = context?.user || null;
  const setUser = context?.setUser || (() => {});

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
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL,
      });

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
        text: error.message || "Something went wrong",
      });
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="loading loading-spinner loading-xl text-cyan-600"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-white to-blue-100 px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-cyan-200">
        <h2 className="text-3xl font-bold text-center text-cyan-700 mb-6">
          My Profile
        </h2>

        {/* Profile Info */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={user?.photoURL || "/default-profile.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-cyan-400 shadow-lg object-cover"
          />
          <h3 className="text-2xl font-semibold mt-3">
            {user?.displayName || "No Name"}
          </h3>
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
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 shadow-md transition cursor-pointer"
          >
            Update Profile
          </button>
        </div>

        {/* ================= MODAL ================= */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-cyan-200 animate-scaleUp">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h3 className="text-xl font-bold text-cyan-700">
                  Edit Profile
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-red-500 text-2xl cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* Preview */}
              <div className="flex flex-col items-center py-5">
                <img
                  src={photoURL || user?.photoURL || "/default-profile.png"}
                  alt="Preview"
                  className="w-24 h-24 rounded-full border-4 border-cyan-400 shadow-md object-cover"
                />
                <p className="text-gray-500 text-sm mt-2">Live Preview</p>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdate} className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered w-full border-cyan-300 focus:ring-2 focus:ring-cyan-500 rounded-xl px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Photo URL
                  </label>
                  <input
                    type="text"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="input input-bordered w-full border-cyan-300 focus:ring-2 focus:ring-cyan-500 rounded-xl px-3 py-2"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-md transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl shadow-sm transition cursor-pointer"
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
