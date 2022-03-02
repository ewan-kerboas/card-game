import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Game } from './pages';
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/game-:gameId" element={<Game/>} />
      </Routes>
    </Router>
  );
}

export default App;
