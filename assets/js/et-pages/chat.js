"use strict";
/**
 * DOM Elements
 */
const $chatListBox = KTUtil.getByID('kt_chat_aside');
const $chatList = document.getElementById("et-chat-list")
const $messageBox = KTUtil.getByID('kt_chat_content');
const $messageList = document.getElementById('et-message-list')
const $messageScroll = KTUtil.find($messageBox, '.kt-scroll');
const $groupName = document.getElementById('et-group-name')
const $messageForm = document.getElementById('et-message-form')
const $messageText = document.getElementById('et-message-text')
const $messageTextJQ = $('#et-message-text')
const $searchChatBoxForm = document.getElementById('et-search-chat-box-form')
const $searchChatBoxInput = $('#et-search-chat-box-input')
const $searchList = document.getElementById('et-search-list')
const $searchName = document.getElementById('et-search-name')
const $searchResult = document.getElementById('et-search-result')
const $searchNotFound = document.getElementById('et-search-not-found')
const $replyBtn = document.getElementById('et-reply-btn')
const $chatListItems = $chatList.childNodes
const $callBtn = document.getElementById('et-call-btn')
const $studentList = document.getElementById('et-student-list')

let userGroupChats = []
let newGroup = false;

/**
 * Create socket io 
 */
let socket = io.connect("/chat")

/**
 * generate list of chatting users in the left chat list
 */
$.ajax({
    method: "GET",
    url: "/message/allChats",
})
.done(function (groups) {
    $replyBtn.disabled = true
    groups.forEach((group, index) => {

        //get answererId 
        let answererId = 0
        let { groupMembers } = group
        groupMembers.forEach(member => {
            if(member.id != localStorage.getItem('userId')) answererId = member.id
        })

        let chatItem = document.createElement('div')
        chatItem.setAttribute('group-id', group.groupId)
        chatItem.setAttribute('answerer-id', answererId)
        chatItem.className = 'et-chat-item'
        if(index == 0) chatItem.classList.add('et-top-chat-item')
        chatItem.innerHTML =  `<div class="kt-widget__item">
                                    <span class="kt-media kt-media--circle">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <rect x="0" y="0" width="24" height="24"/>
                                                <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="10"/>
                                                <path d="M12,11 C10.8954305,11 10,10.1045695 10,9 C10,7.8954305 10.8954305,7 12,7 C13.1045695,7 14,7.8954305 14,9 C14,10.1045695 13.1045695,11 12,11 Z M7.00036205,16.4995035 C7.21569918,13.5165724 9.36772908,12 11.9907452,12 C14.6506758,12 16.8360465,13.4332455 16.9988413,16.5 C17.0053266,16.6221713 16.9988413,17 16.5815,17 L7.4041679,17 C7.26484009,17 6.98863236,16.6619875 7.00036205,16.4995035 Z" fill="#000000" opacity="0.3"/>
                                            </g>
                                        </svg>
                                    </span>
                                    <div class="kt-widget__info">
                                        <div class="kt-widget__section">
                                            <a href="#" class="kt-widget__username">${group.groupName}</a>
                                            <span class="kt-badge kt-badge--success kt-badge--dot"></span>
                                        </div>
                                        <span class="kt-widget__desc" id="et-latest-message-${group.groupId}">
                                            ${group.latestMessage}
                                        </span>
                                    </div>
                                </div>`
        $chatList.appendChild(chatItem)
        chatItem.addEventListener('click', (e) => {
            renderMessageBox({ groupId: group.groupId, groupName: group.groupName, answererId })
        })

        userGroupChats.push(group.groupId)

        if(index == 0) {
            renderMessageBox({ groupId: group.groupId, groupName: group.groupName, answererId })
        }
    })
    /**
     * add user to online user list and join user in its rooms/groups
     */
    socket.emit("joinOnline", { rooms: userGroupChats })
});

/**
 * get tutees list
 */
$.ajax({
    url: '/user/findStudentsByTutorId',
    method: "GET"
}).done(data => {
    if(data.status){
        let students = data.students
        renderStudentList(students)
    }else console.log(data.message)
})

/**
 * render tutee list
 */
function renderStudentList(students){
    let btnColor = ''
    students.forEach((student, index) => {
        if(index % 4 == 0) btnColor = 'brand'
        else if(index % 4 == 1) btnColor = 'warning'
        else if(index % 4 == 2) btnColor = 'danger'
        else if(index % 4 == 3) btnColor = 'success'

        let $studentListItem = document.createElement('div')
        $studentListItem.classList.add('kt-widget4__item')
        $studentListItem.innerHTML =`<div class="kt-widget4__pic kt-widget4__pic--pic">
                                        <span class="kt-media kt-media--circle">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <rect x="0" y="0" width="24" height="24"/>
                                                    <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="10"/>
                                                    <path d="M12,11 C10.8954305,11 10,10.1045695 10,9 C10,7.8954305 10.8954305,7 12,7 C13.1045695,7 14,7.8954305 14,9 C14,10.1045695 13.1045695,11 12,11 Z M7.00036205,16.4995035 C7.21569918,13.5165724 9.36772908,12 11.9907452,12 C14.6506758,12 16.8360465,13.4332455 16.9988413,16.5 C17.0053266,16.6221713 16.9988413,17 16.5815,17 L7.4041679,17 C7.26484009,17 6.98863236,16.6619875 7.00036205,16.4995035 Z" fill="#000000" opacity="0.3"/>
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                    <div class="kt-widget4__info">
                                        <a href="#" class="kt-widget4__username">
                                            ${student.name}
                                        </a>
                                        <p class="kt-widget4__text">
                                            ${student.email}
                                        </p>
                                    </div>
                                    <a class="btn btn-sm btn-label-${btnColor} btn-bold et-student-chat-btn" >Chat</a>`
        $studentList.appendChild($studentListItem)

        let $studentChatBtn = $studentListItem.querySelector('.et-student-chat-btn')
        $studentChatBtn.addEventListener('click', () => {
            let studentName = student.name
            let studentId = student.id
            let foundGroup = false
            /**
             * search student in current chat list
             */
            for(let i = 0; i < $chatListItems.length;i++){
                let groupName = $chatListItems[i].querySelector(".kt-widget__username").innerText
                $chatListItems[i].classList.remove('et-top-chat-item')
                if(studentName == groupName){
                    foundGroup = true
                    $chatListItems[i].classList.add('et-top-chat-item')
                    clickOnFoundChatItem()
                    break
                }
            }
            /**
             * if there is no student existing, create new chat with student
             */
            if(!foundGroup){
                let partnerId = studentId
                let memberIdList = [partnerId]
                
                let sendData = {
                    groupName: null,
                    memberIdList: memberIdList
                }
        
                $.ajax({
                    url: '/group/createNewGroup',
                    method:"POST",
                    data: JSON.stringify(sendData),
                    contentType: 'application/json'
                }).then((data) => {
                    if(data.status){
                        let groupId = data.records[0].groupId
                        let groupName = studentName
                        hideSearchListShowChatList()
                        renderMessageBox({groupId, groupName, answererId: partnerId })
                    }
                })
            }

        })
        
    })
}

/**
 * disable/enable reply button
 */
$messageTextJQ.bind('input', (e) => {
    if(e.target.value == ''){
        $replyBtn.disabled = true
    }else{
        $replyBtn.disabled = false
    }
})
/**
 * generate recent messages of current right chat 
 */
function renderMessageBox({ groupId, groupName, answererId }){
    $.ajax({
		method: "POST",
		url: "/message/messages",
		data: { groupId }
	})
	.done(function ({ messages, currentUserId }) {
        /**
         * set answerer id to call icon
         */
        $callBtn.setAttribute('answerer-id', answererId)
        /**
         * set answerer name to call icon
         */
        $callBtn.setAttribute('answerer-name', groupName)
        /**
         * render group name
         */
        $groupName.innerText = groupName
        /**
         * assgin group id to the right message box
         */
        $messageBox.setAttribute('group-id', groupId)
        /**
         * render recent messages
         */
        $messageList.innerHTML = ""
        messages.forEach(message => {
        let $messageItem = document.createElement('div')
            if(message.senderId != currentUserId){
                $messageItem.innerHTML = `<div class="kt-chat__message">
                                            <div class="kt-chat__user">
                                                <a href="#" class="kt-chat__username">${message.sender}</span></a>
                                            </div>
                                            <div class="kt-chat__text kt-bg-light-success">
                                                ${message.content}
                                            </div>
                                        </div>`                
            }else{
                $messageItem.innerHTML = `<div class="kt-chat__message kt-chat__message--right">
                                            <div class="kt-chat__user">
                                                <a href="#" class="kt-chat__username">Me</span></a>
                                            </div>
                                            <div class="kt-chat__text kt-bg-light-brand">
                                                ${message.content}
                                            </div>
                                        </div>`       
            }
            $messageList.appendChild($messageItem)   
        })
        $messageScroll.scrollTop = parseInt(KTUtil.css($messageList, 'height'));
	});
}
/**
 * initialize beautiful scroll bar for chat list box (left)
 */
function initChatListBoxScrollBar(){
    /**
     * Mobile offcanvas for mobile mode
     */
    let offcanvas = new KTOffcanvas($chatListBox, {
        overlay: true,  
        baseClass: 'kt-app__aside',
        closeBy: 'kt_chat_aside_close',
        toggleBy: 'kt_chat_aside_mobile_toggle'
    }); 
    /**
     * get scroll bar element within the chat box element
     */
    let scrollBarEl = KTUtil.find($chatListBox, '.kt-scroll');
    if (!scrollBarEl) {
        return;
    }
    /**
     *  Initialize perfect scrollbar
     */
    KTUtil.scrollInit(scrollBarEl, {
        mobileNativeScroll: true,  // enable native scroll for mobile
        desktopNativeScroll: false, // disable native scroll and use custom scroll for desktop 
        resetHeightOnDestroy: true,  // reset css height on scroll feature destroyed
        handleWindowResize: true, // recalculate hight on window resize
        rememberPosition: true, // remember scroll position in cookie
        height: function() {  // calculate height
            let height;
            let portletBodyEl = KTUtil.find($chatListBox, '.kt-portlet > .kt-portlet__body');
            let widgetEl = KTUtil.find($chatListBox, '.kt-widget.kt-widget--users');
            let searchbarEl = KTUtil.find($chatListBox, '.kt-searchbar');

            if (KTUtil.isInResponsiveRange('desktop')) {
                height = KTLayout.getContentHeight();
            } else {
                height = KTUtil.getViewPort().height;
            }

            if ($chatListBox) {
                height = height - parseInt(KTUtil.css($chatListBox, 'margin-top')) - parseInt(KTUtil.css($chatListBox, 'margin-bottom'));
                height = height - parseInt(KTUtil.css($chatListBox, 'padding-top')) - parseInt(KTUtil.css($chatListBox, 'padding-bottom'));
            }

            if (widgetEl) {
                height = height - parseInt(KTUtil.css(widgetEl, 'margin-top')) - parseInt(KTUtil.css(widgetEl, 'margin-bottom'));
                height = height - parseInt(KTUtil.css(widgetEl, 'padding-top')) - parseInt(KTUtil.css(widgetEl, 'padding-bottom'));
            }

            if (portletBodyEl) {
                height = height - parseInt(KTUtil.css(portletBodyEl, 'margin-top')) - parseInt(KTUtil.css(portletBodyEl, 'margin-bottom'));
                height = height - parseInt(KTUtil.css(portletBodyEl, 'padding-top')) - parseInt(KTUtil.css(portletBodyEl, 'padding-bottom'));
            }

            if (searchbarEl) {
                height = height - parseInt(KTUtil.css(searchbarEl, 'height'));
                height = height - parseInt(KTUtil.css(searchbarEl, 'margin-top')) - parseInt(KTUtil.css(searchbarEl, 'margin-bottom'));
            }

            // remove additional space
            height = height - 5;
            
            return height;
        } 
    });
}
initChatListBoxScrollBar()

/**
 * initialize beautiful scroll bar for chat message box (right)
 */
function initMessageBoxScrollBar(){
    var messageListEl = KTUtil.find($messageBox, '.kt-scroll');

    if (!messageListEl) {
        return;
    }

    // initialize perfect scrollbar(see:  https://github.com/utatti/perfect-scrollbar)
    KTUtil.scrollInit(messageListEl, {
        windowScroll: false, // allow browser scroll when the scroll reaches the end of the side
        mobileNativeScroll: true,  // enable native scroll for mobile
        desktopNativeScroll: false, // disable native scroll and use custom scroll for desktop
        resetHeightOnDestroy: true,  // reset css height on scroll feature destroyed
        handleWindowResize: true, // recalculate hight on window resize
        rememberPosition: true, // remember scroll position in cookie
        height: function() {  // calculate height
            var height;

            // Mobile mode
            if (KTUtil.isInResponsiveRange('tablet-and-mobile')) {
                return KTUtil.hasAttr(messageListEl, 'data-mobile-height') ? parseInt(KTUtil.attr(messageListEl, 'data-mobile-height')) : 300;
            }

            // Desktop mode
            if (KTUtil.isInResponsiveRange('desktop') && KTUtil.hasAttr(messageListEl, 'data-height')) {
                return parseInt(KTUtil.attr(messageListEl, 'data-height'));
            }

            var chatEl = KTUtil.find($messageBox, '.kt-chat');
            var portletHeadEl = KTUtil.find($messageBox, '.kt-portlet > .kt-portlet__head');
            var portletBodyEl = KTUtil.find($messageBox, '.kt-portlet > .kt-portlet__body');
            var portletFootEl = KTUtil.find($messageBox, '.kt-portlet > .kt-portlet__foot');

            if (KTUtil.isInResponsiveRange('desktop')) {
                height = KTLayout.getContentHeight();
            } else {
                height = KTUtil.getViewPort().height;
            }

            if (chatEl) {
                height = height - parseInt(KTUtil.css(chatEl, 'margin-top')) - parseInt(KTUtil.css(chatEl, 'margin-bottom'));
                height = height - parseInt(KTUtil.css(chatEl, 'padding-top')) - parseInt(KTUtil.css(chatEl, 'padding-bottom'));
            }

            if (portletHeadEl) {
                height = height - parseInt(KTUtil.css(portletHeadEl, 'height'));
                height = height - parseInt(KTUtil.css(portletHeadEl, 'margin-top')) - parseInt(KTUtil.css(portletHeadEl, 'margin-bottom'));
            }

            if (portletBodyEl) {
                height = height - parseInt(KTUtil.css(portletBodyEl, 'margin-top')) - parseInt(KTUtil.css(portletBodyEl, 'margin-bottom'));
                height = height - parseInt(KTUtil.css(portletBodyEl, 'padding-top')) - parseInt(KTUtil.css(portletBodyEl, 'padding-bottom'));
            }

            if (portletFootEl) {
                height = height - parseInt(KTUtil.css(portletFootEl, 'height'));
                height = height - parseInt(KTUtil.css(portletFootEl, 'margin-top')) - parseInt(KTUtil.css(portletFootEl, 'margin-bottom'));
            }

            // remove additional space
            height = height - 5;
            return height;
        }
    });
}
initMessageBoxScrollBar()

/**
 * handle search event
 */
$searchChatBoxForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let searchName = $searchChatBoxInput.val()
    let foundGroup = false

    if(searchName != localStorage.getItem('userName')){
        /**
         * search group name in current chat list
         */
        for(let i = 0; i < $chatListItems.length;i++){
            let groupName = $chatListItems[i].querySelector(".kt-widget__username").innerText
            $chatListItems[i].classList.remove('et-top-chat-item')
            if(searchName == groupName){
                foundGroup = true
                $searchResult.style.display = 'flex'
                $searchName.innerText = groupName
                $chatListItems[i].classList.add('et-top-chat-item')
                break
            }
        }
        /**
         * if there is no group name existing, call api to search for user name
         */
        if(!foundGroup){
            $.ajax({
                url: '/user/findByName',
                method: "POST",
                data: { userName: searchName}
            }).then((data) => {
                if(data.status){
                    $searchResult.style.display = 'flex'
                    $searchName.innerText = searchName
                    $searchResult.setAttribute('partner-id', data.userId)
                    newGroup = true
                }else{
                    $searchNotFound.style.display = 'flex'
                }
            })
        }        
    }else{
        $searchNotFound.style.display = 'flex'
    }
})
/**
 * hide/open search list box
 */
$searchChatBoxInput.bind('input', (e) => {
    if(e.target.value == ''){
        hideSearchListShowChatList()
    }else{
        hideChatListShowSearchList()
    }
})
/**
 * hide search list and show chat list 
 */
function hideSearchListShowChatList(){
    newGroup = false
    $searchChatBoxInput.val('')
    $searchResult.removeAttribute('group-id')
    $searchList.style.display = 'none'
    $searchResult.style.display = 'none'
    $searchNotFound.style.display = 'none'
    $chatList.style.display = 'block'
}
/**
 * hide chat list and show search list
 */
function hideChatListShowSearchList(){
    $chatList.style.display = 'none'
    $searchList.style.display = 'block'
}

/**
 * handle click on found chat item event
 */
    
$searchResult.addEventListener('click', () => {
    if(newGroup){
        let partnerId = $searchResult.getAttribute('partner-id')
        let memberIdList = [partnerId]
        
        let sendData = {
            groupName: null,
            memberIdList: memberIdList
        }

        $.ajax({
            url: '/group/createNewGroup',
            method:"POST",
            data: JSON.stringify(sendData),
            contentType: 'application/json'
        }).then((data) => {
            if(data.status){
                let groupId = data.records[0].groupId
                let groupName = $searchName.innerText
                hideSearchListShowChatList()
                renderMessageBox({groupId, groupName, answererId: partnerId })
            }
        })
    }else{
        clickOnFoundChatItem()
    }
})
/**
 * 
 */
function clickOnFoundChatItem(){
    let $topChatItem = document.querySelector(".et-top-chat-item")
    $chatList.insertBefore($topChatItem, $chatListItems[0]);
    /**
     * render right message box
     */
    let groupId = $topChatItem.getAttribute('group-id')
    let groupName = $topChatItem.querySelector(".kt-widget__username").innerText
    let answererId = $topChatItem.getAttribute('answerer-id')

    hideSearchListShowChatList()
    renderMessageBox({groupId, groupName, answererId })
}
/**
 * handle send message event
 */
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let messageText = $messageText.value
    let groupId = $messageBox.getAttribute('group-id')

    $.ajax({
        url: 'message/addNewMessage',
        method: 'POST',
        data: { groupId, messageText, senderId: localStorage.getItem('userId') }
    }).done((stt) => {
        if(stt){
            $messageText.value = ''
            $replyBtn.disabled = true
            socket.emit('sendMessage', { groupId, messageText, senderId: localStorage.getItem('userId'), senderName: localStorage.getItem('userName')})
        }
    })

    
})

/**
 * listen to incoming message
 */
socket.on('incomingMessage', ({ groupId, messageText, senderId, senderName }) => {
    let currentUserId = localStorage.getItem('userId')
    let openedGroupId = $messageBox.getAttribute('group-id')
    /**
     * render incoming message in right message box (if it is currently open)
     */
    if(openedGroupId == groupId){
        let $messageItem = document.createElement('div')
        if(currentUserId != senderId){
            $messageItem.innerHTML = `<div class="kt-chat__message">
                                                <div class="kt-chat__user">
                                                    <a href="#" class="kt-chat__username">${senderName}</span></a>
                                                </div>
                                                <div class="kt-chat__text kt-bg-light-success">
                                                    ${messageText}
                                                </div>
                                            </div>` 
        }else{
            $messageItem.innerHTML = `<div class="kt-chat__message kt-chat__message--right">
                                                <div class="kt-chat__user">
                                                    <a href="#" class="kt-chat__username">Me</span></a>
                                                </div>
                                                <div class="kt-chat__text kt-bg-light-brand">
                                                    ${messageText}
                                                </div>
                                            </div>`
        }
        $messageList.appendChild($messageItem) 
        $messageScroll.scrollTop = parseInt(KTUtil.css($messageList, 'height'));
    }
    /**
     * render incoming message in left box
     */
    document.getElementById(`et-latest-message-${groupId}`).innerText = messageText

})

/**
 * listen to new group invitation
 */
socket.on('inviteToNewGroup', ({memberList, groupId, groupName}) => {
    let currentUserId = parseInt(localStorage.getItem('userId'))
    let isInvited = memberList.find(member => member.memberId == currentUserId)

    if(isInvited){
        socket.emit('joinNewGroup', { groupId }, function(){
            //get answererId
            let answererId = 0
            /**
             * check if chat is private or group of people
             */
            if(groupName == null){
                let partner = memberList.find(member => member.memberId != currentUserId)
                groupName = partner.memberName
                answererId = partner.memberId
            }
            let chatItem = document.createElement('div')
            chatItem.setAttribute('group-id', groupId)
            chatItem.setAttribute('answerer-id', answererId)
            chatItem.classList.add('et-top-chat-item')
            chatItem.classList.add('et-chat-item')
            chatItem.innerHTML =  `<div class="kt-widget__item">
                                        <span class="kt-media kt-media--circle">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <rect x="0" y="0" width="24" height="24"/>
                                                    <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="10"/>
                                                    <path d="M12,11 C10.8954305,11 10,10.1045695 10,9 C10,7.8954305 10.8954305,7 12,7 C13.1045695,7 14,7.8954305 14,9 C14,10.1045695 13.1045695,11 12,11 Z M7.00036205,16.4995035 C7.21569918,13.5165724 9.36772908,12 11.9907452,12 C14.6506758,12 16.8360465,13.4332455 16.9988413,16.5 C17.0053266,16.6221713 16.9988413,17 16.5815,17 L7.4041679,17 C7.26484009,17 6.98863236,16.6619875 7.00036205,16.4995035 Z" fill="#000000" opacity="0.3"/>
                                                </g>
                                            </svg>
                                        </span>
                                        <div class="kt-widget__info">
                                            <div class="kt-widget__section">
                                                <a href="#" class="kt-widget__username">${groupName}</a>
                                                <span class="kt-badge kt-badge--success kt-badge--dot"></span>
                                            </div>
                                            <span class="kt-widget__desc" id="et-latest-message-${groupId}">
                                                You have joined new chat
                                            </span>
                                        </div>
                                    </div>`
            $chatList.appendChild(chatItem)
            $chatList.insertBefore(chatItem, $chatList.childNodes[0]);
            chatItem.addEventListener('click', (e) => {
                renderMessageBox({ groupId, groupName, answererId })
            })
    
            userGroupChats.push(groupId)
        })
    }
    
})

/**
 * handle call event
 */

$callBtn.addEventListener('click', (e) => {
    let callerId = localStorage.getItem('userId')
    let callerName = localStorage.getItem('userName')
    let answererId = $callBtn.getAttribute('answerer-id')
    let answererName = $callBtn.getAttribute('answerer-name')
    call_noti_socket.emit('startACall', { callerId, callerName, answererId, answererName })
    showCallModal({ answererName })

    setTimeout(function(){
        call_noti_socket.emit('checkCallStatus', { userId: localStorage.getItem('userId')})
    }, 30000)
})

call_noti_socket.on('getMyCallStatus', ({ chatRoom }) => {
    if(chatRoom == undefined) {
        hideCallModal()
        let callerId = localStorage.getItem('userId')
        let callerName = localStorage.getItem('userName')
        let answererId = $callBtn.getAttribute('answerer-id')
        let answererName = $callBtn.getAttribute('answerer-name')
        call_noti_socket.emit('cancelCall', { callerId, callerName, answererId, answererName })
    }
})



