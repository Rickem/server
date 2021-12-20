const path = require('path');
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");

const { Server } = require("socket.io");
// middleware
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
});

io.on("connection", (socket) => {
  console.log(`${socket.id} has connected`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`user with id ${socket.id} has joined room ${data}`);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconect", () => {
    console.log("user disconnected", socket.id);
  });
});

// static folder
// app.use(express.static(path.join(__dirname, '../public')));


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
})