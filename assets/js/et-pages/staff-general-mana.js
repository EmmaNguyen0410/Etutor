$viewUserListBtn = document.getElementById('et-view-user-list-btn');
$viewClassListBtn = document.getElementById('et-view-class-list-btn');

$viewClassListBtn.onclick = (e) => {
    window.location.href ='/classManagement'
}

$viewUserListBtn.onclick = (e) => {
    window.location.href = '/userManagement'
}