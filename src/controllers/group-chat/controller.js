const { User, GroupChat, Message, Groups_Members } = require('../../config/sequelize')
class GroupChatController{
    createNewGroupChat(req, res){
        let currentUser = req.session.user
        let memberIdList = req.body.memberIdList
        let groupName = req.body.groupName

        GroupChat.create({
            name: groupName
        }).then(newGroup => {
            let newGroupId = newGroup.dataValues.id
            let groupMemberRecords = [{memberId: currentUser.userId, groupId: newGroupId}]

            memberIdList.forEach(memberId => {
                groupMemberRecords.push({
                    memberId: memberId,
                    groupId: newGroupId
                })
            })

            Groups_Members.bulkCreate(groupMemberRecords).then(records => {
                if(records){
                    res.send({status: true, records })
                }else{
                    res.send({status: false})
                }
            })
        })
    }
}
module.exports = new GroupChatController()