import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from "mongoose";
import { MONGO_URI, JWT_SECRET } from "./config.js";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { noteTypeDefs } from "./typeDefs/noteTypeDefs.js";
import { userTypeDefs } from "./typeDefs/userTypeDefs.js";
import { noteResolvers } from "./resolvers/noteResolvers.js";
import { userResolvers } from "./resolvers/userResolvers.js";
import jwt from "jsonwebtoken";
mongoose.connect(MONGO_URI);
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (error) => {
    console.error("Error connecting to MongoDB", error);
});
const typeDefs = mergeTypeDefs([noteTypeDefs, userTypeDefs]);
const resolvers = mergeResolvers([noteResolvers, userResolvers]);
const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
        // You can add context here if needed, e.g., for authentication
        const { authorization } = req.headers;
        if (authorization) {
            // You can verify the token here and add user info to context            
            // return { user };
            try {
                const { userId } = jwt.verify(authorization, JWT_SECRET);
                return { userId };
            }
            catch (error) {
                console.error("Token verification failed:", error);
                throw new Error("Unauthorized");
            }
        }
        return { req };
    }
});
console.log(`🚀  Server ready at: ${url}`);
