const mongoose = require("mongoose")

const Schema = mongoose.Schema

const machineRollSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    user: { type: String, required: true },
    selection: { type: String, required: true },
    station: { type: String, required: true },
    direction: { type: String, required: true },
    lineNo: { type: String, required: true },
    machine: { type: String, required: true },
    series: { type: String, required: true },
    aboutWork: { type: String, required: true },
    time: { type: String, required: true },
    availableSlot: { type: String, required: true },
    quantum: { type: String, required: true },
    deputedSupervisor: { type: String, required: true },
    resources: { type: String, required: true }
}, {
    versionKey: false
})



const machineRoll = mongoose.model("machineRoll", machineRollSchema);
module.exports = machineRoll
