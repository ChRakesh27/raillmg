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
import { AppService } from '../app.service';
import { DateTime } from 'luxon'
import { AvailableSlotsConfig } from './available-slots';

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

  constructor(private fb: FormBuilder, private service: AppService) { }

  ngOnInit(): void {
    this.userData = this.service.userData;
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
      alert("form is not valid")
      return
    }


    let payload = this.machineFormArray.value.map((item) => {
      let splitSlot = item.availableSlot.split(' ')
      item.availableSlot = { startDate: splitSlot[0] + ' ' + splitSlot[1] + ' ' + splitSlot[4], endDate: splitSlot[0] + ' ' + splitSlot[3] + ' ' + splitSlot[4] }

      return {
        ...item,
        user: this.userData['_id'],
        department: this.department.value,
      };
    });

    this.service.setMachineRoll(payload).subscribe(() => {
      this.machineFormArray.reset();
      alert('Your successful submission');
    });

  }

  onAddNewForm() {
    const machineForm = this.fb.group({
      selection: [null, Validators.required],
      station: [null, Validators.required],
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
    });

    this.machineFormArray.push(machineForm);

    const selectCtrl = machineForm.controls['selection'] as FormControl
    selectCtrl.valueChanges.subscribe((change) => {
      this.prepareAvailableSlots(change, machineForm.controls['direction'].value)
    })
    const directionCtrl = machineForm.controls['direction'] as FormControl
    directionCtrl.valueChanges.subscribe((change) => {
      this.prepareAvailableSlots(machineForm.controls['selection'].value, change)
    })
  }

  onDelete(index: number) {
    this.machineFormArray.removeAt(index);
  }

  prepareAvailableSlots(selection, direction) {
    console.log(selection, direction)
    if (!selection || !direction) {
      return
    }

    if (this.availableSlots[selection + '_' + direction]) {
      return
    }

    const slots = AvailableSlotsConfig[selection][direction.toLowerCase()]
    if (!slots) return

    let dt = DateTime.now()
    const weekdays = []
    for (let i = 0; i < 365; i++) {
      if (slots[dt.weekday]) {
        weekdays.push(dt.toLocaleString() + slots[dt.weekday])
      }
      dt = dt.plus({ days: 1 });
    }

    this.availableSlots[selection + '_' + direction] = weekdays
  }

}
