import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  board = '';
  section = '';
  stations = [];
  payload = {};
  ngOnInit() {}

  onSubmit() {
    this.payload = {
      board: this.board,
      section: this.section,
      stations: this.stations,
    };
    console.log('---------------.', this.payload);
  }

  onAddStation() {
    this.stations.push('');
  }

  onAddSection() {
    // this.section.push('');
  }
  onDelete(index) {}
  onAddNewForm() {}
}

// this.railForm = new FormGroup({
//   board: new FormControl(''),
//   section: new FormControl(''),
//   stations: new FormControl([]),
//   // direction: new FormControl(''),
//   // mps: new FormControl(''),
//   // resources: new FormControl(''),
//   // machines: new FormControl(''),
// });

// this.form = this.fb.group({
//   board: this.fb.control(
//     { value: '', disabled: false },
//     Validators.required
//   ),
//   section: this.fb.control(
//     { value: '', disabled: false },
//     Validators.required
//   ),
//   railFormArray: this.fb.array([]),
// });

// const sectionForm = this.fb.group({
//   station: [''],
// });
// this.railFormArray.push(sectionForm);

// form!: FormGroup;

// get railFormArray(): FormArray {
//   return this.form.controls['machineFormArray'] as FormArray;
// }

// get board(): FormControl {
//   return this.form.controls['department'] as FormControl;
// }
// constructor(private fb: FormBuilder) {}
