const Listing = require("../models/listings.js");
const data = require("./data.js");
const mongoose = require("mongoose");
// console.log(data.data);

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    await mongoose.connect(MONGO_URL);
};

main()
.then(res => {
    console.log("connection successful");
})
.catch(err => {
    console.log("error");
});

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("data was initialized!");
};

initDB(); 