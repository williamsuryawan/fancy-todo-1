$(document).ready(function() {
    $('#login-content').hide();
    $('#home-content').show();

    if(localStorage.getItem('token')) {
        isLogin(true);
    } else {
        isLogin(false);
    }

    $('#login_click').click(function() {
        console.log("show form login")
        $('#home-content').hide();
        $('#login-content').show();
        $('#login_form').show();
        $('#register_form').hide();
        $('#google_signin').show();
        
    })

    $('#login_form').submit(function() {
        event.preventDefault()
    })

    $('#register_click').click(function() {
        console.log("show form register")
        $('#home-content').hide();
        $('#login-content').show();
        $('#register_form').show();
        $('#login_form').hide();
    })

    $('#register_form').submit(function() {
        event.preventDefault()
    })

    $('#sign_in').click(function() {
        $('#login-content').show()
        $('#register_form').hide()
        $('#login_form').show()
    })

    $('#mysummary_click').click(function() {
        console.log("show summary sign in true")
        getmytodo();
        getmyactiveproject();
        getmyinvitedproject();
        getmycreatedproject();
        $('#mysummary-content').show();
        $('#myproject-content').hide();
        $('#mytodo-content').hide();
    })

})

function register() {
    console.log($('#emailReg').val())
    console.log($('#pwReg').val())
    $.ajax({
        url: 'http://localhost:3000/users/register',
        method: 'POST',
        data: {
            email: $('#emailReg').val(),
            password: $('#pwReg').val()
        }
    })
    .done(data => {
        $('#register_form').hide()
        $('#login_form').show()
        Swal.fire({
            position: 'top-end',
            type: 'success',
            title: 'Register is success',
            showConfirmButton: false,
            timer: 1500
        })
    })
    .fail(err => {
        console.log(err)
    }) 
}

function isLogin(input) {
    if(input == false) {
        console.log("login is ===>", input)
        $('#login-content').hide();
        $('#main-content').hide();
        $('#navbar-content-before').show();
        $('#navbar-content-after').hide();
    } else {
        $('#login-content').hide();
        $('#navbar-content-before').hide();
        $('#navbar-content-after').show();
        $('#myproject-content').hide();
        $('#mytodo-content').hide();
        getmytodo();
        getmycreatedproject();
        getmyinvitedproject();
        getmyactiveproject();
        $('#mysummary-content').show();
        $('#main-content').show();
    }
}