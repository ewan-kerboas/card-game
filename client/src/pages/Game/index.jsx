import React, {useEffect, useState} from "react";
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

export function Game() {

  let { gameId } = useParams();

  const [test, setTest] = useState("");
  
  useEffect(() => {
    console.log('coucou')
    // Send the id of the game
    socket.emit("gameInit", gameId);

    socket.on("hello", (obj) => {
      console.log('testttt')
      console.log(obj)
    })
  })

  return (
    <>
      <h1>Into game ! {
        test &&
        test
      }</h1>
    </>
  );
};
