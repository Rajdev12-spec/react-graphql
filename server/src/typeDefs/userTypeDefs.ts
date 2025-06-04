export const userTypeDefs = `#graphql
type User {
    _id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    }

    type Query {
        getUsers: [User]        
        getUserById(_id: ID!): User
    }
        input userInput {
        name: String!
        email: String!
        password: String!
    }
        type token{
        token: String!
        }

        input signInInput {
        email: String!
        password: String!
    }
        input updateUserInput{
        name: String
        email: String
        }

    type Mutation {
        addUser(userInput: userInput!): User
        signInUser(signInInput: signInInput!): token
        updateUser(_id: ID!, updateUserInput: updateUserInput!): User
        deleteUser(_id: ID!): User
    }
`;
