import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import { errorHandler } from "../src/middlewares/error.middlewares.js"

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(morgan('dev'))

import indexRoutes from "../src/routes/index.js"

app.use("/api/v1",indexRoutes)

app.use(errorHandler);
export {app}