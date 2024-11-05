const socketIO = require('socket.io');

class SocketService {
  constructor() {
    this.io - null;
  }
  initialize(server) {
    this.io = socketIO(server);
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on('userOnline', (userId) => {
        console.log(`User online: ${userId}`)
      })

      socket.on('typing', (data) => {
        socket.to(data.recipientId).emit('typing', data);
      })

      socket.on('stopTyping', (data) => {
        socket.to(data.recipientId).emit('stopTyping', data);
      })

      socket.on('sendMessage', (data) => {
        // Save message to database
        socket.to(data.senderId).emit('recieveMessage', data);
      })

      socket.on('readMessage', (data) => {
        socket.to(data.senderId).emit('messageRead', data);
      })

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      })
    })
    console.log('Socket initialized');
  }
}

module.exports = new SocketService();