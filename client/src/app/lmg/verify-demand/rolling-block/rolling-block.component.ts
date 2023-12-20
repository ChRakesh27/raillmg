import { Component } from '@angular/core';
import { AppService } from '../../../app.service';
import { CommonModule } from '@angular/common';
import { EditComponent } from '../../../shared/edit/edit.component';

@Component({
  selector: 'app-rolling-block',
  standalone: true,
  imports: [CommonModule, EditComponent],
  templateUrl: './rolling-block.component.html',
  styleUrl: './rolling-block.component.css'
})
export class RollingBlockComponent {
  columns = [
    { data: '_id', title: '_id' },
    { data: 'Avl_status', title: 'AVAIL STATUS', type: 'checkbox', defaultData: true },
    { data: "date", title: "Date" },
    { data: "department", title: "DEPARTMENT" },
    { data: "board", title: "BOARD", type: 'select', selectOptions: ['BG1', 'BG2', 'BG3', 'BG4', 'BG5'] },
    { data: "section", title: "SECTION" },
    { data: "avl_start", title: "SLOT START" },
    { data: "avl_end", title: "SLOT END" },
    { data: "avl_duration", title: "AVL DURATION" },
    { data: "dmd_duration", title: "DMD DURATION" },
    { data: "machine", title: "TYPE OF MACHINE" },
    { data: "grant_status", title: "GRANT STATUS", type: 'select', selectOptions: ['Pending', 'Granted', 'Not Granted'] },
    { data: "time_granted", title: "TIME GRANTED" },
    { data: "remarks", title: "REMARKS" }]

  dataSet = []
  constructor(private service: AppService) { }
  ngOnInit(): void {
    this.service.getAllMachineRoll().subscribe((data) => {
      this.dataSet = data
    });
  }
}
