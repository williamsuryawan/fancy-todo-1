# fancy-todo by William Suryawan

#General
#### client site: http://localhost:8080/
#### server site: http://localhost:3000/

### Installation and Getting Started (execute this function to run this app in your terminal)
```sh
$ npm init -y (inside root server folder)
$ npm run dev or nodemon app.js (on terminal inside root server folder)
$ live-server --host=localhost (on terminal inside root client folder)
```

### **User Routing**
HTTP METHOD | ROUTE | REQUEST | RESPONSE Success | RESPONSE Error | Description
------|------|-----------|------|----------|------------
POST | users/register | body Object <br> example {email: String, password: String} | Code: 201 <br> Body: {message: newUser} | Code: 500 <br> Body: {message: internal server error} |register new user to fancy todo
POST | users/login | body Object <br> example {email: String, password: String, loginVia: String} | Code: 200 <br> Body: {token: token} | Code 400 <b> Body: {msg: wrong email/password} | login via website/ googleSignIn to get the token and to access fancy todo

### **Todo Routing**

HTTP METHOD | ROUTE | REQUEST | RESPONSE Success | RESPONSE Error | Description
------|------|-----------|------|----------|------------
POST | todos/create | body Object <br> example {description: String, due_date: Date Format (YYYY-MM-DD)} <br> headers token:**Required** | Code: 201 <br> Body: {message: newTodo} | Code: 500 <br> Body: {message: internal server error} |register new personal todo to fancy todo
GET | todos | headers token:**Required** | Code: 200 <br> Body: [{message: todo}] | Code: 500 <br> Body: {message: internal server error} |show all personal todo of the authenticated user (based on provided user token)
GET | todos/:id | params todoId <br> headers token:**Required** | Code: 200 <br> Body: {message: todo} | Code: 500 <br> Body: {message: internal server error} |show one personal todo of the authenticated user (based on provided user token and todo Id)
PUT | todos/:id | params todoId <br> headers token:**Required** <br> body Object <br> example {description: String, status: String, due_date: Date Format (YYYY-MM-DD)} | Code: 200 <br> Body: {message: updatedTodo} | Code: 500 <br> Body: {message: can't edit todo} | edit one  personal todo of the authenticated user (based on information provided on body)
DELETE | todos/:id | params todoId <br> headers token:**Required** | Code: 200 <br> Body: {message: deletedTodo} | Code: 500 <br> Body: {message: can't delete todo} | delete one  personal todo of the authenticated user (based on provided user token and todo Id)

### **Project Routing (Project Management)**

HTTP METHOD | ROUTE | REQUEST | RESPONSE Success | RESPONSE Error | Description
------|------|-----------|------|----------|------------
GET | projects/myinvitedproject | headers token:**Required** | Code: 201 <br> Body: [{message: projects}] | Code: 500 <br> Body: {message: internal server error} | get all the projects that the authenticated user is invited
GET | projects/myactiveproject | headers token:**Required** | Code: 201 <br> Body: [{message: projects}] | Code: 500 <br> Body: {message: internal server error} | get all the projects that the authenticated user is the member of the projects
GET | projects/mycreatedproject | headers token:**Required** | Code: 201 <br> Body: [{message: projects}] | Code: 500 <br> Body: {message: internal server error} | get all the projects that the authenticated user is the creator of the project
GET | projects/detail/:projectId | params projectId <br> headers token:**Required** | Code: 201 <br> Body: {message: project} | Code: 500 <br> Body: {message: internal server error} | get information of a project that the authenticated user is related to the project
POST | projects/create | body Object <br> example {projectName: String, description: String} <br> headers token:**Required** | Code: 201 <br> Body: {message: newProject} | Code: 500 <br> Body: {message: internal server error} |create new project for fancy todo
POST | projects/invite/:projectId | params projectId <br> body Object <br> example {memberEmails: email1@mail.com email2@mail.com} <br> headers token:**Required** | Code: 201 <br> Body: {message: project with invitedMembers} | Code: 500 <br> Body: {message: internal server error} | Invite member to project (by putting new memberId to invitedMembers Array)
PATCH | projects/accept/:projectId | params projectId <br> headers token:**Required** | Code: 201 <br> Body: {message: one project with updated invitedMembers and activeMembers} | Code: 500 <br> Body: {message: internal server error} | Accept project invitation (by putting memberId from invitedMembers Array to activeMembers Array )
PATCH | projects/decline/:projectId | params projectId <br> headers token:**Required** | Code: 201 <br> Body: {message: one project with updated invitedMembers} | Code: 500 <br> Body: {message: internal server error} | Decline project invitation (by removing memberId from invitedMembers Array)
PATCH | projects/leave/:projectId | params projectId <br> headers token:**Required** | Code: 201 <br> Body: {message: one project with updated invitedMembers} | Code: 500 <br> Body: {message: internal server error} | Leave from a project (by removing memberId from activeMembers Array)

### **Project Routing (Todo CRUD)**

HTTP METHOD | ROUTE | REQUEST | RESPONSE Success | RESPONSE Error | Description
------|------|-----------|------|----------|------------
POST | projects/:projectId/create | params projectId <br> body Object <br> example {description: String, due_date: Date Format (YYYY-MM-DD)} <br> headers token:**Required** | Code: 201 <br> Body: {message: newTodo} | Code: 500 <br> Body: {message: internal server error} | create a new todo in a project
GET | projects/:projectId/todos | headers token:**Required** | Code: 200 <br> Body: [{message: todo}] | Code: 500 <br> Body: {message: internal server error} | show all todos of one project (based on provided user token and projectId)
GET | todos/:id | params todoId <br> headers token:**Required** | Code: 200 <br> Body: {message: todo} | Code: 500 <br> Body: {message: internal server error} |show one personal todo of the authenticated user (based on provided user token and todo Id)
PUT | projects/:id | params todoId <br> headers token:**Required** <br> body Object <br> example {description: String, status: String, due_date: Date Format (YYYY-MM-DD)} | Code: 200 <br> Body: {message: updatedTodo} | Code: 500 <br> Body: {message: can't edit todo} | edit one  todo in a project of the authenticated user (based on information provided on body)
DELETE | projects/:id | params todoId <br> headers token:**Required** | Code: 200 <br> Body: {message: deletedTodo} | Code: 500 <br> Body: {message: can't delete todo} | delete one todo in a project of the authenticated user (based on provided user token and todo Id)
