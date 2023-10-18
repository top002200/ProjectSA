import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


import ProfileUserUI from "./pages/profile/user";
import RegisterUserUI from "./pages/register/user";
import LoginUserUI from "./pages/login/user";
import PrivacyUserUI from "./pages/profile/user/privacy";


const App: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  const result = localStorage.getItem("result");
  const page = localStorage.getItem("page");

  if (token) {
    console.log(result)
    if (result === "user") {
      return (
        <Router>
          <Routes>
            <Route path="/login/user" element={<Navigate to="/profile/user" />} />
            <Route path="/profile/user" element={<ProfileUserUI />} />
            <Route path="/privacy/user" element={<PrivacyUserUI />} />
          </Routes>
        </Router>
      );
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginUserUI />} />
        <Route path="/register/user" element={<RegisterUserUI />} />
        <Route path="/profile/user" element={<Navigate to="/" />} />
        <Route path="/privacy/user" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );


};


export default App;
