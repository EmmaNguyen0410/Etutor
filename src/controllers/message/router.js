const express = require('express')
const router = express.Router()
const messageController = require("./controller")

router.post('/messages', messageController.findAllMessagesByGroupId)
      .get('/allChats', messageController.findAllGroupChatsByUserId)
      .post('/addNewMessage', messageController.addNewMessage)
      .get('/getTopFiveTutorsManyMessages', messageController.getTopFiveTutorsManyMessages)
      

module.exports = router