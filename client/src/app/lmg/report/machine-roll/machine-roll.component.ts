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
    editor: false,
    readOnly: true,
    ...hotSettings,
    height: '74vh',
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
    const workbook = XLSX.utils.book_new();
    const jsonData = Papa.parse(exportedString);
    let departmentIndex = jsonData.data[0].indexOf('DEPARTMENT')
    let boardIndex = jsonData.data[0].indexOf('BOARD')
    let sectionIndex = jsonData.data[0].indexOf('SECTION')
    let directionIndex = jsonData.data[0].indexOf('DIRECTION')
    let kmIndex = jsonData.data[0].indexOf('KILOMETER')
    let workIndex = jsonData.data[0].indexOf('WORK TYPE')
    let slotStartIndex = jsonData.data[0].indexOf('SLOT START')
    let slotEndIndex = jsonData.data[0].indexOf('SLOT END')
    let stStaffIndex = jsonData.data[0].indexOf('S&T STAFF')
    let trdStaffIndex = jsonData.data[0].indexOf('TRD STAFF')
    let remarkIndex = jsonData.data[0].indexOf('REMARKS')

    let block = jsonData.data[0].indexOf('ROLLING/NON-ROLLING')


    let selectedIndex = [departmentIndex, boardIndex, sectionIndex, directionIndex, kmIndex, workIndex, slotStartIndex, slotEndIndex, stStaffIndex, trdStaffIndex, remarkIndex, block]
    // let dataSet = jsonData.data.map((ele) => {
    //   ele.shift();
    //   ele.pop();
    //   return ele;
    // });
    let dataSet = []
    for (let ele of jsonData.data) {
      let result = []
      for (let i of selectedIndex) {
        result.push(ele[i])
      }
      dataSet.push(result)
    }



    // const img = new Image();
    // img.src = '/assets/cover_page.jpg'; // Replace 'path_to_your_image.jpg' with the actual path to your JPG image
    // const doc = new jsPDF('p', 'pc', [80, 500]);

    // const doc = new jsPDF("l", "pc", [80, 80]);
    const doc = new jsPDF("l", "mm", [350, 210]);

    // doc.autoTable({
    //   startY: doc.lastAutoTable.finalY + 10, // 10 margin
    //   //...
    // })
    doc.setFontSize(22)

    autoTable(doc, {
      head: [dataSet.shift()],
      body: dataSet,
    });
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
