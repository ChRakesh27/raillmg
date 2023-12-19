import { Component, OnInit } from '@angular/core';
import { event } from 'jquery';
import * as XLSX from 'xlsx';
import { HotTableModule, HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../app.service';
import { localStorageService } from '../../../shared/service/local-storage.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-machine-upload-file',
  standalone: true,
  imports: [HotTableModule, FormsModule],
  templateUrl: './machine-upload-file.component.html',
  styleUrl: './machine-upload-file.component.css'
})
export class MachineUploadFileComponent implements OnInit {
  department = ""
  dataSet = []
  jsonData = []
  userData = {}
  private hotRegisterer = new HotTableRegisterer();
  id = 'hotInstancePre';
  colHeader = []
  hotSettings: Handsontable.GridSettings = {
    allowRemoveColumn: true,
    allowInsertColumn: false,
    allowInsertRow: false,
    allowRemoveRow: true,
    contextMenu: true,
    colWidths: '150',
    multiColumnSorting: true,
    manualColumnResize: true,
    filters: true,
    manualColumnMove: true,
    rowHeaders: true,
    dropdownMenu: ['remove_col', 'remove_row', 'clear_column', 'undo', 'redo', 'filter_by_value', 'filter_operators', 'filter_action_bar'],
  };

  xlToMngKeys = {
    "SECTION": "section",
    "KM/LINE": "lineNo",
    "MACHINE TYPE & NO.": "machine",
    "DISCONNECTION DEMAND HOURS": "dmd_duration",
    "BLOCK DEMAND HOURS": "dmd_duration",
    "QUANTUM": "quantum",
    "DEPUTED SUPERVISOR": "deputedSupervisor",
    "RESOURCES": "resources",
    "CREW": "crew",
    "LOCO": "loco",
    "BOARD": "board",
    "TYPE OF WORK": "typeOfWork",
    "WHETHER NI WORK/PNI WORK OR NON-NI WORK": "ni",
    "YARD": "yard",
    "REMARKS IF ANY": "remarks",
    "APPROVAL REQUIRED OR NOT": "approval",
    "S&T STAFF REQUIRED (YES/NO)": "s_tStaff",
    "TPC STAFF REQUIRED (YES/NO)": "tpcStaff",
    "POINT/BPAC/OTHERS": "point",
    "TOWER WAGON/MATERIAL TRAIN": "tower",
  }

  constructor(private service: AppService,
    private toastService: ToastService,
    private ls: localStorageService) { }

  ngOnInit(): void {
    this.userData = this.ls.getUser();

  }

  onFileUpload(e) {
    let wb = null;
    const reader = new FileReader()
    const file = e.target.files[0]
    reader.onload = (event) => {
      const hot = this.hotRegisterer.getInstance(this.id);
      const data = reader.result
      wb = XLSX.read(data, { type: 'binary', raw: false });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.jsonData = XLSX.utils.sheet_to_json(ws, { raw: false })
      this.colHeader = Object.keys(this.jsonData[0])

      hot.updateData(this.jsonData);
    }

    reader.readAsBinaryString(file);

  }

  onSubmit() {
    let dt = DateTime.now()
    const hot = this.hotRegisterer.getInstance(this.id);

    this.dataSet = this.jsonData.map((item) => {
      let ModData = {
        department: this.department,
        info: {
          createBy: { name: this.userData['username'], dateTime: dt.toLocaleString(DateTime.DATETIME_SHORT) },
          editBy: []
        },
      }
      for (let key of Object.keys(item)) {
        if (item[key] !== null) {
          let upperKey = key.toUpperCase().trim()
          if (upperKey === 'AVAILABLE SLOT') {
            let splitSlot = item['AVAILABLE SLOT'].split(' ')
            ModData["date"] = splitSlot[0]
            ModData["avl_start"] = this.timeFormate(splitSlot[0], splitSlot[1])
            ModData["avl_end"] = this.timeFormate(splitSlot[0], splitSlot[3])
            ModData["avl_duration"] = 180
          } else {
            if (this.xlToMngKeys[upperKey] !== undefined)
              ModData[this.xlToMngKeys[upperKey]] = item[key]
          }
        }
      }
      return ModData
    })

    if (this.dataSet.length !== 0) {
      console.log("🚀 ~ this.dataSet:", this.dataSet)
      this.service.setMachineRoll(this.dataSet).subscribe(() => {
        this.toastService.showSuccess("successfully submitted")
        this.onDelete()
      })
    } else {
      this.toastService.showWarning("Please upload xlsx file")
    }

  }

  timeFormate(date, time) {
    let dateTime = new Date(date + " " + time).toISOString()
    let dt = DateTime.fromISO(dateTime);
    return dt.toLocaleString(DateTime.TIME_24_SIMPLE);
  }

  onDelete() {
    this.department = ""
    const hot = this.hotRegisterer.getInstance(this.id);
    this.dataSet = []
    this.jsonData = []
    hot.updateData(this.dataSet);
  }

}
