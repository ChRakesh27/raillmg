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
  colHeaders = [];
  private hotRegisterer = new HotTableRegisterer();
  id = 'hotInstance';
  hotSettings: Handsontable.GridSettings = {
    rowHeaders: true,
    colHeaders: [
      'edit',
      'date',
      'startTime',
      'endTime',
      'department',
      'section',
      'stationTo',
      'stationFrom',
      'direction',
      'lineNo',
      'machine',
      'series',
      'typeOfWork',
      'time',
      'quantum',
      'deputedSupervisor',
      'resources',
      'crew',
      'loco'
    ],
    afterOnCellMouseDown: (event, coords, TD) => {
      // if (event.realTarget.nodeName.toLowerCase() === 'button' && coords.col === 1) {
      console.log(event);
      // }
    },

    columns: [
      {
        data: 'edit',
        readOnly: true,
        editor: false,
        renderer: function (instance, td, row, col, prop, value, cellProperties) {
          if (value) {
            td.innerHTML = `<button class="btn btn-primary" (click)='onEdit(${value})'> Edit </button>`;
          }
        }
      },
      { data: 'date' },
      { data: 'startTime' },
      { data: 'endTime' },
      { data: 'department' },
      { data: 'section' },
      { data: 'stationTo' },
      { data: 'stationFrom' },
      { data: 'direction' },
      { data: 'lineNo' },
      { data: 'machine' },
      { data: 'series' },
      { data: 'typeOfWork' },
      { data: 'time' },
      { data: 'quantum' },
      { data: 'deputedSupervisor' },
      { data: 'resources' },
      { data: 'crew' },
      { data: 'loco' }
    ],
    colWidths: '150',
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
        let { avl_slot_to, avl_slot_from, _id, user, ...rest } = item;
        return {
          edit:
            item.department == this.userData['department']
              ? item.department
              : '',
          date: DateTime.fromISO(avl_slot_from).toFormat(
            'MM/dd/yyyy'
          ),
          startTime: this.timeFormate(avl_slot_from),
          endTime: this.timeFormate(avl_slot_to),
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
