const mongoose = require("mongoose")

const Schema = mongoose.Schema

const loginSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
}, {
    versionKey: false
})


const registerSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
}, {
    versionKey: false
})



const login = mongoose.model("login", loginSchema);
const register = mongoose.model("login", registerSchema);
module.exports = { login, register }