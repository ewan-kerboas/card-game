import React from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';

import "./Home.css";

const socket = io.connect('http://localhost:4000');

export function Home() {

  const [inMatchmaking, setInMatchmaking] = React.useState(false);

  const navigate = useNavigate();

  setInterval(() => {
  }, 1000)

  function joinMatchmaking() {
    setInMatchmaking(true)

    socket.emit("addPlayer", {username: "testCoco"})
  }

  function leaveMatchmaking() {
    setInMatchmaking(false);

    socket.emit("removePlayer", {id: socket.id})
  }

  return (
    <div className="home-container">
        <button onClick={joinMatchmaking} className="enter-room-button">Play</button>
        {
          inMatchmaking &&
          <>
            <h1>Searching player ...</h1>
            <button onClick={leaveMatchmaking}>Leave matchmaking</button>
          </>
        }
    </div>
  );
};
