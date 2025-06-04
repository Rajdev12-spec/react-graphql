export const noteTypeDefs = `#graphql
type Note {
   _id: ID!
    title: String!
    content: String!
    author: User!
    createdAt: String!
    updatedAt: String!
    }

   type Query{
       getNotes: [Note]
       getNoteById(_id: ID!): Note
       getNotesByUser: [Note]
   }
    input noteInput {
         title: String!
         content: String!        
    }
    type Mutation {
         createNote(noteInput: noteInput!): Note
         updateNote(_id: ID!, noteInput: noteInput!): Note
           deleteNote(_id: ID!): Note
    }
`;
