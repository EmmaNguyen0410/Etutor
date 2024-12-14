'use strict'

var StudentTable = function () {
    var students = [];
    var urlParams = new URLSearchParams(window.location.search);
    var tutorId = urlParams.get('tutorId');
    var tutorDatatable;
    const showAllStudents = () => {

        var classes = [];
        $.ajax({
            method: "POST",
            url: '/class/findClassRoomsByUserId',
            async: false,
            data: { userId: tutorId, role: 'tutor' }
        }).done((data) => {
            classes = data;
        })
        classes.forEach(element => {
            $.ajax({
                method: "POST",
                url: "/class/findPeopleByClassId",
                async: false,
                data: { classId: element.classId }
            }).done((data) => {
                students.push(data.classPeople.students[0])
            })
        })
        tutorDatatable = $("#et-tutor-student-list").KTDatatable({
            data: {
                type: 'local',
                source: students,
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },
            layout: {
                scroll: false,
                footer: false,
            },
            sortable: true,
            pagination: true,
            columns: [
                {
                    field: 'id',
                    title: 'ID',
                    width: 20,
                    textAlign: 'center',
                },
                {
                    field: 'fullname',
                    title: 'Name',
                    width: 200,
                },
                {
                    field: 'email',
                    width: 150,
                    title: 'Email'
                },
                {
                    field: 'Action',
                    width: 200,
                    title: 'Action',
                    sortable: false,
                    autoHide: false,
                    overFlow: 'visible',
                    template: function (row) {
                        return `<button type="button" class="et-delete-student btn btn-danger btn-icon-sm" student-name="${row.name}">
                        <i class="flaticon2-delete"></i> Delete</button>`

                    }
                }
            ]
        })
    }

    const deleteStudentEvent = () => {
        $(document).ready(() => {
            var $deleteStudentBtns = document.getElementsByClassName('et-delete-student')
            for (var i = 0; i < $deleteStudentBtns.length; i++) {
                let currentBtn = $deleteStudentBtns[i]
                $deleteStudentBtns[i].onclick = (btn) => {
                    let className = currentBtn.getAttribute('student-name')

                    swal.fire({
                        buttonsStyling: false,

                        text: "Are you sure to delete this student ?",
                        type: "danger",

                        confirmButtonText: "Yes, delete!",
                        confirmButtonClass: "btn btn-sm btn-bold btn-danger",

                        showCancelButton: true,
                        cancelButtonText: "No, cancel",
                        cancelButtonClass: "btn btn-sm btn-bold btn-brand"
                    }).then(function (result) {
                        if (result.value) {
                            swal.fire({
                                title: 'Deleted!',
                                text: 'Your selected records have been deleted! :(',
                                type: 'success',
                                buttonsStyling: false,
                                confirmButtonText: "OK",
                                confirmButtonClass: "btn btn-sm btn-bold btn-brand",
                            }).then(() => {
                                $.ajax({
                                    method: "POST",
                                    url: "/class/deleteClassByTutorIdAndClassName",
                                    async: false,
                                    data: { className: className, tutorId: tutorId }
                                }).then(data => window.location.reload())
                            })
                        } else if (result.dismiss === 'cancel') {
                            swal.fire({
                                title: 'Cancelled',
                                text: 'You selected student have not been deleted! :)',
                                type: 'error',
                                buttonsStyling: false,
                                confirmButtonText: "OK",
                                confirmButtonClass: "btn btn-sm btn-bold btn-brand",
                            });
                        }
                    });
                }
            }
        })
    }
    var datatable;

    const assignNewStudentTable = () => {
        $('#et_modal_create').on('shown.bs.modal', function () {
            datatable = $('#et-student-list').KTDatatable({
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            method: 'GET',
                            url: '/user/findStudentsWithoutClass',
                            map: function (raw) {
                                // sample data mapping
                                var dataSet = raw;
                                if (typeof raw.users !== 'undefined') {
                                    dataSet = raw.users
                                }
                                return dataSet;
                            },

                        }
                    },
                    pageSize: 10,
                    serverPaging: false,
                    serverFiltering: false,
                    serverSorting: false,
                },
                layout: {
                    scroll: false,
                    footer: false
                },

                // column sorting
                sortable: false,

                pagination: true,

                columns: [
                    {
                        field: 'id',
                        title: 'ID',
                        sortable: false,
                        width: 20,
                        selector: {
                            class: 'kt-checkbox--solid'
                        },
                        textAlign: 'center',
                    },
                    {
                        field: 'fullname',
                        title: 'Name',
                        width: 200,
                    },
                    {
                        field: 'name',
                        title: 'Account',
                        width: 200,
                    },
                    {
                        field: 'email',
                        width: 150,
                        title: 'Email'
                    }
                ]
            })
        })
    }

    // // search
    // var search = function () {
    //     $('#kt_form_status').on('change', function () {
    //         datatable.search($(this).val().toLowerCase(), 'Status');
    //     });
    // };

    // selected records assign
    var selectedAssign = function () {
        $('#et_confirm_add').on('click', function () {
            // fetch selected IDs
            var ids = datatable.rows('.kt-datatable__row--active').nodes().find('.kt-checkbox--single > [type="checkbox"]').map(function (i, chk) {
                return $(chk).val();
            });
            var studentNames = datatable.rows('.kt-datatable__row--active').nodes().find('[data-field="name"] > span').map(function (i, nameField) {
                return $(nameField).text();
            })

            var studentEmails = datatable.rows('.kt-datatable__row--active').nodes().find('[data-field="email"] > span').map(function (i, emailField) {
                return $(emailField).text();
            })

            if (ids.length > 0) {
                // learn more: https://sweetalert2.github.io/
                swal.fire({
                    buttonsStyling: false,

                    text: "Are you sure to assign " + ids.length + " selected students ?",
                    type: "warning",

                    confirmButtonText: "Yes, assign!",
                    confirmButtonClass: "btn btn-sm btn-bold btn-warning",

                    showCancelButton: true,
                    cancelButtonText: "No, cancel",
                    cancelButtonClass: "btn btn-sm btn-bold btn-brand"
                }).then(function (result) {
                    if (result.value) {
                        swal.fire({
                            title: 'Assigned!',
                            text: 'Your selected students have been assigned',
                            type: 'success',
                            buttonsStyling: false,
                            confirmButtonText: "OK",
                            confirmButtonClass: "btn btn-sm btn-bold btn-brand",
                        })
                            .then((result) => {
                                var staffId = window.localStorage.getItem('userId');
                                $.ajax({
                                    method: "POST",
                                    url: '/class/createClassAndAssignStudents',
                                    data: { tutorId: tutorId, staffId: staffId, studentIds: JSON.stringify(ids), studentNames: JSON.stringify(studentNames) },
                                    async: false,
                                }).done((data) => {
                                    console.log(data);
                                })
                                $.ajax({
                                    method: "POST",
                                    url: '/email/sendEmail',
                                    data: { tutorId: tutorId, studentEmails: JSON.stringify(studentEmails), studentIds: JSON.stringify(ids), studentNames: JSON.stringify(studentNames) },
                                    async: false,
                                }).done((data) => {
                                    console.log(data);
                                    window.location.reload();
                                })
                                
                            })
                        // result.dismiss can be 'cancel', 'overlay',
                        // 'close', and 'timer'
                    } else if (result.dismiss === 'cancel') {
                        swal.fire({
                            title: 'Cancelled',
                            text: 'You selected students have not been assigned!',
                            type: 'error',
                            buttonsStyling: false,
                            confirmButtonText: "OK",
                            confirmButtonClass: "btn btn-sm btn-bold btn-brand",
                        })
                    }
                });
            }
        });
    }


    return {
        init: () => {
            showAllStudents();
            assignNewStudentTable();
            selectedAssign();
            deleteStudentEvent();
        }
    }
}();

$(document).ready(() => {
    StudentTable.init();
})
