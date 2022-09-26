const mongoose=require("mongoose");
const { Schema } = mongoose;

const ProfileSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    name:{
        type:String,
        require:true
    },
    degree:{
        type:String,
        require:true
    },
    languages:{
        type:String,
        require:true
    },
    exprience:{
        type:String,
        require:true
    },
    projects:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model("Profile",ProfileSchema);