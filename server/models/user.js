const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hashPassword = require('../helpers/hashPassword')

const userSchema = new Schema ({
    email: {type: String},
    password: {type: String},
    listTodo: [{
        type: Schema.Types.ObjectId,
        ref: 'Todo'
    }],
    listProject: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]
});

userSchema.pre('save', function(next) {
    console.log("masuk hook hash password")
    if(this.password) { 
        this.password = hashPassword(this.password)
    }
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;