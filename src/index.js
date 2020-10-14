const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/messages");

const port = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.emit("message", generateMessage("Welcome"));
  socket.broadcast.emit("message", generateMessage("New User joined!"));

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    io.emit("message", generateMessage(message));
    callback("Delivered");
  });

  socket.on("sendLocation", (location, callback) => {
    io.emit("locationMessage", location);

    callback("Delivered location!");
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("User has left!"));
  });
});

server.listen(port, () => {
  console.log("Server started at port " + port);
});
