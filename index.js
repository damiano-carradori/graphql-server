const { ApolloServer } = require('apollo-server');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');
const mongoose = require('mongoose');
require('dotenv').config();

const options = {
    'user': process.env.DB_USER,
    'pass': process.env.DB_PASS
};
mongoose.connect(process.env.DB_URI, options).catch((err)=>console.log(err));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: req => ({...req})
});

server.listen(80).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
});