const express = require("express");
const { register, getAllScore, addScore, getMyScore } = require("./controllers/GlobalController");
const { authorization } = require("./middleware/auth");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let roomNumber = 1;
const rooms = {};
const roomCounters = {};
const timers = {};
const vote = {};
const score = {};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", register);

app.use(authorization);

io.on("connection", (socket) => {
  let assignedRoom = null;

  const username = socket.handshake.auth.username;

  for (const room in rooms) {
    if (rooms[room].length === 1) {
      assignedRoom = room;
      break;
    }
  }

  if (!assignedRoom) {
    assignedRoom = roomNumber;
    rooms[assignedRoom] = [];
    roomCounters[`room-${assignedRoom}`] = {};
    vote[`room-${assignedRoom}`] = {};
    score[`room-${assignedRoom}`] = {};
    roomNumber++;
  }

  rooms[assignedRoom].push(socket.id);
  socket.join(`room-${assignedRoom}`);
  roomCounters[`room-${assignedRoom}`][socket.id] = 0;
  score[`room-${assignedRoom}`][socket.id] = 0;
  vote[`room-${assignedRoom}`][socket.id] = 0;

  const otherUserId = rooms[assignedRoom].find((id) => id !== socket.id);
  const otherUsername = otherUserId ? io.sockets.sockets.get(otherUserId)?.handshake.auth.username : null;

  io.to(`room-${assignedRoom}`).emit("usernames", {
    myName: username,
    otherName: otherUsername || "Waiting for another player...",
  });

  socket.emit("message", `You have joined room ${assignedRoom}`);

  if (rooms[assignedRoom].length === 2) {
    io.to(`room-${assignedRoom}`).emit("message", "Room is full. Game starts!");
  } else {
    socket.emit("message", "Waiting for another player...");
  }

  socket.on("start", () => {
    const room = `room-${assignedRoom}`;

    if (!vote[room]) {
      vote[room] = {};
    }
    vote[room][socket.id] = 0;
    io.to(room).emit("vote:update", vote[room]);
    console.log(`Vote initialized for ${socket.id}:`, vote[room][socket.id]);

    startRoomTimer(room);
  });

  socket.on("vote", () => {
    const room = `room-${assignedRoom}`;

    if (!vote[room]) {
      vote[room] = {};
    }

    vote[room][socket.id] = 1;

    io.to(room).emit("vote:update", vote[room]);
    console.log(`${socket.id} voted. Current votes:`, vote[room]);

    const userIds = Object.keys(vote[room]);

    if (userIds.length === 2) {
      const totalVotes = vote[room][userIds[0]] + vote[room][userIds[1]];

      if (totalVotes === 2) {
        console.log("Both users voted! Game starting...");

        userIds.forEach((userId) => {
          roomCounters[room][userId] = 0;
          score[room][userId] = 0;
        });

        io.to(room).emit("count:update", roomCounters[room]);

        resetRoomTimer(room);
        startRoomTimer(room);

        userIds.forEach((userId) => {
          vote[room][userId] = 0;
        });

        io.to(room).emit("vote:update", vote[room]);

        io.to(room).emit("message", "Both users voted! Game starting...");
      }
    }
  });

  socket.on("count:add", () => {
    const room = `room-${assignedRoom}`;
    roomCounters[room][socket.id] += 3;
    score[room][socket.id] = roomCounters[room][socket.id];
    io.to(room).emit("count:update", roomCounters[room], score[room]);
    console.log(score);
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      const index = rooms[room].indexOf(socket.id);
      if (index !== -1) {
        rooms[room].splice(index, 1);
        delete roomCounters[`room-${room}`][socket.id];
        delete vote[`room-${room}`][socket.id];
        delete score[`room-${room}`][socket.id];
        if (rooms[room].length === 0) {
          clearInterval(timers[room]);
          delete rooms[room];
          delete roomCounters[`room-${room}`];
          delete vote[`room-${room}`];
        } else {
          io.to(`room-${room}`).emit("message", "Other player disconnected.");
        }
        break;
      }
    }
  });

  socket.on("timer:reset", () => {
    const room = `room-${assignedRoom}`;
    resetRoomTimer(room);
    startRoomTimer(`room-${assignedRoom}`);
  });
  socket.on("count:reset", () => {
    const room = `room-${assignedRoom}`;
    roomCounters[room][socket.id] = 0;
    io.to(room).emit("count:update", roomCounters[room]);
  });
});

function startRoomTimer(room) {
  let timer = 10;

  timers[room] = setInterval(() => {
    timer--;
    io.to(room).emit("timer:update", timer);

    if (timer <= 0) {
      clearInterval(timers[room]);
      io.to(room).emit("message", "Time's up!");
    }
  }, 1000);
}

function resetRoomTimer(room) {
  clearInterval(timers[room]);
}

app.get("/score", getAllScore);
app.post("/score", addScore);
app.get("/myscore", getMyScore);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
