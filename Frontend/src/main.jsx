import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
// import App from './App.jsx'
import Register from "./Components/Register.jsx";
import SetupOrganisation from "./Components/SetupOrganisation.jsx";
import ChatbotIntegration from "./Components/ChatbotIntegration.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/setup-org" element={<SetupOrganisation />} />
        <Route path="/chatbot" element={<ChatbotIntegration />} />
      </Routes>
    </Router>
  </StrictMode>
);
