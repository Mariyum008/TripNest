const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect(MONGO_URL);
}
const  initDB = async () =>  {
    await Listing.deleteMany({}); //deling already stored data, testing data 
    initData.data = initData.data.map((obj) => ({
        ...obj,
         owner : '66cb3069393ca1595f0d78e2', 
        }));
    await Listing.insertMany(initData.data); //inserting new data
    console.log("data was initialized");
}

initDB();