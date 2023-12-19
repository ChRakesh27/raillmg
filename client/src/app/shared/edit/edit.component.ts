import { Component, Input, OnInit } from '@angular/core';
import { HotTableModule, HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import { DateTime } from 'luxon';
import { AppService } from '../../app.service';
import { IUser } from '../../model/user.model';
import { hotSettings } from '../constants/hotSettings';
import { localStorageService } from '../service/local-storage.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [HotTableModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})

export class EditComponent implements OnInit {


  @Input() columns: any[] = []
  @Input() dataSet: any[] = []
  @Input() cells: boolean = false


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
  private hotRegisterer = new HotTableRegisterer();
  id = 'hotInstance';


  hotSettings: Handsontable.GridSettings = {
    ...hotSettings,
    cells: (row, col) => {
      if (this.cells === false) {
        return
      }
      let cp = {};
      if (this.dataSet.length === 0) {
        return
      }
      if (col === 3) {
        return { readOnly: true }
      }

      if (col === 1) {
        cp['readOnly'] = this.userData.department !== 'OPERATING'
      } else {
        if (this.userData.department === this.dataSet[row]?.department) {
          cp['readOnly'] = false
        } else {
          cp['readOnly'] = true
        }
      }
      return cp
    },
    afterChange: (changes) => {
      changes?.forEach(([row, prop, oldValue, newValue]) => {
        const hot = this.hotRegisterer.getInstance(this.id);
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
        // this.service.updateMachineRoll(id, payload).subscribe(() => {
        const column = this.hotRegisterer.getInstance(this.id).propToCol(prop as string)
        const cell = this.hotRegisterer.getInstance(this.id).getCell(row, column as number);
        cell.style.backgroundColor = 'lightgreen';
        cell.className = 'updatedCell'
        this.toastService.showSuccess("successfully Updated")
        // })

      });
    },



  };
  constructor(
    private service: AppService,
    private toastService: ToastService,
    private ls: localStorageService
  ) { }

  ngOnInit() {

    this.userData = this.ls.getUser()
    this.service.getAllMachineRoll().subscribe((data) => {
      const hot = this.hotRegisterer.getInstance(this.id);
      // if (this.userData.department !== 'OPERATING') {
      //   data = data.filter(item => {
      //     return item.department === this.userData.department
      //   })
      // }
      this.dataSet = data
      hot.updateSettings({ columns: this.columns, data: this.dataSet })
      hot.updateData(this.dataSet);
    });
  }
}
