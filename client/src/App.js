import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Matchmaking } from './pages';
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/m?=:matchId" element={<Matchmaking/>} />
      </Routes>
    </Router>
  );
}

export default App;
