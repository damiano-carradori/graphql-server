const { tasks } = require('./resolvers/queries');
const { addTask, deleteTask, updateTask } = require('./resolvers/mutations');

module.exports = {
    Query: {
        tasks
    },
    Mutation: {
        addTask,
        deleteTask,
        updateTask
    }
};