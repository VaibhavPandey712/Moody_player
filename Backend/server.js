import app from "./src/app.js";
import connectToDB from "./src/db/db.js";
import  dotenv  from "dotenv";

dotenv.config();

const port=3000;
connectToDB();

app.listen(port,()=>{
    console.log("Server is running");
})
