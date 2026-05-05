const mongoose = require("mongoose");

const databaseConnection = async()=>{
   try{
    await mongoose.connect(process.env.DB_URI);
    console.log("database connected ");
   } 
   catch(err){
     console.log("MongoDB connection error:", err);
     process.exit(1);
   }

   
    
    
    
};
module.exports = databaseConnection;
