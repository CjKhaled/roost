/* eslint-disable no-undef */
const { 
    getAllConversations, 
    getMessages, 
    getOrCreateConversation, 
    sendMessage, 
    markMessageAsRead, 
    getUnreadMessagesCount 
  } = require('../../../server/services/messageService');
  const prisma = require('../../../server/models/prisma/prismaClient');
  
  jest.mock('../../../server/models/prisma/prismaClient', () => ({
    conversation: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    message: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    }
  }));
  
  class PrismaClientKnownRequestError extends Error {
    constructor(message, code, clientVersion) {
      super(message);
      this.name = 'PrismaClientKnownRequestError';
      this.code = code;
      this.clientVersion = clientVersion;
    }
  }
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('retrieving all conversations for a user works', async () => {
    const mockConversations = [{ id: 'conv1', messages: [] }];
    prisma.conversation.findMany.mockResolvedValue(mockConversations);
  
    const conversations = await getAllConversations('userId');
    expect(prisma.conversation.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ userOneId: 'userId' }, { userTwoId: 'userId' }]
      },
      include: {
        messages: true
      }
    });
    expect(conversations).toEqual(mockConversations);
  });
  
  test('retrieving messages for a conversation works', async () => {
    const mockMessages = [{ id: 'msg1', content: 'Hello' }];
    prisma.message.findMany.mockResolvedValue(mockMessages);
  
    const messages = await getMessages('convId');
    expect(prisma.message.findMany).toHaveBeenCalledWith({
      where: {
        conversationId: 'convId'
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    expect(messages).toEqual(mockMessages);
  });
  
  test('getting or creating a conversation between users works', async () => {
    const mockConversation = { id: 'convId' };
    prisma.conversation.findFirst.mockResolvedValue(null);
    prisma.conversation.create.mockResolvedValue(mockConversation);
  
    const conversation = await getOrCreateConversation('userOneId', 'userTwoId');
    expect(prisma.conversation.findFirst).toHaveBeenCalledWith({
      where: {
        OR: [
          { userOneId: 'userOneId', userTwoId: 'userTwoId' },
          { userOneId: 'userTwoId', userTwoId: 'userOneId' }
        ]
      }
    });
    expect(prisma.conversation.create).toHaveBeenCalledWith({
      data: {
        userOneId: 'userOneId',
        userTwoId: 'userTwoId'
      }
    });
    expect(conversation).toEqual(mockConversation);
  });
  
  test('sending a message works', async () => {
    const mockMessage = { id: 'msgId', content: 'Hello', senderId: 'user1', receiverId: 'user2' };
    prisma.message.create.mockResolvedValue(mockMessage);
  
    const message = await sendMessage('user1', 'user2', 'convId', 'Hello');
    expect(prisma.message.create).toHaveBeenCalledWith({
      data: {
        senderId: 'user1',
        receiverId: 'user2',
        conversationId: 'convId',
        content: 'Hello',
        read: false
      }
    });
    expect(message).toEqual(mockMessage);
  });
  
  test('marking a message as read works', async () => {
    const mockMessage = { id: 'msgId', content: 'Hello', read: true };
    prisma.message.update.mockResolvedValue(mockMessage);
  
    const updatedMessage = await markMessageAsRead('msgId');
    expect(prisma.message.update).toHaveBeenCalledWith({
      where: { id: 'msgId' },
      data: { read: true }
    });
    expect(updatedMessage).toEqual(mockMessage);
  });
  
  test('getting unread messages count works', async () => {
    prisma.message.count.mockResolvedValue(5);
  
    const unreadCount = await getUnreadMessagesCount('userId');
    expect(prisma.message.count).toHaveBeenCalledWith({
      where: {
        receiverId: 'userId',
        read: false
      }
    });
    expect(unreadCount).toBe(5);
  });
  