import React, {useEffect, useState} from "react";
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import socket from "../../Socket.js";

export function Game() {
  let { gameId } = useParams();

  const [test, setTest] = useState("");
  const [players, setPlayers] = useState([]);
  const [adversaire, setAdversaire] = useState();
  
  useEffect(() => {
    // Send the id of the game
    socket.emit("gameInit", gameId);

    socket.on("gameStart", (obj) => {
      setPlayers(obj)
    })
  })

  return (
    <>
      <h1>Into game !</h1>
      {adversaire}
    </>
  );
};
