import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { DateTime } from 'luxon';
import { localStorageService } from '../../../shared/service/local-storage.service';
import { HotTableModule, HotTableRegisterer } from '@handsontable/angular';
import { registerAllModules } from 'handsontable/registry';
import Handsontable from 'handsontable';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';

registerAllModules();
@Component({
  selector: 'app-machine-roll',
  standalone: true,
  imports: [CommonModule, HotTableModule],
  templateUrl: './machine-roll.component.html',
  styleUrl: './machine-roll.component.css',
})
export class MachineRollComponent implements OnInit {
  userData = {};
  filters = [];
  colHeaders = [
    { data: 'date', title: 'DATE' },
    { data: "board", title: "BOARD" },
    { data: 'department', title: 'DEPARTMENT' },
    { data: "section", title: "SECTION" },
    { data: 'startTime', title: 'AVAILABLE SLOT START TIME' },
    { data: 'endTime', title: 'AVAILABLE SLOT END TIME' },
    { data: 'stationTo', title: 'STATION TO' },
    { data: 'stationFrom', title: 'STATION FROM' },
    { data: 'direction', title: 'DIRECTION' },
    { data: 'series', title: 'SERIES' },
    { data: "ni", title: "Whether NI work/PNI work or Non-NI Work" },
    { data: "yard", title: "Yard" },
    { data: "lineNo", title: "KM/LINE" },
    { data: "machine", title: "Machine Type & No." },
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
    { data: "tower", title: "TOWER WAGON/MATERIAL TRAIN" }
  ];



  private hotRegisterer = new HotTableRegisterer();
  id = 'hotInstance';
  hotSettings: Handsontable.GridSettings = {
    rowHeaders: true,
    colWidths: '150',
    columns: this.colHeaders,
    height: 'auto',
    multiColumnSorting: true,
    manualColumnResize: true,
    filters: true,
    manualColumnMove: true,
    dropdownMenu: ['filter_by_value', 'filter_operators', 'filter_action_bar'],
  };

  constructor(private service: AppService, private ls: localStorageService) { }


  ngOnInit() {
    this.userData = this.ls.getUser();
    this.service.getAllMachineRoll().subscribe((data) => {
      const hot = this.hotRegisterer.getInstance(this.id);
      const dataSet = data.map((item) => {
        let { avl_end, avl_start, _id, user, ...rest } = item;
        return {

          date: DateTime.fromISO(avl_start).toFormat(
            'MM/dd/yyyy'
          ),
          startTime: this.timeFormate(avl_start),
          endTime: this.timeFormate(avl_end),
          ...rest,
        };
      });
      hot.updateData(dataSet);
    });
  }

  timeFormate(params) {
    let dt = DateTime.fromISO(params);
    return dt.toLocaleString(DateTime.TIME_SIMPLE);
  }

  onEdit(data) {
    console.log("🚀 ~ data:", data)

  }

  onExcelDownload() {
    const hot = this.hotRegisterer.getInstance(this.id);
    const exportPlugin = hot.getPlugin('exportFile');
    const exportedString = exportPlugin.exportAsString('csv', {
      bom: false,
      columnHeaders: true,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      rowDelimiter: '\r\n',
    });

    const jsonData = Papa.parse(exportedString);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dates');
    XLSX.utils.sheet_add_aoa(worksheet, jsonData.data);
    XLSX.writeFile(workbook, 'MachineRolls.xlsx');
  }

  onPdfDownload() { }
}

// {
//   data: 'edit',
//   readOnly: true,
//   editor: false,
//   renderer: function (instance, td, row, col, prop, value, cellProperties) {
//     if (value) {
//       td.innerHTML = `<button class="btn btn-primary" (click)='onEdit(${value})'> Edit </button>`;
//     }
//   }
// },

// columns: [
//   { data: 'date' },
//   { data: 'startTime' },
//   { data: 'endTime' },
//   { data: 'department' },
//   { data: 'section' },
//   { data: 'stationTo' },
//   { data: 'stationFrom' },
//   { data: 'direction' },
//   { data: 'lineNo' },
//   { data: 'machine' },
//   { data: 'series' },
//   { data: 'typeOfWork' },
//   { data: 'time' },
//   { data: 'quantum' },
//   { data: 'deputedSupervisor' },
//   { data: 'resources' },
//   { data: 'crew' },
//   { data: 'loco' }
// ],

// edit:
//             item.department == this.userData['department']
//                item.department
//               : '',

