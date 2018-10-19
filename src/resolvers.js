const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('./utils');
const { Users, Tasks } = require('./datamodels');

// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        async me(root, args, context) {
            const id = getUserId(context);
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
        async signUp(parent, {username, password, profile_picture}) {
            const cryptPassword = await bcrypt.hash(password, 10);

            let userModel = new Users({
                username,
                password: cryptPassword,
                profile_picture,
            });
            let user = await userModel.save();

            const token = jwt.sign({userId: user.id}, APP_SECRET);

            return {
                token,
                user,
            }
        },
        async logIn(parent, {username, password}) {
            const user = await Users.findOne({username});
            if (!user) {
                throw new Error('No such user found')
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error('Invalid password')
            }

            const token = jwt.sign({userId: user.id}, APP_SECRET);

            return {
                token,
                user,
            }
        },
        async deleteUser(root, {id}) {
            return await Users.findByIdAndRemove(id)
        },
        // Task
        async addTask(root, {text}, context) {
            const user = getUserId(context);
            await Tasks.updateMany({user}, {$inc: {position: 1}});
            let task = new Tasks({user, text});
            return await task.save();
        },
        async deleteTask(root, {id}, context) {
            const user = getUserId(context);
            let removed = await Tasks.findOneAndDelete({_id: id, user});
            await Tasks.updateMany({user: user, position: {$gt: removed.position}}, {$inc: {position: -1}});
            return removed;
        },
        async updateTask(root, {id, text, done}, context) {
            const user = getUserId(context);
            return await Tasks.findOneAndUpdate({_id: id, user}, {
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