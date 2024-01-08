import { Component } from '@angular/core';
import { HotTableModule, HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import { DateTime } from 'luxon';
import { AppService } from '../../app.service';
import { IUser } from '../../shared/model/user.model';
import { hotSettings } from '../../shared/constants/hotSettings';
import { localStorageService } from '../../shared/service/local-storage.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ILog, IMachineRoll } from '../../shared/model/machineRoll.model';

@Component({
  selector: 'app-verify-demand',
  standalone: true,
  imports: [HotTableModule],
  templateUrl: './verify-demand.component.html',
  styleUrl: './verify-demand.component.css',
})
export class VerifyDemandComponent {
  userData: IUser;

  dataSet = [];

  private hotRegisterer = new HotTableRegisterer();
  id_rolling = 'hotInstance_rolling';
  id_non_rolling = 'hotInstance_non-rolling';
  constColumns = [
    { data: 'date', title: 'Date', width: 73 },
    { data: 'department', title: 'DEPARTMENT', width: 110 },
    {
      data: 'board',
      title: 'BOARD',
      type: 'select',
      selectOptions: ['BG1', 'BG2', 'BG3', 'BG4', 'BG5'],
      width: 73,
    },
    { data: 'section', title: 'SECTION', width: 80 },
    { data: 'avl_start', title: 'SLOT START', width: 100 },
    { data: 'avl_end', title: 'SLOT END', width: 90 },
    { data: 'avl_duration', title: 'AVL DUR...', width: 100 },
    { data: 'dmd_duration', title: 'DMD DUR...', width: 100 },
    { data: 'machine', title: 'MACHINE TYPE', width: 120 },
  ];
  rollingColumns = [
    { data: '_id', title: '_id' },
    {
      data: 'Avl_status',
      title: 'AVAIL STATUS',
      type: 'checkbox',
      defaultData: true,
      width: 130,
    },
    ...this.constColumns,
    {
      data: 'grant_status',
      title: 'GRANT STATUS',
      type: 'select',
      selectOptions: ['Pending', 'Granted', 'Not Granted'],
      width: 120,
    },
    { data: 'time_granted', title: 'TIME GRANTED', width: 120 },
    { data: 'remarks', title: 'REMARKS', width: 100 },
    {
      data: 'logs',
      title: 'INFORMATION',
      editor: false,
      width: 300,
      renderer: (
        instance: Handsontable.Core,
        TD: HTMLTableCellElement,
        row: number,
        col: number,
        prop: string | number,
        value: ILog[],
        cellProperties: Handsontable.CellProperties
      ) => {
        TD.className = (row % 2 == 0 ? 'evenCell' : 'oddCell') + ' wraptext';
        let text = [];
        if (!value?.length) return;
        for (let log of value) {
          text.push(
            `user ${log.updatedBy} modified ${log.field} from ${log.oldValue} to ${log.newValue}.`
          );
        }
        TD.innerHTML = text.join(' | ');
        cellProperties.comment = {
          value: text.join('\n'),
          readOnly: true,
        };
      },
    },
  ];

  nonRollingColumns = [
    { data: '_id', title: '_id' },
    {
      data: 'status',
      title: ' APPROVE STATUS',
      type: 'select',
      selectOptions: ['Accept', 'Reject'],
      width: 130,
    },
    ...this.constColumns,
    { data: 'remarks', title: 'REMARKS', width: 90 },
    {
      data: 'logs',
      title: 'INFORMATION',
      editor: false,
      width: 300,
      renderer: (
        instance: Handsontable.Core,
        TD: HTMLTableCellElement,
        row: number,
        col: number,
        prop: string | number,
        value: ILog[],
        cellProperties: Handsontable.CellProperties
      ) => {
        TD.className = (row % 2 == 0 ? 'evenCell' : 'oddCell') + ' wraptext';
        let text = [];
        if (!value?.length) return;
        for (let log of value) {
          text.push(
            `user ${log.updatedBy} modified ${log.field} from ${log.oldValue} to ${log.newValue}.`
          );
        }
        TD.innerHTML = text.join(' | ');
        cellProperties.comment = {
          value: text.join('\n'),
          readOnly: true,
        };
      },
    },
    // { data: "grant_status", title: "Grant Status", type: 'select', selectOptions: ['Pending', 'Granted', 'Not Granted'] },
    // { data: "time_granted", title: "Time Granted" },
  ];

  hotSettings: Handsontable.GridSettings = {
    ...hotSettings,
    height: '35vh',
    afterChange: (changes) => {
      changes?.forEach(([row, prop, oldValue, newValue]) => {
        const headerKey = prop as string;

        const hot = this.hotRegisterer.getInstance(this.id_rolling);
        let id = hot.getDataAtRow(row)[0];
        if (oldValue == newValue || (newValue == '' && oldValue == undefined)) {
          return;
        }
        const data = this.dataSet.find((item) => item._id === id);

        const log = {
          updatedBy: this.userData['username'],
          updatedAt: new Date().toISOString(),
          field: headerKey,
          oldValue,
          newValue,
        };
        let payload: Partial<IMachineRoll> = {
          [headerKey]: newValue,
          updatedBy: this.userData['username'],
          updatedAt: new Date().toISOString(),
          logs: [...data.logs, log],
        };
        this.service
          .updateMachineRoll('machineRolls', id, payload)
          .subscribe(() => {
            const column = hot.propToCol(headerKey);
            const cell = hot.getCell(row, column as number);
            cell.style.backgroundColor = 'lightblue';
            cell.className = 'updatedCell';
            this.toastService.showSuccess('successfully Updated');
          });
      });
    },
    cells: (row, col, prop) => {
      let cp = { className: row % 2 == 0 ? 'evenCell' : 'oddCell' };
      if (this.dataSet.length === 0) {
        return;
      }
      if (
        (prop === 'grant_status' ||
          prop === 'time_granted' ||
          prop === 'remarks' ||
          prop === 'status') &&
        this.userData.department === 'OPERATING'
      ) {
        cp['readOnly'] = false;
      } else if (
        prop === 'Avl_status' &&
        this.userData.department === this.dataSet[row]?.department
      ) {
        cp['readOnly'] = false;
      } else {
        cp['readOnly'] = true;
      }
      return cp;
    },
  };

  constructor(
    private service: AppService,
    private toastService: ToastService,
    private ls: localStorageService
  ) {}

  ngOnInit() {
    this.userData = this.ls.getUser();
    Promise.resolve().then(() => {
      this.service.getAllMachineRoll('machineRolls').subscribe((data) => {
        const hot1 = this.hotRegisterer.getInstance(this.id_rolling);
        const hot2 = this.hotRegisterer.getInstance(this.id_non_rolling);
        let dt = DateTime.now();
        let curDay = dt.toFormat('dd/MM/yyyy');
        dt = dt.plus({ days: 1 });
        let nextDay = dt.toFormat('dd/MM/yyyy');
        data = data.filter((item) => {
          // let editString = '';
          // for (let ele of item.logs.editBy) {
          //   editString += `${ele.changes},\nSlot time changed: ${ele.dateTime} User Name: ${ele.name}\n\n`;
          // }
          // item['edit'] = editString;
          if (item.date === curDay || item.date === nextDay) {
            return true;
          }
          return false;
        });
        // if (this.userData.department !== 'OPERATING') {
        //   data = data.filter(item => {
        //     return item.department === this.userData.department
        //   })
        // }
        this.dataSet = data;
        hot1.updateSettings({
          columns: this.rollingColumns,
          data: this.dataSet,
        });
        hot2.updateSettings({
          columns: this.nonRollingColumns,
          data: this.dataSet,
        });
      });
    });
  }
}
