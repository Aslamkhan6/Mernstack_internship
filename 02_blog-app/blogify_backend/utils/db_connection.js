const mongoose = require('mongoose')
require("dotenv").config()
const uri = process.env.DB_URL
console.log(uri)

const  dbconnection = async ()=>{
    try {
        await mongoose.connect(uri);
        console.log('data base connected  sucessfully....... ');
    } catch (error) {
        console.log(`connection error  ${error}`);
        process.exit();
    }
}
module.exports = dbconnection