const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const userModel = require('../models/User')
const classModel = require('../models/ClassRoom')
const meetingModel = require('../models/Meeting')
const fileModel = require('../models/File')
const postModel = require('../models/Post')
const commentModel = require('../models/Comment')
const groupChatModel = require('../models/GroupChat')
const messageModel = require('../models/Message')
const groupsMembersModel = require('../models/Groups_Members')
const studentsClassRoomsModel = require('../models/Students_ClassRooms')
const notificationModel = require('../models/Notification')
const notificationsUsersModel = require('../models/Notifications_Users')
dotenv.config();
/**
 * database connection
 */

const sequelize = new Sequelize(process.env['DB_NAME'], process.env['DB_USERNAME'], process.env['DB_PASSWORD'], {
    host: process.env['DB_HOST'],
    port: 5432,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  }
);

const User = userModel(sequelize, Sequelize)
const ClassRoom = classModel(sequelize, Sequelize)
const Meeting = meetingModel(sequelize, Sequelize)
const File = fileModel(sequelize, Sequelize)
const Post = postModel(sequelize, Sequelize)
const Comment = commentModel(sequelize, Sequelize)
const GroupChat = groupChatModel(sequelize, Sequelize)
const Message = messageModel(sequelize, Sequelize)
const Groups_Members = groupsMembersModel(sequelize, Sequelize)
const Students_ClassRooms = studentsClassRoomsModel(sequelize, Sequelize)
const Notification = notificationModel(sequelize, Sequelize)
const Notifications_Users = notificationsUsersModel(sequelize, Sequelize)

//ClassRoom have exactly 1 staff and 1 tutor and one staff/tutor can have many classrooms
ClassRoom.belongsTo(User, { as: 'Tutor', foreignKey: 'TutorId' })
User.hasMany(ClassRoom, {as: 'TutorClass', foreignKey: 'TutorId'})
ClassRoom.belongsTo(User, { as: 'Staff', foreignKey: 'StaffId' })
User.hasMany(ClassRoom, {as: 'StaffClass', foreignKey: 'StaffId'})

//Many-to-Many association StudentClassRoom
ClassRoom.belongsToMany(User, { as: 'Students', through: Students_ClassRooms, foreignKey: 'classId' })
User.belongsToMany(ClassRoom, { through: Students_ClassRooms, foreignKey: 'studentId' })

//Each meeting is for 1 class
Meeting.belongsTo(ClassRoom, { foreignKey: 'classId' })
ClassRoom.hasMany(Meeting, { foreignKey: 'classId' })

//file registered by an user and belongs to specific class and post
File.belongsTo(ClassRoom)
ClassRoom.hasMany(File)
File.belongsTo(User)
User.hasMany(File)
File.belongsTo(Post)
Post.hasMany(File)

//Post is posted by specific user and belongs to specific class
Post.belongsTo(ClassRoom)
ClassRoom.hasMany(Post)
Post.belongsTo(User)
User.hasMany(Post)

//Comment belongs to a post and written by an user
Comment.belongsTo(User)
Comment.belongsTo(Post)
Post.hasMany(Comment)

//Message belongs to a group and sended by an user
Message.belongsTo(User)
User.hasMany(Message)
Message.belongsTo(GroupChat)
GroupChat.hasMany(Message)


//Many-toMany association GroupsMembers
GroupChat.belongsToMany(User, { as: 'Members', through: Groups_Members, foreignKey: 'groupId' })
User.belongsToMany(GroupChat, {through: Groups_Members, foreignKey: 'memberId' })

//Many-to-Many association between Notification and User
User.belongsToMany(Notification, {through: Notifications_Users, foreignKey: 'userId'})
Notification.belongsToMany(User, {through: Notifications_Users, foreignKey: 'notificationId'})
/**
 * sync database
 */
sequelize.sync({ force: true })
.then(() => {
  console.log('Database & table created')
  User.create({
    name: 'admin',
    fullname: 'Admin Nguyen',
    password: '$2b$10$LfiaPWdgq7ic.VCea8T3oeWQ8Q/wI1P6G6d46p28reMI6wsXSxS5G',
    role: 'admin',
    email: 'admin@gmail.com',
  }).then((userCreated) => {
    console.log(userCreated)
  })

  User.create({
    name: 'staff',
    fullname: 'Staff Nguyen',
    password: '$2b$10$LfiaPWdgq7ic.VCea8T3oeWQ8Q/wI1P6G6d46p28reMI6wsXSxS5G',
    role: 'staff',
    email: 'staff@gmail.com',
  }).then((userCreated) => {
    console.log(userCreated)
  })

  User.create({
    name: 'staffA',
    fullname: 'StaffA Nguyen',
    password: '$2b$10$LfiaPWdgq7ic.VCea8T3oeWQ8Q/wI1P6G6d46p28reMI6wsXSxS5G',
    role: 'staff',
    email: 'staffA@gmail.com',
    authorizedStaff: true
  }).then((userCreated) => {
    console.log(userCreated)
  })

  User.create({
    name: 'tutor',
    fullname: 'Tutor Nguyen',
    password: '$2b$10$LfiaPWdgq7ic.VCea8T3oeWQ8Q/wI1P6G6d46p28reMI6wsXSxS5G',
    role: 'tutor',
    email: 'tutor@gmail.com',
  }).then((userCreated) => {
    console.log(userCreated)
  })

  User.create({
    name: 'student',
    fullname: 'Student Nguyen',
    password: '$2b$10$LfiaPWdgq7ic.VCea8T3oeWQ8Q/wI1P6G6d46p28reMI6wsXSxS5G',
    role: 'student',
    email: 'student@gmail.com',
  }).then((userCreated) => {
    console.log(userCreated)
  })
})


module.exports = {
  User,
  Message,
  GroupChat,
  Groups_Members,
  ClassRoom,
  Meeting,
  File,
  Post,
  Comment,
  Students_ClassRooms,
  Notification,
  Notifications_Users,
  Sequelize,
  sequelize
}