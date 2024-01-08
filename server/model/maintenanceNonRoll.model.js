const mongoose = require("mongoose")

const Schema = mongoose.Schema

const LogSchema = new Schema({
    updatedBy: { type: String },
    updatedAt: { type: Date },
    field: { type: String },
    oldValue: { type: String },
    newValue: { type: String }
}, {
    versionKey: false
})

const maintenanceNonRollSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    date: { type: String },
    department: { type: String },
    section: { type: String },
    stationTo: { type: String },
    stationFrom: { type: String },
    direction: { type: String },
    lineNo: { type: String },
    machine: { type: String },
    series: { type: String },
    dmd_duration: { type: Number },
    avl_duration: { type: Number },
    avl_start: { type: String },
    avl_end: { type: String },
    quantum: { type: String },
    deputedSupervisor: { type: String },
    resources: { type: String },
    crew: { type: Number, default: 0 },
    loco: { type: Number, default: 0 },
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
    grant_status: { type: String, default: 'Pending' },
    time_granted: { type: String },
    status: { type: String },
    Avl_status: { type: Boolean, default: true },
    logs: { type: [LogSchema], default: [] },
    createdBy: { type: String },
    createdAt: { type: Date },
    updatedBy: { type: String },
    updatedAt: { type: Date },
    caution: { type: Array },
    cancelTrain: { type: String },
}, {
    versionKey: false
})



const maintenanceNonRoll = mongoose.model("machineRoll", maintenanceNonRollSchema);
module.exports = maintenanceNonRoll
