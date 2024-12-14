const { Meeting } = require('../../config/sequelize')
const moment = require('moment')

class MeetingController {
    add(req, res){
        let { meetingName, meetingDuration, meetingStartTime, classId } = req.body
        let role = req.session.user.role
        let tutorConfirmed = false;
        let studentConfirmed = false;

        if(role == 'tutor') tutorConfirmed = true
        else if(role == 'student') studentConfirmed = true  
        else res.send({status: false, message: "Current user's role undefined! Cannot create meeting"})      

        Meeting.create({
            name: meetingName,
            duration: meetingDuration,
            startTime: meetingStartTime,
            tutorConfirmed,
            studentConfirmed,
            classId
        }).then(meeting => {
            if(meeting){
                res.send({status: true, meeting})
            }else{
                res.send({status: false, message: "Add meeting failed!"})
            }
        })
    }

    findMeetingsByClassId(req, res){
        let { classId } = req.body
        Meeting.findAll({
            where: { classId },
            order: [
                ['startTime', 'ASC'],
            ],
        }).then(meetings => {
            if(meetings){
                meetings.map(function(meeting){
                    let startTime = meeting.startTime
                    meeting.dataValues.startTimeDay = moment(startTime).format('dddd')
                    meeting.dataValues.startTimeDate = moment(startTime).format('MMMM Do YYYY')
                    meeting.dataValues.startTimeTime = moment(startTime).format('hh:mm a')
                    return meeting
                })
                res.send({ status: true, meetings })                
            }else{
                res.send({status: false, message: 'There is no meeting!'})
            }
        })
    }

    confirm(req, res){
        let { meetingId } = req.body

        Meeting.update({
            tutorConfirmed: true,
            studentConfirmed: true
        }, {
            where: {id: meetingId}
        }).then(updated => {
            if(updated[0]){
                res.send({status: true})
            }else{
                res.send({status: false, message: 'Cannot confirm this meeting now!'})
            }
        })
    }

    delete(req, res){
        let { meetingId } = req.body

        Meeting.destroy({
            where: { id: meetingId }
        }).then(deleted => {
            if(deleted) res.send({status: true})
            else res.send({status: false, message: 'Cannot delete this meeting!'})
        })
    }
}
module.exports = new MeetingController ()
