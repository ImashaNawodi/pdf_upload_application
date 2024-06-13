import React from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import FileUploadModal from "./FileUploadModel";

export default function UploadPdf() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const handleClick = () => {
    logout();
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

      <FileUploadModal />
    </div>
    <hr />
    <footer className="bg-gray-900 text-white text-center py-5">
      <p>&copy; 2024 PDF Manager. All rights reserved.</p>
    </footer>
    <hr />
  </div>
  );
}
