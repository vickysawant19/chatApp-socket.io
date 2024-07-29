import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const io = new Server(server);

let messages = [];

app.use(express.static(path.join(__dirname, "public")));

// Route to serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected");

  // Listen for chat messages
  socket.on("chat", (data) => {
    messages.push(data);
    io.emit("chat", data);
    if (messages.length > 100) {
      messages.pop();
    }
  });

  socket.on("sendData", (data) => {
    socket.emit("previousMessages", messages);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
