$(document).ready(function () {
    $('#navbar-content-before').append(`
        <div class="nav nav-pills" style="background-color:#80e5ff">
            <div class="col-10">
                <h6 style="margin-top:1.1%">Fancy Todo by William Suryawan</h6>
            </div>
            <li class="nav-item">
                <a class="nav-link" id="register_click" href="#" style="color:black">Register</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" id="login_click" style="color:black">Sign in</a>
            </li>
        </div>
    `)

    $('#navbar-content-after').append(`
        <div class="nav nav-pills" style="background-color:#80e5ff">
            <div class="col-8">
                <a class="nav-link" id="myhome_click" href="#" style="color:black">Welcome! Please click home/ add todo to start ^_^</a>
            </div>
            <li class="nav-item">
                <a class="nav-link" id="mysummary_click" href="#" style="color:black">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="modal" data-target="#addProjectModal" href="#" style="color:black">Add Project</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="modal" data-target="#addTodoModal" href="#" style="color:black">Add Todo</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="signOut()" id="sign_out" style="color:black">Sign out</a>
            </li>
        </div>    
    `)
})
