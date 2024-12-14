/**
 * DOM elements
 */
$viewStaffManaBtn = document.getElementById("et-view-staff-mana-btn")
$viewStaffDashboardBtn = document.getElementById("et-view-staff-dashboard-btn")

/**
 * handle click view staff management button
 */
$viewStaffManaBtn.addEventListener('click', (e) => {
    window.location.href = '/staffManagement'
})
/**
 * handle click view staff dashboard button
 */
$viewStaffDashboardBtn.addEventListener('click', (e) => {
    console.log("trang xem dashboard")
    window.location.href = '/staffDashboard'
})