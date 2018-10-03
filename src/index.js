const { GraphQLServer } = require('graphql-yoga');
const resolvers = require('./resolvers');

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers
});

server.start(
    {port:80},
    () => console.log(`Server is running on http://localhost:4000`)
);