require('dotenv').config();
const authSocketMiddleware = require('./middleware/authSocketMiddleware');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Express ve HTTP sunucu oluştur
const socketHandler = require('./sockets');

const app = express();
const server = http.createServer(app);

// CORS ayarları (Tüm IP'lerden gelen bağlantıya izin veriyoruz, gerekirse sınırlarız)
const io = new Server(server, {
  cors: {
    origin: '*', // İleride frontend IP'sine sabitleyebilirsin
    methods: ['GET', 'POST']
  }
});

// Basit socket bağlanma testi
io.use(authSocketMiddleware);
socketHandler(io);


io.on('connection', (socket) => {
  console.log('Yeni bağlantı:', socket.id);

  socket.on('disconnect', () => {
    console.log('Bağlantı koptu:', socket.id);
  });
});

// HTTP root test
app.get('/', (req, res) => {
  res.send('Message servisi aktif.');
});

// Sunucuyu başlat
const PORT = process.env.PORT || 8005;
server.listen(PORT, () => {
  console.log(`Message servisi ${PORT} portunda çalışıyor.`);
});
