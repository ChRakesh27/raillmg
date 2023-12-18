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
        if (oldValue != newValue) {
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
            },
            prop: newValue
          }


          this.service.updateMachineRoll(id, payload).subscribe(() => {
            this.toastService.showSuccess("successfully Updated")
          })
        }
      });
    },
    ...hotSettings
  };

  constructor(
    private service: AppService,
    private ls: localStorageService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.userData = this.ls.getUser();
    this.service.getAllMachineRoll().subscribe((data) => {
      const hot = this.hotRegisterer.getInstance(this.id);
      if (this.userData.department !== 'OPERATING') {
        data = data.filter(item => {
          return item.department === this.userData.department
        })
      }
      this.dataSet = data
      hot.updateData(data);
    });
  }

}
