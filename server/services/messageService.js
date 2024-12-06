const prisma = require('../models/prisma/prismaClient')
const AppError = require('../config/AppError')

// get all conversations f
async function getAllConversations (userID) {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ userOneId: userID }, { userTwoId: userID }]
      },
      include: {
        messages: true
      }
    })
    return conversations
  } catch (error) {
    throw new AppError('Could not retrieve conversations', 500)
  }
}

// get all messages in a conversation
async function getMessages (conversationId) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    return messages
  } catch (error) {
    throw new AppError('Could not retrieve messages', 500)
  }
}

// get or create a conversation between two users
async function getOrCreateConversation (userOneId, userTwoId) {
  try {
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { userOneId, userTwoId },
          { userOneId: userTwoId, userTwoId: userOneId }
        ]
      }
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userOneId,
          userTwoId
        }
      })
    }

    return conversation
  } catch (error) {
    throw new AppError('Could not get or create conversation', 500)
  }
}

// send a message from one user to another
async function sendMessage (senderId, receiverId, conversationId, content) {
  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        conversationId,
        content,
        read: false
      }
    })
    return message
  } catch (error) {
    throw new AppError('Could not send message', 500)
  }
}

// mark a message as read
async function markMessageAsRead (messageId) {
  try {
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { read: true }
    })
    return message
  } catch (error) {
    throw new AppError('Message not found', 404)
  }
}

// get the count of unread messages for a user
async function getUnreadMessagesCount (userId) {
  try {
    const count = await prisma.message.count({
      where: {
        receiverId: userId,
        read: false
      }
    })
    return count
  } catch (error) {
    throw new AppError('Could not retrieve unread messages count', 500)
  }
}

module.exports = {
  getAllConversations,
  getMessages,
  getOrCreateConversation,
  sendMessage,
  markMessageAsRead,
  getUnreadMessagesCount
}
