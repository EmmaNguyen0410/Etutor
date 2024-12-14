const { User, ClassRoom, Meeting, Message, Post, File, GroupChat, Students_ClassRooms } = require('../../config/sequelize')
const { Op } = require("sequelize");
const { Sequelize } = require('../../config/sequelize')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const qs = require('qs')

class UserController {
    createNewUser(req, res){
        let { userName, password, role, email, fullName, authorizedStaff, major } = req.body

        User.findOne({
            where: Sequelize.or(
                { name: userName },
                { email: email }
            )
        }).then(userFound => {
            if (userFound) res.send({ status: false, message: 'Username or email has already existed !' })
            else {
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        User.create({
                            name: userName,
                            fullname: fullName,
                            password: hash,
                            role,
                            email,
                            authorizedStaff,
                            major
                        }).then((userCreated) => {
                            let newUser = {
                                id: userCreated.dataValues.id,
                                username: userCreated.dataValues.name,
                                email: userCreated.dataValues.email,
                                role: userCreated.dataValues.role
                            }
                            if (userCreated) {
                                res.send({ status: true, message: "User created !", newUser })
                            } else {
                                res.send({ status: false, message: "Cannot create user!" })
                            }
                        })
                    });
                });
            }
        })
    }

    updateUser(req, res){
        let { userName, email, role, userId, authorizedStaff, major } = req.body
        
        User.update({
            name: userName,
            email,
            role,
            authorizedStaff,
            major
        }, {
            where: { id: userId }
        }).then(user => {
            if (user[0] == 1) res.send({ status: true, message: "User updated!" })
            else res.send({ status: false, message: "Update error!" })
        })
    }

    deleteUserById(req, res) {
        let { userId } = req.body

        User.destroy({
            where: { id: userId }
        }).then(deleted => {
            if (deleted) {
                res.send({ status: true, message: 'User deleted !' })
            } else {
                res.send({ status: false, message: 'Cannot delete user !' })
            }
        })
    }

    getAllUser(req, res) {
        User.findAll()
            .then(users => {
                res.send({ status: true, users })
            })
            .catch(err => {
                console.log(err)
                res.send({ status: false, message: "error" })
            });
    }

    findUserById(req, res) {
        User.findOne({
            where: { id: req.body.userId }
        }).then(user => {
            if (user) res.send({ status: true, user })
            else res.send({ status: false, message: "no user found" })
        })
    }

    findUserByName(req, res) {
        let userName = req.body.userName

        User.findOne({
            where: {
                name: userName
            }
        }).then(user => {
            if (user) {
                let userId = user.dataValues.id
                res.send({ status: true, userId })
            } else {
                res.send({ status: false })
            }
        })
    }

    findAllStaff(req, res){
        User.findAll({
            where: {
                role: 'staff'
            }
        }).then(allStaff => {
            let staffData = []
            if (allStaff) {
                allStaff.forEach(staff => {
                    let { id, name, email, authorizedStaff } = staff
                    staffData.push({ id, name, email, authorizedStaff })
                    
                })
                res.send({ status: true, staffData })
            } else {
                res.send({ status: false, message: 'No staff found!' })
            }
        })
    }

    findAllTutorAndStudent(req, res) {
        User.findAll({
            where: Sequelize.or(
                { role: 'tutor' },
                { role: 'student' }
            )
        }).then(users => {
            if (users) {
                users.map(function (user) {
                    delete user.dataValues.password
                    return user
                })
                res.send({ status: true, users })
            } else {
                res.send({ status: false, message: "No user found!" })
            }
        })
    }

    findUsersByRole(req, res) {
        let userRole = req.body.userRole

        User.findAll({
            where: {
                role: userRole
            }
        }).then(users => {
            if (users) {
                res.send({ status: true, users })
            } else {
                res.send({ status: false })
            }
        })
    }

    findStudentsWithoutClass(req, res) {
        User.findAll({
            where: {
                role: 'student',
                '$ClassRooms$': {[Op.is]: null}
            },
            include: [
                {model: ClassRoom}
            ]
        }).then(users => {
            res.send({status: true, users})

        })
    }

    findStudentWithNoTutor(req, res){
        User.findAll({
            attributes: ['id', 'name', 'fullname', 'email'],
            where: {role: 'student'},
            include: [
                {
                    model: ClassRoom
                }
            ]
        }).then(students => {
            if(students){
                let studentsNoTutor = []
                students.forEach(student => {
                    if(student.ClassRooms.length == 0) studentsNoTutor.push(student)
                })
                res.send({ status: true, studentsNoTutor })
            }else{
                res.send({ status: false, message: 'Cannot get student list' })
            }
        })
    }

    findStudentsWithNoInteractionInSevenDays(req, res){
        User.findAll({
            where: { role: "student" },
            include:[
                {
                    model: Message 
                },
                {
                    model: Post
                },
                {
                    model: ClassRoom,
                    include: [{ model: Meeting }]
                }
            ],
            order:[
                [Message, 'createdAt', 'desc'],
                [Post, 'createdAt', 'desc'],
                [ClassRoom, Meeting, 'createdAt', 'desc']
            ],
            
        }).then(data => {
            res.send(data)
        })
    }

    findMeetingsAndFilesByUserId(req, res){
        let { userId } = req.body

        User.findOne({
            where: { id: userId },
            include: [
                { model: ClassRoom, include: [{ model: Meeting }, { model: File }] }
            ],
            order:[
                [ClassRoom, Meeting, 'startTime', 'asc'],
                [ClassRoom, File, 'createdAt', 'desc']
            ]
        }).then(user => {
            if(user){
                if(user.ClassRooms.length == 0){
                    res.send({status: true, meetings: []})
                }else{
                    res.send({status: true, meetings: user.ClassRooms[0].Meetings, files: user.ClassRooms[0].Files })
                }
            }else{
                res.send({status: false, message: 'No user found!'})
            }
        })
    }

    findMessagesOfPeersByUserId(req, res){
        let userId = req.body.userId

        User.findOne({
            where: {id: userId},
            include: [
                {
                    model: GroupChat, 
                    include:[
                        {
                            model: Message, 
                            where: { UserId: { [Op.not]: userId}  }
                        }
                    ]
                }
            ],
            order: [
                [ GroupChat, Message, 'createdAt', 'desc']
            ]

        }).then(user => {
            if(user){
                let messages = []
                if(user.GroupChats.length != 0) res.send({status: true, messages: user.GroupChats[0].Messages})
                else res.send({status: true, messages })
            }else{
                res.send({status:false, message:'Cannot get messages'})
            }
        })
    }

    findMessagesByUserId(req, res){
        let userId = req.body.userId

        Message.findAll({
            where: {
                UserId: userId
            },
            order:[
                ['createdAt', 'asc']
            ]
        }).then(messages => {
            if(messages) res.send({ status: true, messages })
            else res.send({ status: false, message: 'Cannot find messages!' })
        })
    }

    findMeetingsByTutorId(req, res){
        let userId = req.session.user.userId

        User.findOne({
            where: { id: userId },
            include: [
                { model: ClassRoom, as: 'TutorClass', include: [{ model: Meeting }] }
            ],
            order:[
                [{model: ClassRoom, as: 'TutorClass'}, Meeting, 'startTime', 'asc'],
            ]
        }).then(user => {
            if(user){
                if(user.TutorClass.length == 0){
                    res.send({status: true, meetings: []})
                }else{
                    let meetings = []

                    user.TutorClass.forEach(classRoom => {
                        meetings = meetings.concat(classRoom.Meetings)
                    })
                    res.send({status: true, meetings})
                }
            }else{
                res.send({status: false, message: 'No user found!'})
            }
        })
    }

    findStudentsByTutorId(req, res){
        let userId = req.session.user.userId
        User.findOne({
            where: { id: userId },
            include: [
                {
                    model: ClassRoom,
                    as: 'TutorClass',
                    include: { model: User, as: 'Students'}
                }
            ]
        }).then(user => {
            if(user){
                let students = []
                user.TutorClass.forEach(classRoom => {
                    students = students.concat(classRoom.Students)
                })
                res.send({status: true, students})
            }else{
                res.send({status: false, message: 'Cannot find students!'})
            }
        })
    }

    getStudentsAndStaffs(req, res){
        User.findAll({
            where: Sequelize.or(
                { role: 'staff' },
                { role: 'student'}
            ),
            attributes: ['id', 'name', 'fullname', 'email', 'role']
        }).then(users => {
            if(users){
                res.send({ status: true, users })
            }else{
                res.send({status: false, message: 'Cannot find students and tutors!'})
            }
        })
    }
    
}
module.exports = new UserController()