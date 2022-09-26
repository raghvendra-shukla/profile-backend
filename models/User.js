const mongoose=require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});
const user=mongoose.model("user",UserSchema);
// by creating indexes values are not repeat
// user.createIndexes();
module.exports=user;