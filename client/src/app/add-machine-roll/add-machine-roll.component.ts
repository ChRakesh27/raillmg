import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { AppService } from '../app.service';

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

  get machineFormArray(): FormArray {
    return this.form.controls['machineFormArray'] as FormArray;
  }

  get department(): string {
    return this.form.controls['department'].value;
  }

  constructor(private fb: FormBuilder, private service: AppService) { }

  ngOnInit(): void {
    this.userData = this.service.userData;
    this.form = this.fb.group({
      department: this.fb.control(
        null,
        Validators.required
      ),
      machineFormArray: this.fb.array([]),
    });
  }

  onSubmit() {
    if (this.machineFormArray.valid) {
      let payload = this.machineFormArray.value.map((item) => {
        return {
          ...item,
          user: this.userData['_id'],
          department: this.department,
        };
      });

      this.service.setMachineRoll(payload).subscribe(() => {
        this.machineFormArray.reset();
        alert('Your successful submission');
      });
    } else {
      alert('fill all details');
    }
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
  }

  onDelete(index: number) {
    this.machineFormArray.removeAt(index);
  }
}
