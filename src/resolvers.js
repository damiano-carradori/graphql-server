const { Users, Tasks } = require('./datamodels');

// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        async user(root, {id}) {
            return await Users.findById(id)
        },
        async users() {
            return await Users.find()
        },
    },
    User: {
        async tasks(user) {
            return await Tasks.find({user: user.id}).sort({position:1});
        }
    },
    Mutation: {
        // User
        async addUser(root, {username, profile_picture}) {
            let user = new Users({username, profile_picture});
            return await user.save()
        },
        async deleteUser(root, {id}) {
            return await Users.findByIdAndRemove(id)
        },
        // Task
        async addTask(root, {user, text}) {
            await Tasks.updateMany({user},{$inc:{position:1}});
            let task = new Tasks({user, text});
            return await task.save();
        }
    }
};

module.exports = resolvers;