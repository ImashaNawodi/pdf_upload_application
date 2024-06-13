import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/HomePage";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import ManagePdf from "./pages/UserHome";
import UploadPdf from "./components/UploadPdf";
import ViewPdf from "./components/ViewPdf";
import DeletePdf from "./components/DeletePdf";
import { useAuthContext } from "./hooks/useAuthContext";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ChangePassword from "./components/Profile/ChangePassword";
import DeleteAccount from "./components/Profile/DeleteAccount";

function App() {
  const { user } = useAuthContext();

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={
            !user ? <SignUpPage /> : <Navigate to={`/home/${user.accountId}`} />
          }
        />

        <Route
          path="/login"
          element={
            !user ? <LoginPage /> : <Navigate to={`/home/${user.accountId}`} />
          }
        />

        <Route path="/home/:accountId" element={<ManagePdf />} />
        <Route path="/UploadPdf/:accountId" element={<UploadPdf />} />
        <Route path="/ViewPdf/:accountId/:pdfId" element={<ViewPdf />} />
        <Route path="/deletePdf/:id" element={<DeletePdf />} />
        <Route path="/forgotPassword" element={< ForgotPassword/>} />

        <Route path="/reset-password/:resetToken" element={<ResetPassword/>} />
        <Route path="/changePassword/:accountId" element={<ChangePassword />} />
        <Route path="/deleteAccount/:accountId" element={<DeleteAccount />} />

      </Routes>
    </Router>
  );
}

export default App;
