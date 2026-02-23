require("dotenv").config();
const Listing = require("../models/listings.js");
const data = require("./data.js");
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGODB_URI;

console.log(MONGO_URI);

async function main() {
    await mongoose.connect(MONGO_URI);
};

main()
.then(res => {
    console.log("connection successful");
})
.catch(err => {
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("data was initialized!");
};

initDB(); 