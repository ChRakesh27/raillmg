import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-machine-roll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './machine-roll.component.html',
  styleUrl: './machine-roll.component.css'
})
export class MachineRollComponent implements OnInit {
  userData = {};
  machineRolls = []
  constructor(private service: AppService) { }


  ngOnInit(): void {
    this.userData = this.service.userData;
    this.service.getMachineRoll(this.userData["_id"]).subscribe((data) => {
      this.machineRolls = data
    })
  }




}




