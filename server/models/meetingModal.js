const mongoose=require("mongoose")

const MeetingSchema=new mongoose.Schema({
    roomId:{
        type:String,
        required:true,
        unique:true
    },
    hostId:{
        type:String,
        required:true,
    },
    participantsId:[{
        type:String,

    }]
},{timestamps:true})

const MeetingModel=mongoose.models.Meeting||mongoose.model("Meeting",MeetingSchema)

module.exports=MeetingModel