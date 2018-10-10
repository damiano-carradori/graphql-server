const { gql } = require('apollo-server');

// The GraphQL schema
const typeDefs = gql`
    type Task {
        id: ID!
        user: String!
        position: Int!
        text: String!
        done: Boolean!
    }

    type User {
        id: ID!
        username: String!
        profile_picture: String
        tasks: [Task!]!
    }
    
    type Query {
        user(id: ID!): User!
        users: [User!]!
    }
    
    type Mutation {
        addUser(username: String!, profile_picture: String): User!
        deleteUser(id: ID!): User!
        addTask(user: ID!, text: String!): Task!
    }
`;

module.exports = typeDefs;