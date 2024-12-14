/**
 * DOM elements
 */
$loginForm = $('#kt_login_form')
$loginFormButton = $('#kt_login_signin_submit')


/**
 * show error message 
 */
function showErrorMsg(form, type, msg) {
	var alert = $('<div class="alert alert-bold alert-solid-' + type + ' alert-dismissible" role="alert">\
		<div class="alert-text">'+ msg + '</div>\
		<div class="alert-close">\
			<i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
		</div>\
	</div>');

	form.find('.alert').remove();
	alert.prependTo(form);
	KTUtil.animateClass(alert[0], 'fadeIn animated');
}
/**
 * submit login form event handler
 */

$loginForm.submit((e) => {
	e.preventDefault()

	$loginForm.validate({
		rules: {
			username: {
				required: true
			},
			password: {
				required: true
			}
		}
	});

	if (!$loginForm.valid()) {
		return;
	}

	KTApp.progress($loginFormButton);

	let username = e.target.elements.username.value;
	let password = e.target.elements.password.value;

	$.ajax({
		method: "POST",
		url: "/auth/login",
		data: { username, password }
	})
	.done(function (data) {
		KTApp.unprogress($loginFormButton);
		if(data.status){
			let userDetail = data.userDetail
			localStorage.setItem('userId', userDetail.userId)
			localStorage.setItem('userName', userDetail.userName)
			localStorage.setItem('role', userDetail.role)
			window.location.href = "/dashboard"
		}else{
			showErrorMsg($loginForm, 'danger', 'Incorrect username or password. Please try again.');
		}
	});
})


