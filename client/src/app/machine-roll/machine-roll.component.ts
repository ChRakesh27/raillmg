import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-machine-roll',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './machine-roll.component.html',
  styleUrl: './machine-roll.component.css'
})
export class MachineRollComponent implements OnInit {
  form!: FormGroup


  get machineFormArray(): FormArray {
    return this.form.controls['machineFormArray'] as FormArray
  }

  constructor(private fb: FormBuilder) { }


  ngOnInit(): void {
    this.form = this.fb.group({
      machineFormArray: this.fb.array([])
    })
    this.onAddNewForm()
  }

  onSubmit() {
    console.log(this.machineFormArray.value);
  }

  onAddNewForm() {
    const machineForm = this.fb.group({
      user: [null, Validators.required],
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
      resources: [null, Validators.required]
    });

    this.machineFormArray.push(machineForm)
  }

  onDelete(index: number) {
    this.machineFormArray.removeAt(index)
  }


}




