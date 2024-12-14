const express = require('express')
const router = express.Router()
const groupChatController = require("./controller")

router.post('/createNewGroup', groupChatController.createNewGroupChat)

module.exports = router
