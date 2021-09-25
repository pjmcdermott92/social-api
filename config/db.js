const mongoose = require('mongoose');
const config = require('config');

const DB = config.get('MongoURL');

const connectDB = async () => {
    try {
        await mongoose.connect(DB);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
