$(document).ready(function () {
        
})


function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    console.log("cek apa isi ini====", googleUser.getAuthResponse())
    
    const id_token = googleUser.getAuthResponse().id_token;
    console.log("cek token google", id_token)
    $.ajax({
        url: `${baseURL}/users/login`,
        method: 'POST',
        data: {
          id_token: id_token,
          loginVia: 'googleSignIn'
        }
    })
        .done(data => {
          localStorage.setItem('token', data.token);
          isLogin(true);
          $('#login-content').hide();
        })
        .fail(error => {
          console.log(error)
        })

}

function login() {
    console.log($('#emailLogin').val())
    console.log($('#pwLogin').val())
    $.ajax({
        url: 'http://localhost:3000/users/login',
        method: 'POST',
        data: {
            email: $('#emailLogin').val(),
            password: $('#pwLogin').val(),
            loginVia: 'website'
        }
    })
    .done(data => {
        Swal.fire({
            position: 'top-end',
            type: 'success',
            title: 'Login is success',
            showConfirmButton: false,
            timer: 1500
        })
        localStorage.setItem('token', data.token)
        isLogin(true);
        $('#login-content').hide();
        $('#navbar-content-before').hide();
        $('#navbar-content-after').show();
        $('#main-content').show();
        $('#mysummary-content').show();
        $('#myproject-content').hide();
        $('#mytodo-content').hide();
        getmytodo();
        getmyproject();
    })
    .fail(err => {
        console.log(err)
        Swal.fire({
            position: 'top-end',
            type: 'error',
            title: 'Username/password is wrong',
            showConfirmButton: false,
            timer: 1500
        })
    })
} 

function signOut() {
    Swal.fire({
        title: 'Do you want to leave?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sign Out'
      }).then((result) => {
        if (result.value) {
            Swal.fire({
                type: 'success',
                title: 'Log out is success',
                showConfirmButton: false,
                timer: 1500
            })
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
            });
            localStorage.removeItem('token');
            $('#main-content').hide();
            $('#login-content').hide();
            $('#home-content').show();
            $('#navbar-content-before').show();
            $('#navbar-content-after').hide();
        }
      })
    
    
}
