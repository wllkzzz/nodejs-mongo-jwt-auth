const { Schema, model } = require("mongoose");


const UserSchema = new Schema({
    email: {type: String, unique: true, requried: true},
    password: {type: String, requried: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String}
})

module.exports = model("User", UserSchema)