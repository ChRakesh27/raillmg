import { machineType } from "./machineType";
import { sectionList } from "./section-list";
import { stationList } from "./station-list";

export const columns = [
    { data: "_id", title: "id" },
    { data: 'department', title: 'DEPARTMENT' },
    { data: 'date', title: 'DATE' },
    { data: "board", title: "BOARD", type: 'select', selectOptions: ['BD1', 'BD2', 'BD3', 'BD4', 'BD5'] },
    { data: "section", title: "SECTION", type: 'select', selectOptions: sectionList },
    { data: 'avl_start', title: 'AVAILABLE SLOT START TIME' },
    { data: 'avl_end', title: 'AVAILABLE SLOT END TIME' },
    { data: 'stationTo', title: 'STATION TO', type: 'select', selectOptions: stationList },
    { data: 'stationFrom', title: 'STATION FROM', type: 'select', selectOptions: stationList },
    { data: 'direction', title: 'DIRECTION', type: 'select', selectOptions: ['UP', 'DN', 'BOTH'] },
    { data: 'series', title: 'SERIES' },
    { data: "ni", title: "Whether NI work/PNI work or Non-NI Work" },
    { data: "yard", title: "Yard" },
    { data: "lineNo", title: "KM/LINE" },
    { data: "machine", title: "Machine Type & No.", type: 'select', selectOptions: machineType },
    { data: "typeOfWork", title: "TYPE OF WORK" },
    { data: "time", title: "BLOCK DEMAND HOURS" },
    { data: "quantum", title: "QUANTUM" },
    { data: "deputedSupervisior", title: "DEPUTED SUPERVISIOR" },
    { data: "resources", title: "RESOURCES" },
    { data: "loco", title: "LOCO" },
    { data: "crew", title: "CREW" },
    { data: "remarks", title: " REMARKS IF ANY" },
    { data: "approval", title: "APPROVAL REQUIRED OR NOT " },
    { data: "s_tStaff", title: "S&T STAFF REQUIRED (YES/NO)" },
    { data: "tpcStaff", title: "TPC STAFF REQUIRED (YES/NO)" },
    { data: "point", title: "POINT/BPAC/OTHERS" },
    { data: "tower", title: "TOWER WAGON/MATERIAL TRAIN" },
];