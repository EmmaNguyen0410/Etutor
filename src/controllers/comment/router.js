const express = require('express')
const router = express.Router()
const commentController = require("./controller")

router.post('/add', commentController.add)

module.exports = router
