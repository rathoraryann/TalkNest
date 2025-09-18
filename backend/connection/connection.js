const mongoose = require('mongoose');

const connection = async() =>{
    await mongoose.connect(process.env.MONGO_URI)
}

module.exports = connection;