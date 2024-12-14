const $todayMeetingList = document.getElementById('et-today-meeting-list')
const $myStudentList = document.getElementById('et-my-student-list')
const $filterStudentBtn = document.getElementById('et-filter-student-btn')
const $generalSearch = document.getElementById('generalSearch')
const $majorSelectMenu = document.getElementById('et-major-select-menu')
const $clearFilterBtn = document.getElementById('et-clear-filter-btn')
const $studentStats = document.getElementById('et-student-stats')
const $averageMessage = document.getElementById('et-average-message')

/**
 * render average messages per week chart
 */
$.ajax({
    method:'POST',
    url: '/user/findMessagesByUserId',
    data: { userId: localStorage.getItem('userId')}
}).done(data => {
    if(data.status){
        let messages = data.messages

        let messageData = [{
            "month": "Jan",
            "messages": 0
        }, {
            "month": "Feb",
            "messages": 0
        }, {
            "month": "Mar",
            "messages": 0
        }, {
            "month": "Apr",
            "messages": 0
        }, {
            "month": "May",
            "messages": 0
        }, {
            "month": "Jun",
            "messages": 0
        }, {
            "month": "Jul",
            "messages": 0
        }, {
            "month": "Aug",
            "messages": 0
        }, {
            "month": "Sep",
            "messages": 0
        }, {
            "month": "Oct",
            "messages": 0
        }, {
            "month": "Nov",
            "messages": 0
        }, {
            "month": "Dec",
            "messages": 0
        }]
    
        messages.forEach(message => {
            let createdAtDate = moment(message.createdAt)
            let createdAtMonth = createdAtDate.month()
            messageData[createdAtMonth]["messages"] = messageData[createdAtMonth]["messages"] += 1
        })

        let todayMonth = moment().month()
        $averageMessage.innerText = messageData[todayMonth]['messages']

        createChart(messageData)
    }else{
        console.log(data.status)
    }
})
/**
 * render chart 
 */
function createChart(data){
    AmCharts.makeChart("kt_amcharts_1", {
        "rtl": KTUtil.isRTL(),
        "type": "serial",
        "theme": "light",
        "dataProvider": data,
        "gridAboveGraphs": true,
        "startDuration": 1,
        "graphs": [{
            "balloonText": "[[category]]: <b>[[value]] messages/week</b>",
            "fillAlphas": 0.8,
            "lineAlpha": 0.2,
            "type": "column",
            "valueField": "messages"
        }],
        "chartCursor": {
            "categoryBalloonEnabled": false,
            "cursorAlpha": 0,
            "zoomable": false
        },
        "categoryField": "month",
        "categoryAxis": {
            "gridPosition": "start",
            "gridAlpha": 0,
            "tickPosition": "start",
            "tickLength": 20
        }
    });    
}

/**
 * get today's meetings
 */
$.ajax({
    url: '/user/findMeetingsByTutorId',
    method: 'GET',
}).done(data => {
    if(data.status){
        //render meetings
        let meetings = data.meetings

        meetings.forEach(meeting => {
            let { name, startTime, tutorConfirmed, studentConfirmed, classId } = meeting
            //get today meeting
            let todayStr = moment().format('YYYY MM DD')
            let startTimeStr = moment(startTime).format('YYYY MM DD')

            if(todayStr == startTimeStr){
                renderTodayMeetings({ meetingName: name, startTime, tutorConfirmed, studentConfirmed, container: $todayMeetingList, classId })
            } 
        })
    }else{
        console.log(data.message)
    }
})

/**
 * render today's meeting
 */
function renderTodayMeetings({ meetingName, startTime, tutorConfirmed, studentConfirmed, container, classId }){
    let statusColor = ''
    if(tutorConfirmed && studentConfirmed) statusColor = 'kt-font-success'
    else if(studentConfirmed) statusColor = 'kt-font-danger'
    else statusColor = 'kt-font-warning'

    //format startTime 
    startTime = moment(startTime).format('LT')
    let $todayMeeting = document.createElement('div')
    $todayMeeting.classList.add("kt-timeline-v2__item")
    $todayMeeting.innerHTML =`<span class="kt-timeline-v2__item-time" style="font-size: 1rem">${startTime}</span>
                            <div class="kt-timeline-v2__item-cricle">
                                <i class="fa fa-genderless ${statusColor}"></i>
                            </div>
                            <div class="kt-timeline-v2__item-text  kt-padding-top-5">
                                <a href="/class/${classId}/meeting">${meetingName}</a>
                            </div>`
                        
    container.appendChild($todayMeeting)           
}

/**
 * get tutees list
 */
$.ajax({
    url: '/user/findStudentsByTutorId',
    method: "GET"
}).done(data => {
    if(data.status){
        let students = data.students
        $studentStats.innerText = students.length
        renderUserList($myStudentList, students)
    }else console.log(data.message)
})

/**
 * render tutee list 
 */
function renderUserList(container, userData){
    userData.forEach(user => {
        let studentClassId = user.Students_ClassRooms.classId
        let newRow = document.createElement('tr')
        newRow.setAttribute('user-id', user.id)
        newRow.classList.add('kt-datatable__row')
        newRow.style.left = '0px'
        newRow.innerHTML =      `<td class="kt-datatable__cell" data-field="Name">
                                    <span style="width: 110px;" class="et-student-name"><a href = "/class/${studentClassId}/stream">${user.name}</a></span>
                                </td>
                                <td class="kt-datatable__cell" data-field="Fullname">
                                    <span style="width: 110px;" class="et-student-fullname">${user.fullname}</span>
                                </td>
                                <td class="kt-datatable__cell" data-field="Email">
                                    <span style="width: 110px;" class="et-student-email">${user.email}</span>
                                </td>
                                <td class="kt-datatable__cell" data-field="Major">
                                    <span style="width: 110px;" class="et-student-major">${user.major}</span>
                                </td>
                            `
        container.appendChild(newRow)
    })
}
/**
 * filter student
 */
$filterStudentBtn.addEventListener('click', (e) => {
    let majorFilter = $majorSelectMenu.value
    let otherFilter = $generalSearch.value
    let studentElList = [...$myStudentList.childNodes]
    studentElList.shift()
    clearAllFilter()

    if(majorFilter != 'all' && otherFilter == ''){
        studentElList.forEach(studentEl => {
            let studentMajor = studentEl.querySelector('.et-student-major').innerText
            if(studentMajor != majorFilter) {
                studentEl.style.display='none'
            }
        })
    }else if(majorFilter == 'all' && otherFilter != ''){
        studentElList.forEach(studentEl => {
            let studentName = studentEl.querySelector('.et-student-name').innerText
            let studentFullName = studentEl.querySelector('.et-student-fullname').innerText
            let studentEmail = studentEl.querySelector('.et-student-email').innerText

            if(studentName != otherFilter && studentFullName != otherFilter && studentEmail != otherFilter) {
                studentEl.style.display='none'
            }
        })
    }else if(majorFilter != 'all' && otherFilter != ''){
        studentElList.forEach(studentEl => {
            let studentMajor = studentEl.querySelector('.et-student-major').innerText
            let studentName = studentEl.querySelector('.et-student-name').innerText
            let studentFullName = studentEl.querySelector('.et-student-fullname').innerText
            let studentEmail = studentEl.querySelector('.et-student-email').innerText

            if(studentName == otherFilter && studentMajor == majorFilter) {
                studentEl.style.display=''
            }else if(studentFullName == otherFilter && studentMajor == majorFilter){
                studentEl.style.display=''
            }else if(studentEmail == otherFilter && studentMajor == majorFilter){
                studentEl.style.display=''
            }else{
                studentEl.style.display='none'
            }
        })
    }

})
/**
 * clear all filtered data
 */
function clearAllFilter(){
    let studentElList = [...$myStudentList.childNodes]
    studentElList.shift()

    studentElList.forEach(studentEl => {
        studentEl.style.display = ''
    })
}
/**
 * clear all filtered data, seacrch, and select menu
 */
$clearFilterBtn.addEventListener('click', () => {
    clearAllFilter()
    $generalSearch.value = ''
    $majorSelectMenu.value = 'all'
})