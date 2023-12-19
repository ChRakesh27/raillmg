export interface IMachineRoll {
    _id: String,
    user: String,
    department: String,
    selection: String,
    station: String,
    direction: String,
    lineNo: String,
    machine: String,
    series: String,
    aboutWork: String,
    dmd_duration: String,
    availableSlot: IAvailableSlots,
    quantum: String,
    deputedSupervisor: String,
    resources: String
}

export interface IAvailableSlots {
    startDate: String;
    endDate: String
}