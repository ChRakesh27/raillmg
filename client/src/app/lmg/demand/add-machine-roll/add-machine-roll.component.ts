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
        "CONSTRUCTION",
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


    let payload = this.machineFormArray.value.map((item) => {
      let splitSlot = item.availableSlot.split(' ')
      item.availableSlot = {
        startDate: this.getISOString(splitSlot[0], splitSlot[1]),
        endDate: this.getISOString(splitSlot[0], splitSlot[3])
      }

      return {
        ...item,
        user: this.userData['_id'],
        department: this.department.value,
      };
    });

    this.service.setMachineRoll(payload).subscribe(() => {
      this.machineFormArray.reset();
      this.toastService.showSuccess("successfully submitted")
    });

  }

  getISOString(date, time): string {
    return new Date(date + " " + time).toISOString()
  }

  onAddNewForm() {
    const machineForm = this.fb.group({
      section: [null, Validators.required],
      stationTo: [null, Validators.required],
      stationFrom: [null, Validators.required],
      direction: [null, Validators.required],
      lineNo: [null, Validators.required],
      machine: [null, Validators.required],
      series: [null, Validators.required],
      aboutWork: [null, Validators.required],
      time: [null, Validators.required],
      availableSlot: [null, Validators.required],
      quantum: [null, Validators.required],
      deputedSupervisor: [null, Validators.required],
      resources: [null, Validators.required],
      crew: [0],
      loco: [0],
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
        weekdays.push(dt.toLocaleString() + slots[dt.weekday])
      }
      dt = dt.plus({ days: 1 });
    }

    this.availableSlots[section + '_' + direction] = weekdays
  }

}
