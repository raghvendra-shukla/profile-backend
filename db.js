const mongoose = require('mongoose');

const password = encodeURIComponent("Raghvendra@123");
const mongoURI=`mongodb+srv://Raghvendra-Shukla:${password}@raghvendra-cluster.nub3x7g.mongodb.net/?retryWrites=true&w=majority`;

const connectToMongo=()=>{
    mongoose.connect(mongoURI)
    .then(()=>console.log('connected to Mongo'))
    .catch(e=>console.log(e));
}

module.exports=connectToMongo;