import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { accountId } = useParams();
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      console.log("New password and confirm password do not match.");
      // You can also set an error state to display a message to the user if needed
      return;
    }

    setLoading(true); // Set loading state to true while waiting for the API request

    try {
      // Make an API call to change the password
      const response = await axios.post(
        `http://localhost:8000/user/change/${accountId}`,
        {
          currentPassword,
          newPassword,
        }
      );
      console.log("Password changed successfully:", response.data);
      // You can display a success message to the user if needed
    } catch (error) {
      console.error("Error changing password:", error.response.data);
      // You can display an error message to the user if needed
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  return (
    <div>
      <div
        className="flex flex-col min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgb(0 0 0 / 60%), rgb(0 0 0 / 60%)), url('/assets/1.jpeg')",
        }}
      >
        <div className="absolute top-0 left-0 mt-5 ml-5">
          <img
            src="/assets/OIP.jpeg"
            alt="Background Image"
            className="h-20 w-20 rounded-full object-cover"
          />
        </div>
        <div className="absolute top-0 right-0 mt-3 mr-5">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            <a href="/">Home</a>
          </button>
        </div>
        <form onSubmit={handleSave}>
          <div className="container flex-1 flex flex-col items-center max-w-md mx-auto px-4 py-20">
            <div
              className="flex flex-col p-8 rounded-2xl shadow-md bg-cover bg-center w-full"
              style={{
                backgroundImage:
                  "url('https://img.freepik.com/free-photo/starry-night-sky_1048-11828.jpg')",
                backgroundSize: "cover",
              }}
            >
              <h1 className="text-center text-4xl mb-8 text-neutral-200">
                Change Password
              </h1>
              <input
                id="password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full mb-6 p-3 rounded-lg text-gray-200 placeholder-gray-400 border border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Current Password"
                minLength="6"
                required
              />
              <input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mb-6 p-3 rounded-lg text-gray-200 placeholder-gray-400 border border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="New Password"
                minLength="6"
                required
              />{" "}
              <input
                id="password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full mb-6 p-3 rounded-lg text-gray-200 placeholder-gray-400 border border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400"
                minLength="6"
                required
              />
              <button
                type="submit"
                className="relative inline-flex items-center justify-center w-full p-3 mb-6 text-lg font-medium text-neutral-200 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <hr />
      <footer className="bg-gray-900 text-white text-center py-5">
        <p>&copy; 2024 PDF Vault. All rights reserved.</p>
      </footer>
      <hr />
    </div>
  );
};

export default ChangePassword;
