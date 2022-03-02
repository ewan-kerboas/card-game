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

  socket.on("gameInit", (obj) => {
    console.log(obj)
    let id;

    for(i in games) {
      if(games[i].id == `game-${obj}`) {
        id = games[i].id;
      } else console.log('the game doesn\'t exist')
    }

    console.log(`Salut : ${id}`)

    if(id != undefined) {
      io.to(`${id}`).emit("hello", "salut");
    }
  })

  socket.on("addPlayer", (obj) => {
    if(wps.length == 0) {
      wps.push(new Player(socket.id, obj.username, socket));
    } else {
      let randomId = generateRandomNumber(12);

      wps[0].socket.join(`game-${randomId}`);
      socket.join(`game-${randomId}`);

      let game = new Game(`game-${randomId}`);

      game.players.push(wps[0]);
      game.players.push(new Player(socket.id, obj.username, socket));

      games.push(game);

      io.to(`game-${randomId}`).emit("isInGame", ({is: true, id: randomId}));

      wps = [];
    }
  });

  socket.on("removePlayer", (obj) => {
    if(wps.length > 1) return;
    wps = [];
  })

  socket.on("disconnect", () => {
    socket.on("removePlayer", (obj) => {
      if(wps.length > 1) return;
      wps = [];
    })
  })
})

server.listen(PORT, function() {
  console.log('listening on port ', PORT)
})