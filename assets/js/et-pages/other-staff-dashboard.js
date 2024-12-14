const $studentNoTutorList = document.getElementById('et-student-no-tutor-list')
const $studentNoInteractionSevenList = document.getElementById('et-student-no-interaction-7-list')
const $studentNoInteractionTwentyEightList = document.getElementById('et-student-no-interaction-28-list')
const $noTutorStats = document.getElementById('et-no-tutor-stats')
const $pairStats = document.getElementById('et-pair-stats')
const userId = window.location.pathname.split("/")[2]
const $topFiveTutorMessageList = document.getElementById('et-top-five-tutor-message-list')


$.ajax({
    url: '/class/findClassRoomsByUserId',
    method: "POST",
    data: { userId, role: 'staff'}
}).done(classRooms => {
    $pairStats.innerText = classRooms.length
})

/**
 * table of students with no interaction for 7 days and 28 days
 */
$.ajax({
    url:'/user/findStudentsWithNoInteractionInSevenDays',
    method:'GET',
}).done(students => {
    renderStudentsNoInteraction({ days: 7, students, container: $studentNoInteractionSevenList })
    renderStudentsNoInteraction({ days: 28, students, container: $studentNoInteractionTwentyEightList })
})

/**
 * table of student without no tutor
 */
$.ajax({
    url:'/user/findStudentWithNoTutor',
    method:'GET',
}).done(data => {
    if(data.status) {
        $noTutorStats.innerText = data.studentsNoTutor.length
        renderUserList($studentNoTutorList, data.studentsNoTutor)
    }else{
        console.log(data.message)
    }
})

/**
 * get top five tutors have many messages
 */
$.ajax({
    url: '/message/getTopFiveTutorsManyMessages',
    method: "GET"
}).done(data => {
    if(data.status){
        renderUserList($topFiveTutorMessageList, data.tutors)
    }else{
        console.log(data.message)
    }
})
/**
 * render user list function
 */
function renderUserList(container, userData){
    userData.forEach(user => {
        let newRow = document.createElement('tr')
        newRow.setAttribute('user-id', user.id)
        newRow.classList.add('kt-datatable__row')
        newRow.style.left = '0px'
        newRow.innerHTML =      `<td class="kt-datatable__cell" data-field="Name">
                                    <span style="width: 110px;">${user.name}</span>
                                </td>
                                <td class="kt-datatable__cell" data-field="Fullname">
                                    <span style="width: 110px;">${user.fullname}</span>
                                </td>
                                <td class="kt-datatable__cell" data-field="Email">
                                    <span style="width: 110px;">${user.email}</span>
                                </td>
                            `
        container.appendChild(newRow)
    })
}

/**
 * render no interaction student list
 */
function renderStudentsNoInteraction({ days, students, container }){
    let studentNumber = students.length
    let studentsNoInteraction = []

    let now = moment();

    students.forEach(student => {
        let noMessage = false
        let noPost = false
        let noMeeting = false

        let messages = student.Messages
        let posts = student.Posts
        let meetings = []
        let classRoom = student.ClassRooms[0]

        if(classRoom) meetings = classRoom.Meetings

        if(messages.length == 0) noMessage = true
        else{
            let latestMessageTime = messages[0].createdAt
            if(now.diff(latestMessageTime, 'days') > days) noMessage = true
        }

        if(posts.length == 0) noPost = true
        else {
            let latestPostTime = posts[0].createdAt
            if(now.diff(latestPostTime, 'days') > days) noPost = true
        }

      
        if(meetings.length == 0) noMeeting = true
        else {
            let latestMeetingTime = meetings[0].createdAt
            if(now.diff(latestMeetingTime, 'days') > days) noMeeting = true
        }

        if(noMessage && noMeeting && noPost) studentsNoInteraction.push(student)
    })

    renderUserList(container, studentsNoInteraction)
    renderStudentInteractionChart({ studentNumber, studentsNoInteractionNumber: studentsNoInteraction.length, days })
}

/**
 * render student interaction chart
 */
function renderStudentInteractionChart({ studentNumber, studentsNoInteractionNumber, days }){
    let studentsHaveInteractionNumber = studentNumber - studentsNoInteractionNumber
    let studentsHaveInteractionPercent = Math.round(studentsHaveInteractionNumber/studentNumber * 100)
    let studentsNoInteractionPercent = Math.round(studentsNoInteractionNumber/studentNumber * 100)

    createPieChart({ studentsHaveInteractionPercent, studentsNoInteractionPercent, days })
}
/**
 * create pie chart
 */
function createPieChart({ studentsHaveInteractionPercent, studentsNoInteractionPercent, days }){
    var data = [
        {label: `no interaction`, data: studentsNoInteractionPercent, color:  KTApp.getStateColor("brand")},
        {label: `have interaction`, data: studentsHaveInteractionPercent, color:  KTApp.getStateColor("danger")},
    ];
    $.plot($(`#et-student-interaction-chart-${days}`), data, {
        series: {
            pie: {
                show: true
            }
        }
    });
}