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

export {app}