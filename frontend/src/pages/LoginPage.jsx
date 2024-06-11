import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountId, setAccountId] = useState("");
  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, accountId);
      // Redirect to home or dashboard after successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgb(0 0 0 / 60%), rgb(0 0 0 / 60%)), url('/assets/1.jpeg')",
      }}
    >
      <form onSubmit={handleLogin}>
        <div className="container flex-1 flex flex-col items-center max-w-md mx-auto px-4 py-20">
          <div
            className="flex flex-col p-8 rounded-2xl shadow-md bg-cover bg-center w-full"
            style={{
              backgroundImage:
                "url('https://img.freepik.com/free-photo/starry-night-sky_1048-11828.jpg')",
              backgroundSize: "cover",
            }}
          >
            <h1 className="text-center text-4xl mb-8 text-neutral-200">Login</h1>
            <input
              id="accountId"
              type="text"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="ACCXXX"
              className="w-full mb-6 p-3 rounded-lg text-gray-200 placeholder-gray-400 border border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400"
              autoFocus
              autoComplete="accountId"
              required
            />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full mb-6 p-3 rounded-lg text-gray-200 placeholder-gray-400 border border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400"
              autoComplete="email"
              required
            />

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full mb-6 p-3 rounded-lg text-gray-200 placeholder-gray-400 border border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400"
              minLength="6"
              required
            />

            <button
              type="submit"
              className="relative inline-flex items-center justify-center w-full p-3 mb-6 text-lg font-medium text-neutral-200 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {error && <div className="error text-neutral-200">{error}</div>}

            <p className="text-neutral-200 text-center">
              Don't have an account yet? <Link to="/signup" className="underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
