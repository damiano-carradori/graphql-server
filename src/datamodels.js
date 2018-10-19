const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Task
const taskSchema = new Schema({
    user: String,
    position: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    text: String,
    done: {
        type: Boolean,
        default: false
    }
});
const Tasks = mongoose.model('tasks', taskSchema);

// User
const userSchema = new Schema({
    username: {
        type: String,
        index: true,
        unique: true
    },
    password: String,
    profile_picture: String
});
const Users = mongoose.model('users', userSchema);

module.exports = { Users, Tasks };