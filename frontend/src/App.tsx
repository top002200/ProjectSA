import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// User
import ProfileUserUI from "./pages/profile/user";
import RegisterUserUI from "./pages/register/user";
import LoginUserUI from "./pages/login/user";
import PrivacyUserUI from "./pages/profile/user/privacy";
// Op
import ProfileOperator from "./pages/profile/operator";
import PrivacyOperator from "./pages/privacy/operator";
import RegisterOperator from "./pages/register/operator";
import LoginOperator from "./pages/login/operator";
// Candi-post
import Candidatepost from "./pages/candidate/post";
import Candidatehome from "./pages/candidatehome/home";


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
    if (result === "operator") {
      return (
        <Router>
          <Routes>
            <Route path="/login/operator" element={<Navigate to="/profile/operator" />} />
            <Route path="/profile/operator" element={<ProfileOperator />} />
            <Route path="/privacy/operator" element={<PrivacyOperator />} />
            <Route path="/candidate/post" element={<Candidatepost />} />
            <Route path="/candidatehome/home" element={<Candidatehome />} />
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

        <Route path="/op" element={<LoginOperator />} />
        <Route path="/register/operator" element={<RegisterOperator />} />
        <Route path="/profile/operator" element={<Navigate to="/" />} />
        <Route path="/privacy/operator" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );


};


export default App;
