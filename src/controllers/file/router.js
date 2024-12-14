const express = require('express')
const router = express.Router()
const fileController = require("./controller")

router.get('/get', fileController.getFile)
      .post('/upload', fileController.upload)
      .post('/updateClassIdAndPostId', fileController.updateClassIdAndPostId)

module.exports = router
