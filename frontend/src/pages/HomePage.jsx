import React, { useState } from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const HomePage = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const handleClick = () => {
    logout();
  };
  return (
    <div>
      <div
        className="h-screen flex justify-center items-center bg-cover bg-center"
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

        {user && (
          <button
            onClick={handleClick}
            className="absolute bg-red-600 hover:bg-red-700 text-white p-3 top-0 right-0 mt-3 mr-5  py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Log out
          </button>
        )}
        {!user && (
          <button className="absolute bg-red-600 hover:bg-red-700 text-white p-3 top-0 right-0 mt-3 mr-5  py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            <a href="login"> Sign In</a>
          </button>
        )}

        <div className="space-y-5">
          <p className="text-white font-bold text-5xl flex flex-col items-center">
            <span>
              Upload and View PDFs <br />
            </span>
            <span> easily and securely. </span>
          </p>
          <p className="text-white font-semibold text-3xl flex flex-col items-center">
            Join Us and Manage Your Documents Easily.
          </p>
          <div className="flex flex-row items-center justify-center">
            <button className="p-4 text-l font-semibold bg-red-600 hover:bg-red-700 text-white">
              <a href="signup"> Get Started &gt;</a>
            </button>
          </div>
        </div>
      </div>

      <hr />
      <div class="h-screen flex items-center justify-center bg-black p-5">
        <div class="space-y-5 p-5">
          <p class="text-white font-bold text-4xl">Secure Uploads</p>
          <p class="text-white font-semiboldbold text-xl">
            Easily upload your PDF documents securely.
          </p>
        </div>
        <div>
          <img src="/assets/6.jpg" />
        </div>
      </div>
      <hr />
      <div class="h-screen flex items-center justify-center bg-black p-5">
        <div>
          <img class="our-story-card-img" src="/assets/4.jpeg" />
        </div>
        <div class="space-y-5 p-5">
          <p class="text-white font-bold text-4xl">Effortless Viewing</p>
          <p class="text-white font-semiboldbold text-xl">
            View your uploaded PDFs effortlessly anytime, anywhere.{" "}
          </p>
        </div>
      </div>
      <hr />
      <div class="h-screen flex items-center justify-center bg-black p-5">
        <div class="space-y-5 p-5">
          <p class="text-white font-bold text-4xl">User-Friendly Interface</p>
          <p class="text-white font-semiboldbold text-xl">
            Enjoy a simple and intuitive user interface.
          </p>
        </div>
        <div>
          <img
            alt=""
            class="our-story-card-img"
            data-uia="our-story-card-img"
            src="/assets/8.png"
          />
        </div>
      </div>
      <hr />

      <hr />
      <footer className="bg-gray-900 text-white text-center py-5">
        <p>&copy; 2024 PDF Manager. All rights reserved.</p>
      </footer>
      <hr />
    </div>
  );
};

export default HomePage;
