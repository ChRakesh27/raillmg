import { Component, Input } from '@angular/core';
import { stationList } from '../staion-list';
import { FormBuilder } from '@angular/forms';
import { DateTime } from 'luxon';
import { AvailableSlotsConfig } from './available-slots';

@Component({
  selector: 'app-lmg-form',
  standalone: true,
  imports: [],
  templateUrl: './lmg-form.component.html',
  styleUrl: './lmg-form.component.css'
})
export class LmgFormComponent {

  @Input() department = ''
  stations = stationList

  machineForm: any;
  availableSlots = {}
  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    this.machineForm = this.fb.group({
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

    console.log('->>>>>>>>>>>>>>>>', this.department);

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
