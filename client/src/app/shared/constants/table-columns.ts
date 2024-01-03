import Handsontable from 'handsontable';
import { machineType } from './machineType';
import { sectionList } from './section-list';
import { stationList } from './station-list';
import { ILog } from '../model/machineRoll.model';

const LogInfoRender = (
  instance: Handsontable.Core,
  TD: HTMLTableCellElement,
  row: number,
  col: number,
  prop: string | number,
  value: ILog[],
  cellProperties: Handsontable.CellProperties
) => {
  TD.className = (row % 2 == 0 ? 'evenCell' : 'oddCell') + ' wraptext';
  let text = [];
  if (!value?.length) return;
  for (let log of value) {
    text.push(
      `user ${log.updatedBy} modified ${log.field} from ${log.oldValue} to ${log.newValue}.`
    );
  }
  TD.innerHTML = text.join(' | ');
  cellProperties.comment = {
    value: text.join('\n'),
    readOnly: true,
  };
};

export const columns: Handsontable.ColumnSettings[] = [
  { data: '_id', title: 'id' },
  {
    data: 'date',
    title: 'DATE',
    type: 'date',
    dateFormat: 'dd/MM/YYYY',
    correctFormat: true,
  },
  { data: 'department', title: 'DEPARTMENT', readonly: true, editor: false },
  {
    data: 'board',
    title: 'BOARD',
    type: 'select',
    selectOptions: ['BG1', 'BG2', 'BG3', 'BG4', 'BG5'],
  },
  {
    data: 'section',
    title: 'SECTION',
    type: 'select',
    selectOptions: sectionList,
  },
  { data: 'avl_start', title: ' SLOT START' },
  { data: 'avl_end', title: ' SLOT END' },
  { data: 'avl_duration', title: 'AVL DURATION' },
  { data: 'dmd_duration', title: 'DMD DURATION' },
  {
    data: 'machine',
    title: 'Machine Type',
    type: 'select',
    selectOptions: machineType,
  },
  {
    data: 'stationTo',
    title: 'STATION TO',
    type: 'select',
    selectOptions: stationList,
  },
  {
    data: 'stationFrom',
    title: 'STATION FROM',
    type: 'select',
    selectOptions: stationList,
  },
  {
    data: 'direction',
    title: 'DIRECTION',
    type: 'select',
    selectOptions: ['UP', 'DN', 'BOTH'],
  },
  { data: 'series', title: 'SERIES' },
  { data: 'ni', title: 'Whether NI work/PNI work or Non-NI Work' },
  { data: 'yard', title: 'Yard' },
  { data: 'lineNo', title: 'KM/LINE' },
  { data: 'typeOfWork', title: 'TYPE OF WORK' },
  { data: 'quantum', title: 'QUANTUM' },
  { data: 'deputedSupervisor', title: 'DEPUTED SUPERVISOR' },
  { data: 'resources', title: 'RESOURCES' },
  { data: 'loco', title: 'LOCO' },
  { data: 'crew', title: 'CREW' },
  { data: 'remarks', title: ' REMARKS IF ANY' },
  { data: 'approval', title: 'APPROVAL' },
  { data: 's_tStaff', title: 'S&T STAFF' },
  { data: 'tpcStaff', title: 'TPC STAFF' },
  { data: 'point', title: 'POINT/BPAC/OTHERS' },
  { data: 'tower', title: 'TOWER WAGON/MATERIAL TRAIN' },
  {
    data: 'logs',
    title: 'INFORMATION',
    editor: false,
    width: 400,
    renderer: LogInfoRender,
  },
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
