import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { AppService } from '../../../app.service';
import { DateTime } from 'luxon'
import { ToastService } from '../../../shared/toast/toast.service';
import { localStorageService } from '../../../shared/service/local-storage.service';
import { LmgFormComponent } from "../../../shared/lmg-form/lmg-form.component";
import { stationList } from '../../../shared/constants/station-list';

@Component({
  selector: 'app-add-machine-roll',
  standalone: true,
  templateUrl: './add-machine-roll.component.html',
  styleUrl: './add-machine-roll.component.css',
  imports: [CommonModule, ReactiveFormsModule, LmgFormComponent]
})
export class AddMachineRollComponent implements OnInit {
  form!: FormGroup;
  userData = {};
  availableSlots = {};
  value: any;
  stationList = stationList

  get machineFormGroup(): FormGroup {
    return this.form.controls['machineFormGroup'] as FormGroup;
  }

  get machineFormGroupControls(): { [key: string]: FormGroup } {
    const controls = (this.form.controls['machineFormGroup'] as FormGroup).controls
    const map = {}
    for (const ctrl in controls) {
      map[ctrl] = controls[ctrl] as FormGroup
    }
    return map;
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
      machineFormGroup: this.fb.group({})
    });
  }

  onAddNewForm() {
    this.form.get('department')?.disable();
    this.machineFormGroup.addControl('item1', this.fb.group({}))
  }


  onSubmit() {
    if (Object.keys(this.machineFormGroup).length === 0 || !this.form.valid) {
      this.toastService.showWarning("Please fill all details")
      return
    }

    const payload = Object.values(this.machineFormGroup.value).map((item: any) => {
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
      const controls = (this.form.controls['machineFormGroup'] as FormGroup).controls
      for (const ctrl in controls) {
        this.machineFormGroup.removeControl(ctrl)
      }
      this.form.get('department')?.enable();
      this.toastService.showSuccess("successfully submitted")
    });

  }
  timeFormate(date, time) {
    let dateTime = new Date(date + " " + time).toISOString()
    let dt = DateTime.fromISO(dateTime);
    return dt.toLocaleString(DateTime.TIME_24_SIMPLE);
  }

  onDelete(key: string) {
    this.machineFormGroup.removeControl(key)
    if (Object.keys(this.machineFormGroup).length === 0) {
      this.form.get('department')?.enable();
    }
  }
}
