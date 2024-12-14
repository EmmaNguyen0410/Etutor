/**
 * DOM Elements
 */
const $contentContainer = document.getElementById('et-content-container')

 /**
  * render all classrooms' dashboards
  */
$.ajax({
    url: 'class/findClassRoomsByUserId',
    method: "POST",
    data: {userId: localStorage.getItem('userId'),role: localStorage.getItem('role')}
}).done(classRooms => {
    let currentRow;
    classRooms.forEach((classRoom, index) => {
        let { classId, className, tutorId, staffId, staffName, tutorName } = classRoom
        let enterClassBtnStyle = pickEnterClassBtnStyle(index)
        if((index + 1) % 4 == 1){
            let newRow = document.createElement('div')
            newRow.classList.add('row')
            currentRow = newRow
            $contentContainer.appendChild(newRow)
        }
        
        /**
         * create render new portlet for current row
         */
        let newPortlet = document.createElement('div')
        newPortlet.classList.add('col-xl-3')

        newPortlet.innerHTML = `<div class="kt-portlet kt-portlet--height-fluid">
                                    <div class="kt-portlet__head kt-portlet__head--noborder">
                                        <div class="kt-portlet__head-label">
                                            <h3 class="kt-portlet__head-title">
                                            </h3>
                                        </div>
                                    </div>
                                    <div class="kt-portlet__body">
                                        <div class="kt-widget kt-widget--user-profile-2">
                                            <div class="kt-widget__head">
                                                <div class="kt-widget__media">
                                                    <img class="kt-widget__img kt-hidden-" src="../../media/users/default.jpg"
                                                        alt="image">
                                                    <img class="kt-widget__img kt-hidden" src="../../media/users/default.jpg"
                                                        alt="image">
                                                    <div
                                                        class="kt-widget__pic kt-widget__pic--success kt-font-success kt-font-boldest kt-hidden">
                                                        ChS
                                                    </div>
                                                </div>
                                                <div class="kt-widget__info">
                                                    <a href="#" class="kt-widget__titel kt-hidden-">
                                                        ${className}
                                                    </a>
                                                    <span class="kt-widget__desc">
                                                        Class code: ${classId}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="kt-widget__body">
                                                <div class="kt-widget__item">
                                                    <div class="kt-widget__contact">
                                                        <span class="kt-widget__label">Staff name:</span>
                                                        <a href="#" class="kt-widget__data">${staffName}</a>
                                                    </div>
                                                    <div class="kt-widget__contact">
                                                        <span class="kt-widget__label">Tutor name:</span>
                                                        <a href="#" class="kt-widget__data">${tutorName}</a>
                                                    </div>
                                                    <div class="kt-widget__contact">
                                                        <span class="kt-widget__label">Student number:</span>
                                                        <span class="kt-widget__data">3</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="kt-widget__footer">
                                                <button type="button" class="btn ${enterClassBtnStyle} btn-lg btn-upper et-enter-class-btn" class-id=${classId}>Enter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`

        currentRow.appendChild(newPortlet)

        /**
         * click enter class btn
         */
        let $enterClassBtn = newPortlet.querySelector(".et-enter-class-btn")
        $enterClassBtn.addEventListener('click', (e) => {
            window.location.href = `/class/${classId}/stream` 
        })
    })
    
})

/**
 * choose color for enter class button
 */
function pickEnterClassBtnStyle(index){
    let enterClassBtnStyle = ['btn-label-danger', 'btn-label-warning', 'btn-label-brand', 'btn-label-success']

    if(index % 4 == 0){
        return enterClassBtnStyle[0]
    }else if(index % 4 == 1){
        return enterClassBtnStyle[1]
    }else if(index % 4 == 2){
        return enterClassBtnStyle[2]
    }else{
        return enterClassBtnStyle[3]
    }
}
