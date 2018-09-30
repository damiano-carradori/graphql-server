const mongoose = require('mongoose');
require('dotenv').config();
const options = {
    'user': process.env.DB_USER,
    'pass': process.env.DB_PASS
};

mongoose.connect(process.env.DB_URI, options);

let taskSchema = new mongoose.Schema({
    text: String,
    done: {
        type: Boolean,
        default: false
    }
});
let Tasks = mongoose.model('tasks', taskSchema);

module.exports = { Tasks };