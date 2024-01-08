import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
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
import { stationList } from '../constants/station-list';
import { IUser } from '../model/user.model';
import { localStorageService } from '../service/local-storage.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-add-machine-const',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbPopoverModule, FormsModule],
  templateUrl: './add-machine-const.component.html',
  styleUrl: './add-machine-const.component.css',
})
export class AddMachineConstComponent implements OnInit {
  @Input() domain;

  form!: FormGroup;
  userData: Partial<IUser> = {};
  availableSlots = {};
  cautions = [];
  stations = stationList;
  machineType: { _id: ''; machine: '' }[];
  boardlist: { _id: ''; board: '' }[];
  sectionList = [];
  value: any;
  railDetails: IRailForm[] = [];
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
    private ls: localStorageService
  ) {}

  ngOnInit(): void {
    this.userData = this.ls.getUser();
    this.form = this.fb.group({
      department: this.fb.control(
        { value: 'CONSTRUCTION', disabled: false },
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
        this.boardlist = data;
      });
    });
    // Promise.resolve().then(() => {
    //   this.service.getAllRailDetails('railDetails').subscribe((data) => {
    //     this.railDetails = data;
    //   });
    // });
  }

  onBoardSelect(index, event) {
    this.railDetails[index].board = event.target.value;
    // this.service.getAllRailDetails('railDetails?board:').subscribe((data) => {
    //   console.log('🚀 ~ data:', data);
    //   // this.sectionList=data
    // });
  }

  onSubmit() {
    if (this.machineFormArray.value.length === 0 || !this.form.valid) {
      this.toastService.showWarning('Please fill all details');
      return;
    }

    let payload = [];
    payload = this.machineFormArray.value.map((item, index) => {
      let splitSlot = item.availableSlot.split(' ');

      if (!item.crewCheckbox || item.crew == null) {
        item.crew = 0;
      }
      if (!item.locoCheckbox || item.loco == null) {
        item.loco = 0;
      }
      item.caution = this.cautions[index];

      const dt = DateTime.now();
      const startTime = DateTime.fromFormat(splitSlot[1], 'HH:mm');
      const endTime = DateTime.fromFormat(splitSlot[3], 'HH:mm');
      const timeDifferenceInMinutes = endTime.diff(
        startTime,
        'minutes'
      ).minutes;
      return {
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
      };
    });

    this.service.setMachineRoll(this.domain, payload).subscribe(() => {
      for (let index = this.machineFormArray.length - 1; index >= 0; index--) {
        this.machineFormArray.removeAt(index);
      }
      this.form.get('department')?.enable();
      this.toastService.showSuccess('successfully submitted');
    });
  }

  onAddNewForm() {
    this.form.get('department')?.disable();
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
      machine: [''],
      series: [null],
      typeOfWork: [null],
      dmd_duration: [null],
      availableSlot: [''],
      quantum: [null],
      deputedSupervisor: [null],
      resources: [null],
      ni: [''],
      yard: [null],
      remarks: [null],
      approval: [''],
      s_tStaff: [''],
      tpcStaff: [''],
      point: [null],
      tower: [null],
      crew: [null],
      crewCheckbox: [false],
      loco: [null],
      cautionCheckbox: [false],
      caution: [{ length: '', speed: 0 }],
      locoCheckbox: [false],
      cancelTrain: [null],
      cancelTrainCheckbox: [false],
    });
    this.cautions.push([{ length: '', speed: 0 }]);
    this.machineFormArray.push(machineForm);

    const selectCtrl = machineForm.controls['section'] as FormControl;
    selectCtrl.valueChanges.subscribe((change) => {
      this.prepareAvailableSlots(
        change,
        machineForm.controls['direction'].value
      );
    });
    const directionCtrl = machineForm.controls['direction'] as FormControl;
    directionCtrl.valueChanges.subscribe((change) => {
      this.prepareAvailableSlots(machineForm.controls['section'].value, change);
    });
  }
  addCaution(index) {
    this.cautions[index].push({ length: '', speed: 0 });
  }
  deleteCaution(i, index) {
    this.cautions[i] = this.cautions[i].filter((ele, ind) => index != ind);
  }
  onDelete(index: number) {
    this.machineFormArray.removeAt(index);
    this.railDetails.splice(index, 1);
    if (this.machineFormArray.length === 0) {
      this.form.get('department')?.enable();
    }
  }
  cautionLength($event, index1, index2) {
    this.cautions[index1][index2]['length'] = $event.target.value;
  }
  cautionSpeed($event, index1, index2) {
    this.cautions[index1][index2]['speed'] = $event.target.value;
  }
  prepareAvailableSlots(section, direction) {
    if (!section || !direction) {
      return;
    }
    if (this.availableSlots[section + '_' + direction]) {
      return;
    }
    const slots = AvailableSlotsConfig[section][direction.toLowerCase()];
    if (!slots) return;

    let dt = DateTime.now();
    const weekdays = [];
    for (let i = 0; i < 365; i++) {
      if (slots[dt.weekday]) {
        weekdays.push(dt.toFormat('dd/MM/yyyy') + slots[dt.weekday]);
      }
      dt = dt.plus({ days: 1 });
    }

    this.availableSlots[section + '_' + direction] = weekdays;
  }
}
