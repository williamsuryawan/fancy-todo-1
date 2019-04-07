const Project = require('../models/project')
const Todo = require('../models/todo')
const User = require('../models/user')

class ProjectController {
    static async findAllProjects (req,res) {
        let allProjects = await Project.find({}).populate('invitedMembers').populate('createdBy').populate('todos')
        res.status(200).json(allProjects)
    }
    
    static async findOneProject (req,res) {
        let foundProject = await Project.findOne({"_id": req.params.projectId}).populate('invitedMembers').populate('createdBy').populate('todos')
        res.status(200).json(foundProject)
    }

    static createProject (req,res) {
        console.log("masuk ke sini", req.body, req.loggedInUser.id)
        Project
            .create({
                projectName: req.body.projectName,
                description: req.body.description,
                createdBy: req.loggedInUser.id
            })
            .then(newProject => {
                res.status(201).json({
                        msg: `New Project has been created`,
                        data: newProject
                    })
            })
    }

    static inviteMember (req,res) {
        let memberInvited = [] //user yang sudah pasti akan dimasukkin ke field invitedUsers
        let memberNotExist = [] //user yang tidak ketemu akan dikembalikan ke client untuk kemudian dikonfirmasi kembali
        let promiseMemberInvited = []
        console.log("before looping", req.body)
        req.body.memberEmails.split(' ').forEach(result => {
            console.log("dalam looping", result)
            promiseMemberInvited.push(
                User
                    .findOne({email: result})
            )
        });
        console.log("setelah invited", promiseMemberInvited )
        Promise.all(promiseMemberInvited)
        .then(users => {
            console.log("setelah promise all", users)
            users.forEach((notFound, index) => {
                if (!notFound) {
                    memberNotExist.push(req.body.memberEmails.split(' ')[index])
                }
            })
            memberInvited = users.filter(e => e !== null)
            console.log("new array in new member invited", memberInvited)
            // memberInvited.forEach(usr => {
            //     let idx = req.body.memberEmails.split(' ').findIndex(e => e == usr.email)
            //     console.log("dalam looping member invited", usr, idx)
            //     req.body.memberEmails = req.body.memberEmails.split(' ').splice(idx, 1).join(' ')
            // })
            memberInvited = memberInvited.map(e => e._id)
            console.log("after removing all information: ", memberInvited)
            return Project
                .findOneAndUpdate({
                    _id: req.params.projectId
                }, {
                    invitedMembers: memberInvited
                }, {
                    new: true
                })
                .then(updatedProject => {
                    console.log("hasil update project:", updatedProject)
                    res.status(201).json({
                            msg: `New Project has been updated`,
                            data: updatedProject
                        })
                })
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).json({
                    msg: `Internal server error`,
                    data: err.message
                })
        })
    }
    static acceptProjectInvitation(req, res) {
        console.log("masuk ke accept project invitation", req.params.id)
        Project
            .findOneAndUpdate({
                _id: req.params.id
            }, {$pull: {invitedMembers: req.loggedInUser.id},
                $push: {activeMembers: req.loggedInUser.id}
            }, { new: true })
            .then(afterAccept => {
                res.status(200).json(afterAccept)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err.message)
            })
    }

    static  declineProjectInvitation (req,res) {
        console.log("masuk ke decline project invitation", req.params.id)
        Project
            .findOneAndUpdate({
                _id: req.params.id
            }, {$pull: {invitedMembers: req.loggedInUser.id}}, { new: true })
            .then(afterDecline => {
                res.status(200).json(afterDecline)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err.message)
            })
    }
    
    static removeMember (req,res) {

    }

    static createTodoinProject (req,res) {
        console.log("masuk ke add project", req.params, req.body)
        let inputTodo = {
            description: req.body.description,
            status: 'INCOMPLETE',
            due_date: req.body.due_date,
            todouserid: req.loggedInUser.id
        }
        Todo
            .create(inputTodo)
            .then(newTodo => {
                console.log("berhasil create todo dalam project", newTodo)
                return Project
                    .findOneAndUpdate({
                        _id: req.params.projectId
                    }, {$push: {todos: newTodo._id}
                    }, {new: true})
                    .then(newTodoProject => {
                        console.log("berhasil masukkan todo dalam project", newTodoProject)
                        res.status(200).json(newTodoProject)
                    })
            })
            .catch(err => {
                res.status(500).json({
                        msg: `Internal server error`,
                        data: err.message
                    })
            })
    }

    static async findAllTodoinProject (req,res) {
        console.log("masuk ke find all todo in a project", req.params)
        let foundProject = await Project.findOne({_id: req.params.projectId}).populate('todos')
        res.status(200).json(foundProject.todos)
    }

    static findIndividualTodoinProject (req,res) {

    }

    static editIndividualTodoinProject (req,res) {
        console.log("masuk ke find all todo in a project", req.params)
        console.log("Masuk ke edit todo", req.body, req.loggedInUser, req.params)
        Todo.findOne({
            "_id": req.params.id
        })
        .then (todo => {
            // let editDate = checkDate(req.body.updatedAt)
            console.log("Hasil pencarian todo: ", todo)
             return Todo.findOneAndUpdate({
                _id: req.params.id
            }, {
                description: req.body.description,
                status: req.body.status,
                due_date: req.body.due_date,
                todouserid: req.loggedInUser.id
            }, {new: true})
            .then(updatedTodo => {
                console.log("Hasil Edit", updatedTodo)
                res.status(200).json ({
                    msg: "Todo has been updated",
                    data: updatedTodo
                })
            })
        })
        .catch(error=>{
            res.status(500).json({
                msg: 'ERROR in finding your todo to edit ',error
            }) 
            console.log(error)
        })
    }

    static deleteIndividualTodoinProject (req,res) {
        Todo.findOne({
            _id: req.params.id
        })
        .then(foundTodo =>{
            console.log("Todo yang akan diremove dan delete:", foundTodo, req.loggedInUser)
            return User.findOneAndUpdate({
                _id:foundTodo.todouserid
            }, {$pull: {listTodo: foundTodo._id}})
            .then(todoToDelete => {
                console.log("Hasil update user untuk delete todo:", todoToDelete)
                return Todo.findOneAndDelete({
                    _id: req.params.id
                })
                .then(deletedTodo => {
                    console.log("Hasil delete: ", deletedTodo)
                    res.status(200).json({
                        msg: 'Todo has been deleted',
                        data: deletedTodo
                    })
                })
            })
        })
        .catch(error => {
            res.status(500).json(error.message)
        })
    }

    static findProjectbyInvitedList(req,res) {
        Project.find({
            invitedMembers: req.loggedInUser.id
        })
        .then(result => {
            console.log(result)
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err)
        })
    }

    static findProjectbyActiveList(req,res) {
        Project.find({
            activeMembers: req.loggedInUser.id
        })
        .then(result => {
            console.log(result)
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err)
        })
    }

    static findProjectbyCreatedByUserId(req,res) {
        console.log("masuk ke findProjectbyCreatedByUserId ", req.loggedInUser.id)
        Project.find({
            createdBy: req.loggedInUser.id
        })
        .then(result => {
            console.log(result)
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err)
        })
    }
}

module.exports = ProjectController;










// class Controller {
//     static create(req, res) {
//         let userInvited = [] //user yang sudah pasti akan dimasukkin ke field invitedUsers
//         let userNotFound = [] //user yang tidak ketemu akan dikembalikan ke client untuk kemudian dikonfirmasi kembali
//         let promiseUserInvited = []
//         req.body.invitedUsers.split(' ').forEach(u => {
//             promiseUserInvited.push(
//                 User
//                     .findOne({
//                         username: u
//                     })
//             )
//         });
//         Promise.all(promiseUserInvited)
//         .then(users => {
//             users.forEach((notFound, index) => {
//                 if (!notFound) {
//                     userNotFound.push(req.body.invitedUsers.split(' ')[index])
//                 }
//             })
//             userInvited = users.filter(e => e !== null)
//             userInvited.forEach(usr => {
//                 let idx = req.body.invitedUsers.split(' ').findIndex(e => e === usr.username)
//                 req.body.invitedUsers = req.body.invitedUsers.split(' ').splice(idx, 1).join(' ')
//             })
//             userInvited = userInvited.map(e => e._id)
            
//             return Project
//                 .create({
//                     users: req.decoded.id,
//                     name: req.body.name,
//                     description: req.body.description,
//                     creator: req.decoded.id,
//                     invitedUsers: userInvited
//                 })
//                 .then(newProject => {
//                     res
//                         .status(201)
//                         .json({
//                             msg: `New Project has been created`,
//                             newProject,
//                             userNotFound
//                         })
//                 })
//         })
//         .catch(err => {
//             console.log(err)
//             res
//                 .status(500)
//                 .json({
//                     msg: `Internal server error`,
//                     err
//                 })
//         })
//     }

//     static allProjects(req, res) {
//         Project
//             .find({
//                 users: req.decoded.id
//             })
//             // .populate('users')
//             // .populate('creator')
//             .populate('todos')
//             .sort({
//                 createdAt: -1
//             })
//             .then(projects => {
//                 res
//                     .status(200)
//                     .json(projects)
//             })
//             .catch(err => {
//                 console.log(err)
//                 res
//                     .status(500)
//                     .json({
//                         msg: `Internal server error`,
//                         err
//                     })
//             })
//     }

//     static gotInvitationQuestionMark(req, res) {
//         Project
//             .find({
//                 invitedUsers: req.decoded.id
//             })
//             .populate('creator')
//             .then(projects => {
//                 res
//                     .status(200)
//                     .json(projects)
//             })
//             .catch(err => {
//                 console.log(err)
//                 res
//                     .status(500)
//                     .json({
//                         msg: `Internal server error`,
//                         err
//                     })
//             })
//     }

//     static getProject(req, res) {
//         Project
//             .findById(req.params.id)
//             .populate('users')
//             .populate('todos')
//             .populate('creator')
//             .then(project => {
//                 res
//                     .status(200)
//                     .json(project)
//             })
//             .catch(err => {
//                 res
//                 .status(500)
//                     .json({
//                         msg: `Internal server error`,
//                         err
//                     })
//             })
//     }

//     static inviteMember(req, res) {
//         let userInvited = [] //user yang sudah pasti akan dimasukkin ke field invitedUsers
//         let userNotFound = [] //user yang tidak ketemu akan dikembalikan ke client untuk kemudian dikonfirmasi kembali
//         let promiseUserInvited = []
//         req.body.invitedUsers.split(' ').forEach(u => {
//             promiseUserInvited.push(
//                 User
//                     .findOne({
//                         username: u
//                     })
//             )
//         });
//         Promise.all(promiseUserInvited)
//         .then(users => {
//             users.forEach((notFound, index) => {
//                 if (!notFound) {
//                     userNotFound.push(req.body.invitedUsers.split(' ')[index])
//                 }
//             })
//             userInvited = users.filter(e => e !== null)
//             userInvited.forEach(usr => {
//                 let idx = req.body.invitedUsers.split(' ').findIndex(e => e === usr.username)
//                 req.body.invitedUsers = req.body.invitedUsers.split(' ').splice(idx, 1).join(' ')
//             })
//             userInvited = userInvited.map(e => e._id)
            
//             return Project
//                 .findOneAndUpdate({
//                     _id: req.params.id
//                 }, {
//                     invitedUsers: userInvited
//                 }, {
//                     new: true
//                 })
//                 .then(updated => {
//                     res
//                         .status(201)
//                         .json({
//                             msg: `New Project has been updated`
//                         })
//                 })
//         })
//         .catch(err => {
//             console.log(err)
//             res
//                 .status(500)
//                 .json({
//                     msg: `Internal server error`,
//                     err
//                 })
//         })
//     }

//     static removeTodo(req, res) {
//         Project
//             .deleteOne({
//                 _id: req.params.id
//             }, {
//                 todos: req.params.todoId
//             })
//             .then(deleted => {
//                 res
//                     .status(200)
//                     .json({
//                         msg: `Todo has been successfully removed`
//                     })
//             })
//             .catch(err => {
//                 res
//                 .status(500)
//                     .json({
//                         msg: `Internal server error`,
//                         err
//                     })
//             })
//     }

//     static addTodo(req, res) {
//         Todo
//             .create({
//                 name: req.body.name,
//                 description: req.body.description,
//                 due_date: req.body.due_date,
//                 // user: req.decoded.id,
//                 urgency: req.body.urgency
//             })
//             .then(newTodo => {
//                 return Project
//                         .findOneAndUpdate({
//                             _id: req.params.id
//                         }, {
//                             $push: {
//                                 todos: newTodo._id
//                             }
//                         })
//                         .then(project => {
//                             res
//                                 .status(200)
//                                 .json(project)
//                         })
//             })
//             .catch(err => {
//                 res
//                 .status(500)
//                     .json({
//                         msg: `Internal server error`,
//                         err
//                     })
//             })
//     }

//     static addUser(req, res) {
//         Project
//             .findOneAndUpdate({
//                 _id: req.params.id
//             }, {
//                 $push: {
//                     invitedUsers: req.body.users
//                 }
//             }, { new: true })
//             .then(done => {
//                 res
//                     .status(200)
//                     .json(done)
//             })
//             .catch(err => {
//                 res
//                 .status(500)
//                     .json({
//                         msg: `Internal server error`,
//                         err
//                     })
//             })
//     }

//     static userAcceptingInvitation(req, res) {
//         Project
//             .findOneAndUpdate({
//                 _id: req.params.id
//             }, {
//                 $pull: {
//                     invitedUsers: req.decoded.id
//                 },
//                 $push: {
//                     users: req.decoded.id
//                 }
//             }, { new: true })
//             .then(done => {
//                 res
//                     .status(200)
//                     .json(done)
//             })
//             .catch(err => {
//                 console.log(err)
//                 res
//                     .status(500)
//                     .json({
//                         msg: `Internal server error`,
//                         err
//                     })
//             })
//     }

//     static findTodo(req, res) {
//         console.log(req.params.id)
//         Todo
//             .findById(req.params.todoId)
//             .then(todo => {
//                 res
//                     .status(200)
//                     .json(todo)
//             })
//             .catch(err => {
//                 console.log(err)
//                 res
//                     .status(500)
//                     .json({
//                         msg: `Internal Server Error`,
//                         err: err
//                     })   
//             })
//     }

//     static delete(req, res) {
//         Todo
//             .deleteOne({
//                 _id: req.params.id
//             })
//             .then(deleted => {
//                 res
//                     .json({
//                         msg: `Todo has been removed`
//                     })
//             })
//             .catch(err => {
//                 console.log(err)
//                 res
//                     .status(500)
//                     .json({
//                         msg: `Internal Server Error`,
//                         err: err
//                     })       
//             })
//     }

//     static userRejectingInvitation(req, res) {
//         Project
//             .findOneAndUpdate({
//                 _id: req.params.id
//             }, {
//                 $pull: {
//                     invitedUsers: req.decoded.id
//                 }
//             }, { new: true })
//             .then(done => {
//                 res
//                     .status(200)
//                     .json(done)
//             })
//             .catch(err => {
//                 console.log(err)
//                 res
//                     .status(500)
//                     .json({
//                         msg: `Internal server error`,
//                         err
//                     })
//             })        
//     }

//     static removeMember(req, res) {
//         Project
//             .findOneAndUpdate({
//                 _id: req.params.projectId
//             }, {
//                 $pull: {
//                     users: req.params.memberId
//                 }
//             })
//             .then(success => {
//                 res
//                     .status(200)
//                     .json({
//                         msg: `Member has been successfully removed`
//                     })
//             })
//             .catch(err => {
//                 console.log(err)
//                 res
//                     .status(500)
//                     .json({
//                         msg: `Internal server error`,
//                         err
//                     })
//             })
//     }

//     static editTodo(req, res) {
//         let edit = {
//             name: req.body.name,
//             status: req.body.status,
//             description: req.body.description,
//             due_date: req.body.due_date,
//             urgency: req.body.urgency
//         }
        
//         Todo
//             .updateOne({
//                 _id: req.params.todoId
//             }, edit)
//             .then(updated => {
//                 res
//                     .status(200)
//                     .json({
//                         msg: `Todo has been successfully updated`
//                     })
//             })
//             .catch(err => {
//                 console.log(err)
//                 res
//                     .status(500)
//                     .json({
//                         msg: `Internal server error`,
//                         err
//                     })
//             })
//     }
// }

// module.exports = Controller