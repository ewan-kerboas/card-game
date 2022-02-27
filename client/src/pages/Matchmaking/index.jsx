import React from "react";
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000/m');

export function Matchmaking() {

  return (
    <>
      <h1>Matchmaking ... </h1>
    </>
  );
};
