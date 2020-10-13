const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");

const port = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

let count = 0;

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.emit("message", "Welcome!");
  socket.broadcast.emit("message", "new user joined room");

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("sendLocation", ({ location, latitude, longitude }) => {
    socket.broadcast.emit(
      "message",
      location + " https://google.com/maps?q=" + latitude + "," + longitude
    );
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left!");
  });
});

server.listen(port, () => {
  console.log("Server started at port " + port);
});
