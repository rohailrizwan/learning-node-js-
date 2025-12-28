import mongoose from "mongoose"


const productSchema = new mongoose.Schema(
    {
        product_name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        rating: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        notes: {
            type: [String],
            required: true,
            default: []
        },
        image: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        }

    },
    { timestamps: true }
)

export const Product = mongoose.model("Products",productSchema)