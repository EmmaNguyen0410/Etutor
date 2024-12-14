const express = require('express')
const app = express()
const path = require('path')
const hbs = require('express-handlebars')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const http = require('http')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)
const { Client } = require('pg')
const client = new Client()
client.connect()

const authRouter = require('./controllers/auth/router')
const renderUIRouter = require('./controllers/ui-render/router')
const userRouter = require('./controllers/user/router')
const messageRouter = require('./controllers/message/router')
const groupChatRouter = require('./controllers/group-chat/router')
const classRoomRouter = require('./controllers/class/router')
const postRouter = require('./controllers/post/router')
const fileRouter = require('./controllers/file/router')
const commentRouter = require('./controllers/comment/router')
const meetingRouter = require('./controllers/meeting/router')
const notificationRouter = require('./controllers/notification/router')
const emailRouter = require('./controllers/email/router')

const assetsDirectoryPath = path.join(__dirname,'..','/assets')
const nodeModulesDirectoryPath = path.join(__dirname,'..','/node_modules')
const { Message, User, GroupChat, Groups_Members, Meeting, ClassRoom }  = require('../src/config/sequelize')

const { getChatRoomByUserId, addNewChatRoom, editChatRoomByUserId, removeChatRoomBySocketId } = require('./utils/chat-room')
/**
 * use assets folder
 */
app.use(express.static(assetsDirectoryPath))
app.use(express.static(nodeModulesDirectoryPath))
/**
 * setup for express-handlebars
 */
app.engine('hbs', hbs({
    layoutsDir: path.join(__dirname, '..', '/views/layouts/'), 
    partialsDir: path.join(__dirname, '..', '/views/partials/'),
    extname:'hbs', 
    defaultLayout: 'main'
}))

app.set('views', path.join(__dirname ,'..', 'views'));
app.set('view engine', 'hbs')

/**
 * setup for body-parser
 */
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));
/**
 * create new session each time new client connects to server and store sessionId in its cookies. 
 */
app.use(session({
    name: 'sessionId',
    // cookie: { maxAge: Date.now() + (1 * 24 * 60 * 60 * 1000) },
    cookie: { maxAge: 10 * 60 * 1000 },
    secret: 'keyboard cat',
    resave: false, //Prevent session being saved back to the session store when it is not modified during request
    saveUninitialized: false, //do not save new session which is not modified 
}))

/**
 * use authentication router
 */
app.use("/auth", authRouter)

/**
 * check login middleware
 */
app.use(function(req, res, next){
    if(req.session.user){
        next()
    }else{
        res.redirect('/auth/login')
    }
})
/**
 * create socket io connection from server side (chat)
 */
let chatNS = io.of("/chat")
chatNS.on('connection', (socket) => {
    console.log('chat socket on')


    Groups_Members.afterBulkCreate((newGroupMembers, options) => {
        let memberList = []
        let groupId = newGroupMembers[0].dataValues.groupId
        let groupName = ''

        GroupChat.findOne({
            where:{ id : groupId},
            include: [
                {
                   model: User, as: "Members"
                }
            ]
        }).then(group => {
            console.log(group)
            groupName = group.dataValues.name

            let groupMembers = group.dataValues.Members

            groupMembers.forEach(groupMember => {
                memberList.push({
                    memberId: groupMember.dataValues.id,
                    memberName: groupMember.dataValues.name,
                })
            })
    
            socket.emit('inviteToNewGroup', { memberList, groupId, groupName })
        })
    })

    socket.on('joinOnline', ({rooms}) => {
        /**
         * current user join its rooms/groups
         */
        rooms.forEach(room => {
            socket.join(room)
        })
        /**
         * add current user to online list
         */
    })
    /**
     * listen to join new group 
     */
    socket.on('joinNewGroup', ({ groupId }, cb) => {
        socket.join(groupId)
        cb()
    })
    /**
     * listen to sendMessage event
     */
    socket.on('sendMessage', ({groupId, messageText, senderId, senderName}) => {
        /**
         * send message to people joining the room
         */
        chatNS.to(groupId).emit('incomingMessage', { groupId, messageText, senderId, senderName })
    })
})

/**
 * create socket io connection from server side (notification)
 */
let notiNS = io.of("/notification")
notiNS.on('connection', function(socket) {
    Meeting.afterCreate((newMeeting, options) => {
        console.log('tao meeting')
        let meetingName = newMeeting.name
        let classId = newMeeting.classId
        let tutorConfirmed = newMeeting.tutorConfirmed

        let creatorRole = ''
        if(tutorConfirmed) creatorRole = 'tutor'
        else creatorRole = 'student'

        ClassRoom.findOne({
            where: { id: classId },
            include: [
                { model: User, as: 'Students'},
                { model: User, as: 'Tutor'}
            ]
        }).then(classRoom => {
            socket.emit('needConfirmMeeting', { 
                tutorId: classRoom.Tutor.id,
                tutorName: classRoom.Tutor.name,
                studentId: classRoom.Students[0].id,
                studentName: classRoom.Students[0].name,
                creatorRole,
                classId,
                meetingName
            })
        })
    })

    Meeting.afterBulkUpdate((updated, options) => {
        let meetingId = parseInt(updated.where.id)

        Meeting.findOne({
            where: {id : meetingId},
            include: { 
                model: ClassRoom,
                include: [{ model: User, as: 'Tutor'}, { model: User, as: 'Students' }] 
            }
        }).then(meeting => {
            let meetingName = meeting.name
            let classId = meeting.classId
            
            socket.emit('confirmedMeeting', { 
                tutorId: meeting.ClassRoom.Tutor.id,
                studentId: meeting.ClassRoom.Students[0].id,
                classId,
                meetingName
            })
        })
    })
    
    socket.on('newNotiId', ({ notiId, notiOwnerId }) => {
        console.log(notiId, notiOwnerId)
        socket.broadcast.emit('myNewNotiId', ({ notiId, notiOwnerId }))
    })
    
})
/**
 * create socket io connection from server side(call request)
 */
let callNotiNS = io.of("/callNoti")
callNotiNS.on('connection', function(socket){
    socket.on('startACall', ({ callerId, callerName, answererId, answererName }) => {
        socket.broadcast.emit('joinACall', { callerId, callerName, answererId, answererName })
    })

    socket.on('cancelCall', ({ callerId, callerName, answererId, answererName }) => {
        socket.broadcast.emit('canceledCall', { callerId, callerName, answererId, answererName })
    })

    socket.on('declineCall', ({ callerId, callerName, answererId, answererName }) => {
        socket.broadcast.emit('declinedCall', { callerId, callerName, answererId, answererName })
    })
    socket.on('acceptCall', ({ callerId, callerName, answererId, answererName }, cb) => {
        addNewChatRoom({ callerId, answererId })
        cb()
        socket.broadcast.emit('acceptedCall', { callerId, callerName, answererId, answererName })
    })

    socket.on('checkCallStatus', ({ userId }) => {
        let chatRoom = getChatRoomByUserId(userId)

        socket.emit('getMyCallStatus', { chatRoom })
    })
}) 
/**
 * create socket io connection from server side(calling connection)
 */
let callingNS = io.of("/calling")
callingNS.on('connection', function(socket){

    socket.on('joinCallRoom', ({ userId }) => {
        editChatRoomByUserId({ id: userId, socketId: socket.id})
    })

    socket.on('sendToken', ({ myUserId, token }) => {
        let { callerId, answererId } = getChatRoomByUserId(myUserId)
        let userId = 0

        if(myUserId == callerId) userId = answererId
        else userId = callerId

        let friendToken = token

        socket.broadcast.emit('friendToken', { userId, friendToken})
    })

    socket.on('stop-call', ({ userId }, cb) => {
        let { callerId, answererId } = getChatRoomByUserId(userId)
        socket.broadcast.emit('stopped-call', { callerId, answererId })
        removeChatRoomBySocketId(socket.id)
        cb()
    })

    socket.on('disconnect', ()=> {
        removeChatRoomBySocketId(socket.id)
    })

}) 
/**
 * Ui render router
 */
app.use("/", renderUIRouter)

app.use("/user", userRouter)

app.use("/class", classRoomRouter)

app.use("/post", postRouter)

app.use('/file', fileRouter)

app.use('/comment', commentRouter)

app.use("/message", messageRouter)

app.use('/group', groupChatRouter)

app.use('/meeting', meetingRouter)

app.use('/notification', notificationRouter)

app.use('/email', emailRouter)

server.listen(process.env.PORT || 3000);