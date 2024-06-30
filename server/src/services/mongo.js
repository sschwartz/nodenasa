const mongoose = require('mongoose');

require('dotenv').config();
// const MONGO_URL = "mongodb+srv://dbUser:Z7whc57VGcSPLmyw@learningnode.upev5dp.mongodb.net/nasa?retryWrites=true&w=majority";
const MONGO_URL = process.env.MONGO_URL;


mongoose.connection.once('open', () => {
    console.log('Mongo ready');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
})

async function mongoConnect(){
    await mongoose.connect(MONGO_URL, {})
};

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };