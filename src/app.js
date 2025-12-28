import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app  = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN || "*",
    credentials:true
}))
app.use(urlencoded({extended:true})) // for nested data
app.use(express.static('public')) // for static file
app.use(cookieParser()) // for cookie access from browser
app.use(express.json()) // for json data


app.use('/uploads',express.static('public/uploads'))
// route declaration
import userRouter from './routes/user.router.js'
import  {errorMiddleware}  from "./middleware/error.middleware.js";
import uploadRouter from "./routes/upload.router.js";
import todoRouter from './routes/todo.router.js'
import contactRouter from './routes/contact.router.js'
import productRouter from './routes/product.router.js'
app.use("/users",userRouter)
app.use("/product",productRouter)
app.use('/uploads',uploadRouter)
app.use('/todo',todoRouter)
app.use("/",contactRouter)

// ✅ Global error handler — last me rakho
app.use(errorMiddleware);

export {app}