const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    todos: [{
            type: Schema.Types.ObjectId,
            ref: 'Todo'
        }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    activeMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    invitedMembers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
    }]
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project;