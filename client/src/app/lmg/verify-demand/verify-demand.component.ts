import { Component } from '@angular/core';
import { HotTableModule, HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import { DateTime } from 'luxon';
import { AppService } from '../../app.service';
import { IUser } from '../../model/user.model';
import { hotSettings } from '../../shared/constants/hotSettings';
import { localStorageService } from '../../shared/service/local-storage.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-verify-demand',
  standalone: true,
  imports: [HotTableModule],
  templateUrl: './verify-demand.component.html',
  styleUrl: './verify-demand.component.css'
})
export class VerifyDemandComponent {

  userData: IUser = {
    _id: undefined,
    username: undefined,
    email: undefined,
    designation: undefined,
    department: undefined,
    mobile: undefined
  }
  usersInfo = {
    createBy: { name: '', dateTime: "" }, editBy: []
  }

  dataSet = []

  private hotRegisterer = new HotTableRegisterer();
  id_rolling = 'hotInstance_rolling';
  id_non_rolling = 'hotInstance_non-rolling';
  constColumns = [{ data: "date", title: "Date" },
  { data: "department", title: "DEPARTMENT" },
  { data: "board", title: "BOARD", type: 'select', selectOptions: ['BG1', 'BG2', 'BG3', 'BG4', 'BG5'] },
  { data: "section", title: "SECTION" },
  { data: "avl_start", title: "SLOT START" },
  { data: "avl_end", title: "SLOT END" },
  { data: "avl_duration", title: "AVL DURATION" },
  { data: "dmd_duration", title: "DMD DURATION" },
  { data: "machine", title: "TYPE OF MACHINE" },]
  rollingColumns = [
    { data: '_id', title: '_id' },
    { data: 'Avl_status', title: 'AVAIL STATUS', type: 'checkbox', defaultData: true },
    ...this.constColumns,
    { data: "grant_status", title: "GRANT STATUS", type: 'select', selectOptions: ['Pending', 'Granted', 'Not Granted'] },
    { data: "time_granted", title: "TIME GRANTED" },
    { data: "remarks", title: "REMARKS" },
    { data: "edit", title: "INFORMATION" },
  ]

  nonRollingColumns = [
    { data: '_id', title: '_id' },
    { data: 'status', title: ' APPROVE STATUS', type: 'select', selectOptions: ['Accept', 'Reject'] },
    ...this.constColumns,
    { data: "remarks", title: "REMARKS" },
    { data: "edit", title: "INFORMATION" },
    // { data: "grant_status", title: "Grant Status", type: 'select', selectOptions: ['Pending', 'Granted', 'Not Granted'] },
    // { data: "time_granted", title: "Time Granted" },
  ]


  hotSettings: Handsontable.GridSettings = {
    ...hotSettings,
    rowHeights: 40,
    colWidths: 180,
    width: '100%',
    height: '35vh',
    afterChange: (changes) => {
      changes?.forEach(([row, prop, oldValue, newValue]) => {
        const hot = this.hotRegisterer.getInstance(this.id_rolling);
        let id = hot.getDataAtRow(row)[0]
        if (oldValue == newValue || (newValue == '' && oldValue == undefined)) {
          return
        }
        const data = this.dataSet.find((item) => item._id === id)
        this.usersInfo = data['info']
        const dt = DateTime.now()
        this.usersInfo.editBy.push({
          name: this.userData['username'],
          dateTime: dt.toLocaleString(DateTime.DATETIME_SHORT),
          changes: `${prop} -> ${oldValue} to ${newValue} `
        })
        let payload = {
          info: {
            ...this.usersInfo
          }
        }
        payload[prop as string] = newValue
        this.service.updateMachineRoll(id, payload).subscribe(() => {
          const column = this.hotRegisterer.getInstance(this.id_rolling).propToCol(prop as string)
          const cell = this.hotRegisterer.getInstance(this.id_rolling).getCell(row, column as number);
          cell.style.backgroundColor = 'lightblue';
          cell.className = 'updatedCell'
          this.toastService.showSuccess("successfully Updated")
        })

      });
    },
    cells: (row, col, prop) => {
      let cp = { className: row % 2 == 0 ? 'evenCell' : 'oddCell' };
      if (this.dataSet.length === 0) {
        return
      }
      if ((prop === 'grant_status' || prop === 'time_granted' || prop === 'remarks' || prop === 'status') && this.userData.department === 'OPERATING') {
        cp['readOnly'] = false
      } else if (prop === 'Avl_status' && this.userData.department === this.dataSet[row]?.department) {
        cp['readOnly'] = false
      }
      else {
        cp['readOnly'] = true
      }
      return cp
    }
  };

  constructor(
    private service: AppService,
    private toastService: ToastService,
    private ls: localStorageService
  ) { }

  ngOnInit() {
    this.userData = this.ls.getUser()
    Promise.resolve().then(() => {
      this.service.getAllMachineRoll().subscribe((data) => {
        const hot1 = this.hotRegisterer.getInstance(this.id_rolling);
        const hot2 = this.hotRegisterer.getInstance(this.id_non_rolling);
        let dt = DateTime.now()
        let curDay = dt.toFormat('MM/dd/yyyy')
        dt = dt.plus({ days: 1 });
        let nextDay = dt.toFormat('MM/dd/yyyy')
        data = data.map(item => {
          let editString = ''
          for (let ele of item.info.editBy) {
            editString += `${ele.changes},Slot time changed: ${ele.dateTime} User Name: ${ele.name}\n\n`
          }
          item['edit'] = editString
          if (item.date === curDay || item.date === nextDay) {
            return item
          }
        })
        // if (this.userData.department !== 'OPERATING') {
        //   data = data.filter(item => {
        //     return item.department === this.userData.department
        //   })
        // }
        this.dataSet = data
        hot1.updateSettings({ columns: this.rollingColumns, data: this.dataSet })
        hot2.updateSettings({ columns: this.nonRollingColumns, data: this.dataSet })
      });
    })
  }




}
