import { machineType } from "./machineType";
import { sectionList } from "./section-list";
import { stationList } from "./station-list";

export const columns = [
    { data: "_id", title: "id" },
    {
        data: 'date', title: 'DATE', type: 'date', dateFormat: 'MM/DD/YYYY', correctFormat: true,
    },
    { data: 'department', title: 'DEPARTMENT', readonly: true, editor: false, },
    { data: "board", title: "BOARD", type: 'select', selectOptions: ['BG1', 'BG2', 'BG3', 'BG4', 'BG5'] },
    { data: "section", title: "SECTION", type: 'select', selectOptions: sectionList },
    { data: 'avl_start', title: ' SLOT START' },
    { data: 'avl_end', title: ' SLOT END' },
    { data: "avl_duration", title: "AVL DURATION" },
    { data: "dmd_duration", title: "DEMAND DURATION" },
    { data: "machine", title: "Machine Type & No.", type: 'select', selectOptions: machineType },
    { data: 'stationTo', title: 'STATION TO', type: 'select', selectOptions: stationList },
    { data: 'stationFrom', title: 'STATION FROM', type: 'select', selectOptions: stationList },
    { data: 'direction', title: 'DIRECTION', type: 'select', selectOptions: ['UP', 'DN', 'BOTH'] },
    { data: 'series', title: 'SERIES' },
    { data: "ni", title: "Whether NI work/PNI work or Non-NI Work" },
    { data: "yard", title: "Yard" },
    { data: "lineNo", title: "KM/LINE" },
    { data: "typeOfWork", title: "TYPE OF WORK" },
    { data: "quantum", title: "QUANTUM" },
    { data: "deputedSupervisor", title: "DEPUTED SUPERVISOR" },
    { data: "resources", title: "RESOURCES" },
    { data: "loco", title: "LOCO" },
    { data: "crew", title: "CREW" },
    { data: "remarks", title: " REMARKS IF ANY" },
    { data: "approval", title: "APPROVAL" },
    { data: "s_tStaff", title: "S&T STAFF (YES/NO)" },
    { data: "tpcStaff", title: "TPC STAFF (YES/NO)" },
    { data: "point", title: "POINT/BPAC/OTHERS" },
    { data: "tower", title: "TOWER WAGON/MATERIAL TRAIN" },
];

// datePickerConfig: {
//     // First day of the week (0: Sunday, 1: Monday, etc)
//     firstDay: 0,
//         showWeekNumber: true,
//             disableDayFn(date) {
//         // Disable Sunday and Saturday
//         return date.getDay() === 0 || date.getDay() === 6;
//     }
// }