import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path:'.env'
})

const PORT=process.env.PORT

connectDB()
        .then(()=>{
            app.listen(PORT,()=>{
                console.log(`Server is running at PORT : http://localhost:${PORT}`);
            })
        })
        .catch((error)=>{
            console.log(error);
            process.exit(1)
        })