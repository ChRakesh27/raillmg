import { Component } from '@angular/core';
import { EditComponent } from '../../../shared/edit/edit.component';

@Component({
  selector: 'app-non-rolling-block',
  standalone: true,
  imports: [EditComponent],
  templateUrl: './non-rolling-block.component.html',
  styleUrl: './non-rolling-block.component.css'
})
export class NonRollingBlockComponent {
  columns = [
    { data: '_id', title: '_id' },
    { data: 'status', title: 'Status', type: 'select', selectOptions: ['Accept', 'Reject'] },
    { data: "date", title: "Date" },
    { data: "department", title: "department" },
    { data: "board", title: "BOARD", type: 'select', selectOptions: ['BG1', 'BG2', 'BG3', 'BG4', 'BG5'] },
    { data: "section", title: "Section" },
    { data: "slot", title: "Slot" },
    { data: "avl_duration", title: "Avl Duration" },
    { data: "dmd_duration", title: "Dmd Duration" },
    { data: "machine", title: "Type of machine" },
    // { data: "grant_status", title: "Grant Status", type: 'select', selectOptions: ['Pending', 'Granted', 'Not Granted'] },
    // { data: "time_granted", title: "Time Granted" },
    // { data: "remarks", title: "Remarks" }
  ]



}
