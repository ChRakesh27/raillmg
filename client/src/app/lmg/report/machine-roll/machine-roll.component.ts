import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { HotTableModule, HotTableRegisterer } from '@handsontable/angular';
import { registerAllModules } from 'handsontable/registry';
import Handsontable from 'handsontable';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { ToastService } from '../../../shared/toast/toast.service';
import { hotSettings } from '../../../shared/constants/hotSettings';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { ConnectService } from '../../../services/connect.service';
// import {sectionDetails } from  '../../../shared/constants/sectionDetailss';

registerAllModules();
@Component({
  selector: 'app-machine-roll',
  standalone: true,
  templateUrl: './machine-roll.component.html',
  styleUrl: './machine-roll.component.css',
  imports: [HotTableModule, CommonModule],
})
export class MachineRollComponent implements OnInit {
  private hotRegisterer = new HotTableRegisterer();
  domainData = {
    machineRolls: 'MACHINE ROLLS BLOCK',
    maintenanceRolls: 'MAINTENANCE ROLLS BLOCK',
    machineNonRolls: 'MACHINE OUT OF ROLLING BLOCK',
    maintenanceNonRolls: 'MAINTENANCE OUT OF ROLLING BLOCK',
    'all-rolling': 'ALL-ROLLING BLOCK',
    'all-non-rolling': 'ALL-NON-ROLLING BLOCK',
    "dailyReport": "DAILY REPORT"
  };
  machineList: any[] = [];
  id = 'hotInstance';
  dataset: any = [];
  startDate: any;
  endDate: any;
  title: any;
  hotSettings: Handsontable.GridSettings = {
    ...hotSettings,
    columns: [
      { data: '_id', title: '_id' },
      { data: 'date', title: 'DATE', width: 100 },
      { data: 'department', title: 'DEPARTMENT', width: 120 },
      { data: 'board', title: 'BOARD', width: 105 },
      { data: 'section', title: 'SECTION', width: 105 },
      { data: 'direction', title: 'DIRECTION', width: 100 },
      { data: 'km', title: 'KILOMETER', width: 120 },
      { data: 'typeOfWork', title: 'TYPE OF WORK', width: 120 },
      { data: 'avl_start', title: 'SLOT START', width: 100, editor: 'false', readOnly: true },
      { data: 'avl_end', title: 'SLOT END', width: 100, editor: 'false', readOnly: true },
      { data: 's_tStaff', title: 'S&T STAFF', width: 100 },
      { data: 'tpcStaff', title: 'TRD STAFF', width: 100 },
      { data: 'remarks', title: 'REMARKS', width: 150 },
      { data: 'block', title: 'ROLL FROM', width: 130 }],
    editor: false,
    readOnly: true,
    height: '62vh',
  };

  constructor(
    private service: AppService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private connectService: ConnectService //add extra service
  ) { }

  ngOnInit() {
    this.route.params.subscribe((url) => {
      this.title = url.id;
      let domain = [];
      this.dataset = [];

      if (this.title == 'all-rolling') {
        domain = ['machineRolls', 'maintenanceRolls'];
      } else if (this.title === 'all-non-rolling') {
        domain = ['maintenanceNonRolls', 'machineNonRolls'];
      } else if (this.title === 'dailyReport') {
        domain = ['machineRolls', 'maintenanceRolls', 'maintenanceNonRolls', 'machineNonRolls'];
      } else {
        domain = [this.title];
      }

      for (let ele of domain) {
        Promise.resolve().then(() => {
          this.service.getAllMachineRoll(ele).subscribe((data) => {
            const hot = this.hotRegisterer.getInstance(this.id);
            const purseValueMap: { [key: string]: number } = {};
            data = data.map((item) => {
              item.block = ele
              // Integrate values into 'item.integrates'
              let Itemp = '';
              for (let ele of item.integrated) {
                Itemp += `BLOCK: ${ele.block !== undefined ? ele.block : '-'} | SECTION: ${ele.section1 !== undefined ? ele.section1 : '-'} | DURATION: ${ele.duration !== undefined ? ele.duration : '-'}\n`;
              }
              item.integrates = Itemp;

              // Process caution data
              let cSpeed = '';
              let cLength = '';
              let cTdc = '';
              let cTimeLoss = '';
              for (let ele of item.caution) {
                cLength += `${ele.length}\n`;
                cSpeed += `${ele.speed}\n`;
                cTdc += `${ele.tdc}\n`;
                cTimeLoss += ele.timeloss ? `${ele.timeloss} \n` : '';
              }
              item.cautionLength = cLength;
              item.cautionSpeed = cSpeed;
              item.cautionTdc = cTdc;
              item.cautionTimeLoss = cTimeLoss;

              // Update remaining purse
              const purseString = item.purse;
              let remainPurse = null;

              if (purseString && purseString.includes(':')) {
                const purseValueString = purseString.split(':')[1].trim();
                const purseValue = parseFloat(purseValueString);

                if (!isNaN(purseValue)) {
                  const timeGrantedValue = parseFloat(item.time_granted);

                  if (!isNaN(timeGrantedValue)) {
                    const machineType = item.machine;
                    const prevRemainPurse = purseValueMap[machineType] || null;

                    if (prevRemainPurse !== null) {
                      remainPurse = prevRemainPurse - timeGrantedValue;
                    } else {
                      remainPurse = (purseValue) - timeGrantedValue;
                    }

                    purseValueMap[machineType] = remainPurse;
                  }
                }
              }

              item.remain_purse = remainPurse;

              return item;
            });

            this.dataset.push(...data);

            //Sort dataset based on date in ascending order
            // this.dataset.sort((a, b) => {
            //   return new Date(a.date).getTime() - new Date(b.date).getTime();
            // });

            //   function formatTime(minutes) {
            //     const hours = Math.floor(minutes / 60);
            //     const remainingMinutes = minutes % 60;
            //     return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
            // }

            // // Calculate total sum of time_granted and dmd_duration
            // let total_time_granted = 0;
            // let total_dmd_duration = 0;
            // for (let item of data) {
            //     total_time_granted += item.time_granted || 0;
            //     total_dmd_duration += item.dmd_duration || 0;
            // }

            // // Convert total time granted and total DMD duration to hh:mm format
            // const total_time_granted_hhmm = formatTime(total_time_granted);
            // const total_dmd_duration_hhmm = formatTime(total_dmd_duration);

            // // Create total row object
            // const totalRow = {
            //     time_granted: total_time_granted_hhmm,
            //     dmd_duration: total_dmd_duration_hhmm,
            //     // Add other properties if needed
            // };


            //   // Push total row to the end of data array
            //   data.push(totalRow);

            // Update Handsontable with the updated data
            hot.updateData(this.dataset);
          });
        });

      }
    });
  }

  getRemainPurse(machineName: string): number | undefined {
    const machine = this.machineList.find(m => m.machine === machineName);
    return machine ? machine.remain_purse : undefined;
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
    this.toastService.showSuccess('Downloaded Excel file');
  }

  onPdfDownload() {
    const hot = this.hotRegisterer.getInstance(this.id);
    const exportPlugin = hot.getPlugin('exportFile');
    const exportedString = exportPlugin.exportAsString('csv', {
      bom: false,
      columnHeaders: true,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      rowDelimiter: '\r\n',
    });
    // const workbook = XLSX.utils.book_new();
    const jsonData = Papa.parse(exportedString, { header: true });

    // const img = new Image();
    // img.src = '/assets/cover_page.jpg'; // Replace 'path_to_your_image.jpg' with the actual path to your JPG image
    // const doc = new jsPDF('p', 'pc', [80, 500]);

    // const doc = new jsPDF("l", "mm", [350, 210]);
    const doc = new jsPDF("l", 'px', 'a4');

    // doc.autoTable({
    //   startY: doc.lastAutoTable.finalY + 10, // 10 margin
    //   //...
    // })
    doc.setFontSize(22)
    autoTable(doc, {
      theme: 'grid',
      columnStyles: {
        "DEPARTMENT": { cellWidth: 70 },
        "BOARD": { cellWidth: 48 },
        'SECTION': { cellWidth: 54 },
        'DIRECTION': { cellWidth: 48 },
        'KILOMETER': { cellWidth: 52 },
        'WORK TYPE': { cellWidth: 60 },
        'SLOT START': { cellWidth: 32 },
        'SLOT END': { cellWidth: 32 },
        'S&T STAFF': { cellWidth: 32 },
        'TRD STAFF': { cellWidth: 32 },
        'REMARKS': { cellWidth: 60 },
        'ROLLING/NON-ROLLING': { cellWidth: 70 },
      },
      body: jsonData.data,
      columns: [
        { header: 'DEPARTMENT', dataKey: 'DEPARTMENT' },
        { header: 'BOARD', dataKey: 'BOARD' },
        { header: 'SECTION', dataKey: 'SECTION' },
        { header: 'DIRECTION', dataKey: 'DIRECTION' },
        { header: 'KILOMETER', dataKey: 'KILOMETER' },
        { header: 'WORK TYPE', dataKey: 'WORK TYPE' },
        { header: 'SLOT START', dataKey: 'SLOT START' },
        { header: 'SLOT END', dataKey: 'SLOT END' },
        { header: 'S&T STAFF', dataKey: 'S&T STAFF' },
        { header: 'TRD STAFF', dataKey: 'TRD STAFF' },
        { header: 'REMARKS', dataKey: 'REMARKS' },
        { header: 'ROLLING/NON-ROLLING', dataKey: 'ROLLING/NON-ROLLING' },
      ],
    });
    // autoTable(doc, {
    //   head: [dataSet.shift()],
    //   body: dataSet,
    // });
    // ---------------------------------------------------------------
    doc.save('merged_document.pdf');


    // img.onload = function () {
    //   // Calculate the aspect ratio to maintain the image's proportions
    //   const aspectRatio = img.width / img.height;

    //   // Calculate the width and height of the image on the PDF
    //   const imgWidth = doc.internal.pageSize.getWidth(); // Adjust as needed
    //   const imgHeight = imgWidth / aspectRatio;

    //   // Add the image to the PDF
    //   doc.addImage(img, 'JPEG', 1, 1, imgWidth, imgHeight);

    //   // autoTable(doc, { html: '#table-wrapper' });
    //   autoTable(doc, {
    //     startY: imgHeight + 20,
    //     head: [dataSet.shift()],
    //     body: dataSet,
    //   });
    //   // Load the JPG image 

    //   // Save the PDF
    //   doc.save('merged_document.pdf');
    // };

  }

  //getting pdf on sign component

  //   const hot = this.hotRegisterer.getInstance(this.id);
  //   const exportPlugin = hot.getPlugin('exportFile');
  //   const exportedString = exportPlugin.exportAsString('csv', {
  //     bom: false,
  //     columnHeaders: true,
  //     exportHiddenColumns: true,
  //     exportHiddenRows: true,
  //     rowDelimiter: '\r\n',
  //   });
  //   const workbook = XLSX.utils.book_new();
  //   const jsonData = Papa.parse(exportedString);
  //   let dataSet = jsonData.data.map((ele) => {
  //        ele.shift();
  //       ele.pop();
  //        return ele;
  //      });

  //   const doc = new jsPDF('p', 'pc', [300, 500]);
  //   // autoTable(doc, { html: '#table-wrapper' });
  //   autoTable(doc, {
  //     head: [jsonData.data.shift()],
  //     body: jsonData.data,
  //   });
  //   const pdfData = doc.output('datauristring');
  //   this.connect.setPdfData(pdfData);
  // }



  selectStartDate(e) {
    this.startDate = DateTime.fromISO(e.target.value);
  }
  selectEndDate(e) {
    this.endDate = DateTime.fromISO(e.target.value);
  }

  filterDataWithDate() {
    if (!this.startDate && !this.endDate) {
      return;
    }

    const hot = this.hotRegisterer.getInstance(this.id);

    const filteredData = this.dataset.filter((item) => {
      const parsedDate = DateTime.fromFormat(item.date, 'dd/MM/yyyy');

      if (this.startDate <= parsedDate && this.endDate >= parsedDate) {
        return true;
      } else if (
        this.startDate !== undefined &&
        this.startDate <= parsedDate &&
        this.endDate == undefined
      ) {
        return true;
      } else if (
        this.endDate !== undefined &&
        this.endDate >= parsedDate &&
        this.startDate == undefined
      ) {
        return true;
      }

      return false;
    });

    // Sort the filtered data by date in ascending order
    filteredData.sort((a, b) => {
      const dateA = DateTime.fromFormat(a.date, 'dd/MM/yyyy');
      const dateB = DateTime.fromFormat(b.date, 'dd/MM/yyyy');
      return dateA.toMillis() - dateB.toMillis();
    });
    hot.updateData(filteredData);

    //   function formatTime(minutes) {
    //     const hours = Math.floor(minutes / 60);
    //     const remainingMinutes = minutes % 60;
    //     return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
    // }

    // // Calculate total sum of time_granted and dmd_duration
    // let total_time_granted = 0;
    // let total_dmd_duration = 0;
    // for (let item of filteredData) {
    //     total_time_granted += item.time_granted || 0;
    //     total_dmd_duration += item.dmd_duration || 0;
    // }

    // // Convert total time granted and total DMD duration to hh:mm format
    // const total_time_granted_hhmm = formatTime(total_time_granted);
    // const total_dmd_duration_hhmm = formatTime(total_dmd_duration);

    // // Create total row object
    // const totalRow = {
    //     time_granted: total_time_granted_hhmm,
    //     dmd_duration: total_dmd_duration_hhmm,
    //     // Add other properties if needed
    // };


    //   // Push total row to the end of filtered data array
    //   filteredData.push(totalRow);

    // Update Handsontable with the updated data including the total row
    hot.updateData(filteredData);
  }


  ResetDates() {
    const hot = this.hotRegisterer.getInstance(this.id);

    hot.updateData(this.dataset);
  }
}
