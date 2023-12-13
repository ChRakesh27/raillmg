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
import {
  electric,
  engineering,
  s_t,
} from '../../../shared/Departmentcolumns/columns';

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
  dataSet = {
    engineering: [],
    s_t: [],
    electric: []
  }
  private hotRegisterer = new HotTableRegisterer();
  tables = [
    { id: 'engineering', columns: engineering },
    { id: 's&t', columns: s_t },
    { id: 'electric', columns: electric },
  ];
  hotSettings: Handsontable.GridSettings = {
    rowHeaders: true,
    colWidths: '150',
    height: 'auto',
    multiColumnSorting: true,
    manualColumnResize: true,
    filters: true,
    columnHeaderHeight: 50,
    manualColumnMove: true,
    dropdownMenu: ['filter_by_value', 'filter_operators', 'filter_action_bar'],
  };

  constructor(private service: AppService, private ls: localStorageService) { }

  ngOnInit() {
    this.userData = this.ls.getUser();
    this.service.getAllMachineRoll().subscribe((data) => {
      const engg = this.hotRegisterer.getInstance(this.tables[0]['id']);
      const s_t = this.hotRegisterer.getInstance(this.tables[1]['id']);
      const elec = this.hotRegisterer.getInstance(this.tables[2]['id']);

      for (let item of data) {
        let { avl_end, avl_start, _id, user, ...rest } = item;
        const customData = {
          date: DateTime.fromISO(avl_start).toFormat('MM/dd/yyyy'),
          startTime: this.timeFormate(avl_start),
          endTime: this.timeFormate(avl_end),
        }
        if (item.department === 'ENGINEERING') {
          this.dataSet['engineering'].push({ ...customData, ...rest })
        }
        else if (item.department === 'S&T') {
          this.dataSet['s_t'].push({ ...customData, ...rest })

        }
        else if (item.department === 'ELECTRIC') {
          this.dataSet['electric'].push({ ...customData, ...rest })

        }
      }

      engg.updateData(this.dataSet.engineering);
      s_t.updateData(this.dataSet.s_t);
      elec.updateData(this.dataSet.electric);
    });
  }

  timeFormate(params) {
    let dt = DateTime.fromISO(params);
    return dt.toLocaleString(DateTime.TIME_SIMPLE);
  }

  onEdit(data) {
    console.log('🚀 ~ data:', data);
  }

  onExcelDownload(id) {
    const hot = this.hotRegisterer.getInstance(id);
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

// edit:
//             item.department == this.userData['department']
//                item.department
//               : '',
