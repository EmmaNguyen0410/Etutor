const express = require('express')
const router = express.Router()
const postController = require("./controller")

router.post('/add', postController.createNewPost)
      .post('/getPostsByClassId', postController.getPostsByClassId)

module.exports = router