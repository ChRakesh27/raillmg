import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { DateTime } from 'luxon';
import { localStorageService } from '../../../shared/service/local-storage.service';
import { HotTableModule, HotTableRegisterer } from '@handsontable/angular';
import { registerAllModules } from 'handsontable/registry'
import Handsontable from 'handsontable';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';

registerAllModules()
@Component({
  selector: 'app-machine-roll',
  standalone: true,
  imports: [CommonModule, HotTableModule],
  templateUrl: './machine-roll.component.html',
  styleUrl: './machine-roll.component.css',
})
export class MachineRollComponent implements OnInit {
  userData = {};
  machineRolls = [];
  dataset: any[] = [];
  filters = []
  colHeaders = [];
  private hotRegisterer = new HotTableRegisterer();
  id = 'hotInstance';
  hotSettings: Handsontable.GridSettings = {
    rowHeaders: true,
    colWidths: "150",
    height: "auto",
    multiColumnSorting: true,
    manualColumnResize: true,
    filters: true,
    manualColumnMove: true,
    dropdownMenu: [
      'filter_by_value',
      'filter_operators',
      'filter_action_bar',
    ]
  };


  constructor(private service: AppService, private ls: localStorageService) { }

  ngOnInit(): void {

    this.userData = this.ls.getUser();
    this.service.getMachineRoll(this.userData['_id']).subscribe((data) => {
      this.machineRolls = data;

      this.dataset = data.map((item) => {
        let { availableSlot, _id, user, ...rest } = item;
        return {
          date: DateTime.fromISO(availableSlot['startDate']).toISODate(),
          startTime: this.timeFormate(availableSlot['startDate']),
          endTime: this.timeFormate(availableSlot['endDate']),
          ...rest,
        };
      });
      this.colHeaders = Object.keys(this.dataset[0])
    });
  }


  timeFormate(params) {
    let dt = DateTime.fromISO(params);
    return dt.toLocaleString(DateTime.TIME_SIMPLE);
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

  onPdfDownload() {

  }

}
