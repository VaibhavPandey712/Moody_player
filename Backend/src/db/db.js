import mongoose from "mongoose";

function connectToDB(){
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Database Connected");
    })
}
export default connectToDB;