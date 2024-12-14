let chatRooms = []

function getChatRoomByUserId(id) {
    return chatRooms.find(chatRoom => chatRoom.callerId == id || chatRoom.answererId == id)
}

function addNewChatRoom({ callerId, answererId }) {
    chatRooms.push({ callerId, answererId })
}
function editChatRoomByUserId({ id, socketId }) {
    const index = chatRooms.findIndex((chatRoom) => chatRoom.callerId == id || chatRoom.answererId == id)

    if (index != -1) {
        let chatRoom = chatRooms[index]
        if (chatRoom.callerId == id) {
            chatRooms[index].callerSocketId = socketId
        } else {
            chatRooms[index].answererSocketId = socketId
        }
    }
}
function removeChatRoomBySocketId(id) {
    const index = chatRooms.findIndex((chatRoom) => chatRoom.callerSocketId == id || chatRoom.answererSocketId == id)

    if (index != -1) chatRooms.splice(index, 1)

}
module.exports = {
    getChatRoomByUserId,
    addNewChatRoom,
    editChatRoomByUserId,
    removeChatRoomBySocketId
}