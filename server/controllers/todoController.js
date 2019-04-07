const User = require('../models/user')
const Todo = require('../models/todo')
// const checkDate = require('../helpers/checktodoDate')


class todoController {
    //create todo
    static createTodo (req,res) {
            console.log("masuk sini post todo", req.body)
            let inputTodo = {
                description: req.body.description,
                status: 'INCOMPLETE',
                due_date: req.body.due_date,
                todouserid: req.loggedInUser.id
            }

            Todo.create(inputTodo)
                .then(todolist => {
                    let newTodo = todolist
                    console.log("cek hasil create todo", todolist)
                    User.findOneAndUpdate({
                        _id: todolist.todouserid
                    }, {$push: {listTodo: todolist._id}}, {new: true})
                    .then(user => {
                        console.log("Hasil push new todo:", user)
                        res.status(200).json({
                            msg: 'Todolist successfully created',
                            data: newTodo
                        })
                    })
                    .catch(error => {
                        res.status(500).json({
                            msg: 'ERROR Create Todolist: ', error
                        })
                    })
                })
                .catch(error => {
                    res.status(500).json({
                        msg: 'ERROR Create Todolist: ',error
                    })
                })
        
        
    }

    static displayTodoByUserId (req,res) {
        console.log("masuk ke display todo", req.loggedInUser)
        User.find({
            _id: req.loggedInUser.id
        })
        .populate('listTodo')
        .then(user => {
            console.log("User ditemukan, hasil pencarian user: ", user)
            console.log("User ditemukan, hasil pencarian todo: ", user.listTodo)
            //get all todos by user
            Todo.find({
                todouserid: req.loggedInUser.id
            })
            .then(lists => {
                console.log("Hasil pencarian todo: ", lists )
                let completedTodo = 0
                let incompleteTodo = 0
                lists.forEach(todo => {
                    if(todo.status == 'COMPLETE') {
                        completedTodo +=1
                    } else if (todo.status == 'INCOMPLETE') {
                        incompleteTodo +=1
                    }
                })
                res.status(200).json({
                    msg: `List Todo by user ${req.loggedInUser.email}`,
                    data: lists,
                    globalcomplete: completedTodo,
                    globalincomplete: incompleteTodo
                })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({
                    msg: 'ERROR Populate Todolist after create: ',error
                })        
            })
        })
        .catch(error =>{
            res.status(500).json({
                msg: 'ERROR Display list of Todo ', error
            })
        })       
    }

    static displayIndividualTodo (req,res) {
        Todo.findOne({
            _id: req.params.id
        })
        .then(todo => {
            res.status(200).json ({
                msg: "Detail Todo",
                data: todo
            })
        })
        .catch (error => {
            res.status(error).json({
                msg: 'ERROR Display details of Todo ',error
            })
        })
    }

    static editIndividualTodo (req,res) {
        console.log("Masuk ke edit todo", req.body, req.loggedInUser, req.params)
        Todo.findOne({
            "_id": req.params.id
        })
        .then (todo => {
            // let editDate = checkDate(req.body.updatedAt)
            console.log("Hasil pencarian todo: ", todo)
            return Todo.findOneAndUpdate({
                "_id": req.params.id
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
            console.log(error)
            res.status(500).json({
                msg: 'ERROR in finding your todo to edit ',error   
            }) 
        })
    }

    //delete todo
    static deleteIndividualTodo (req,res) {
        Todo.findOne({
            _id: req.params.id
        })
        .then(foundTodo =>{
            console.log("Todo yang akan diremove dan delete:", foundTodo, req.loggedInUser)
            User.findOneAndUpdate({
                _id:foundTodo.todouserid
            }, {$pull: {listTodo: foundTodo._id}})
            .then(todoToDelete => {
                console.log("Hasil update user untuk delete todo:", todoToDelete)
                Todo.findOneAndDelete({
                    _id: req.params.id
                })
                .then(deletedTodo => {
                    console.log("Hasil delete: ", deletedTodo)
                    res.status(200).json({
                        msg: 'Todo has been deleted',
                        data: deletedTodo
                    })
                })
                .catch (error => {
                    res.status(500).json({
                        msg: "Error Delete Todo", error
                    })
                })
            })
            .catch(error => {
                res.status(500).json({
                    msg: 'ERROR removing todo from user ',error
                })
            })
        })
        .catch( error =>{
            res.status(500).json({
                msg: 'ERROR finding todo to delete ',error
            })
        })
    }
}

module.exports = todoController;