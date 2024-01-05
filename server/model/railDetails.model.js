const mongoose = require("mongoose")

const Schema = mongoose.Schema

const railDetailsSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    board: { type: String },
    section: { type: String, unique: true },
    directions: { type: Array },
    slots: { type: Object },
    stations: { type: Array },
    mps: { type: Number, default: 0 }
}, {
    versionKey: false
})






const railDetails = mongoose.model("railDetails", railDetailsSchema);
module.exports = railDetails