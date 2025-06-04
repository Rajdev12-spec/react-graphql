import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";


export const userResolvers = {
    Query: {
        getUsers: async () => await User.find({}),
        getUserById: async (_: any, { _id }: { _id: string }) => {
            return await User.findById(_id);
        },        
    },
    Mutation: {
        addUser: async (_: any, { userInput }: { userInput: { name: string; email: string; password: string } }) => {
            try {
                console.log("Adding user:", userInput);
                // Check if the user already exists
                const existingUser = await User.findOne({ email: userInput.email });                
                if (existingUser) {
                    throw new Error("User already exists");
                }

                const hashedPassword = await bcrypt.hash(userInput.password, 10);
                // Create a new user instance
                const newUser = new User({ ...userInput, password: hashedPassword });
                return await newUser.save();
                
            } catch (error) {
                throw new Error("Error adding user: " + error.message);
                
            }
        },
        signInUser: async (_: any, { signInInput }: { signInInput: { email: string; password: string } }) => {
            try {
                // Find the user by email
                const user = await User.findOne({ email: signInInput.email });
                if (!user) {
                    throw new Error("User not found");
                }

                // Check if the password is correct
                const isMatch = await bcrypt.compare(signInInput.password, user.password);
                if (!isMatch) {
                    throw new Error("Invalid credentials");
                }

                // Generate a token
                const token = jwt.sign({ userId: user._id }, JWT_SECRET);

                // If everything is fine, return the token
                return { token };
            } catch (error) {
                throw new Error("Error signing in user: " + error.message);
            }
        },
        updateUser: async (_: any, { _id, updateUserInput }: { _id: string; updateUserInput: { name: string; email: string } }) => {
            try {
                // Find the user by ID and update
                return await User.findByIdAndUpdate(
                    _id,
                    { ...updateUserInput },
                    { new: true }
                );
            } catch (error) {
                throw new Error("Error updating user: " + error.message);
            }
        },
        deleteUser: async (_: any, { _id }: { _id: string }) => {
            try {
                // Find the user by ID and delete
                const user = await User.findById(_id);
                if (!user) {
                    throw new Error("User not found");
                }
                return await User.findByIdAndDelete(_id);
            } catch (error) {
                throw new Error("Error deleting user: " + error.message);
            }
        },
    },
}