const { getAllConversations } = require('../services/messageService')

async function getAllConversationsHandler (req, res, next) {
  try {
    const { userID } = req.params // Assuming userId is passed as a URL parameter
    const conversations = await getAllConversations(userID)
    res.status(200).json({ conversations })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllConversationsHandler
}
