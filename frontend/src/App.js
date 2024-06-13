import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import Home from "./pages/HomePage";
import LoginPage from "./components/LoginPage";
import UserHome from "./pages/UserHome";
import UploadPdf from "./components/UploadPdf";
import ViewPdf from "./components/ViewPdf";
import DeletePdf from "./components/DeletePdf";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/Profile/ResetPassword";
import ChangePassword from "./components/Profile/ChangePassword";
import DeleteAccount from "./components/Profile/DeleteAccount";
import SignUp from "./components/SignUp";

function App() {
  const { user } = useAuthContext();

  return (
    <Router>
      <Routes>

        {/* Public Route: Homepage */}
        <Route path="/" element={<Home />} />

        {/* Public Route: Signup Page */}
        <Route
          path="/signup"
          element={
            !user ? <SignUp /> : <Navigate to={`/home/${user.accountId}`} />
          }
        />

        {/* Public Route: Login Page */}
        <Route
          path="/login"
          element={
            !user ? <LoginPage /> : <Navigate to={`/home/${user.accountId}`} />
          }
        />

        {/* Private Route: User Home Page */}
        <Route path="/home/:accountId" element={<UserHome />} />

        {/* Private Route: Upload PDF Page */}
        <Route path="/UploadPdf/:accountId" element={<UploadPdf />} />

        {/* Private Route: View PDF Page */}
        <Route path="/ViewPdf/:accountId/:pdfId" element={<ViewPdf />} />

        {/* Private Route: Delete PDF Page */}
        <Route path="/deletePdf/:accountId/:id" element={<DeletePdf />} />
        
        {/* Public Route: Forgot Password Page */}
        <Route path="/forgotPassword" element={< ForgotPassword/>} />

        {/* Public Route: Reset Password Page */}
        <Route path="/reset-password/:resetToken" element={<ResetPassword/>} />

        {/* Private Route: Change Password Page */}
        <Route path="/changePassword/:accountId" element={<ChangePassword />} />

        {/* Private Route: Delete Account Page */}
        <Route path="/deleteAccount/:accountId" element={<DeleteAccount />} />

      </Routes>
    </Router>
  );
}

export default App;
