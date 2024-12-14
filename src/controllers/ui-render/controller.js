const { User } = require('../../config/sequelize') 
class UIRender{

    renderDashboardPage(req, res){
        let currentUserRole = req.session.user.role
        let isAdminOrStaff = false
        let isTutorOrStudent = false
        let isStudent = false
        let isAdmin = false
        let authorizedStaff = req.session.user.authorizedStaff

        if(currentUserRole == "student") isStudent = true
        if(currentUserRole == "admin")  isAdmin = true

        if(currentUserRole == 'admin' || currentUserRole == 'staff'){
            isAdminOrStaff = true
        }else{
            isTutorOrStudent = true
        }

        if(currentUserRole == 'admin'){
            res.render('admin-dashboard', {
                title: 'Etutoring',
                thisPageStyleSheets: ['../css/et-pages/admin-dashboard.css'], 
                thisPageScripts: ['../js/et-pages/admin-dashboard.js'],
                isAdminOrStaff,
                isTutorOrStudent,
                isStudent,
                isAdmin,
                authorizedStaff,
                layout: 'main'
            })
        }else if(currentUserRole == 'staff'){
            res.render('staff-dashboard', {
                title: 'Etutoring',
                thisPageStyleSheets: [], 
                thisPageScripts: ['../js/et-pages/staff-dashboard.js'],
                isAdminOrStaff,
                isTutorOrStudent,
                isStudent,
                isAdmin,
                authorizedStaff,
                layout: 'main'
            })
        }else if(currentUserRole == 'tutor'){
            res.render('tutor-dashboard', {
                title: 'Etutoring',
                thisPageStyleSheets: [], 
                thisPageScripts: ['../js/et-pages/tutor-dashboard.js'],
                isAdminOrStaff,
                isTutorOrStudent,
                isStudent,
                isAdmin,
                authorizedStaff,
                layout: 'main'
            })
        }else if(currentUserRole == 'student'){
            res.render('student-dashboard', {
                title: 'Etutoring',
                thisPageStyleSheets: ['../css/et-pages/student-dashboard.css'], 
                thisPageScripts: ['../js/et-pages/student-dashboard.js'],
                isAdminOrStaff,
                isTutorOrStudent,
                isStudent,
                isAdmin,
                authorizedStaff,
                layout: 'main'
            })
        }else{
            res.send({status: false})
        }
    }

    renderChatPage(req, res){
        let currentUserRole = req.session.user.role
        let isAdminOrStaff = false
        let isTutorOrStudent = false
        let isStudent = false
        let isAdmin = false
        let authorizedStaff = req.session.user.authorizedStaff

        if(currentUserRole == "student") isStudent = true
        if(currentUserRole == "admin")  isAdmin = true

        if(currentUserRole == 'admin' || currentUserRole == 'staff'){
            isAdminOrStaff = true
        }else{
            isTutorOrStudent = true
        }

        res.render('chat', {
            title: 'Etutoring',
            thisPageStyleSheets: ['../css/et-pages/chat.css'], 
            thisPageScripts: ['../js/et-pages/chat.js'],
            isAdminOrStaff,
            isTutorOrStudent,
            isStudent,
            isAdmin,
            authorizedStaff,
            layout: 'main'
        })
    }

    renderStaffManaPage(req, res){
        let currentUserRole = req.session.user.role
        let isAdminOrStaff = false
        let isTutorOrStudent = false
        let isStudent = false
        let isAdmin = false
        let authorizedStaff = req.session.user.authorizedStaff

        if(currentUserRole == "student") isStudent = true
        if(currentUserRole == "admin") isAdmin = true

        if(currentUserRole == 'admin' || currentUserRole == 'staff'){
            isAdminOrStaff = true
        }else{
            isTutorOrStudent = true
        }

        res.render('admin-staff-mana', {
            title: 'Etutoring',
            thisPageStyleSheets: ['../css/et-pages/admin-staff-mana.css'], 
            thisPageScripts: ['../js/et-pages/admin-staff-mana.js'],
            isAdminOrStaff,
            isTutorOrStudent,
            isStudent,
            isAdmin,
            authorizedStaff,
            layout: 'main'
        })
    }

    renderStaffDashboardPage(req, res){
        let currentUserRole = req.session.user.role
        let isAdminOrStaff = false
        let isTutorOrStudent = false
        let isStudent = false
        let isAdmin = false
        let authorizedStaff = req.session.user.authorizedStaff

        if(currentUserRole == "student") isStudent = true
        if(currentUserRole == "admin") isAdmin = true

        if(currentUserRole == 'admin' || currentUserRole == 'staff'){
            isAdminOrStaff = true
        }else{
            isTutorOrStudent = true
        }
        res.render('admin-staff-dashboard', {
            title: 'Etutoring',
            thisPageStyleSheets: [], 
            thisPageScripts: [],
            isAdminOrStaff,
            isTutorOrStudent,
            isStudent,
            isAdmin,
            authorizedStaff,
            layout: 'main'
        })
    }

    renderClassStreamPage(req, res){
        let currentUserRole = req.session.user.role
        let isAdminOrStaff = false
        let isTutorOrStudent = false
        let isStudent = false
        let isAdmin = false
        let authorizedStaff = req.session.user.authorizedStaff

        if(currentUserRole == "student") isStudent = true
        if(currentUserRole == "admin") isAdmin = true

        if(currentUserRole == 'admin' || currentUserRole == 'staff'){
            isAdminOrStaff = true
        }else{
            isTutorOrStudent = true
        }
        res.render('class-stream', {
            title: 'Etutoring',
            thisPageStyleSheets: ['../../css/pages/todo/todo.css'], 
            thisPageScripts: ['../../js/et-pages/class-stream.js'],
            isAdminOrStaff,
            isTutorOrStudent,
            isStudent,
            isAdmin,
            authorizedStaff,
            layout: 'class'
        })
    }

    renderClassListPage(req, res){
        let currentUserRole = req.session.user.role
        let isAdminOrStaff = false
        let isTutorOrStudent = false
        let isStudent = false
        let isAdmin = false
        let authorizedStaff = req.session.user.authorizedStaff

        if(currentUserRole == "student") isStudent = true
        if(currentUserRole == "admin") isAdmin = true

        if(currentUserRole == 'admin' || currentUserRole == 'staff'){
            isAdminOrStaff = true
        }else{
            isTutorOrStudent = true
        }
        res.render('class-list', {
            title: 'Etutoring',
            thisPageStyleSheets: [], 
            thisPageScripts: ['../js/et-pages/class-list.js'],
            isAdminOrStaff,
            isTutorOrStudent,
            isStudent,
            isAdmin,
            authorizedStaff,
            layout: 'main'
        })   
    }

    renderClassPeoplePage(req, res){
        let currentUserRole = req.session.user.role
        let isAdminOrStaff = false
        let isTutorOrStudent = false
        let isStudent = false
        let isAdmin = false
        let authorizedStaff = req.session.user.authorizedStaff

        if(currentUserRole == "student") isStudent = true
        if(currentUserRole == "admin") isAdmin = true

        if(currentUserRole == 'admin' || currentUserRole == 'staff'){
            isAdminOrStaff = true
        }else{
            isTutorOrStudent = true
        }
        res.render('class-people', {
            title: 'Etutoring',
            thisPageStyleSheets: ['../../css/et-pages/class-people.css'], 
            isAdminOrStaff,
            isTutorOrStudent,
            isStudent,
            isAdmin,
            authorizedStaff,
            thisPageScripts: ['../../js/et-pages/class-people.js'],
            layout: 'class'
        })
    }

    renderClassMeetingPage(req, res){
        let currentUserRole = req.session.user.role
        let isAdminOrStaff = false
        let isTutorOrStudent = false
        let isStudent = false
        let isAdmin = false
        let authorizedStaff = req.session.user.authorizedStaff

        if(currentUserRole == "student") isStudent = true
        if(currentUserRole == "admin") isAdmin = true

        if(currentUserRole == 'admin' || currentUserRole == 'staff'){
            isAdminOrStaff = true
        }else{
            isTutorOrStudent = true
        }
        res.render('class-meeting', {
            title: 'Etutoring',
            thisPageStyleSheets: ['../../css/et-pages/class-meeting.css'], 
            thisPageScripts: ['../../js/et-pages/class-meeting.js', '../../js/pages/crud/forms/widgets/bootstrap-datetimepicker.js'],
            isAdminOrStaff,
            isTutorOrStudent,
            isStudent,
            isAdmin,
            authorizedStaff,
            layout: 'class'
        })      
    }

    renderClassManaPage(req, res){
        let currentUserRole = req.session.user.role
        let isAdminOrStaff = false
        let isTutorOrStudent = false
        let isStudent = false
        let isAdmin = false
        let authorizedStaff = req.session.user.authorizedStaff

        if(currentUserRole == "student") isStudent = true
        if(currentUserRole == "admin") isAdmin = true

        if(currentUserRole == 'admin' || currentUserRole == 'staff'){
            isAdminOrStaff = true
        }else{
            isTutorOrStudent = true
        }
        res.render('staff-class-mana', {
            title: 'Etutoring',
            thisPageScripts: ['../js/et-pages/staff-class-mana.js'],
            thisPageStyleSheets: [],
            isAdminOrStaff,
            isTutorOrStudent,
            isStudent,
            isAdmin,
            authorizedStaff,
            layout: 'main'
        })
    }

    renderClassStudentManaPage(req, res){
        let currentUserRole = req.session.user.role
        let isAdminOrStaff = false
        let isTutorOrStudent = false
        let isStudent = false
        let isAdmin = false
        let authorizedStaff = req.session.user.authorizedStaff

        if(currentUserRole == "student") isStudent = true
        if(currentUserRole == "admin") isAdmin = true

        if(currentUserRole == 'admin' || currentUserRole == 'staff'){
            isAdminOrStaff = true
        }else{
            isTutorOrStudent = true
        }
        res.render('class-student-mana', {
            title: 'Etutoring',
            thisPageScripts: ['../js/et-pages/class-student-mana.js'],
            thisPageStyleSheets: [],
            isAdminOrStaff,
            isTutorOrStudent,
            isStudent,
            isAdmin,
            authorizedStaff,
            layout: 'main'
        })
    }
    
    renderUserManaPage(req, res){
        let currentUserRole = req.session.user.role
        let isAdminOrStaff = false
        let isTutorOrStudent = false
        let isStudent = false
        let isAdmin = false
        let authorizedStaff = req.session.user.authorizedStaff

        if(currentUserRole == "student") isStudent = true
        if(currentUserRole == "admin") isAdmin = true

        if(currentUserRole == 'admin' || currentUserRole == 'staff'){
            isAdminOrStaff = true
        }else{
            isTutorOrStudent = true
        }
        res.render('staff-user-mana', {
            title: 'Etutoring',
            thisPageScripts: ['../js/et-pages/staff-user-mana.js'],
            thisPageStyleSheets: [],
            isAdminOrStaff,
            isTutorOrStudent,
            isStudent,
            isAdmin,
            authorizedStaff,
            layout: 'main'
        })
    }

    renderStudentAssignmentPage(req, res) {
        let currentUserRole = req.session.user.role
        let isAdminOrStaff = false
        let isTutorOrStudent = false
        let isStudent = false
        let isAdmin = false
        let authorizedStaff = req.session.user.authorizedStaff

        if(currentUserRole == "student") isStudent = true
        if(currentUserRole == "admin") isAdmin = true

        if(currentUserRole == 'admin' || currentUserRole == 'staff'){
            isAdminOrStaff = true
        }else{
            isTutorOrStudent = true
        }
        res.render('staff-class-mana-student-assign', {
            title: 'Etutoring',
            thisPageScripts: ['../js/et-pages/staff-class-mana-student-assign.js'],
            thisPageStyleSheets: [],
            isAdminOrStaff,
            isTutorOrStudent,
            isStudent,
            isAdmin,
            authorizedStaff,
            layout: 'main'
        })
    }

    renderOthersDashboardPage(req, res){
        let url = req.url
        let otherId = url.split('/')[2]

        User.findOne({
            where: { id: otherId }
        }).then(user => {
            if(user){
                let role = user.role
                let currentUserRole = req.session.user.role
                let isAdminOrStaff = false
                let isTutorOrStudent = false
                let isStudent = false
                let isAdmin = false
                let authorizedStaff = req.session.user.authorizedStaff

                if(currentUserRole == "student") isStudent = true
                if(currentUserRole == "admin") isAdmin = true

                if(currentUserRole == 'admin' || currentUserRole == 'staff'){
                    isAdminOrStaff = true
                }else{
                    isTutorOrStudent = true
                }

                if(role == 'student'){
                    res.render('other-student-dashboard', {
                        title: 'Etutoring',
                        thisPageStyleSheets: ['../css/et-pages/other-student-dashboard.css'], 
                        thisPageScripts: ['../js/et-pages/other-student-dashboard.js'],
                        isAdminOrStaff,
                        isTutorOrStudent,
                        isStudent,
                        isAdmin,
                        authorizedStaff,
                        layout: 'main'
                    })
                }else if(role == 'staff'){
                    res.render('other-staff-dashboard', {
                        title: 'Etutoring',
                        thisPageStyleSheets: [], 
                        thisPageScripts: ['../js/et-pages/other-staff-dashboard.js'],
                        isAdminOrStaff,
                        isTutorOrStudent,
                        isStudent,
                        isAdmin,
                        authorizedStaff,
                        layout: 'main'
                    })
                }
            }else{
                res.render('401-error', {
                    title: 'Etutoring',
                    layout: false
                })
            }
        })
    }

    renderOthersDashboardListPage(req, res){
        let currentUserRole = req.session.user.role
        let isAdminOrStaff = false
        let isTutorOrStudent = false
        let isStudent = false
        let isAdmin = false
        let authorizedStaff = req.session.user.authorizedStaff

        if(currentUserRole == "student") isStudent = true
        if(currentUserRole == "admin") isAdmin = true

        if(currentUserRole == 'admin' || currentUserRole == 'staff'){
            isAdminOrStaff = true
        }else{
            isTutorOrStudent = true
        }
        res.render('other-dashboards', {
            title: 'Etutoring',
            thisPageScripts: ['../js/et-pages/other-dashboards.js'],
            thisPageStyleSheets: [],
            isAdminOrStaff,
            isTutorOrStudent,
            isStudent,
            isAdmin,
            authorizedStaff,
            layout: 'main'
        })
    }

    renderCallPage(req, res){
        res.render('call', {
            title: 'Etutoring',
            thisPageScripts: ['../js/et-pages/call.bundle.js'],
            thisPageStyleSheets: [],
            layout: 'call'
        })
    }

}
module.exports = new UIRender()