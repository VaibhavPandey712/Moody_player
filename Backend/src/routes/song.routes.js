import express from "express";
import multer from "multer";
import uploadFile from "../service/storage.service.js";
import songModel from "../models/song.model.js"



const router = express.Router();
const upload=multer({storage:multer.memoryStorage()});



router.post("/songs", upload.single("audio"), async(req, res) => {
    console.log(req.body);
    console.log(req.file);
    const fileData=await uploadFile(req.file);
    const song=await songModel.create({
        title:req.body.title,
        artist:req.body.artist,
        audio:fileData.url,
        mood:req.body.mood
    })
    res.json({message:"Song Added",song:song})
})

router.get("/songs",async(req,res)=>{
    const {mood}=req.query;
    const songs=await songModel.find({
        mood:mood
    })

    res.status(200).json({
        message:"Success",
        song:songs
    })
})



export default router;