const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

// console.log(typeof passportLocalMongoose);

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;