var detailProjectId =''
function addProjectFunction() {
    let addProjectName = $('#addModalProjectName').val()
    let addProjectDescription = $('#addModalProjectDescription').val()
    console.log("masuk ke add project function =====", addProjectName, addProjectDescription)
    $.ajax({
        url: `${baseURL}/projects/create`,
        method: 'POST',
        headers: {
          token: `${baseToken}`
        },
        data: {
            projectName: addProjectName,
            description: addProjectDescription
        }
    })
    .done(data => {
        console.log("add project berhasil", data.data)
        $('#addModalProjectName').val('')
        $('#addModalProjectDescription').val('')
        getmyactiveproject();
        getmyinvitedproject();
        getmycreatedproject();
        $('#mysummary-content').show();
    })
    .fail(error => {
    console.log(error)
    })
}

function getmyactiveproject() {
    console.log("masuk ke function my active project")  
    $('#mysummary-project-active').empty();
    $.ajax({
        url: `${baseURL}/projects/myactiveproject`,
        method: 'GET',
        headers: {
          token: `${baseToken}`
        }
    })
    .done(myActiveProjects => {
        console.log("get my active project berhasil", myActiveProjects)
        let summary_active =''
        myActiveProjects.forEach(myActiveProject => {
        summary_active += `
                <div class="col-6 mb-3" >
                    <div class="card bg-primary" style="width: 18rem;">
                        <div class="card-body text-white">
                            <h5 class="card-title">${myActiveProject.projectName}</h5>
                            <p class="card-text"> <strong>Description:</strong> ${myActiveProject.description} </p>
                            <p class="card-text"> <strong>Active Members:</strong> ${myActiveProject.activeMembers.length} </p>
                            <button type="button" class="btn btn-dark" onclick="seeDetailProjectFunction('${myActiveProject._id}')" style="color:white">Detail</button>
                            <button type="button" class="btn btn-danger" onclick="leaveProjectFunction('${myActiveProject._id}')" style="color:white">Leave Project</button>
                        </div>
                    </div>
                </div>`
        })
        $('#mysummary-project-active').append(summary_active)
        $('#mysummary-project-list').show();
    })
    .fail(error => {
        console.log(error)
    })
}
  
function getmyinvitedproject () {
    console.log("masuk ke function my invited project")
    $('#mysummary-project-invited').empty();
    $.ajax({
          url: `${baseURL}/projects/myinvitedproject`,
          method: 'GET',
          headers: {
            token: `${baseToken}`
          }
    })
    .done(myInvitedProjects => {
        console.log("get my invited project berhasil", myInvitedProjects)
        let summary_invited =''
        myInvitedProjects.forEach(myInvitedProject => {
        summary_invited += `
                <div class="col-6 mb-3" >
                    <div class="card border-warning" style="width: 18rem;">
                        <div class="card-body bg-warning text-black">
                            <h5 class="card-title">${myInvitedProject.projectName}</h5>
                            <p class="card-text"> <strong>Active Members:</strong> ${myInvitedProject.activeMembers.length} </p>
                            <p class="card-text"> <strong>Pending Members:</strong> ${myInvitedProject.invitedMembers.length} </p>
                            <p class="card-text"> <strong>Description:</strong> ${myInvitedProject.description} </p>
                            <button type="button" class="btn btn-success" onclick="acceptProjectFunction('${myInvitedProject._id}')" style="color:white">Accept</button>
                            <button type="button" class="btn btn-danger" onclick="declineProjectFunction('${myInvitedProject._id}')" style="color:white">Decline</button>
                        </div>
                    </div>
                </div>`
        })
        $('#mysummary-project-invited').append(summary_invited)
        $('#mysummary-project-list').show();
    })
    .fail(error => {
        console.log(error)
    })
}
  
function getmycreatedproject() {
    console.log("masuk ke function my created project")
    $('#mysummary-project-created').empty();
    $.ajax({
        url: `${baseURL}/projects/mycreatedproject`,
        method: 'GET',
        headers: {
        token: `${baseToken}`
        }
    })
    .done(myCreatedProjects => {
        console.log("get my created project berhasil", myCreatedProjects)
        let summary_created =''
        myCreatedProjects.forEach(myCreatedProject => {
        summary_created += `
                <div class="col-6 mb-3" >
                    <div class="card" style="width: 18rem;">
                        <div class="card-body bg-warning text-black">
                            <h5 class="card-title">${myCreatedProject.projectName}</h5>
                            <p class="card-text"> <strong>Description:</strong> ${myCreatedProject.description} </p>
                            <p class="card-text"> <strong>Active Members:</strong> ${myCreatedProject.activeMembers.length} </p>
                            <p class="card-text"> <strong>Pending Members:</strong> ${myCreatedProject.invitedMembers.length} </p>
                            <button type="button" class="btn btn-success" onclick="addMemberModalFunction('${myCreatedProject._id}')" style="color:white">Add Member</button>
                            <button type="button" class="btn btn-dark" onclick="seeDetailProjectFunction('${myCreatedProject._id}')" style="color:white">Detail</button>
                        </div>
                    </div>
                </div>`
        })
        $('#mysummary-project-created').prepend(summary_created)
        $('#mysummary-project-list').show();
    })
    .fail(error => {
        console.log(error)
    })
}


function addMemberModalFunction (input) {
    console.log("add member in project ==", input)
    $.ajax({
        url: `${baseURL}/projects/detail/${input}`,
        method: 'GET',
        headers: {
          token: `${baseToken}`
        }
      })
      .done(data => {
        console.log("get detail todo dalam project berhasil", data.invitedMembers, data.activeMembers)
        let invitedMemberList = ''
        let activeMemberList = ''
        data.invitedMembers.forEach(invitedMember => {
            invitedMemberList += `${invitedMember.email} `
        })
        data.activeMembers.forEach(activeMember => {
            activeMemberList += `${activeMember.email} `
        })
        $('#addMemberModalActiveMember').val(activeMemberList)
        $('#addMemberModalInvitedMember').val(invitedMemberList)
        $('#addMemberModalNewInvitedMember').val('')
        $('#addMemberModalProjectId').val(input)
        $('#addMemberProjectModal').modal('toggle')
      })
      .fail(error => {
        console.log(error)
      })
}

function addMemberProjectFunction () {
    let addMemberActiveMember = $('#addMemberModalActiveMember').val()
    let addMemberInvitedMember = $('#addMemberModalInvitedMember').val()
    let addMemberNewInvitedMember = $('#addMemberModalNewInvitedMember').val()
    let addMemberProjectId = $('#addMemberModalProjectId').val()
    console.log("masuk ke function add member", addMemberActiveMember, addMemberInvitedMember, addMemberNewInvitedMember, addMemberProjectId)
    $.ajax({
        url: `${baseURL}/projects/invite/${addMemberProjectId}`,
        method: 'POST',
        headers: {
          token: `${baseToken}`
        },
        data: {
            memberEmails: `${addMemberInvitedMember}${addMemberNewInvitedMember}`
        }
    })
    .done(data => {
        console.log("add member dalam project berhasil", data.data)
        $('#addMemberModalActiveMember').empty()
        $('#addMemberModalInvitedMember').empty()
        $('#addMemberModalNewInvitedMember').empty()
        $('#addMemberModalProjectId').empty()
        getmytodo();
        getmycreatedproject();
        getmyinvitedproject();
        getmyactiveproject();
        $('#mysummary-content').show();
    })
    .fail(error => {
        console.log(error)
    })

}

function editTodoProjectModalFunction (input) {
    console.log("edit todo in project ==", input)
    $.ajax({
        url: `${baseURL}/todos/${input}`,
        method: 'GET',
        headers: {
          token: `${baseToken}`
        }
      })
      .done(data => {
        console.log("get detail todo dalam project berhasil", data.data)
        $('#editModalTodoProjectDescription').val(data.data.description)
        $('#editModalTodoProjectStatus').val(data.data.status)
        $('#editModalTodoProjectDueDate').val(data.data.due_date)
        $('#editModalTodoProjectId').val(input)
        $('#editTodoProjectModal').modal('toggle')
      })
      .fail(error => {
        console.log(error)
      })
}

function editTodoProjectFunction () {
    let editTodoProjectDescription = $('#editModalTodoProjectDescription').val()
    let editTodoProjectDueDate = $('#editModalTodoProjectDueDate').val()
    let editTodoProjectStatus = $('#editModalTodoProjectStatus').val()
    let editTodoProjectId = $('#editModalTodoProjectId').val()
    console.log("masuk ke edit todo dalam project function =====", editTodoProjectDescription, editTodoProjectDueDate)
    $.ajax({
        url: `${baseURL}/projects/${editTodoProjectId}`,
        method: 'PUT',
        headers: {
          token: `${baseToken}`
        },
        data: {
          description: editTodoProjectDescription,
          due_date: editTodoProjectDueDate,
          status: editTodoProjectStatus
        }
    })
    .done(data => {
        console.log("edit todo dalam project berhasil", data.data)
        $('#editModalTodoProjectDescription').empty()
        $('#editModalTodoProjectDueDate').empty()
        $('#editModalTodoProjectId').empty()
        seeDetailProjectFunction(detailProjectId);
    })
    .fail(error => {
        console.log(error)
    })
}

function deleteTodoProjectFunction (input) {
    Swal.fire({
        title: 'Do you want to delete?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sign Out'
    })
    .then((result) => {
      if (result.value) {
        $.ajax({
          url: `${baseURL}/todos/${input}`,
          method: 'DELETE',
          headers: {
            token: `${baseToken}`
          }
        })
        .done(data => {
          console.log("berhasil delete todo dalam project")
          Swal.fire({
            type: 'success',
            title: 'Delete todo is success',
            showConfirmButton: false,
            timer: 1500
          })
          seeDetailProjectFunction(detailProjectId);
        })
        .fail(error => {
          console.log(error)
        })      
    }  
    })
}


function addTodoProjectFunction () {
    let inputId = detailProjectId
    let addTodoProjectDescription = $('#addModalTodoProjectDescription').val()
    let addTodoProjectDueDate = $('#addModalTodoProjectDueDate').val()
    console.log("masuk ke add todo project function =====", inputId, addTodoProjectDescription, addTodoProjectDueDate)
    $.ajax({
        url: `${baseURL}/projects/${inputId}/create`,
        method: 'POST',
        headers: {
          token: `${baseToken}`
        },
        data: {
          description: addTodoProjectDescription,
          due_date: addTodoProjectDueDate
        }
    })
    .done(data => {
        console.log("add todo dalam project berhasil", data.data)
        $('#addModalTodoProjectDescription').empty();
        $('#addModalTodoProjectDueDate').empty();
        seeDetailProjectFunction(inputId);
    })
    .fail(error => {
        console.log(error)
    })
}

function seeDetailProjectFunction (input) {
    console.log("masuk ke ask detail project", input)
    detailProjectId = input
    $('#myproject-id').empty()
    $('#myproject-todo').empty()
    $('#myproject-welcome').empty()
    $.ajax({
        url: `${baseURL}/projects/${input}/todos`,
        method: 'GET',
        headers: {
          token: `${baseToken}`
        }
    })
    .done(detailProject => {
        console.log("berhasil detail project", detailProject)
        let todoInProject =''
        detailProject.forEach(todoproject => {
            if(todoproject.status == 'INCOMPLETE') {
                todoInProject += `
                <div class="col-6 mb-3" >
                    <div class="card" style="width: 18rem;">
                        <div class="card-body bg-warning text-black">
                            <h5 class="card-title">${todoproject.description}</h5>
                            <p class="card-text"> <strong>Status:</strong> ${todoproject.status} <br> <strong>Due-Date:</strong> ${new Date(todoproject.due_date)} </p>
                            <button type="button" class="btn btn-success" onclick="editCompleteTodoProjectFunction('${todoproject._id}')" style="color:white">Complete</button>
                            <button type="button" class="btn btn-dark" onclick="editTodoProjectModalFunction('${todoproject._id}')" style="color:white">Edit</button>
                            <button type="button" class="btn btn-danger" onclick="deleteTodoProjectFunction('${todoproject._id}')" style="color:white">Delete</button>
                        </div>
                    </div>
                </div>`
            } else {
                todoInProject += `
                <div class="col-6 mb-3" >
                    <div class="card" style="width: 18rem;">
                        <div class="card-body bg-primary text-white">
                            <h5 class="card-title">${todoproject.description}</h5>
                            <p class="card-text"> <strong>Status:</strong> ${todoproject.status} <br> <strong>Due-Date:</strong> ${new Date(todoproject.due_date)} </p>
                            <button type="button" class="btn btn-success" onclick="editIncompleteTodoProjectFunction('${todoproject._id}')" style="color:white">Complete</button>
                            <button type="button" class="btn btn-dark" onclick="editTodoProjectModalFunction('${todoproject._id}')" style="color:white">Edit</button>
                            <button type="button" class="btn btn-danger" onclick="deleteTodoProjectFunction('${todoproject._id}')" style="color:white">Delete</button>
                        </div>
                    </div>
                </div>`
            }
        })
        $('#mysummary-welcome').empty();
        $('#mysummary-content').hide();
        $('#myproject-content').show();
        $('#myproject-id').append(input);
        
        console.log("selesai looping project todolist", input, detailProjectId)
        $('#myproject-welcome').append(`
            <div class="col-8"> <h3> Project Detail </h3></div>
            <div class="col-2">
                <button type="button" class="btn btn-success" data-toggle="modal" data-target="#addTodoProjectModal" style="color:white">Add Todo</button>
                <button type="button" class="btn btn-dark">Back</button>
            </div>
        `)
        $('#myproject-todo').prepend(todoInProject)
        $('#myproject-todo-list').show();
    })
    .fail(error => {
        console.log(error)
    })
}

function acceptProjectFunction(inputProjectId) {
    console.log("masuk ke function accept invitation", inputProjectId)
    Swal.fire({
        title: 'Do you want to accept?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Accept'
      }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `${baseURL}/projects/accept/${inputProjectId}`,
                method: 'PATCH',
                headers: {
                  token: `${baseToken}`
                }
            })
            .done(data => {
                console.log("accept invitation project berhasil", data)
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: `Success! Welcome to ${data.projectName}`,
                    showConfirmButton: false,
                    timer: 1500
                })
                getmytodo();
                getmycreatedproject();
                getmyinvitedproject();
                getmyactiveproject();
                $('#mysummary-content').show();
            })
            .fail(error => {
                console.log(error)
            })
        }
      })
    
}

function declineProjectFunction (inputProjectId) {
    console.log("masuk ke function decline invitation", inputProjectId)
    Swal.fire({
        title: 'Do you want to decline to join the project?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Decline'
      }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `${baseURL}/projects/decline/${inputProjectId}`,
                method: 'PATCH',
                headers: {token: `${baseToken}`}
            })
            .done(data => {
                console.log("decline invitation project berhasil", data)
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: `Success! You have declined to join the project`,
                    showConfirmButton: false,
                    timer: 1500
                })
                getmytodo();
                getmycreatedproject();
                getmyinvitedproject();
                getmyactiveproject();
                $('#mysummary-content').show();
            })
            .fail(error => {
                console.log(error)
            })
        }
      })
}

function leaveProjectFunction (inputProjectId) {
    console.log("masuk ke function leave invitation", inputProjectId)
    Swal.fire({
        title: 'Do you want to leave the project?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Leave'
      }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `${baseURL}/projects/leave/${inputProjectId}`,
                method: 'PATCH',
                headers: {token: `${baseToken}`}
            })
            .done(data => {
                console.log("leave project berhasil", data)
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: `Success! You have left the project`,
                    showConfirmButton: false,
                    timer: 1500
                })
                getmytodo();
                getmycreatedproject();
                getmyinvitedproject();
                getmyactiveproject();
                $('#mysummary-content').show();
            })
            .fail(error => {
                console.log(error)
            })
        }
      })
}
    