import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  FormControl,
} from '@angular/forms';
import { AppService } from '../../../app.service';
import { DateTime } from 'luxon'
import { AvailableSlotsConfig } from './available-slots';
import { ToastService } from '../../../shared/toast/toast.service';
import { localStorageService } from '../../../shared/service/local-storage.service';

@Component({
  selector: 'app-add-machine-roll',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-machine-roll.component.html',
  styleUrl: './add-machine-roll.component.css',
})
export class AddMachineRollComponent implements OnInit {
  form!: FormGroup;
  userData = {};
  availableSlots = {};
  value: any;
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
  ) { }

  ngOnInit(): void {
    this.userData = this.ls.getUser();
    this.form = this.fb.group({
      department: this.fb.control(
        { value: "CONSTRUCTION", disabled: false },
        Validators.required


      ),
      machineFormArray: this.fb.array([]),
    });
  }

  onSubmit() {
    if (this.machineFormArray.value.length === 0 || !this.form.valid) {
      this.toastService.showWarning("Please fill all details")
      return
    }

    let payload = []
    payload = this.machineFormArray.value.map((item) => {
      let splitSlot = item.availableSlot.split(' ')

      if (!item.crewCheckbox || item.crew == null) {
        item.crew = 0
      }
      if (!item.locoCheckbox || item.loco == null) {
        item.loco = 0
      }

      return {
        ...item,
        avl_start: this.timeFormate(splitSlot[0], splitSlot[1]),
        avl_end: this.timeFormate(splitSlot[0], splitSlot[3]),
        date: splitSlot[0],
        user: this.userData['_id'],
        department: this.department.value,
      };

    });

    this.service.setMachineRoll(payload).subscribe(() => {
      for (let index = this.machineFormArray.length - 1; index >= 0; index--) {
        this.machineFormArray.removeAt(index);
      }
      this.form.get('department')?.enable();
      this.toastService.showSuccess("successfully submitted")
    });

  }
  timeFormate(date, time) {
    let dateTime = new Date(date + " " + time).toISOString()
    let dt = DateTime.fromISO(dateTime);
    return dt.toLocaleString(DateTime.TIME_SIMPLE);
  }

  onAddNewForm() {
    this.form.get('department')?.disable();
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
      time: [null],
      availableSlot: [''],
      quantum: [null],
      deputedSupervisior: [null],
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
      locoCheckbox: [false],
    });

    this.machineFormArray.push(machineForm);

    const selectCtrl = machineForm.controls['section'] as FormControl
    selectCtrl.valueChanges.subscribe((change) => {
      this.prepareAvailableSlots(change, machineForm.controls['direction'].value)
    })
    const directionCtrl = machineForm.controls['direction'] as FormControl
    directionCtrl.valueChanges.subscribe((change) => {
      this.prepareAvailableSlots(machineForm.controls['section'].value, change)
    })
  }

  onDelete(index: number) {
    this.machineFormArray.removeAt(index);
    if (this.machineFormArray.length === 0) {
      this.form.get('department')?.enable();
    }
  }

  prepareAvailableSlots(section, direction) {
    if (!section || !direction) {
      return
    }
    if (this.availableSlots[section + '_' + direction]) {
      return
    }
    const slots = AvailableSlotsConfig[section][direction.toLowerCase()]
    if (!slots) return

    let dt = DateTime.now()
    const weekdays = []
    for (let i = 0; i < 365; i++) {
      if (slots[dt.weekday]) {
        weekdays.push(dt.toFormat('MM/dd/yyyy') + slots[dt.weekday])
      }
      dt = dt.plus({ days: 1 });
    }

    this.availableSlots[section + '_' + direction] = weekdays
  }

}
