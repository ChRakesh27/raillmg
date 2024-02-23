import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  NgbNavModule,
  NgbPopoverModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  FormControl,
  FormsModule,
} from '@angular/forms';
import { IRailForm } from '../model/railForm.model';
import { DateTime } from 'luxon';
import { AppService } from '../../app.service';
import { AvailableSlotsConfig } from '../constants/available-slots';
import { IUser } from '../model/user.model';
import { localStorageService } from '../service/local-storage.service';
import { ToastService } from '../toast/toast.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute, Route } from '@angular/router';
import { Router } from 'express';
@Component({
  selector: 'app-add-machine-const',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbPopoverModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    JsonPipe,
    NgbTimepickerModule,
    NgbNavModule,
  ],
  templateUrl: './add-machine-const.component.html',
  styleUrl: './add-machine-const.component.css',
})
export class AddMachineConstComponent implements OnInit {
  @Input() domain;

  domainData = {
    machineRolls: 'MACHINE ROLLS',
    maintenanceRolls: 'MAINTENANCE ROLLS',
    machineNonRolls: 'MACHINE OUT OF ROLLING',
    maintenanceNonRolls: 'MAINTENANCE OUT OF ROLLING',
  };
  form!: FormGroup;
  userData: Partial<IUser> = {};
  availableSlots = {};
  cautions = [];
  integrates = [];
  stations = [];
  machineType: { _id: ''; machine: '' }[];
  boardList: { _id: ''; board: '' }[];
  sectionList = [];
  value: any;
  railDetails: any[] = [];
  dataSet = [];
  slot: any = {
    date: '',
    startTime: '',
    endTime: '',
  };
  slotIndex: any;
  dropdownSettings: IDropdownSettings = {
    idField: '_id',
    textField: 'machine',
    allowSearchFilter: true,
    maxHeight: 118,
    noDataAvailablePlaceholderText: 'There is no Available Slots',
  };
  AvlSlotSettings: IDropdownSettings = {
    idField: '_id',
    textField: 'machine',
    allowSearchFilter: true,
    maxHeight: 118,
    noDataAvailablePlaceholderText: 'There is no Available Slots',
  };
  get machineFormArray(): FormArray {
    return this.form.controls['machineFormArray'] as FormArray;
  }

  get department(): FormControl {
    return this.form.controls['department'] as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private service: AppService,
    private toastService: ToastService,
    private ls: localStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userData = this.ls.getUser();
    this.form = this.fb.group({
      department: this.fb.control(
        {
          value:
            this.userData.department === 'OPERATING'
              ? 'CONSTRUCTION'
              : this.userData.department,
          disabled: this.userData.department !== 'OPERATING',
        },
        Validators.required
      ),
      machineFormArray: this.fb.array([]),
    });

    Promise.resolve().then(() => {
      this.service.getAllRailDetails('machines').subscribe((data) => {
        this.machineType = data;
      });
    });

    Promise.resolve().then(() => {
      this.service.getAllRailDetails('boards').subscribe((data) => {
        this.boardList = data;
      });
    });
  }

  onBoardSelect(index, event) {
    this.service
      .getAllRailDetails('railDetails?board=' + event.target.value)
      .subscribe((data) => {
        this.dataSet = data;
        this.sectionList[index] = data.map((ele) => ele.section);
      });
  }

  onSectionSelect(index, event) {
    let data = this.dataSet.filter((ele) => ele.section === event.target.value);
    this.railDetails[index] = data[0];

    console.log('🚀 ~ this.railDetails:', this.railDetails, index);
  }

  onSubmit() {
    if (this.machineFormArray.value.length === 0 || !this.form.valid) {
      this.toastService.showWarning('Please fill all details');
      return;
    }

    let payload = [];

    for (let [index, item] of this.machineFormArray.value.entries()) {
      console.log('🚀 ~ item.avlSlotOther):', index, item, item.avlSlotOther);
      for (let slotItem of item.avlSlotOther) {
        console.log('🚀 ~ slotItem:', slotItem);

        let splitSlot = [];
        if (item.availableSlot === 'Avl_slot_other') {
          // const regexPattern = new RegExp(
          //   '\\b([0-3][0-9]/[0-1][1-2]/\\d{4}) ([0-2][0-9]:[0-2][0-9]) to ([0-2][0-9]:[0-2][0-9]) (\\b(?:MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)\\b)\\b'
          // );
          // if (!regexPattern.test(item.avlSlotOther)) {
          //   this.toastService.showDanger('AVAILABLE SLOT ARE INCORRECT FORMAT');
          //   return;
          // }

          splitSlot = slotItem.split(' ');
        } else {
          splitSlot = item.availableSlot.split(' ');
        }
        if (!item.crewCheckbox || item.crew == null) {
          item.crew = 0;
        }
        if (!item.locoCheckbox || item.loco == null) {
          item.loco = 0;
        }
        item.caution = this.cautions[index];
        item.integrated = this.integrates[index];

        const dt = DateTime.now();
        const startTime = DateTime.fromFormat(splitSlot[1], 'HH:mm');
        const endTime = DateTime.fromFormat(splitSlot[3], 'HH:mm');
        const timeDifferenceInMinutes = endTime.diff(
          startTime,
          'minutes'
        ).minutes;

        // item.machine = item.machine.map((item) => {
        //   return item.machine.trim();
        // });

        payload.push({
          ...item,
          avl_start: splitSlot[1],
          avl_end: splitSlot[3],
          date: splitSlot[0],
          department: this.department.value,
          avl_duration: timeDifferenceInMinutes,
          createdAt: new Date().toISOString(),
          createdBy: this.userData.username,
          updatedAt: new Date().toISOString(),
          updatedBy: this.userData.username,
          logs: [],
        });
      }
    }

    this.service.addRailDetails(this.domain, payload).subscribe((res) => {
      for (let index = this.machineFormArray.length - 1; index >= 0; index--) {
        this.machineFormArray.removeAt(index);
      }
      if (this.userData.department === 'OPERATING') {
        this.form.get('department')?.enable();
      }
      this.toastService.showSuccess('successfully submitted');
    });
  }

  onAddNewForm() {
    this.form.get('department')?.disable();
    this.sectionList.push([]);
    this.railDetails.push({
      _id: '',
      board: '',
      section: '',
      mps: 0,
      slots: [],
      directions: [],
      stations: [],
    });
    const machineForm = this.fb.group({
      board: [''],
      section: [''],
      stationTo: [''],
      stationFrom: [''],
      direction: [''],
      lineNo: [null],
      machine: [null],
      series: [null],
      typeOfWork: [null],
      dmd_duration: [null],
      availableSlot: [''],
      avlSlotOther: [[]],
      quantum: [null],
      deputedSupervisor: [null],
      resources: [null],
      km: [null],
      ni: [
        this.domain === 'machineRolls' || this.domain === 'maintenanceRolls'
          ? 'NON NI'
          : 'EMERGENT',
      ],
      // yard: [null],
      remarks: [null],
      approval: [''],
      s_tStaff: [''],
      tpcStaff: [''],
      // point: [null],
      // tower: [null],
      crew: [null],
      crewCheckbox: [false],
      loco: [null],
      cautionCheckbox: [false],
      caution: [{ length: '', tdc: '', speed: 0 }],
      locoCheckbox: [false],
      // cancelTrain: [null],
      cancelTrainCheckbox: [false],
      integratedCheckbox: [false],
      integrated: [{ block: '', section: '', duration: 0 }],
    });
    this.cautions.push([{ length: '', tdc: '', speed: 0 }]);
    this.integrates.push([{ block: '', section: '', duration: 0 }]);
    this.machineFormArray.push(machineForm);

    const selectCtrl = machineForm.controls['section'] as FormControl;

    selectCtrl.valueChanges.subscribe((change) => {
      this.prepareAvailableSlots(change, '');
      machineForm.controls['direction'].setValue('');
    });

    const directionCtrl = machineForm.controls['direction'] as FormControl;
    directionCtrl.valueChanges.subscribe((change) => {
      this.prepareAvailableSlots(machineForm.controls['section'].value, change);
    });
  }

  addCaution(index) {
    this.cautions[index].push({ length: '', tdc: '', speed: 0 });
  }

  addIntegrated(index) {
    this.integrates[index].push({ block: '', section: '', duration: 0 });
  }

  deleteCaution(i, index) {
    this.cautions[i] = this.cautions[i].filter((ele, ind) => index != ind);
  }

  deleteIntegrated(i, index) {
    this.integrates[i] = this.integrates[i].filter((ele, ind) => index != ind);
  }

  onDelete(index: number) {
    this.machineFormArray.removeAt(index);
    this.railDetails.splice(index, 1);
    this.sectionList.splice(index, 1);
    if (
      this.machineFormArray.length === 0 &&
      this.userData.department === 'OPERATING'
    ) {
      this.form.get('department')?.enable();
    }
  }

  cautionLength($event, index1, index2) {
    this.cautions[index1][index2]['length'] = $event.target.value;
  }

  cautionSpeed($event, index1, index2) {
    this.cautions[index1][index2]['speed'] = $event.target.value;
  }

  cautionTDC($event, index1, index2) {
    var parts = $event.target.value.split('-');
    var year = parts[0];
    var month = parts[1];
    var day = parts[2];
    this.cautions[index1][index2]['tdc'] = day + '/' + month + '/' + year;
  }

  integratedBlock($event, index1, index2) {
    this.integrates[index1][index2]['block'] = $event.target.value;
  }
  integratedSection($event, index1, index2) {
    this.integrates[index1][index2]['section'] = $event.target.value;
  }

  integratedDuration($event, index1, index2) {
    this.integrates[index1][index2]['duration'] = $event.target.value;
  }

  prepareAvailableSlots(section, direction) {
    if (!section || !direction || direction == '') {
      return;
    }

    if (this.availableSlots[section + '_' + direction]) {
      return;
    }

    let railData = {};

    for (let item of this.railDetails) {
      if (item.section == section) {
        railData = item;
        break;
      }
    }

    if (Object.keys(railData).length == 0) {
      this.toastService.showWarning('SLOTS are not Available');
      return;
    }
    const slotsList = railData['slots'][direction];

    let dt = DateTime.now();

    let avl_slot = ['Avl_slot_other'];
    for (let i = 0; i < 365; i++) {
      for (let slotDay in slotsList) {
        if (+dt.weekday == +slotDay || (+dt.weekday == 7 && +slotDay == 0)) {
          for (let slot of slotsList[slotDay]) {
            avl_slot.push(dt.toFormat('dd/MM/yyyy') + ' ' + slot);
          }
        }
      }
      dt = dt.plus({ days: 1 });
    }

    this.availableSlots[section + '_' + direction] = avl_slot;
    console.log('🚀 ~ avl_slot:', avl_slot);

    railData = {};
  }

  setSlotIndex(index) {
    this.slotIndex = index;
  }
  addSlot() {
    const parsedDate = DateTime.fromISO(this.slot.date);
    const formattedDate = parsedDate.toFormat('dd/LL/yyyy');
    let text = `${formattedDate} ${this.slot.startTime.hour}:${this.slot.startTime.minute} to ${this.slot.endTime.hour}:${this.slot.endTime.minute} hrs`;
    this.machineFormArray.value[this.slotIndex].avlSlotOther.push(text);
  }
  deleteSlot(formIndex, slotIndex) {
    this.machineFormArray.value[this.slotIndex].avlSlotOther.splice(
      slotIndex,
      1
    );
  }
  onSubmitSlot() {
    console.log(
      '🚀 ~ this.machineFormArray.value:',
      this.machineFormArray.value
    );
  }
}
