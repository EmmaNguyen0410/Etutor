/**
 * DOM elements
 */
const $editStaffForm = document.getElementById('kt_modal_4')
const $editUserNameInput = document.getElementById('et-edit-username-input')
const $editEmailInput = document.getElementById('et-edit-email-input')
const $updateStaffConfirmBtn = document.getElementById('et-update-staff-confirm-btn')
const $addNewStaffForm = document.getElementById('et_modal_create')
const $addNewStaffBtn = document.getElementById('et-add-new-staff-btn')
const $addNewStaffConfirmBtn = document.getElementById('et-add-staff-confirm-btn')
const $addUserNameInput = document.getElementById('et-add-username-input')
const $addEmailInput = document.getElementById('et-add-email-input')
const $addFullNameInput = document.getElementById('et-add-fullname-input')
const $addPasswordInput = document.getElementById('et-add-password-input')
const $deleteStaffBtn = document.getElementById('et-delete-staff-btn')
const $modalConfirmDelete = document.getElementById('et_modal_confirm_delete')
const $modalConfirmUpdate = document.getElementById('et_modal_confirm_update')
const $modalConfirmAdd = document.getElementById('et_modal_confirm_add')
const $searchInput = document.getElementById('generalSearch')
const $authorizedStaffCb = document.getElementById('et-authorized-staff')
const $editAuthorizedStaffCb = document.getElementById('et-edit-authorized-staff')
let $staffListTable = document.getElementById('et-staff-list-table')
/**
 * render staff data
 */
$.ajax({
    url: '/user/findAllStaff',
    method: 'GET'
}).done((data) => {
    if(data.status){
        let staffData = data.staffData

        staffData.forEach((staff, index) => {
            let authorized = ''
            if(staff.authorizedStaff){
                authorized = "Yes"
            }else{
                authorized = "No"
            }

            let newRow = document.createElement('tr')
            newRow.setAttribute("data-row", index)
            newRow.setAttribute('user-id', staff.id)
            newRow.classList.add('kt-datatable__row')
            newRow.style.left = '0px'
            newRow.innerHTML =      `<td class="kt-datatable__cell" data-field="User Id">
                                        <span style="width: 110px;">${staff.id}</span>
                                    </td>
                                    <td class="kt-datatable__cell" data-field="Name">
                                        <span style="width: 110px;" class="et-username">${staff.name}</span>
                                    </td>
                                    <td class="kt-datatable__cell" data-field="Email">
                                        <span style="width: 110px;" class="et-email">${staff.email}</span>
                                    </td>
                                    <td class="kt-datatable__cell" data-field="Role">
                                        <span style="width: 110px;">Staff</span>
                                    </td>
                                    <td class="kt-datatable__cell" data-field="Authorized">
                                        <span style="width: 110px;" class="et-authorized">${authorized}</span>
                                    </td>
                                    <td class="kt-datatable__cell" data-field="Actions" data-autohide-disabled="false">
                                        <span style="overflow: visible; position: relative; width: 110px;">										
                                            <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" id="et-edit-staff-icon-${staff.id}" title="Edit details" data-toggle="modal" data-target="#kt_modal_4">					
                                                <i class="la la-edit"></i>						
                                            </a>					
                                            <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Delete" id="et-delete-staff-icon-${staff.id}" data-toggle="modal" data-target="#et_modal_confirm_delete">							
                                                <i class="la la-trash"></i>						
                                            </a>					
                                        </span>
                                    </td>
                                `
            $staffListTable.appendChild(newRow)
            
            let $editIcon = document.getElementById(`et-edit-staff-icon-${staff.id}`)
            let $deleteIcon = document.getElementById(`et-delete-staff-icon-${staff.id}`)

            $editIcon.addEventListener('click',(e) => {
                $updateStaffConfirmBtn.setAttribute('staff-id', staff.id)

                $editUserNameInput.value = staff.name
                $editEmailInput.value = staff.email
            })
            $deleteIcon.addEventListener('click', () => {
                $deleteStaffBtn.setAttribute('staff-id', staff.id)
            })
        })
    }
    else console.log(data.message)
})
/**
 * update user AFTER CONFIRMATION from user
 */
$updateStaffConfirmBtn.addEventListener('click', (e) => {
    let staffId = $updateStaffConfirmBtn.getAttribute('staff-id')
    let authorizedStaff = false
    if($editAuthorizedStaffCb.checked) authorizedStaff = true

    $.ajax({
        url: '/user/update',
        method: "POST",
        data: {userName: $editUserNameInput.value, email: $editEmailInput.value, role: 'staff', userId: staffId, authorizedStaff }
    }).then(data => {
        if(data.status){
            //hide kt_modal_4(modal for edit) and et_modal_confirm_update
            $editStaffForm.style.display = "none"
            $modalConfirmUpdate.style.display = "none"
            document.body.removeChild(document.querySelector('.modal-backdrop'))
            document.body.removeChild(document.querySelector('.modal-backdrop'))
            //update user in current table
            updateStaffInTable({userName: $editUserNameInput.value, email: $editEmailInput.value, staffId, authorizedStaff})
        }else{
            console.log(data.message)
        }
    })
})
/**
 * add user AFTER CONFIRMATION from user
 */
$addNewStaffConfirmBtn.addEventListener('click', (e) => {
    let staffUserName = $addUserNameInput.value
    let staffFullName = $addFullNameInput.value
    let staffEmail = $addEmailInput.value
    let staffPassword = $addPasswordInput.value
    let authorizedStaff = false

    if($authorizedStaffCb.checked) authorizedStaff = true

    $.ajax({
        url: '/user/add',
        method: "POST",
        data: {userName: staffUserName, password: staffPassword, role: 'staff', email:staffEmail, fullName: staffFullName, authorizedStaff }
    }).done((data) => {
        if(data.status){
            let {id, username, email, role} = data.newUser
            //hide et_modal_create and et_modal_confirm_add
            $modalConfirmAdd.style.display = "none"
            $addNewStaffForm.style.display = "none"
            document.body.removeChild(document.querySelector('.modal-backdrop'))
            document.body.removeChild(document.querySelector('.modal-backdrop'))
            //add new staff in current table
            addStaffInTable({ id, username, email, role, authorizedStaff })
            //clear inputs in et_modal_create
            clearAddInputs()
        }else{
            console.log(data.message)
        }
    })
})
/**
 * delete user AFTER CONFIRMATION from user
 */
$deleteStaffBtn.addEventListener('click', () => {
    let staffId = $deleteStaffBtn.getAttribute('staff-id')
    $.ajax({
        url: '/user/delete',
        method: "POST",
        data: {userId: staffId}
    }).done(data => {
        if(data.status){
            //hide et_modal_confirm_delete
            $modalConfirmDelete.style.display = "none"
            document.body.removeChild(document.querySelector('.modal-backdrop'))
            //remove deleted staff from table
            removeStaffFromTable(staffId)
        }else{
            console.log(data.message)
        }
    })
})


/**
 * remove deleted staff from table
 */
function removeStaffFromTable(staffId){
    let staffListRows = $staffListTable.childNodes
    let staffListLength = staffListRows.length
    for(let i = 1; i < staffListLength; i++){
        let row = staffListRows[i]
        if(row.getAttribute('user-id') == staffId){
            $staffListTable.removeChild(row)
            break
        }
    }
}
/**
 * update staff in table after updating
 */
function updateStaffInTable({userName, email, staffId, authorizedStaff}){
    let authorized = ''
    let staffListRows = $staffListTable.childNodes
    let staffListLength = staffListRows.length

    if(authorizedStaff) authorized = "Yes"
    else authorized = "No"

    for(let i = 1; i < staffListLength; i++){
        let row = staffListRows[i]
        if(row.getAttribute('user-id') == staffId){
            let userNameEl = row.querySelector(".et-username")
            let emailEl = row.querySelector(".et-email")
            let authorizedEl = row.querySelector(".et-authorized")

            userNameEl.innerText = userName
            emailEl.innerText = email
            authorizedEl.innerText = authorized
            break
        }
    }
}
/**
 * add new row in table after adding new user
 */
function addStaffInTable({ id, username, email, role, authorizedStaff }){
    let authorized = ''
    if(authorizedStaff){
        authorized = 'Yes'
    }else{
        authorized = 'No'
    }
    let newRow = document.createElement('tr')
    newRow.setAttribute('user-id', id)
    newRow.classList.add('kt-datatable__row')
    newRow.style.left = '0px'
    newRow.innerHTML =      `<td class="kt-datatable__cell" data-field="User Id">
                                <span style="width: 110px;">${id}</span>
                            </td>
                            <td class="kt-datatable__cell" data-field="Name">
                                <span style="width: 110px;" class="et-username">${username}</span>
                            </td>
                            <td class="kt-datatable__cell" data-field="Email">
                                <span style="width: 110px;" class="et-email">${email}</span>
                            </td>
                            <td class="kt-datatable__cell" data-field="Role">
                                <span style="width: 110px;">${role}</span>
                            </td>
                            <td class="kt-datatable__cell" data-field="Authorized">
                                <span style="width: 110px;" class="et-authorized">${authorized}</span>
                            </td>
                            <td class="kt-datatable__cell" data-field="Actions" data-autohide-disabled="false">
                                <span style="overflow: visible; position: relative; width: 110px;">										
                                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" id="et-edit-staff-icon-${id}" title="Edit details" data-toggle="modal" data-target="#kt_modal_4">					
                                        <i class="la la-edit"></i>						
                                    </a>					
                                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Delete" id="et-delete-staff-icon-${id}" data-toggle="modal" data-target="#et_modal_confirm_delete">							
                                        <i class="la la-trash"></i>						
                                    </a>					
                                </span>
                            </td>
                        `
    $staffListTable.appendChild(newRow)
    
    let $editIcon = document.getElementById(`et-edit-staff-icon-${id}`)
    let $deleteIcon = document.getElementById(`et-delete-staff-icon-${id}`)

    $editIcon.addEventListener('click',(e) => {
        $updateStaffConfirmBtn.setAttribute('staff-id', id)

        $editUserNameInput.value = username
        $editEmailInput.value = email

        if(authorizedStaff) $editAuthorizedStaffCb.checked = true
        else $editAuthorizedStaffCb.checked = false
    })
    $deleteIcon.addEventListener('click', () => {
        $deleteStaffBtn.setAttribute('staff-id', id)
    })
}
/**
 * clear inputs in add modal (et_modal_create)
 */
function clearAddInputs(){
    $addUserNameInput.value = ''
    $addFullNameInput.value = ''
    $addEmailInput.value = ''
    $addPasswordInput.value = ''
    $authorizedStaffCb.checked = false
}
