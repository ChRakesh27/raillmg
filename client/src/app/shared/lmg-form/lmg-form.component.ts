import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { stationList } from '../constants/station-list';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import { AvailableSlotsConfig } from '../constants/available-slots';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lmg-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lmg-form.component.html',
  styleUrl: './lmg-form.component.css'
})
export class LmgFormComponent implements OnInit, OnChanges {

  @Input() department = 'CONSTRUCTION'
  @Input() machineForm: FormGroup;
  @Input() formValues: any;
  @Output() depFrom = new EventEmitter();

  stations = stationList
  availableSlots = {}
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.createForm()

    const selectCtrl = this.machineForm.controls['section'] as FormControl
    selectCtrl.valueChanges.subscribe((change) => {
      this.prepareAvailableSlots(change, this.machineForm.controls['direction'].value)
    })
    const directionCtrl = this.machineForm.controls['direction'] as FormControl
    directionCtrl.valueChanges.subscribe((change) => {
      this.prepareAvailableSlots(this.machineForm.controls['section'].value, change)
    })
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log("🚀 ~ changes:", changes)
    const values = changes?.formValues?.currentValue
    if (values && Object.keys(values).length !== 0) {
      this.machineForm.patchValue(values)
    }
  }



  createForm() {
    this.machineForm.addControl('board', new FormControl(this.formValues?.board || ''))
    this.machineForm.addControl('section', new FormControl(this.formValues?.section || ''))
    this.machineForm.addControl('stationTo', new FormControl(this.formValues?.stationTo || ''))
    this.machineForm.addControl('stationFrom', new FormControl(this.formValues?.stationFrom || ''))
    this.machineForm.addControl('direction', new FormControl(this.formValues?.direction || ''))
    this.machineForm.addControl('lineNo', new FormControl(this.formValues?.lineNo || null))
    this.machineForm.addControl('machine', new FormControl(this.formValues?.machine || ''))
    this.machineForm.addControl('series', new FormControl(this.formValues?.series || null))
    this.machineForm.addControl('typeOfWork', new FormControl(this.formValues?.typeOfWork || null))
    this.machineForm.addControl('time', new FormControl(this.formValues?.time || null))
    this.machineForm.addControl('availableSlot', new FormControl(this.formValues?.availableSlot || ''))
    this.machineForm.addControl('quantum', new FormControl(this.formValues?.quantum || null))
    this.machineForm.addControl('deputedSupervisior', new FormControl(this.formValues?.deputedSupervisior || null))
    this.machineForm.addControl('resources', new FormControl(this.formValues?.resources || null))
    this.machineForm.addControl('ni', new FormControl(this.formValues?.ni || ''))
    this.machineForm.addControl('yard', new FormControl(this.formValues?.yard || null))
    this.machineForm.addControl('remarks', new FormControl(this.formValues?.remarks || null))
    this.machineForm.addControl('approval', new FormControl(this.formValues?.approval || ''))
    this.machineForm.addControl('s_tStaff', new FormControl(this.formValues?.s_tStaff || ''))
    this.machineForm.addControl('tpcStaff', new FormControl(this.formValues?.tpcStaff || ''))
    this.machineForm.addControl('point', new FormControl(this.formValues?.point || null))
    this.machineForm.addControl('tower', new FormControl(this.formValues?.tower || null))
    this.machineForm.addControl('crew', new FormControl(this.formValues?.crew || null))
    this.machineForm.addControl('crewCheckbox', new FormControl(this.formValues?.crewCheckbox || false))
    this.machineForm.addControl('loco', new FormControl(this.formValues?.loco || null))
    this.machineForm.addControl('locoCheckbox', new FormControl(this.formValues?.locoCheckbox || false))
    console.log('->>>>>>>>>>>>', this.machineForm.value, this.department);
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
