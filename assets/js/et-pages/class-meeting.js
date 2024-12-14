
/**
 * DOM elements
 */
const $addNewMeetingBtn = document.getElementById('et-add-new-meeting-btn')
const $meetingDurationInput = document.getElementById('et-meeting-duration-input')
const $meetingNameInput = document.getElementById('et-meeting-name-input')
const $meetingStartTimeInput = document.getElementById('kt_datetimepicker_2')
const $modalAddNewMeeting = document.getElementById('et_modal_add_new_meeting')
const $meetingContainer = document.getElementById('et-meeting-container')
const $confirmConfirmMeeting = document.getElementById('et-confirm-confirm-meeting-btn')
const $confirmDeleteMeetingBtn = document.getElementById('et-confirm-delete-meeting-btn')

const classId = window.location.pathname.split("/")[2]

/**
 * hide add post button
 */
$addPostBtn.style.display = 'none'

/**
 * change color of navigation anchor
 */
$redirectClassStream.style.color = '#959cb6'
$redirectClassPeople.style.color = '#959cb6'
$redirectClassMeeting.style.color = '#5d78ff'

/**
 * initially render all meetings
 */
$.ajax({
    url: '/meeting/findMeetingsByClassId',
    method: 'POST',
    data: { classId }
}).done(data => {
    if(data.status){
        let meetings = data.meetings
        let currentDate = ''

        meetings.forEach(meeting => {
            //check confirm status
            let confirmedRoleList = []
            let myConfirmStt = ''
            if(meeting.tutorConfirmed) confirmedRoleList.push('tutor')
            if(meeting.studentConfirmed) confirmedRoleList.push('student')

            if(confirmedRoleList.length == 1){
                let currentUserRole = localStorage.getItem('role')
                let confirmedRole = confirmedRoleList[0]

                if(currentUserRole == confirmedRole) myConfirmStt = 'pending'
                else myConfirmStt = 'confirm'
            }else if(confirmedRoleList.length == 2){
                myConfirmStt = 'confirmed'
            }

            if(meeting.startTimeDate != currentDate){
                currentDate = meeting.startTimeDate
                renderDayHeading({dayOfWeek: meeting.startTimeDay, date: meeting.startTimeDate})
            }
            renderMeetingItem({time: meeting.startTimeTime, meetingName: meeting.name, meetingDes: meeting.duration, myConfirmStt, meetingId: meeting.id })
        })

    }else{
        console.log(data.message)
    }
})

/**
 * Add new meeting
 */
$addNewMeetingBtn.addEventListener('click', (e) => {
    e.preventDefault()
    let meetingName = $meetingNameInput.value
    let meetingDuration = $meetingDurationInput.value
    let meetingStartTime = $meetingStartTimeInput.value
    
    $.ajax({
        url: '/meeting/add',
        method: "POST",
        data: { classId, meetingName, meetingDuration, meetingStartTime }
    }).done(data => {
        if(data.status){
            $.ajax({
                url: '/notification/add',
                method: 'POST',
                data: { 
                    userId: localStorage.getItem('userId'), 
                    classId,
                    content: `${localStorage.getItem('userName')} has just created a new meeting: ${meetingName}`, 
                    moreDetail: "Let's confirm!", 
                    type: "confirm_meeting", 
                    href: `/class/${classId}/meeting`
                }
            }).then(data => {
                if(data.status) {
                    let { notiId, notiOwnerId } = data
                    noti_socket.emit('newNotiId', { notiId, notiOwnerId })
                    location.reload()
                }
                else console.log(data.message)
            })    
        }else{
            console.log(data.message)
        }
    })
    
})

/**
 * hide et_modal_add_new_meeting
 */
function hideAndClearMeetingModal(){
    $meetingNameInput.value = ''
    $meetingDurationInput.value = ''
    $meetingStartTimeInput.value = ''
    $modalAddNewMeeting.style.display = 'none'
    if (document.querySelector('.modal-backdrop')) document.body.removeChild(document.querySelector('.modal-backdrop'))
}

/**
 * render day heading
 */
function renderDayHeading({dayOfWeek, date}){
    let $dayHeading = document.createElement('tr')
    $dayHeading.classList.add('fc-list-heading')
    $dayHeading.innerHTML = `<td class="fc-widget-header" colspan="3">
                                <a class="fc-list-heading-main" data-goto="{&quot;date&quot;:&quot;2020-03-29&quot;,&quot;type&quot;:&quot;day&quot;}">${dayOfWeek}</a>
                                <a class="fc-list-heading-alt" data-goto="{&quot;date&quot;:&quot;2020-03-29&quot;,&quot;type&quot;:&quot;day&quot;}">${date}</a>
                            </td>`
    $meetingContainer.appendChild($dayHeading)
}

/**
 * render meeting item
 */
function renderMeetingItem({time, meetingName, meetingDes, myConfirmStt, meetingId }){

    //render status col based on current user confirm stt
    let $statusEl = ''
    if(myConfirmStt == 'pending'){
        $statusEl = `<span class="btn btn-label-warning">Pending</span>`
    }else if(myConfirmStt == 'confirm'){
        $statusEl = `<button class="btn btn-label-danger" id="et-confirm-meeting-btn-${meetingId}" data-toggle="modal" data-target="#et_modal_confirm_confirm_meeting">Confirm</button>`
    }else if(myConfirmStt == 'confirmed'){
        $statusEl =`<span class="btn btn-label-success">Confirmed</span>`
    }

    let meetingItem = document.createElement('tr')
    meetingItem.classList.add('fc-list-item')
    meetingItem.classList.add('fc-event-brand')
    meetingItem.innerHTML = `<td class="fc-list-item-time fc-widget-content">${time}</td>
                            <td class="fc-list-item-marker fc-widget-content">
                                ${$statusEl}
                            </td>
                            <td class="fc-list-item-title fc-widget-content">
                                <div class="et-meeting-title" id="et-delete-meeting-icon-${meetingId}" data-toggle="modal" data-target="#et_modal_confirm_delete_meeting">
                                    <span>${meetingName}</span>
                                    <span class="et-delete-meeting-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <rect x="0" y="0" width="24" height="24"></rect>
                                                <path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"></path>
                                                <path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"></path>
                                            </g>
                                        </svg>
                                    </span>
                                </div>
                                <div class="fc-description">Duration: ${meetingDes} hours
                                </div>
                            </td>`
    $meetingContainer.appendChild(meetingItem)

    //handle clicking confirm meeting button
    let $confirmMeetingBtn = document.getElementById(`et-confirm-meeting-btn-${meetingId}`)
    if($confirmMeetingBtn) {
        $confirmMeetingBtn.addEventListener('click', () => {
            $confirmConfirmMeeting.setAttribute('meeting-id', meetingId)
            $confirmConfirmMeeting.setAttribute('meeting-name', meetingName)
        })
    }

    //handle clicking delete meeting icon
    let $deleteMeetingIcon = document.getElementById(`et-delete-meeting-icon-${meetingId}`)
    $deleteMeetingIcon.addEventListener('click', () => {
        $confirmDeleteMeetingBtn.setAttribute('meeting-id', meetingId)
    })
}

/**
 * confirm meeting after confirmation 
 */
$confirmConfirmMeeting.addEventListener('click', () => {
    let meetingId = $confirmConfirmMeeting.getAttribute('meeting-id')
    let meetingName = $confirmConfirmMeeting.getAttribute('meeting-name')
    $.ajax({
        url:'/meeting/confirm',
        method: "POST",
        data: { meetingId }
    }).then(data => {
        if(data.status){
            $.ajax({
                url: '/notification/add',
                method: 'POST',
                data: { 
                    userId: localStorage.getItem('userId'), 
                    classId,
                    content: `${meetingName} has just been confirmed`, 
                    moreDetail: `Click to see detail!`, 
                    type: "confirmed_meeting", 
                    href: `/class/${classId}/meeting`
                }
            }).then(data => {
                if(data.status) {
                    let { notiId, notiOwnerId } = data
                    noti_socket.emit('newNotiId', { notiId, notiOwnerId })
                    location.reload()
                }
                else console.log(data.message)
            })    
        }else{
            console.log(data.message)
        }
    })
})

/**
 * delete meeting after confirmation
 */
$confirmDeleteMeetingBtn.addEventListener('click', ()=>{
    let meetingId = $confirmDeleteMeetingBtn.getAttribute('meeting-id')
    
    $.ajax({
        url:'/meeting/delete',
        method: "POST",
        data: { meetingId }
    }).then(data => {
        if(data.status){
            location.reload()
        }else{
            console.log(data.message)
        }
    })
})


