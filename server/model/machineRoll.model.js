const mongoose = require("mongoose")

const Schema = mongoose.Schema

const machineRollSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    user: { type: String },
    department: { type: String },
    section: { type: String },
    stationTo: { type: String },
    stationFrom: { type: String },
    direction: { type: String },
    lineNo: { type: String },
    machine: { type: String },
    series: { type: String },
    time: { type: Number },
    avl_slot_to: { type: String },
    avl_slot_from: { type: String },
    quantum: { type: String },
    deputedSupervisor: { type: String },
    resources: { type: String },
    crew: { type: Number },
    loco: { type: Number },
    board: { type: String },
    typeOfWork: { type: String },
    ni: { type: String },
    yard: { type: String },
    remarks: { type: String },
    approval: { type: String },
    s_tStaff: { type: String },
    tpcStaff: { type: String },
    point: { type: String },
    tower: { type: String },
}, {
    versionKey: false
})



const machineRoll = mongoose.model("machineRoll", machineRollSchema);
module.exports = machineRoll
