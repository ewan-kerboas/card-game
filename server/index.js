const { appendFile } = require("fs");

const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;

class Player {
  constructor(id, username) {
      this.id = id;
      this.username = username;
  }
}

//wating players
let wps = []

let lastPlayer = null;

function matchmake() {
  // adding last player at the top of the pile
  if(lastPlayer != null) wps = [lastPlayer, ...wps];

  // save the last impaire player for the next matchmaking
  if (wps.length % 2 == 1) {
      console.log("impaire")
      lastPlayer = wps[wps.length - 1];
      wps.splice(wps.length - 1, 1);
  }

  // matchmake
  let matchs = []
  const midLength = wps.length / 2;

  for (let x = 0; x < midLength; x++) {
      const _rnd = dblRnd(wps.length-1);
      matchs.push({ red: wps.splice(_rnd.red, 1)[0], blue: wps.splice(_rnd.blue, 1)[0] });
  }

  return matchs;
}

// random number
function rnd(max) {
  return Math.floor(Math.random() * max);
}

//double random number
function dblRnd(max){
  let red, blue;

  red = rnd(max);
  blue = rnd(max);

  while (red != blue){
      blue = rnd(max);
  }

  return {red, blue};
}

setInterval(() => {
  if(wps.length > 1) {
    const result = matchmake();
    console.log(result);
    
    io.sockets.emit("initGame", result);
    
  }
}, 1000)

io.on('connection', socket => {
  socket.on("addPlayer", (obj) => {
    wps.push(new Player(socket.id, obj.username));
  })

  socket.on("removePlayer", (obj) => {
    const removeIndex = wps.findIndex(item => item.id === obj.id);
    wps.splice(removeIndex, 1)
  })

  socket.on("disconnect", () => {
    socket.on("removePlayer", (obj) => {
      const removeIndex = wps.findIndex(item => item.id === obj.id);
      wps.splice(removeIndex, 1)
    })
  })
})

server.listen(PORT, function() {
  console.log('listening on port ', PORT)
})