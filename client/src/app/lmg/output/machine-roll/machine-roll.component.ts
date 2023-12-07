import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { utils, writeFileXLSX } from 'xlsx';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  ColGroupDef,
  GridReadyEvent,
  SizeColumnsToContentStrategy,
} from 'ag-grid-community';
import { IMachineRoll } from '../../../model/machineRoll.model';
import { DateTime } from 'luxon';
import { localStorageService } from '../../../shared/service/local-storage.service';

@Component({
  selector: 'app-machine-roll',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './machine-roll.component.html',
  styleUrl: './machine-roll.component.css',
})
export class MachineRollComponent implements OnInit {
  userData = {};
  machineRolls = [];

  rowData: IMachineRoll[] = [];
  colDefs: (ColDef | ColGroupDef)[] = [
    { field: 'department' },
    {
      field: 'date',
      cellDataType: 'date',
    },
    { field: 'selection' },
    { field: 'station' },
    { field: 'direction' },
    { field: 'lineNo' },
    { field: 'machine' },
    { field: 'series' },
    { field: 'aboutWork' },
    { field: 'time' },
    {
      headerName: 'AvailableSlot',
      marryChildren: true,
      children: [{ field: 'startTime' }, { field: 'endTime' }],
    },
    { field: 'quantum' },
    { field: 'deputedSupervisor' },
    { field: 'resources' },
  ];
  public autoSizeStrategy: SizeColumnsToContentStrategy = {
    type: 'fitCellContents',
  };

  constructor(private service: AppService, private ls: localStorageService) { }

  ngOnInit(): void {
    this.userData = this.ls.getUser();
  }

  onGridReady(event: GridReadyEvent) {
    this.service.getMachineRoll(this.userData['_id']).subscribe((data) => {
      this.machineRolls = data;
      this.rowData = data.map((item) => {
        let { availableSlot, ...rest } = item;
        return {
          date: new Date(availableSlot['startDate']),
          startTime: this.timeFormate(availableSlot['startDate']),
          endTime: this.timeFormate(availableSlot['endDate']),
          ...rest,
        };
      });
    });
  }

  timeFormate(params) {
    let dt = DateTime.fromISO(params);
    return dt.toLocaleString(DateTime.TIME_SIMPLE);
  }

  onExcelDownload() {
    let payload = this.machineRolls.map((item) => {
      let { _id, user, availableSlot, ...rest } = item;
      return {
        ...rest,
        avl_start: new Date(availableSlot.startDate),
        avl_end: new Date(availableSlot.endDate),
      };
    });
    const ws = utils.json_to_sheet(payload);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    writeFileXLSX(wb, 'MachineRolls.xlsx');
  }
}
