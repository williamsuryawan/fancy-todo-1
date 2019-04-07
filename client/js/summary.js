function getmytodo() {
    console.log("masuk ke function getmytodo", localStorage.getItem('token'))
    $('#mysummary-welcome').empty();
    $('#mysummary-todo-complete').empty();
    $('#mysummary-todo').empty();
    detailProjectId=''
    $.ajax({
        url: `${baseURL}/todos`,
        method: 'GET',
        headers: {
          token: `${baseToken}`
        }
      })
      .done(data => {
        $('#mysummary-welcome').append(`<h3>${data.msg} </h3>`)
        $('#mysummary-todo-complete').append(`<h5> Your Complete Todos: ${data.globalcomplete} </h5><h5> Your Incomplete Todos: ${data.globalincomplete} </h5> `)
        let summary_todo = '';
        data.data.forEach(todo => {
            if(todo.status == 'INCOMPLETE') {
                summary_todo += `
                    <div class="col-6 mb-3" >
                        <div class="card" style="width: 18rem;">
                            <div class="card-body bg-warning text-black">
                                <h5 class="card-title">${todo.description}</h5>
                                <p class="card-text"> <strong>Status:</strong> ${todo.status} <br> <strong>Due-Date:</strong> ${new Date(todo.due_date)} </p>
                                <button type="button" class="btn btn-success" onclick="editCompleteFunction('${todo._id}')" style="color:white">Complete</button>
                                <button type="button" class="btn btn-dark" onclick="editTodoModalFunction('${todo._id}')" data-toggle="modal" data-target="#editModal" style="color:white">Edit</button>
                                <button type="button" class="btn btn-danger" onclick="deleteTodoModalFunction('${todo._id}')" style="color:white">Delete</button>
                            </div>
                        </div>
                    </div>`
            } else {
                summary_todo += `
                    <div class="col-6 mb-3" >
                        <div class="card" style="width: 18rem;">
                            <div class="card-body bg-primary text-white">
                                <h5 class="card-title">${todo.description}</h5>
                                <p class="card-text"> Status: ${todo.status} <br> Due-Date: ${new Date(todo.due_date)} </p>
                                <button type="button" class="btn btn-secondary" onclick="editIncompleteFunction('${todo._id}')" class="card-link" style="color:white">Incomplete</button>
                                <button type="button" class="btn btn-danger" onclick="deleteTodoModalFunction('${todo._id}')" style="color:white">Delete</button>
                            </div>
                        </div>
                    </div>`
            }
            
        })
        console.log("selesai looping todo summary")
        $('#mysummary-todo').prepend(summary_todo)
        $('#mysummary-todo-list').show();
      })
      .fail(error => {
        console.log(error)
      })
}

function addTodoFunction() {
    let addTodoDescription = $('#addModalTodoDescription').val()
    let addTodoDueDate = $('#addModalTodoDueDate').val()
    console.log("masuk ke add todo data function =====", addTodoDescription, addTodoDueDate)
    $.ajax({
        url: `${baseURL}/todos`,
        method: 'POST',
        headers: {
          token: `${baseToken}`
        },
        data: {
          description: addTodoDescription,
          due_date: addTodoDueDate
        }
    })
    .done(data => {
        console.log("add todo berhasil", data.data)
        $('#addModalTodoDescription').val('')
        $('#addModalTodoDueDate').val('')
        getmytodo();
        $('#mysummary-content').show();
    })
    .fail(error => {
    console.log(error)
    })
}

function editTodoModalFunction(input) {
    console.log("masuk ke function editModal ==", input)
    $.ajax({
        url: `${baseURL}/todos/${input}`,
        method: 'GET',
        headers: {
          token: `${baseToken}`
        }
      })
      .done(data => {
        console.log("get detail data berhasil", data.data)
        $('#editModalTodoDescription').val(data.data.description)
        $('#editModalTodoStatus').val(data.data.status)
        $('#editModalTodoDueDate').val(data.data.due_date)
        $('#editModalTodoId').val(input)
        $('#editTodoModal').modal('toggle')
      })
      .fail(error => {
        console.log(error)
      })
}


function editTodoFunction() {
    console.log("masuk ke edit data function =====")
    console.log($('#editModalTodoDescription').val())
    console.log($('#editModalTodoStatus').val())
    console.log($('#editModalTodoDueDate').val())
    let inputTodoId = $('#editModalTodoId').val()
    let inputTodoDescription = $('#editModalTodoDescription').val()
    let inputTodoStatus = $('#editModalTodoStatus').val()
    let inputTodoDueDate = $('#editModalTodoDueDate').val()
    $.ajax({
        url: `${baseURL}/todos/${inputTodoId}`,
        method: 'PUT',
        headers: {
          token: `${baseToken}`
        },
        data: {
          description: inputTodoDescription,
          status: inputTodoStatus,
          due_date: inputTodoDueDate
        }
    })
    .done(data => {
        console.log("edit todo berhasil", data.data)
        $('#editModalTodoDescription').val('')
        $('#editModalTodoStatus').val('')
        $('#editModalTodoDueDate').val('')
        $('#editModalTodoId').val('')
        getmytodo();
        $('#mysummary-content').show();
    })
    .fail(error => {
    console.log(error)
    })

}

function deleteTodoModalFunction(input) {
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
          console.log("berhasil delete todo")
          Swal.fire({
            type: 'success',
            title: 'Delete todo is success',
            showConfirmButton: false,
            timer: 1500
          })
          getmytodo();
          $('#mysummary-content').show();
        })
        .fail(error => {
          console.log(error)
        })      
    }  
    })
}

function editCompleteFunction(input) {
  $.ajax({
    url: `${baseURL}/todos/${input}`,
    method: 'GET',
    headers: {
      token: `${baseToken}`
    }
  })
  .done(foundTodo => {
    console.log("berhasil find TODO to change COMPLETE", foundTodo)
    $.ajax({
      url: `${baseURL}/todos/${input}`,
      method: 'PUT',
      headers: {
        token: `${baseToken}`
      },
      data: {
        description: foundTodo.data.description,
        status: 'COMPLETE',
        due_date: foundTodo.data.due_date
      }
    })
    .done(data => {
      console.log("change Todo to COMPLETE berhasil", data.data)
      getmytodo();
      $('#mysummary-content').show();
    })
    .fail(error => {
    console.log(error)
    })
  })
  .fail(error => {
    console.log(error)
  })
}

function editIncompleteFunction(input) {
  $.ajax({
    url: `${baseURL}/todos/${input}`,
    method: 'GET',
    headers: {
      token: `${baseToken}`
    }
  })
  .done(foundTodo => {
    console.log("berhasil find TODO to change INCOMPLETE", foundTodo)
    $.ajax({
      url: `${baseURL}/todos/${input}`,
      method: 'PUT',
      headers: {
        token: `${baseToken}`
      },
      data: {
        description: foundTodo.data.description,
        status: 'INCOMPLETE',
        due_date: foundTodo.data.due_date
      }
    })
    .done(data => {
      console.log("change Todo to INCOMPLETE berhasil", data.data)
      getmytodo();
      $('#mysummary-content').show();
    })
    .fail(error => {
    console.log(error)
    })
  })
  .fail(error => {
    console.log(error)
  })
}


function showSummary () {
    console.log("show summary sign in true")
    getmytodo();
    getmyactiveproject();
    getmyinvitedproject();
    getmycreatedproject();
    $('#mysummary-content').show();
    $('#myproject-content').hide();
    $('#mytodo-content').hide();
}