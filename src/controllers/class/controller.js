const { User, ClassRoom } = require('../../config/sequelize')

class classRoomController {
    findClassRoomsByUserId(req, res) {
        let userId = req.body.userId
        let role = req.body.role
        if (role == 'staff') {
            User.findOne({
                where: { id: userId },
                include: [
                    {
                        model: ClassRoom,
                        as: "StaffClass"
                    }
                ]
            }).then(staff => {
                let classRooms = staff.StaffClass
                res.send(classRooms)
            })
        } else if (role == 'tutor') {
            User.findOne({
                where: { id: userId },
                include: [
                    {
                        model: ClassRoom,
                        as: "TutorClass",
                        include: [
                            {
                                model: User,
                                as: "Staff"
                            }
                        ]
                    }
                ]
            }).then(tutor => {
                let tutorName = tutor.name
                let tutorId = tutor.id
                let classRooms = tutor.TutorClass
                let classRoomData = []

                classRooms.forEach(classRoom => {
                    let classId = classRoom.id
                    let className = classRoom.name
                    let staffId = classRoom.StaffId
                    let staffName = classRoom.Staff.name

                    classRoomData.push({ classId, className, tutorId, staffId, staffName, tutorName })

                })
                res.send(classRoomData)

            })
        } else if (role == 'student') {
            User.findOne({
                where: { id: userId },
                include: [
                    {
                        model: ClassRoom,
                        include: [
                            {
                                model: User,
                                as: "Staff"
                            },
                            {
                                model: User,
                                as: "Tutor"
                            }
                        ]
                    }
                ]
            }).then(student => {
                let classRooms = student.ClassRooms
                let classRoomData = []

                classRooms.forEach(classRoom => {
                    let classId = classRoom.id
                    let className = classRoom.name
                    let tutorId = classRoom.TutorId
                    let staffId = classRoom.StaffId
                    let tutorName = classRoom.Tutor.name
                    let staffName = classRoom.Staff.name

                    classRoomData.push({ classId, className, tutorId, staffId, tutorName, staffName })
                })

                res.send(classRoomData)
            })
        }

    }

    findPeopleByClassId(req, res) {
        let { classId } = req.body
        ClassRoom.findOne({
            where: { id: classId },
            include: [
                { model: User, as: "Tutor" },
                { model: User, as: "Staff" },
                { model: User, as: "Students" }
            ]
        }).then(foundClass => {
            if (foundClass) {
                let studentList = []

                foundClass.Students.forEach(student => {
                    studentList.push({
                        id: student.id,
                        name: student.name,
                        fullname: student.fullname,
                        email: student.email
                    })
                })
                let classPeople = {
                    tutor: { id: foundClass.Tutor.id, name: foundClass.Tutor.name, email: foundClass.Tutor.email, fullname: foundClass.Tutor.fullname },
                    staff: { id: foundClass.Staff.id, name: foundClass.Staff.name, email: foundClass.Staff.email, fullname: foundClass.Staff.fullname },
                    students: studentList
                }

                res.send({ status: true, classPeople })
            } else {
                res.send({ status: false, message: "No class found!" })
            }
        })
    }

    getAllClasses(req, res) {
        ClassRoom.findAll({
            include: [{
                model: User,
                as: 'Tutor',
            },
            {
                model: User,
                as: 'Staff',
            },
            {
                model: User,
                as: 'Students'
            }]
        }).then((classes) => {
            if (classes) res.send({ status: true, classes })
            else res.send({ status: false, message: 'no class found' })
        });
    }

    createNewClass(req, res) {
        let { className, tutorId, staffId } = req.body;
        ClassRoom.findOne({
            where: {
                name: className,
                TutorId: tutorId,
                StaffId: staffId
            }
        }).then(classFound => {
            if (classFound) res.send({ status: false, message: 'Class already existed!' })
            else {
                ClassRoom.create({
                    name: className,
                    TutorId: tutorId,
                    StaffId: staffId
                }).then(classCreated => {
                    if (classCreated) {
                        res.send({ status: true, message: "class created!" })
                    }
                    else {
                        res.send({ status: false, message: "cannot create class!" })
                    }
                })
            }
        })
    }

    deleteClassById(req, res) {
        let { classId } = req.body;
        ClassRoom.destroy({
            where: { id: classId }
        }).then(deleted => {
            if (deleted) {
                res.send({ status: true, message: "class deleted!" })
            }
            else {
                res.send({ status: false, message: "cannot delete class!" })
            }
        })
    }

    addStudentsToClass(req, res) {
        const studentIds = req.body["studentIds[]"];
        const { classId } = req.body;
        User.findAll({
            where: {
                id: studentIds
            }
        }).then(students => {
            if (!students) res.send({ status: false, message: 'cannot find student' })
            ClassRoom.findOne({ where: { id: classId } })
                .then((classRoom => {
                    if (!classRoom) res.send({ status: false, message: 'cannot find classroom' })
                    classRoom.addStudents(students);
                    res.send({ status: true, message: 'success!' })
                }))
        })
    }

    updateClass(req, res) {
        let { className, tutorId, staffId, classId } = req.body;
        ClassRoom.findOne({
            where: {
                name: className,
                TutorId: tutorId,
                StaffId: staffId
            }
        }).then(classFound => {
            if (classFound) res.send({ status: false, message: 'Class already existed!' })
            else {
                ClassRoom.update({
                    name: className,
                    TutorId: tutorId,
                    StaffId: staffId
                }, {
                    where: { id: classId }
                }).then(classCreated => {
                    if (classCreated) {
                        res.send({ status: true, message: "class created!" })
                    }
                    else {
                        res.send({ status: false, message: "cannot update class!" })
                    }
                })
            }
        })
    }

    createClassAndAssignStudents(req, res) {
        let studentIds = [];
        let studentNames = [];
        let studentIdsJson = JSON.parse(req.body.studentIds)
        let studentNamesJson = JSON.parse(req.body.studentNames)
        for (var i = 0; i < studentIdsJson.length; i++) {
            studentIds.push(studentIdsJson[`${i}`])
            studentNames.push(studentNamesJson[`${i}`])
        }

        let { tutorId, staffId } = req.body;


        for (var i = 0; i < studentIds.length; i++) {
            let studentName = studentNames[i]
            let studentId = studentIds[i]

            ClassRoom.create({
                name: studentName,
                TutorId: tutorId,
                StaffId: staffId
            }).then(classCreated => {
                User.findOne({
                    where: { id: studentId }
                }).then(student => {
                    classCreated.setStudents(student)
                })
            })
        }
        res.send({ status: true })
    }

    deleteClassByTutorIdAndClassName(req, res) {
        let { className, tutorId } = req.body
        ClassRoom.destroy({
            where: { name: className, TutorId: tutorId }
        }).then(deleted => {
            if (deleted) {
                res.send({ status: true, message: "student deleted!" })
            }
            else {
                res.send({ status: false, message: "cannot delete this student!" })
            }
        })
    }
}

module.exports = new classRoomController()