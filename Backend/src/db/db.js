import mongoose from "mongoose";

function connectToDB(){
    mongoose.connect("mongodb+srv://vaibhavpandey1232:BJXPVBLKOXQUF2bO@cluster0.ut9gfmf.mongodb.net/cohort")
    .then(()=>{
        console.log("Database Connected");
    })
}
export default connectToDB;