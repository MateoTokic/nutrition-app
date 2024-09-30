// src/App.js
import './App.css';
// src/index.js or src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import SavePersonalData from './SavePersonalData'; // Import the component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/save-personal-data" element={<SavePersonalData />} /> {/* Add this route */}
        <Route path="/chat" element={<div>Chat with LLM - Coming Soon!</div>} /> {/* Placeholder for chat */}
      </Routes>
    </Router>
  );
}

export default App;
