import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { signup, error, isLoading } = useSignup();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const { accountId } = useParams();

  const handleSignUp = async (e) => {
    e.preventDefault();
   
    await signup(fullName,email, password );
  };

  const handleClick = () => {
    logout();
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center" style={{
      backgroundImage: "linear-gradient(rgb(0 0 0 / 60%), rgb(0 0 0 / 60%)), url('/assets/1.jpeg')",
    }}>
      <form onSubmit={handleSignUp}>
        <div className="container flex-1 flex flex-col items-center max-w-md mx-auto px-4 py-20">
          <div
            className="flex flex-col p-8 rounded-2xl shadow-md bg-cover bg-center w-full"
            style={{
              backgroundImage: "url('https://img.freepik.com/free-photo/starry-night-sky_1048-11828.jpg')",
              backgroundSize: 'cover',
            }}
          >
            <h1 className="text-center text-4xl mb-8 text-neutral-200">Sign Up</h1>

            <input
              id="name"
              type="text"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              className="w-full mb-6 p-3 rounded-lg text-gray-200 placeholder-gray-400 border border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Name"
            />

            <input
              id="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full mb-6 p-3 rounded-lg text-gray-200 placeholder-gray-400 border border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Email"
            />

            <input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              minLength="6"
              required
              className="w-full mb-6 p-3 rounded-lg text-gray-200 placeholder-gray-400 border border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Password"
            />

          

            <button
              type="submit"
              className="relative inline-flex items-center justify-center w-full p-3 mb-6 text-lg font-medium text-neutral-200 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>

            {error && <div className="text-red-500">{error}</div>}

            <p className="text-neutral-200 text-center">
              Already have an account? <Link to="/login" className="underline">Login here</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
