const db = require('../db');

function socketHandler(io) {
  io.on('connection', (socket) => {
    const { id: sender_id, type: sender_type } = socket.user;

    console.log(`📡 ${sender_type} [${sender_id}] bağlandı.`);

    // 1. Mesaj gönderme olayı
    socket.on('send_message', async (data) => {
      const { receiver_id, receiver_type, content } = data;

      if (!receiver_id || !receiver_type || !content) {
        return socket.emit('error_message', 'Eksik mesaj bilgisi.');
      }

      try {
        const query = `
          INSERT INTO messages (sender_id, sender_type, receiver_id, receiver_type, content)
          VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const values = [sender_id, sender_type, receiver_id, receiver_type, content];

        const result = await db.query(query, values);
        const savedMessage = result.rows[0];

        console.log('💬 Mesaj kaydedildi:', savedMessage);

        // 2. Alıcıya mesajı gönder (eğer bağlıysa ileride emit edeceğiz)

        // Şimdilik: sadece gönderene geri gönderelim
        socket.emit('message_sent', savedMessage);

      } catch (err) {
        console.error('Mesaj kaydedilemedi:', err);
        socket.emit('error_message', 'Mesaj gönderilirken bir hata oluştu.');
      }
    });

    // Bağlantı kapandığında
    socket.on('disconnect', () => {
      console.log(`❌ ${sender_type} [${sender_id}] bağlantısı kapandı.`);
    });
  });
}

module.exports = socketHandler;
