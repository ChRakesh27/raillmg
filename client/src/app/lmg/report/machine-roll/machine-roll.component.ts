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
  editData = {};
  dataSet = []
  colHeaders = [
    {
      data: 'edit', title: 'Edit',
      renderer: (instance, TD, row, col, prop, value, cellProperties) => {
        if (value) {
          TD.innerHTML = `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button>`
        } else {
          TD.innerHTML = ''
        }
        return TD;
      }
    },
    { data: 'department', title: 'DEPARTMENT' },
    { data: 'date', title: 'DATE' },
    { data: "board", title: "BOARD" },
    { data: "section", title: "SECTION" },
    { data: 'avl_start', title: 'AVAILABLE SLOT START TIME' },
    { data: 'avl_end', title: 'AVAILABLE SLOT END TIME' },
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
    afterOnCellMouseDown: (event, coords, TD) => {
      const target = event.target as HTMLElement
      if (target.nodeName.toLowerCase() === 'button' && coords.col === 0) {
        console.log('->>>>>>>>>>>>>', this.dataSet[coords.row]);
        this.editData = this.dataSet[coords.row]
      }
    },
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
      this.dataSet = data.map((item) => {

        return {
          edit: item.department === this.userData["department"] ? true : false,
          ...item
        };
      });
      hot.updateData(this.dataSet);
    });
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
