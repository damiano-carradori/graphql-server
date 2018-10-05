const { Tasks } = require('../database/datamodel');

module.exports = {
    tasks: async () => await Tasks.find().sort({_id:-1})
};