const commonColumns = [
    { data: 'department', title: 'DEPARTMENT' },
    { data: 'date', title: 'DATE' },
    { data: "board", title: "BOARD" },
    { data: "section", title: "SECTION" },
    { data: 'startTime', title: 'AVAILABLE SLOT START TIME' },
    { data: 'endTime', title: 'AVAILABLE SLOT END TIME' },
    { data: 'stationTo', title: 'STATION TO' },
    { data: 'stationFrom', title: 'STATION FROM' },
    { data: 'direction', title: 'DIRECTION' },
    { data: 'series', title: 'SERIES' },
    { data: "ni", title: "Whether NI work/PNI work or Non-NI Work" },
    { data: "yard", title: "Yard" },
    { data: "typeOfWork", title: "TYPE OF WORK" },
    { data: "time", title: "BLOCK DEMAND HOURS" },
    { data: "quantum", title: "QUANTUM" },
    { data: "deputedSupervisior", title: "DEPUTED SUPERVISIOR" },
    { data: "resources", title: "RESOURCES" },
    { data: "typeOfWork", title: "TYPE OF WORK" },
    { data: "time", title: "BLOCK DEMAND HOURS" },
    { data: "quantum", title: "QUANTUM" },
    { data: "deputedSupervisior", title: "DEPUTED SUPERVISIOR" },
    { data: "resources", title: "RESOURCES" },
    { data: "typeOfWork", title: "TYPE OF WORK" },
    { data: "time", title: "BLOCK DEMAND HOURS" },
    { data: "quantum", title: "QUANTUM" },
    { data: "deputedSupervisior", title: "DEPUTED SUPERVISIOR" },
    { data: "resources", title: "RESOURCES" },
    { data: "approval", title: "APPROVAL REQUIRED OR NOT " },
]

const doubleColumns = [
    { data: "lineNo", title: "KM/LINE" },
    { data: "loco", title: "LOCO" },
    { data: "crew", title: "CREW" },
    { data: "remarks", title: " REMARKS IF ANY" },
    { data: "s_tStaff", title: "S&T STAFF REQUIRED (YES/NO)" },
    { data: "lineNo", title: "KM/LINE" },
    { data: "loco", title: "LOCO" },
    { data: "crew", title: "CREW" },
    { data: "remarks", title: " REMARKS IF ANY" },
    { data: "s_tStaff", title: "S&T STAFF REQUIRED (YES/NO)" }
]
export const engineering = [
    ...commonColumns,
    { data: "machine", title: "Machine Type & No." },
    ...doubleColumns,
    { data: "tpcStaff", title: "TPC STAFF REQUIRED (YES/NO)" },
]
export const s_t = [
    ...commonColumns,
    { data: "point", title: "POINT/BPAC/OTHERS" },
    { data: "tpcStaff", title: "TPC STAFF REQUIRED (YES/NO)" },
]
export const electric = [
    ...commonColumns,
    ...doubleColumns,
    { data: "tower", title: "TOWER WAGON/MATERIAL TRAIN" }
]

