const express = require('express')
const router = express.Router()
const notificationController = require("./controller")

router.post('/add', notificationController.add)
      .get('/getNotificationsByUserId', notificationController.getNotificationsByUserId)
      .post('/updateNotiSeenStt', notificationController.updateNotiSeenStt)

module.exports = router