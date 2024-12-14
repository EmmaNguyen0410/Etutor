const express = require('express')
const router = express.Router()
const meetingController = require("./controller")

router.post('/add', meetingController.add)
      .post('/findMeetingsByClassId', meetingController.findMeetingsByClassId)
      .post('/confirm', meetingController.confirm)
      .post('/delete', meetingController.delete)

module.exports = router