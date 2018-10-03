const { Tasks } = require('../database/datamodel');

module.exports = {
    addTask: async (root, {text}) => {
        let task = new Tasks({text});
        return await task.save();
    },
    deleteTask: async (root, {id}) => await Tasks.deleteOne({ _id: id }),
    updateTask: async (root, {id, text, done}) => await Tasks.updateOne({_id: id},{'$set': {...(text!==undefined && {text}), ...(done!==undefined && {done})}})
};