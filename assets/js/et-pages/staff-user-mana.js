/**
 * DOM elements
 */
const $editUserModal = document.getElementById('kt_modal_4')
const $editUserNameInput = document.getElementById('et-edit-username-input')
const $editEmailInput = document.getElementById('et-edit-email-input')
const $updateUserConfirmBtn = document.getElementById('et-update-user-confirm-btn')
const $addNewUserModal = document.getElementById('et_modal_create')
const $addNewUserBtn = document.getElementById('et-add-new-user-btn')
const $addNewUserConfirmBtn = document.getElementById('et-add-user-confirm-btn')
const $addUserNameInput = document.getElementById('et-add-username-input')
const $addEmailInput = document.getElementById('et-add-email-input')
const $addFullNameInput = document.getElementById('et-add-fullname-input')
const $addPasswordInput = document.getElementById('et-add-password-input')
const $deleteUserBtn = document.getElementById('et-delete-user-btn')
const $modalConfirmDelete = document.getElementById('et_modal_confirm_delete')
const $modalConfirmUpdate = document.getElementById('et_modal_confirm_update')
const $modalConfirmAdd = document.getElementById('et_modal_confirm_add')
const $searchInput = document.getElementById('generalSearch')
const $editUserForm = document.getElementById('et-edit-user-form')
const $addUserForm = document.getElementById('et-add-user-form')


let $userListTable = document.getElementById('et-user-list-table')

/**
 * render staff data
 */
$.ajax({
    url: '/user/findAllTutorAndStudent',
    method: 'GET'
}).done((data) => {
    if(data.status){
        let usersData = data.users

        usersData.forEach((user, index) => {
            let newRow = document.createElement('tr')
            newRow.setAttribute("data-row", index)
            newRow.setAttribute('user-id', user.id)
            newRow.classList.add('kt-datatable__row')
            newRow.style.left = '0px'
            newRow.innerHTML =      `<td class="kt-datatable__cell" data-field="User Id">
                                        <span style="width: 110px;">${user.id}</span>
                                    </td>
                                    <td class="kt-datatable__cell" data-field="Name">
                                        <span style="width: 110px;" class="et-username">${user.name}</span>
                                    </td>
                                    <td class="kt-datatable__cell" data-field="Email">
                                        <span style="width: 110px;" class="et-email">${user.email}</span>
                                    </td>
                                    <td class="kt-datatable__cell" data-field="Role">
                                        <span style="width: 110px;">${user.role}</span>
                                    </td>
                                    <td class="kt-datatable__cell" data-field="Actions" data-autohide-disabled="false">
                                        <span style="overflow: visible; position: relative; width: 110px;">										
                                            <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" id="et-edit-user-icon-${user.id}" title="Edit details" data-toggle="modal" data-target="#kt_modal_4">					
                                                <i class="la la-edit"></i>						
                                            </a>					
                                            <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Delete" id="et-delete-user-icon-${user.id}" data-toggle="modal" data-target="#et_modal_confirm_delete">							
                                                <i class="la la-trash"></i>						
                                            </a>					
                                        </span>
                                    </td>
                                `
            $userListTable.appendChild(newRow)
            
            let $editIcon = document.getElementById(`et-edit-user-icon-${user.id}`)
            let $deleteIcon = document.getElementById(`et-delete-user-icon-${user.id}`)

            $editIcon.addEventListener('click',(e) => {
                $updateUserConfirmBtn.setAttribute('user-id', user.id)

                $editUserNameInput.value = user.name
                $editEmailInput.value = user.email
            })
            $deleteIcon.addEventListener('click', () => {
                $deleteUserBtn.setAttribute('user-id', user.id)
            })
        })
    }
    else console.log(data.message)
})

/**
 * update user AFTER CONFIRMATION from user
 */
$updateUserConfirmBtn.addEventListener('click', (e) => {
    let userId = $updateUserConfirmBtn.getAttribute('user-id')
    let userRole = ''
    let userMajor = ''
    //check role
    let roleList = [...$editUserForm.elements.et_role]
    roleList.forEach(role => {
        if(role.checked){
            userRole = role.value
        }
    })

    //check major
    let majorList = [...$editUserForm.elements.et_major]
    majorList.forEach(major => {
        if(major.checked) userMajor = major.value
    })

    $.ajax({
        url: '/user/update',
        method: "POST",
        data: {userName: $editUserNameInput.value, email: $editEmailInput.value, role: userRole, userId, major: userMajor }
    }).then(data => {
        if(data.status){
            //hide kt_modal_4(modal for edit) and et_modal_confirm_update
            $editUserModal.style.display = "none"
            $modalConfirmUpdate.style.display = "none"
            document.body.removeChild(document.querySelector('.modal-backdrop'))
            document.body.removeChild(document.querySelector('.modal-backdrop'))
            //update user in current table
            updateUserInTable({userName: $editUserNameInput.value, email: $editEmailInput.value, userId})
        }else{
            console.log(data.message)
        }
    })
})

/**
 * add user AFTER CONFIRMATION from user
 */
$addNewUserConfirmBtn.addEventListener('click', (e) => {
    let userUserName = $addUserNameInput.value
    let userFullName = $addFullNameInput.value
    let userEmail = $addEmailInput.value
    let userPassword = $addPasswordInput.value
    let userRole = ''
    let userMajor = ''

    //check role
    let roleList = [...$addUserForm.elements.et_role]
    roleList.forEach(role => {
        if(role.checked){
            userRole = role.value
        }
    })
    //check major
    let majorList = [...$addUserForm.elements.et_major]
    majorList.forEach(major => {
        if(major.checked) userMajor = major.value
    })

    $.ajax({
        url: '/user/add',
        method: "POST",
        data: {userName: userUserName, password: userPassword, role: userRole, email:userEmail, fullName: userFullName, major: userMajor }
    }).done((data) => {
        if(data.status){
            let { id, username, email, role } = data.newUser

            //hide et_modal_create and et_modal_confirm_add
            $modalConfirmAdd.style.display = "none"
            $addNewUserModal.style.display = "none"
            document.body.removeChild(document.querySelector('.modal-backdrop'))
            document.body.removeChild(document.querySelector('.modal-backdrop'))
            //add new staff in current table
            addUserInTable({ id, username, email, role })
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
$deleteUserBtn.addEventListener('click', () => {
    let userId = $deleteUserBtn.getAttribute('user-id')
    $.ajax({
        url: '/user/delete',
        method: "POST",
        data: { userId }
    }).done(data => {
        if(data.status){
            //hide et_modal_confirm_delete
            $modalConfirmDelete.style.display = "none"
            document.body.removeChild(document.querySelector('.modal-backdrop'))
            //remove deleted staff from table
            removeUserFromTable(userId)
        }else{
            console.log(data.message)
        }
    })
})


/**
 * remove deleted staff from table
 */
function removeUserFromTable(userId){
    let userListRows = $userListTable.childNodes
    let userListLength = userListRows.length
    for(let i = 1; i < userListLength; i++){
        let row = userListRows[i]
        if(row.getAttribute('user-id') == userId){
            $userListTable.removeChild(row)
            break
        }
    }
}
/**
 * update staff in table after updating
 */
function updateUserInTable({userName, email, userId}){
    let userListRows = $userListTable.childNodes
    let userListLength = userListRows.length

    for(let i = 1; i < userListLength; i++){
        let row = userListRows[i]
        if(row.getAttribute('user-id') == userId){
            let userNameEl = row.querySelector(".et-username")
            let emailEl = row.querySelector(".et-email")

            userNameEl.innerText = userName,
            emailEl.innerText = email
            break
        }
    }
}

/**
 * add new row in table after adding new user
 */
function addUserInTable({ id, username, email, role }){
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
                            <td class="kt-datatable__cell" data-field="Actions" data-autohide-disabled="false">
                                <span style="overflow: visible; position: relative; width: 110px;">										
                                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" id="et-edit-user-icon-${id}" title="Edit details" data-toggle="modal" data-target="#kt_modal_4">					
                                        <i class="la la-edit"></i>						
                                    </a>					
                                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Delete" id="et-delete-user-icon-${id}" data-toggle="modal" data-target="#et_modal_confirm_delete">							
                                        <i class="la la-trash"></i>						
                                    </a>					
                                </span>
                            </td>
                        `
    $userListTable.appendChild(newRow)
    
    let $editIcon = document.getElementById(`et-edit-user-icon-${id}`)
    let $deleteIcon = document.getElementById(`et-delete-user-icon-${id}`)

    $editIcon.addEventListener('click',(e) => {
        $updateUserConfirmBtn.setAttribute('user-id', id)

        $editUserNameInput.value = username
        $editEmailInput.value = email
    })
    $deleteIcon.addEventListener('click', () => {
        $deleteUserBtn.setAttribute('user-id', id)
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
}
