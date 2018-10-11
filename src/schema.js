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
        # User
        addUser(username: String!, profile_picture: String): User!
        deleteUser(id: ID!): User!
        # Task
        addTask(user: ID!, text: String!): Task!
        deleteTask(id: ID!): Task!
        updateTask(id: ID!, text: String, done: Boolean): Task!
    }
`;

module.exports = typeDefs;