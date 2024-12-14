/**
 * DOM elements
 */
const $postContainer = document.getElementById('et-post-container')
const $addNewPostBtn = document.getElementById('et-add-new-post-btn')
const $addNewPostForm = document.getElementById('et-add-new-post-form')
const $uploadFileInput = document.getElementById('et-upload-file-input')
const $showUploadItems = document.getElementById('et-show-upload-items')
const $postTitleInput = document.getElementById('et-post-title-input')
const $postContentInput = document.getElementById('et-post-content-input')
const $modalAddNewPost = document.getElementById('et_modal_add_new_post')
const classId = window.location.pathname.split("/")[2]
let fileList = []

/**
 * check if user is in the class. if yes allow access, if no redirect to 401 page
 */


/**
 * hide add post button
 */
$addMeetingBtn.style.display = 'none'
/**
 * change color of navigation anchor
 */
$redirectClassPeople.style.color = '#959cb6'
$redirectClassMeeting.style.color = '#959cb6'
$redirectClassStream.style.color = '#5d78ff'
/**
 * initially render all posts
 */
$.ajax({
    url: '/post/getPostsByClassId',
    method: "POST",
    data: { classId }
}).then(data => {
    if(data.status){
        let posts = data.posts
        posts.forEach(post => {
            let { postId, postTitle, postContent, postCreatedAt, postUpdatedAt, postAuthor, filesData, postComments } = post
            renderPost({ postId, postTitle, postContent, postCreatedAt, postUpdatedAt, postAuthor, filesData })
            postComments.forEach(comment => {
                renderComment({ userName: comment.User.name, content: comment.content, postId })
            })
        })
        
    }
    
})

/**
 * add new post 
 */
$addNewPostBtn.addEventListener('click', (e) => {
    let postTitle = $postTitleInput.value
    let postContent = $postContentInput.value

    $.ajax({
        url: '/post/add',
        method: 'POST',
        data: { title: postTitle, content: postContent, classId }
    }).done(data => {
        if (data.status) {
            let postData = data.post
            let postId = postData.id
            let postTitle = postData.title
            let postContent = postData.content
            let postCreatedAt = postData.createdAt
            let postUpdatedAt = postData.updatedAt
            let postAuthor = localStorage.getItem('userName')

            if(fileList.length == 0){
                //render new post to stream
                renderPost({ postId, postTitle, postContent, postCreatedAt, postUpdatedAt, postAuthor, filesData: []})
                //clear input data in add-new-post form 
                clearAndHideNewPostModal()
            }else{
                let formData = new FormData()

                fileList.forEach(file => {
                    formData.append('uploadedFiles', file)
                })
    
                $.ajax({
                    url: '/file/upload',
                    method: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                }).then(data => {
                    if (data.status) {
                        let filesData = data.files
    
                        filesData.map((file) => {
                            file.ClassRoomId = classId
                            file.PostId = postId
                            delete file.createdAt
                            delete file.updatedAt
                            return file
                        })
    
                        $.ajax({
                            url: '/file/updateClassIdAndPostId',
                            method: "POST",
                            data: JSON.stringify({ updatedFiles: filesData }),
                            contentType: 'application/json'
                        }).done(data => {
                            if (data.status) {
                                //render new post to stream
                                renderPost({ postId, postTitle, postContent, postCreatedAt, postUpdatedAt, postAuthor, filesData })
                                //clear input data in add-new-post form 
                                clearAndHideNewPostModal()
                            }
                        })
    
                    } else {
                        console.log(data.message)
                    }
                })
            }
        } else {
            console.log(data.message)
        }
    })
})

/**
 * handle open new file event
 */
$uploadFileInput.addEventListener('change', (e) => {
    let openFiles = e.target.files
    let openFilesLength = openFiles.length

    for (let i = 0; i < openFilesLength; i++) {
        let openFile = openFiles.item(i)
        let openFileName = openFile.name
        let openFileSize = Math.round(Number(openFile.size) / 1000)

        //add new file to the file list
        fileList.push(openFile)
        //check the index of new file in file list
        let openFileIndex = fileList.length - 1

        let $newUploadItem = document.createElement('div')
        $newUploadItem.classList.add('dropzone-item')
        $newUploadItem.innerHTML = `	<div class="dropzone-file">
                                        <div class="dropzone-filename" title="some_image_file_name.jpg"><span data-dz-name>${openFileName}</span> <strong>(<span  data-dz-size>${openFileSize}kb</span>)</strong></div>
                                    </div>
                                    <div class="dropzone-toolbar">
                                        <span class="dropzone-delete" data-dz-remove id="et-delete-file-icon-${openFileIndex}"><i class="flaticon2-cross"></i></span>
                                    </div>`
        $showUploadItems.appendChild($newUploadItem)

        let $deleteFileIcon = document.getElementById(`et-delete-file-icon-${openFileIndex}`)
        $deleteFileIcon.addEventListener('click', () => {
            //remove file from file list
            fileList.splice(openFileIndex, 1)
            //remove file from show-upload-items
            $showUploadItems.removeChild($newUploadItem)
        })

    }
})

/**
 * render post 
 */
function renderPost({ postId, postTitle, postContent, postCreatedAt, postUpdatedAt, postAuthor, filesData }) {
    let newPost = document.createElement('div')
    newPost.classList.add('row')
    newPost.setAttribute('post-id', postId)
    newPost.innerHTML = `<div class="col">
                            <!--Begin:: Inbox View-->
                            <div class="kt-grid__item kt-grid__item--fluid  kt-portlet kt-portlet--height-fluid kt-todo__view" id="kt_todo_view">

                                <!--Begin:: Portlet Body-->
                                <div class="kt-portlet__body kt-portlet__body--fit-y">

                                    <!--Begin:: Wrapper-->
                                    <div class="kt-todo__wrapper">

                                        <!--Begin:: Head-->
                                        <div class="kt-todo__head">
                                            <div class="kt-todo__toolbar">
                                                <div class="kt-todo__info">
                                                    <span class="kt-media kt-media--sm" data-toggle="expand">
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                                <polygon points="0 0 24 0 24 24 0 24"/>
                                                                <path d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/>
                                                                <path d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z" fill="#000000" fill-rule="nonzero"/>
                                                            </g>
                                                        </svg>
                                            
                                                    </span>
                                                    <a href="#" class="kt-todo__name">
                                                        ${postAuthor}
                                                    </a>
                                                </div>
                                                <div class="kt-todo__details">
                                                    <a href="#" class="kt-todo__icon kt-todo__icon--back">
                                                        <i class="flaticon2-left-arrow-1"></i>
                                                    </a>
                                                    <a href="#" class="kt-todo__icon" data-toggle="kt-tooltip" title="Spam">
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                                <rect x="0" y="0" width="24" height="24" />
                                                                <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="10" />
                                                                <rect fill="#000000" x="11" y="7" width="2" height="8" rx="1" />
                                                                <rect fill="#000000" x="11" y="16" width="2" height="2" rx="1" />
                                                            </g>
                                                        </svg> </a>
                                                    <a href="#" class="kt-todo__icon" data-toggle="kt-tooltip" title="Delete">
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                                <rect x="0" y="0" width="24" height="24" />
                                                                <path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero" />
                                                                <path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3" />
                                                            </g>
                                                        </svg> </a>
                                                    <button type="button" class="btn btn-label-danger btn-upper btn-sm btn-bold">may 07</button>
                                                </div>
                                            </div>
                                        </div>

                                        <!--End:: Head-->

                                        <!--Begin:: Body-->
                                        <div class="kt-todo__body">
                                            <div class="kt-todo__title">
                                                <a href="#" class="kt-todo__text">${postTitle}</a>
                                                <div class="kt-todo__labels">
                                                </div>
                                            </div>
                                            <div class="kt-todo__desc">
                                                ${postContent}
                                            </div>
                                            <div class="kt-todo__files et-post-file-container">
                                                // <span class="kt-todo__file">
                                                //     <i class="flaticon2-clip-symbol kt-font-warning"></i>
                                                //     <a href="#">Agreement Samle.pdf</a>
                                                // </span>
                                            </div>
                                            <div class="kt-todo__comments" id="et-current-comments-${postId}">
                                            </div>
                                            <div class="kt-todo__comments">
                                                <div class="kt-todo__comment">
                                                    <div class="kt-todo__box">
                                                        <span class="kt-media kt-media--sm" data-toggle="expand">
                                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                                    <polygon points="0 0 24 0 24 24 0 24"></polygon>
                                                                    <path d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"></path>
                                                                    <path d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z" fill="#000000" fill-rule="nonzero"></path>
                                                                </g>
                                                            </svg>
                                                        </span>
                                                        <a href="#" class="kt-todo__username">
                                                            You
                                                        </a>
                                                    </div>
                                                    <span class="kt-todo__text">
                                                        <form class="row et-comment-form">
                                                            <input type="name" class="form-control col-11 et-comment-input"
                                                                placeholder="Enter comment">
                                                            <a class="btn btn-icon col-1 et-submit-comment-icon">
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                                    class="kt-svg-icon">
                                                                    <g stroke="none" stroke-width="1" fill="none"
                                                                        fill-rule="evenodd">
                                                                        <rect x="0" y="0" width="24" height="24" />
                                                                        <path
                                                                            d="M3,13.5 L19,12 L3,10.5 L3,3.7732928 C3,3.70255344 3.01501031,3.63261921 3.04403925,3.56811047 C3.15735832,3.3162903 3.45336217,3.20401298 3.70518234,3.31733205 L21.9867539,11.5440392 C22.098181,11.5941815 22.1873901,11.6833905 22.2375323,11.7948177 C22.3508514,12.0466378 22.2385741,12.3426417 21.9867539,12.4559608 L3.70518234,20.6826679 C3.64067359,20.7116969 3.57073936,20.7267072 3.5,20.7267072 C3.22385763,20.7267072 3,20.5028496 3,20.2267072 L3,13.5 Z"
                                                                            fill="#000000" />
                                                                    </g>
                                                                </svg>
                                                            </a>
                                                        </form>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <!--End:: Body-->
                                    </div>

                                    <!--End:: Wrapper-->
                                </div>

                                <!--End:: Portlet Body-->
                            </div>

                            <!--End:: Inbox View-->
                        </div>`
    let $postFileContainer = newPost.querySelector('.et-post-file-container')
    $postFileContainer.innerHTML = renderFiles(filesData)

    let $commentInput = newPost.querySelector('.et-comment-input')
    let $commentForm = newPost.querySelector('.et-comment-form')

    $commentForm.addEventListener('submit', (e) => {
        e.preventDefault()
        let commentContent = $commentInput.value
        submitComment({ postId, content: commentContent })
        $commentInput.value = ""
    })

    let $submitCommentIcon = newPost.querySelector('.et-submit-comment-icon')
    $submitCommentIcon.addEventListener('click', (e) => {
        e.preventDefault()
        let commentContent = $commentInput.value
        submitComment({ postId, content: commentContent })
        $commentInput.value = ""
    })

    $postContainer.insertBefore(newPost, $postContainer.childNodes[0])

}

/**
 * render files 
 */
function renderFiles(filesData) {
    let postFileContainer = ''
    filesData.forEach(file => {
        let filePath = file.path
        let filePathSplit = filePath.split("/")
        let fileName = filePathSplit[filePathSplit.length - 1]

        postFileContainer += `<span class="kt-todo__file">
                                <i class="flaticon2-clip-symbol kt-font-warning"></i>
                                <a href="../../${filePath}" download = "${fileName}">${fileName}</a>
                            </span>`

    })
    return postFileContainer
}

/**
 * clear inputs in add new post modal and hide 
 */
function clearAndHideNewPostModal() {
    $postTitleInput.value = ''
    $postContentInput.value = ''
    $uploadFileInput.value = ''
    $showUploadItemsNodes = [...$showUploadItems.childNodes]

    //remove all files from the file list
    for (let i = 0; i < $showUploadItemsNodes.length; i++) {
        $showUploadItems.removeChild($showUploadItemsNodes[i])
    }
    fileList = []
    //hide modal
    if (document.querySelector('.modal-backdrop')) document.body.removeChild(document.querySelector('.modal-backdrop'))

    $modalAddNewPost.style.display = 'none'
}

/**
 * handle close modal event
 */
$('#et_modal_add_new_post').on('hidden.bs.modal', function () {
    clearAndHideNewPostModal()
})

/**
 * handle submit comments
 */
function submitComment({ postId, content }){
    $.ajax({
        url:'/comment/add',
        method: "POST",
        data: { postId, content }
    }).then(data => {
        if(data.status){
            renderComment({ userName: localStorage.getItem('userName'), content, postId })
        }
    })
}
/**
 * render comment
 */
function renderComment({ userName, content, postId }){
    let $newComment = document.createElement('div')
    $newComment.classList.add('kt-todo__comment')
    $newComment.innerHTML = `<div class="kt-todo__box">
                                <span class="kt-media kt-media--sm" data-toggle="expand" style="background-image: url('assets/media/users/100_4.jpg')">
                                    <span></span>
                                </span>
                                <a href="#" class="kt-todo__username">
                                    ${userName}
                                </a>
                                <span class="kt-todo__date">
                                    3 Days Ago
                                </span>
                            </div>
                            <span class="kt-todo__text">
                                ${content}
                            </span>`
    let $currentComments = document.getElementById(`et-current-comments-${postId}`)
    $currentComments.appendChild($newComment)
}