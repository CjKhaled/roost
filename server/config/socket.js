const socketIO = require('socket.io');
const {
  getAllConversations,
  getMessages,
  getOrCreateConversation,
  sendMessage,
  markMessageAsRead,
  getUnreadMessagesCount,
} = require('../services/messageService');

class SocketService {
  constructor() {
    this.io = null;

  }
  initialize(server) {
    // this.io = socketIO(server);
    this.io = new socketIO.Server(server, {
      cors: {
        origin: '*', // Accept all URLs
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on('userOnline', (userId) => {
        console.log(`User online: ${userId}`)
        socket.join(userId)
      })

      socket.on('typing', (data) => {
        console.log("Typing: ", data);
        const { recipientId, username } = data;
        socket.to(recipientId).emit('typing', { username });
      })

      socket.on('stopTyping', (data) => {
        console.log("Stop typing: ", data);
        const { recipientId } = data;
        socket.to(recipientId).emit('stopTyping');
      })

      socket.on('sendMessage', async (data) => { // could make it syncronous but it complicates handling failures
        console.log("Message sent: ", data);
        try {
          const { senderId, receiverId, conversationId, content } = data;
          const message = await sendMessage(senderId, receiverId, conversationId, content);
          console.log("Message sent: ", message);

          socket.to(receiverId).emit('receiveMessage', message);
        } catch (error) {
          console.error('Error sending message:', error.message);
          socket.emit('error', { message: 'Could not send message' });
        }
      })

      socket.on('readMessage', async (data) => {
        console.log("Message read: ", data);
        try {
          const { messageId } = data;
          const message = await markMessageAsRead(messageId);

          socket.to(message.senderId).emit('messageRead', message);
        } catch (error) {
          console.error('Error marking message as read:', error.message);
          socket.emit('error', { message: 'Could not mark message as read' });
        }
      })

      socket.on('getMessages', async (conversationId) => {
        console.log("Get messages: ", conversationId);
        try {
          const messages = await getMessages(conversationId);
          socket.emit('messages', messages);
        } catch (error) {
          console.error('Error retrieving messages:', error.message);
          socket.emit('error', { message: 'Could not retrieve messages' });
        }
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      })
    })
    console.log('Socket initialized');
  }
}

module.exports = new SocketService();