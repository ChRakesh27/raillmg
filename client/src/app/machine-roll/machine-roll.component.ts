import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { utils, writeFileXLSX } from 'xlsx';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { IMachineRoll } from '../model/machineRoll.model';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
@Component({
  selector: 'app-machine-roll',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './machine-roll.component.html',
  styleUrl: './machine-roll.component.css'
})
export class MachineRollComponent implements OnInit {
  userData = {};
  machineRolls = []
  rowData: IMachineRoll[];
  colData: (ColDef | ColGroupDef)[]
  themeClass = "ag-theme-quartz";
  constructor(private service: AppService) { }


  ngOnInit(): void {
    this.userData = this.service.getIsUserLoggedIn();
    this.service.getMachineRoll(this.userData["_id"]).subscribe((data) => {
      this.machineRolls = data
      this.rowData = data.map(item => {
        let { availableSlot, ...rest } = item
        return { startDate: new Date(availableSlot['startDate']), endDate: new Date(availableSlot[`endDate`]), ...rest }
      })
    })

    this.colData = [{ field: 'department' },
    { field: "selection" },
    { field: "station" },
    { field: "direction" },
    { field: "lineNo" },
    { field: "machine" },
    { field: "series" },
    { field: "aboutWork" },
    { field: "time" },
    {
      headerName: "availableSlot",
      marryChildren: true,
      children: [
        { field: "startDate", colId: 'startDate' },
        { field: "endDate", colId: 'endDate' }
      ],
    },
    { field: "quantum" },
    { field: "deputedSupervisor" },
    { field: "resources" }
    ]
  }

  onExcelDownload() {
    let payload = this.machineRolls.map(item => {
      let { _id, user, availableSlot, ...rest } = item
      return { ...rest, avl_start: new Date(availableSlot.startDate), avl_end: new Date(availableSlot.endDate) }
    })
    const ws = utils.json_to_sheet(payload);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "MachineRolls.xlsx");
  }




}




