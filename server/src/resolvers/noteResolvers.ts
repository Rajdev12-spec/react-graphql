import Note from "../models/noteModel.js";

export const noteResolvers = {
    Query: {
        getNotes: async () => await Note.find({}),
        getNoteById: async (_: any, { _id }: { _id: string }) => {
            return await Note.findById(_id).populate('author', 'name email'); // Populate author details
        },
        getNotesByUser: async (_: any, __: any, { userId }: { userId: string }) => {
            try {
                if (!userId) {
                    throw new Error("Unauthorized: User ID is required");
                }
                return await Note.find({ author: userId }).populate('author', 'name email'); // Populate author details
            } catch (error) {
                console.error("Error fetching notes by user:", error);
                throw new Error("Failed to fetch notes for the user");
            }
        }
    },
    Mutation: {
        createNote: async (_: any, { noteInput }: { noteInput: { title: string; content: string; } }, { userId }: { userId: string }) => {
            try {
                if (!userId) {
                    throw new Error("Unauthorized: User ID is required");
                }
                const newNote = new Note({
                    title: noteInput.title,
                    content: noteInput.content,
                    author: userId
                });

                return await newNote.save();
            } catch (error) {
                console.error("Error creating note:", error);
                throw new Error("Failed to create note");

            }
            // return await newNote.save();
        },
        updateNote: async (_: any, { _id, noteInput }: { _id: string; noteInput: { title: string; content: string; } }, { userId }: { userId: string }) => {
            try {
                if (!userId) {
                    throw new Error("Unauthorized: User ID is required");
                }
                return await Note.findByIdAndUpdate(
                    _id,
                    {
                        title: noteInput.title,
                        content: noteInput.content
                    },
                    { new: true }
                );

            } catch (error) {
                console.error("Error updating note:", error);
                throw new Error("Failed to update note");

            }
        },
        deleteNote: async (_: any, { _id }: { _id: string }, { userId }: { userId: string }) => {
            try {
                if (!userId) {
                    throw new Error("Unauthorized: User ID is required");
                }
                const note = await Note.findById(_id);
                if (!note) {
                    throw new Error("Note not found");
                }
                return await Note.findByIdAndDelete(_id);
            } catch (error) {
                console.error("Error deleting note:", error);
                throw new Error("Failed to delete note");
            }

        }
    }
};
