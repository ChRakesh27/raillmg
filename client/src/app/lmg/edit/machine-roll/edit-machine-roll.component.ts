import { Component } from '@angular/core';
import { HotTableModule, HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import { hotSettings } from '../../../shared/constants/hotSettings';
import { AppService } from '../../../app.service';
import { localStorageService } from '../../../shared/service/local-storage.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { IUser } from '../../../model/user.model';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-machine-roll',
  standalone: true,
  imports: [HotTableModule],
  templateUrl: './edit-machine-roll.component.html',
  styleUrl: './edit-machine-roll.component.css'
})
export class EditMachineRollComponent {
  userData: IUser
  private hotRegisterer = new HotTableRegisterer();
  id = 'hotInstance';
  usersInfo = {
    createBy: { name: '', dateTime: "" }, editBy: []
  }
  dataSet = []
  hotSettings: Handsontable.GridSettings = {
    afterChange: (changes) => {
      changes?.forEach(([row, prop, oldValue, newValue]) => {
        const hot = this.hotRegisterer.getInstance(this.id);
        let id = hot.getDataAtRow(row)[0]
        if (oldValue == newValue || (newValue == '' && oldValue == undefined)) {
          return
        }
        if (prop === 'date') {
          const parsedDate = DateTime.fromFormat(newValue, 'MM/dd/yyyy');

          if (!parsedDate.isValid) {
            this.toastService.showDanger("Date should be MM/DD/YYYY format")
            return
          }
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
          const column = this.hotRegisterer.getInstance(this.id).propToCol(prop as string)
          const cell = this.hotRegisterer.getInstance(this.id).getCell(row, column as number);
          cell.style.backgroundColor = 'lightblue';
          cell.className = 'updatedCell'
          this.toastService.showSuccess("successfully Updated")
        })

      });
    },
    ...hotSettings,
  };

  constructor(
    private service: AppService,
    private ls: localStorageService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.userData = this.ls.getUser();
    Promise.resolve().then(() => {
      this.service.getAllMachineRoll().subscribe((data) => {
        const hot = this.hotRegisterer.getInstance(this.id);
        data = data.map(item => {
          let editString = ''
          for (let ele of item.info.editBy) {
            editString += `${ele.changes},Slot time changed: ${ele.dateTime} User Name: ${ele.name}\n\n`
          }
          item['edit'] = editString
          if (this.userData.department === 'OPERATING' || item.department === this.userData.department) {
            return item
          }
        })

        this.dataSet = data
        hot.updateData(data);
      });
    })
  }

}
