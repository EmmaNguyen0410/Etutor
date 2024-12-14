
const $staffStudentList = document.getElementById('et-staff-student-list')
const $roleSelectMenu = document.getElementById('et-role-select-menu')
const $generalSearch = document.getElementById('generalSearch')
const $clearFilterBtn = document.getElementById('et-clear-filter-btn')
const $filterUserBtn = document.getElementById('et-filter-user-btn')
/**
 * get staff and tutee list
 */
$.ajax({
    url: '/user/getStudentsAndStaffs',
    method: "GET"
}).done(data => {
    if(data.status){
        renderUserList($staffStudentList, data.users)
    }else{
        console.log(data.message)
    }
})

/**
 * render staff and tutee list 
 */
function renderUserList(container, userData){
    userData.forEach(user => {
        let newRow = document.createElement('tr')

        newRow.classList.add('kt-datatable__row')
        newRow.style.left = '0px'
        newRow.innerHTML =      `<td class="kt-datatable__cell" data-field="Name">
                                    <span style="width: 110px;" class="et-user-name">${user.name}</span>
                                </td>
                                <td class="kt-datatable__cell" data-field="Fullname">
                                    <span style="width: 110px;" class="et-user-fullname">${user.fullname}</span>
                                </td>
                                <td class="kt-datatable__cell" data-field="Email">
                                    <span style="width: 110px;" class="et-user-email">${user.email}</span>
                                </td>
                                <td class="kt-datatable__cell" data-field="Role">
                                    <span style="width: 110px;" class="et-user-role">${user.role}</span>
                                </td>
                                <td class="kt-datatable__cell" data-field="Action">
                                    <a type="button" class="btn btn-label-brand" href="/dashboard/${user.id}">Show Dashboard</a>
                                </td>
                            `
        container.appendChild(newRow)
    })
}
/**
 * filter tutee and staff
 */
$filterUserBtn.addEventListener('click', (e) => {
    let roleFilter = $roleSelectMenu.value
    let otherFilter = $generalSearch.value
    let userElList = [...$staffStudentList.childNodes]
    userElList.shift()
    clearAllFilter()

    if(roleFilter != 'all' && otherFilter == ''){
        userElList.forEach(userEl => {
            let role = userEl.querySelector('.et-user-role').innerText
            if(role != roleFilter) {
                userEl.style.display='none'
            }
        })
    }else if(roleFilter == 'all' && otherFilter != ''){
        userElList.forEach(userEl => {
            let userName = userEl.querySelector('.et-user-name').innerText
            let userFullName = userEl.querySelector('.et-user-fullname').innerText
            let userEmail = userEl.querySelector('.et-user-email').innerText

            if(userName != otherFilter && userFullName != otherFilter && userEmail != otherFilter) {
                userEl.style.display='none'
            }
        })
    }else if(roleFilter != 'all' && otherFilter != ''){
        userElList.forEach(userEl => {
            let userRole = userEl.querySelector('.et-user-role').innerText
            let userName = userEl.querySelector('.et-user-name').innerText
            let userFullName = userEl.querySelector('.et-user-fullname').innerText
            let userEmail = userEl.querySelector('.et-user-email').innerText

            if(userName == otherFilter && userRole == roleFilter) {
                userEl.style.display=''
            }else if(userFullName == otherFilter && userRole == roleFilter){
                userEl.style.display=''
            }else if(userEmail == otherFilter && userRole == roleFilter){
                userEl.style.display=''
            }else{
                userEl.style.display='none'
            }
        })
    }

})
/**
 * clear all filtered data
 */
function clearAllFilter(){
    let userElList = [...$staffStudentList.childNodes]
    userElList.shift()

    userElList.forEach(userEl => {
        userEl.style.display = ''
    })
}
/**
 * clear all filtered data, seacrch, and select menu
 */
$clearFilterBtn.addEventListener('click', () => {
    clearAllFilter()
    $generalSearch.value = ''
    $roleSelectMenu.value = 'all'
})