const mongoose =require("mongoose");

const dbConnection=async()=>{
    
    try {
        // AnsukXqdnhrXUxy5
        // const db=await mongoose.connect("mongodb://localhost:27017/gym");
        await mongoose.connect(process.env.MONGO_URL);
        console.log("database is Connected");
    } catch (error) {
        console.log("Failed to Connect DataBase",error);
    }
}

module.exports=dbConnection