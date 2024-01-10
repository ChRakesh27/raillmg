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
    dateFormat: 'DD/MM/YYYY',
    correctFormat: true,
    width: 95,
  },
  {
    data: 'department',
    title: 'DEPARTMENT',
    readonly: true,
    editor: false,
    width: 110,
  },
  {
    data: 'board',
    title: 'BOARD',
    type: 'select',
    selectOptions: ['BG1', 'BG2', 'BG3', 'BG4', 'BG5'],
    width: 70,
  },
  {
    data: 'section',
    title: 'SECTION',
    type: 'select',
    selectOptions: sectionList,
    width: 80,
  },
  { data: 'avl_start', title: ' SLOT START', width: 100 },
  { data: 'avl_end', title: ' SLOT END', width: 90 },
  { data: 'avl_duration', title: 'AVL DUR...', width: 100 },
  { data: 'dmd_duration', title: 'DMD DUR...', width: 100 },
  {
    data: 'machine',
    title: 'Machine Type',
    type: 'select',
    selectOptions: machineType,
    width: 110,
  },
  {
    data: 'stationTo',
    title: 'STATION TO',
    type: 'select',
    selectOptions: stationList,
    width: 100,
  },
  {
    data: 'stationFrom',
    title: 'STATION FROM',
    type: 'select',
    selectOptions: stationList,
    width: 120,
  },
  {
    data: 'direction',
    title: 'DIRECTION',
    type: 'select',
    selectOptions: ['UP', 'DN', 'BOTH'],
    width: 90,
  },
  { data: 'series', title: 'SERIES', width: 80 },
  { data: 'ni', title: ' NI/Non-NI Work', width: 130 },
  { data: 'yard', title: 'Yard', width: 70 },
  { data: 'lineNo', title: 'KM/LINE', width: 90 },
  { data: 'typeOfWork', title: 'WORK TYPE', width: 110 },
  { data: 'quantum', title: 'QUANTUM', width: 100 },
  { data: 'deputedSupervisor', title: 'DEPUTED SUP...', width: 120 },
  { data: 'resources', title: 'RESOURCES', width: 100 },
  { data: 'loco', title: 'LOCO', width: 70 },
  { data: 'crew', title: 'CREW', width: 70 },
  { data: 'remarks', title: ' REMARKS', width: 90 },
  { data: 'approval', title: 'APPROVAL', width: 90 },
  { data: 's_tStaff', title: 'S&T STAFF', width: 90 },
  { data: 'tpcStaff', title: 'TPC STAFF', width: 90 },
  { data: 'point', title: 'POINT/BPAC/O..', width: 130 },
  { data: 'tower', title: 'TOWER/MAT...', width: 110 },
  { data: 'cancelTrain', title: 'Train Cancel...', width: 110 },
  {
    data: 'logs',
    title: 'EDIT HISTORY',
    editor: false,
    width: 300,
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
