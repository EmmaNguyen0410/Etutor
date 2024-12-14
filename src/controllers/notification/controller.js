const { User, Notification, Notifications_Users, ClassRoom } = require('../../config/sequelize')
class NotificationController {
    add(req, res) {
        let { userId, content, moreDetail, type, href, classId } = req.body

        ClassRoom.findOne({
            where: { id: classId },
            include: [{ model: User, as: "Tutor" }, { model: User, as: "Students" }]
        }).then(classRoom => {
            let tutorId = classRoom.Tutor.id
            let studentId = classRoom.Students[0].id
            let notiOwnerId = 0

            if (tutorId != userId) {
                notiOwnerId = tutorId
            } else {
                notiOwnerId = studentId
            }

            Notification.create(
                { content, moreDetail, type, href, seen: false }
            ).then(newNoti => {
                if (newNoti) {
                    Notifications_Users.create({
                        userId: notiOwnerId,
                        notificationId: newNoti.id
                    }).then(notiUser => {
                        if (notiUser) res.send({ status: true, notiId: newNoti.id, notiOwnerId })
                        else res.send({ status: false, message: 'Cannot add new notification!' })
                    })
                } else {
                    res.send({ status: false, message: 'Cannot add new notification!' })
                }
            })
        })
    }

    getNotificationsByUserId(req, res) {
        let userId = req.session.user.userId

        User.findOne({
            where: { id: userId },
            include: {
                model: Notification
            },
            order: [
                [Notification,'createdAt', 'ASC'],
            ],
        }).then(user => {
            if (user) res.send({ status: true, notifications: user.Notifications })
            else res.send({ status: false, message: "Cannot get notificaitons!" })
        })
    }

    updateNotiSeenStt(req, res){
        let { notiId } = req.body

        Notification.update({
            seen: true
        }, {
            where: { id: notiId }
        }).then(updated => {
            res.send({status: true})
        })

    }


}
module.exports = new NotificationController()