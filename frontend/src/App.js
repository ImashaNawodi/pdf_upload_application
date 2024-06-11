import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/HomePage";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
/* import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage"; */ // Assuming this is the correct import for HomePage

import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const { user } = useAuthContext();
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    // Here you can make an asynchronous call to fetch accountId from the database
    // For example:
    // fetchAccountId().then((accountId) => setAccountId(accountId));
  }, []); // Make sure to pass an empty dependency array to useEffect to run only once

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/signup"
          element={!user ? <SignUpPage /> : <Navigate to={`/home/${user.accountId}`} />}
        />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to={`/home/${user.accountId}`} />}
        />
       {/*  
        
        <Route path="/home/:accountId" element={<HomePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
