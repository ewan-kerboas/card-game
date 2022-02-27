const { appendFile } = require("fs");

const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;

class Player {
  constructor(id, username, socket) {
      this.id = id;
      this.username = username;
      this.socket = socket;
  }
}

class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
  }
}

let i = 1;

//wating players
let wps = [];

let games = [];

function generateRandomNumber(numberOfCharacters) {
  var randomValues = '';
  var stringValues = 'ABCDEFGHIJKLMNOabcdefghijklmnopqrstuvwxyzPQRSTUVWXYZ';  
  var sizeOfCharacter = stringValues.length;  

  for (var i = 0; i < numberOfCharacters; i++) {
     randomValues = randomValues+stringValues.charAt(Math.floor(Math.random() * sizeOfCharacter));
  }

  return randomValues;
} 


io.on('connection', socket => {
  socket.on("addPlayer", (obj) => {
    if(wps.length == 0) {
      wps.push(new Player(socket.id, obj.username, socket));
    } else {
      let randomId = generateRandomNumber(12);
      console.log(randomId);

      wps[0].socket.join(`game-${randomId}`);
      socket.join(`game-${randomId}`);

      let game = new Game(`game-${randomId}`);

      game.players.push(wps[0]);
      game.players.push(new Player(socket.id, obj.username, socket));

      games.push(game);

      console.log(games);
    }
  });

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