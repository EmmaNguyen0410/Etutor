const express = require('express')
const router = express.Router()
const classRoomController = require("./controller")

router.post('/findClassRoomsByUserId', classRoomController.findClassRoomsByUserId)
      .post('/findPeopleByClassId', classRoomController.findPeopleByClassId)
      .get('/getAll', classRoomController.getAllClasses)
      .post('/add', classRoomController.createNewClass)
      .post('/delete', classRoomController.deleteClassById)
      .post('/deleteClassByTutorIdAndClassName', classRoomController.deleteClassByTutorIdAndClassName)
      .post('/addStudents', classRoomController.addStudentsToClass)
      .post('/update', classRoomController.updateClass)
      .post('/createClassAndAssignStudents', classRoomController.createClassAndAssignStudents)

module.exports = router
