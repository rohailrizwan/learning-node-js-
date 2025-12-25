import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

export const Todo = mongoose.model("todos", todoSchema)