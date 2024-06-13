import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      const response = await fetch(
        "http://localhost:8000/user/password/reset/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setShowAlert(true);
      } else {
        console.error("Error:", data);
        alert("Error sending reset password request. Please try again.");
      }
    } catch (error) {
      console.error("Error sending reset password request:", error);
      alert("Error sending reset password request. Please try again.");
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
        {showAlert && (
          <div className="bg-green-200 text-green-700 p-4 mb-4 rounded">
            Password Reset Link is Sent Successfully!
          </div>
        )}
        <form onSubmit={handleSendMessage}>
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
                Forgot Password
              </h1>
              <p
                className="mb-4 text-gray-400 leading-loose text-sm wow fadeInUp"
                data-wow-delay="0.6s"
              >
                Enter the email address you used to create your account to
                receive instructions on resetting your password.
              </p>

              <input
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full mb-6 p-3 rounded-lg text-gray-200 placeholder-gray-400 border border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Email"
              />

              <button
                type="submit"
                className="relative inline-flex items-center justify-center w-full p-3 mb-6 text-lg font-medium text-neutral-200 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                Send Reset Password Email
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

export default ForgotPassword;
