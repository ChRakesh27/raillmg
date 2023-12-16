import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { localStorageService } from '../../../shared/service/local-storage.service';
import { HotTableModule, HotTableRegisterer } from '@handsontable/angular';
import { registerAllModules } from 'handsontable/registry';
import Handsontable from 'handsontable';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { ToastService } from '../../../shared/toast/toast.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvailableSlotsConfig } from '../../../shared/constants/available-slots';
import { DateTime } from 'luxon';
import { LmgFormComponent } from "../../../shared/lmg-form/lmg-form.component";
import { stationList } from '../../../shared/constants/station-list';

registerAllModules();
@Component({
  selector: 'app-machine-roll',
  standalone: true,
  templateUrl: './machine-roll.component.html',
  styleUrl: './machine-roll.component.css',
  imports: [CommonModule, HotTableModule, FormsModule, LmgFormComponent, ReactiveFormsModule]
})
export class MachineRollComponent implements OnInit {
  userData = {};
  machineForm: FormGroup;
  dataSet = []
  selectedRow = {}
  usersInfo = {
    createBy: { name: '', dateTime: "" }, editBy: []
  }
  colHeaders = [
    { data: "_id", title: "id" },
    {
      data: 'edit', title: 'EDIT',
      renderer: (instance, TD, row, col, prop, value, cellProperties) => {
        if (value) {
          TD.innerHTML = `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button>`
        } else {
          TD.innerHTML = ''
        }
        return TD;
      }
    },
    {
      data: 'info', title: 'INFO',
      renderer: (instance, TD, row, col, prop, value, cellProperties) => {
        TD.innerHTML = `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#infoStaticBackdrop">Info</button>`
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
    { data: "tower", title: "TOWER WAGON/MATERIAL TRAIN" },

  ];

  private hotRegisterer = new HotTableRegisterer();
  id = 'hotInstance';
  hotSettings: Handsontable.GridSettings = {
    rowHeaders: true,
    afterOnCellMouseDown: (event, coords, TD) => {
      const target = event.target as HTMLElement
      const hot = this.hotRegisterer.getInstance(this.id);
      let _id = hot.getDataAtRow(coords.row)[0]
      const data = this.dataSet.find((item) => item._id === _id)
      if (target.nodeName.toLowerCase() === 'button' && coords.col === 1) {
        const { date, avl_start, avl_end, ...rest } = data
        data['availableSlot'] = `${date} ${avl_start} to ${avl_end} hrs (${DateTime.fromFormat(date, 'MM/dd/yyyy').toFormat('ccc').toUpperCase()})`
        this.selectedRow = {
          ...data,
          crewCheckbox: data['crew'] === 0 ? false : true,
          locoCheckbox: data['loco'] === 0 ? false : true
        }
        this.usersInfo = data['info']
      }
      else if (target.nodeName.toLowerCase() === 'button' && coords.col === 2) {
        this.usersInfo = data['info']
      }
    },
    colWidths: '150',
    columns: this.colHeaders,
    height: 'auto',
    multiColumnSorting: true,
    manualColumnResize: true,
    filters: true,
    manualColumnMove: true,
    editor: false,
    dropdownMenu: ['filter_by_value', 'filter_operators', 'filter_action_bar'],
    hiddenColumns: {
      columns: [0],
      indicators: false
    }
  };

  constructor(
    private service: AppService,
    private ls: localStorageService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) { }


  ngOnInit() {
    this.machineForm = this.fb.group({})
    this.userData = this.ls.getUser();
    this.service.getAllMachineRoll().subscribe((data) => {
      const hot = this.hotRegisterer.getInstance(this.id);
      this.dataSet = data.map((item) => {
        return {
          edit: item.department === this.userData["department"] || this.userData["department"] === 'OPERATING' ? true : false,
          ...item
        };
      });
      hot.updateData(this.dataSet);
    });
  }

  onUpdate() {

    const dt = DateTime.now()
    let changes = ''
    let data = this.machineForm.value
    for (let key in data) {
      if (this.selectedRow[key] !== data[key] && this.selectedRow[key] && data[key]) {
        changes += `${key} (${this.selectedRow[key]} to ${data[key]}), `
      }
    }


    this.usersInfo.editBy.push({
      name: this.userData['username'],
      dateTime: dt.toLocaleString(DateTime.DATETIME_SHORT),
      changes
    })


    let payload = {
      info: {
        ...this.usersInfo
      },
      ...this.machineForm.value
    }
    console.log("🚀 ~ payload:", payload)

    this.service.updateMachineRoll(this.selectedRow['_id'], payload).subscribe((data) => {
      const hot = this.hotRegisterer.getInstance(this.id);
      this.dataSet = this.dataSet.map((item) => {
        if (item._id === data._id) {
          const data = this.machineForm.value
          for (let ele in item) {
            if (data[ele] !== undefined) {
              item[ele] = data[ele]
            }
          }
        }
        return item
      })
      hot.updateData(this.dataSet);
      this.toastService.showSuccess("successfully submitted")
    })

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
