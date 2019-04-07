const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
    description: {type: String},
    status: {type: String},
    due_date: {type: Date},
    todouserid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    },
    {
        timestamps: true
})

const Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo;