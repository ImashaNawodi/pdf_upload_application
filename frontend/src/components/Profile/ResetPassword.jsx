import React, { useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { resetToken } = useParams();
  const [notification, setNotification] = useState(null); // New state for notifications

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/user/reset-password/${resetToken}`,
        {
          newPassword: password,
          resetToken: resetToken, // Include reset token in the request payload
        }
      );
      setNotification({
        type: "success",
        message: "Password Reset successfully",
      });
        } catch (error) {
      alert(error.response.data.error); // You can replace this with a more user-friendly UI feedback
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
        {notification && (
          <div
            className={`fixed top-10 left-1/2 transform -translate-x-1/2 w-1/4 p-4 z-50 text-center ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {notification.message}
          </div>
        )}
        <form onSubmit={handleResetPassword}>
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
                Reset Password
              </h1>
              <p
                className="mb-4 text-gray-400 leading-loose text-sm wow fadeInUp"
                data-wow-delay="0.6s"
              >
                Fill up the form to reset the password
              </p>

              <input
                id="password"
                name="password"
                type="password"
                className="w-full mb-6 p-3 rounded-lg text-gray-200 placeholder-gray-400 border border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="relative inline-flex items-center justify-center w-full p-3 mb-6 text-lg font-medium text-neutral-200 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                Reset password
              </button>
            </div>
          </div>
        </form>
      </div>
      <hr />
      <footer className="bg-gray-900 text-white text-center py-5">
        <p>&copy; 2024 PDF Manager. All rights reserved.</p>
      </footer>
      <hr />
    </div>
  );
};

export default ResetPassword;
