function isAdmin(req, res, next){
    let role = req.session.user.role
    if(role == 'admin') next()
    else res.send('authorized')
}
function isStaff(req, res, next){
    let role = req.session.user.role
    if(role == 'staff') next()
    else{
        res.render('401-error', {
            title: 'Etutoring',
            layout: false
        })
    }
}
function isTutor(req, res, next){
    let role = req.session.user.role
    if(role == 'tutor') next()
    else{
        res.render('401-error', {
            title: 'Etutoring',
            layout: false
        })
    }
}
function isStudent(req, res, next){
    let role = req.session.user.role
    if(role == 'student') next()
    else{
        res.render('401-error', {
            title: 'Etutoring',
            layout: false
        })
    }
}
function isStudentOrTutor(req, res, next){
    let role = req.session.user.role
    if(role == "tutor" || role == "student") next()
    else{
        res.render('401-error', {
            title: 'Etutoring',
            layout: false
        })
    }
}
function isAdminOrStaff(req, res, next){
    let role = req.session.user.role
    if(role == "admin" || role == "staff") next()
    else{
        res.render('401-error', {
            title: 'Etutoring',
            layout: false
        })
    }
}
function isAuthorizedStaff(req, res, next){
    let role = req.session.user.role
    let isAuthorizedStaff = req.session.user.authorizedStaff
    
    if(role == 'staff' && isAuthorizedStaff == true) next()
    else{
        res.render('401-error', {
            title: 'Etutoring',
            layout: false
        })
    }
}

module.exports = {
    isAdmin,
    isStaff,
    isTutor,
    isStudent,
    isStudentOrTutor,
    isAdminOrStaff,
    isAuthorizedStaff
}