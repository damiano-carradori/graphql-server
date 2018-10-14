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
            await Tasks.updateMany({user}, {$inc: {position: 1}});
            let task = new Tasks({user, text});
            return await task.save();
        },
        async deleteTask(root, {id}) {
            let removed = await Tasks.findByIdAndRemove(id);
            await Tasks.updateMany({user: removed.user, position: {$gt: removed.position}}, {$inc: {position: -1}});
            return removed;
        },
        async updateTask(root, {id, text, done}) {
            return await Tasks.findByIdAndUpdate(id, {
                $set: {
                    updated_at: Date.now(),
                    ...(text !== undefined && {text}),
                    ...(done !== undefined && {done})
                }
            }, {new: true});
        },
        async moveTask(root, {user, from, to}) {
            let toMove = await Tasks.findOne({position: from, user});
            if (from > to) {
                await Tasks.updateMany({position: {$gte: to, $lt: from}, user}, {$inc: {position: 1}});
            } else {
                await Tasks.updateMany({position: {$gt: from, $lte: to}, user}, {$inc: {position: -1}});
            }
            return await Tasks.findByIdAndUpdate(toMove.id, {
                $set: {
                    updated_at: Date.now(),
                    position: to
                }
            }, {new: true});
        }
    }
};

module.exports = resolvers;