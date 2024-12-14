"use strict";

const $assignStudentBtns = document.getElementsByClassName('et-assign-students-class-btn');

var ClassListTable = function() {
    const showAllTutors = () => {
		let tutorList = [];
        $.ajax({
            method: "POST",
			url: "/user/findByRole",
			data: {userRole: 'tutor'},
			async: false
        }).done((data) => {
			tutorList = data.users;            
		})
		$('#kt_subheader_total').text(tutorList.length + " Total")
		tutorList.forEach(element => {
			$('#main-container').append(`
                <div class="col-xl-3">

				<!--Begin::Portlet-->
				<div class="kt-portlet kt-portlet--height-fluid">
					<div class="kt-portlet__head kt-portlet__head--noborder">
						<div class="kt-portlet__head-label">
							<h3 class="kt-portlet__head-title">
							</h3>
						</div>
					</div>
					<div class="kt-portlet__body">

						<!--begin::Widget -->
						<div class="kt-widget kt-widget--user-profile-2">
							<div class="kt-widget__head">
								<div class="kt-widget__media">
									<img class="kt-widget__img kt-hidden-" src="../media/users/default.jpg"
										alt="image">
									<img class="kt-widget__img kt-hidden" src="../media/users/default.jpg"
										alt="image">
									<div
										class="kt-widget__pic kt-widget__pic--success kt-font-success kt-font-boldest kt-hidden">
										ChS
									</div>
								</div>
								<div class="kt-widget__info">
									<a href="#" class="kt-widget__titel kt-hidden-">
										${element.name}
									</a>
									<span class="kt-widget__desc">
										contact: ${element.email}
									</span>
								</div>
							</div>
							<div class="kt-widget__body">
								<div class="kt-widget__item">
									<div class="kt-widget__contact">
										<span class="kt-widget__label">Number of students: </span>
										<span class="kt-widget__data">10</span>
									</div>
								</div>
							</div>
							<div class="kt-widget__footer">
								<button type="button" class="et-assign-students-class-btn btn btn-label-warning btn-lg btn-upper" data-toggle="modal"
								data-target="#et_modal_update_students" class-id="${element.id}">Students Assignment</button>
								&nbsp;
							</div>
						</div>

						<!--end::Widget -->
					</div>
				</div>

				<!--End::Portlet-->
			</div>
                `)
		})
	}


	const assignBtns = () => {
		for (var i = 0; i < $assignStudentBtns.length; i ++){
			$assignStudentBtns[i].onclick = (btn) => {
				var tutorId = btn.target.attributes["class-id"].value;
				window.location.href=`/classManagement/studentAssignment?tutorId=${tutorId}`
			}
		}
	}
	
    return {
        init: () => {
			showAllTutors();
			assignBtns();
        }
    }
}();

$(document).ready(() => {
    ClassListTable.init();
})