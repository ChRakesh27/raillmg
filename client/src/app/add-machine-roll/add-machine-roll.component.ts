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
  selctionObj = {
    "CGS-KYQ": [],
    "KYQ-GHY": [],
    "GHY-NNGE": [],
    'NNGE DGU': [],
    "DGU-CPK": { up: [] },
    "CPK-HJI": []
  }
  value: any;
  get machineFormArray(): FormArray {
    return this.form.controls['machineFormArray'] as FormArray;
  }

  get department(): FormControl {
    return this.form.controls['department'] as FormControl;
  }

  constructor(private fb: FormBuilder, private service: AppService) { }

  ngOnInit(): void {




    this.setDate()



    this.userData = this.service.userData;
    this.form = this.fb.group({
      department: this.fb.control(
        "CONSTRUCTION",
        Validators.required
      ),
      machineFormArray: this.fb.array([]),
    });
  }

  setDate() {
    let dt = DateTime.now()
    for (let i = 0; i < 365; i++) {
      dt = dt.plus({ days: 1 });
      // this.dateOfyear[dt.weekday - 1].push(dt.toLocaleString())

      if (dt.weekday === 3) {
        this.selctionObj["CGS-KYQ"].push(dt.toLocaleString() + "  00:00 to 03:00 hrs(WED)")
        this.selctionObj["KYQ-GHY"].push(dt.toLocaleString() + "  00:00 to 03:00 hrs(WED)")
        this.selctionObj["GHY-NNGE"].push(dt.toLocaleString() + "  00:00 to 03:00 hrs(WED)")
      }
      if (dt.weekday === 4) {
        this.selctionObj["CGS-KYQ"].push(dt.toLocaleString() + "  00:00 to 03:00 hrs(THR)")
        this.selctionObj["KYQ-GHY"].push(dt.toLocaleString() + "  00:00 to 03:00 hrs(THR)")
        this.selctionObj["GHY-NNGE"].push(dt.toLocaleString() + "  00:00 to 03:00 hrs(THR)")
      }
      if (dt.weekday === 5) {
        this.selctionObj["CGS-KYQ"].push(dt.toLocaleString() + "  00:00 to 03:00 hrs(FRI)")
        this.selctionObj["KYQ-GHY"].push(dt.toLocaleString() + "  00:00 to 03:00 hrs(FRI)")
        this.selctionObj["GHY-NNGE"].push(dt.toLocaleString() + "  00:00 to 03:00 hrs(FRI)")
      }







    }

  }




  onSubmit() {
    if (this.machineFormArray.value.length === 0 || !this.form.valid) {
      alert("form is not valid")
      return
    }

    let payload = this.machineFormArray.value.map((item) => {
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
  }

  onDelete(index: number) {
    this.machineFormArray.removeAt(index);
  }

  onSection(data) {
    let val = data.controls['selection'].value

    // if (val === "CGS-KYQ" || val === "KYQ-GHY" ||)
    return this.selctionObj[val]



  }








}
