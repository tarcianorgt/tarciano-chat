const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ room, nickname }) => {
    socket.join(room);
    socket.nickname = nickname;
    io.to(room).emit('message', `${nickname} entrou na sala.`);
  });

  socket.on('chatMessage', (msg) => {
    io.to(socket.rooms).emit('message', `${socket.nickname}: ${msg}`);
  });

  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        io.to(room).emit('message', `${socket.nickname} saiu da sala.`);
      }
    }
  });
});

http.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
