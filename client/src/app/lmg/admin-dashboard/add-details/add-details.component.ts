import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../app.service';
import { ToastService } from '../../../shared/toast/toast.service';
import {
  NgbNavModule,
  NgbTimepickerModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  OperatorFunction,
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs';
import { IRailForm } from '../../../shared/model/railForm.model';

export interface AvlSlot {}

@Component({
  selector: 'app-add-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbTypeaheadModule,
    JsonPipe,
    NgbTimepickerModule,
    NgbNavModule,
  ],
  templateUrl: './add-details.component.html',
  styleUrl: './add-details.component.css',
})
export class AddDetailsComponent {
  active = 'board';
  board = '';
  section = '';
  mps = '';
  station = '';
  machine = '';
  slot = '';

  boardList = [];
  sectionList = [];
  machineList = [];
  stationList = [];
  dataSet = [];

  directions = [
    {
      id: 1,
      direction: 'up',
      days: [],
      start: {},
      end: {},
      checked: false,
    },
    {
      id: 2,
      direction: 'down',
      days: [],
      start: {},
      end: {},
      checked: false,
    },
    {
      id: 3,
      direction: 'both',
      days: [],
      start: {},
      end: {},
      checked: false,
    },
  ];

  formatter = (result: string) => result.toUpperCase();

  selectedAvl: number;
  railForm: IRailForm[] = [];
  avlPreview = {};
  weekdays = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  sup_board_wise = {};
  constructor(
    private service: AppService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    Promise.resolve().then(() => {
      this.service.getAllRailDetails('boards').subscribe((data) => {
        for (let item of data) {
          console.log('🚀 ~ item:', item);
          this.boardList.push(item.board);
        }
      });
    });
    Promise.resolve().then(() => {
      this.service.getAllRailDetails('railDetails').subscribe((data) => {
        this.dataSet = data;
        for (let item of data) {
          if (!this.sectionList.includes(item.section)) {
            this.sectionList.push(item.section);
          }
          if (this.sup_board_wise[item.board] === undefined) {
            this.sup_board_wise[item.board] = [];
          }
          this.sup_board_wise[item.board].push(item);
        }
      });
    });
    Promise.resolve().then(() => {
      this.service.getAllRailDetails('machines').subscribe((data) => {
        this.machineList = data;
      });
    });
  }

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term === ''
          ? []
          : this.boardList
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  onSubmitAvl() {
    for (let item of this.directions) {
      if (!item.checked) {
        continue;
      }

      let days = [];
      for (let day in item.days) {
        if (item.days[day] === null) {
          continue;
        }
        days.push(this.weekdays[day]);
      }

      const startHur =
        item.start['hour'] < 10 ? '0' + item.start['hour'] : item.start['hour'];
      const startMin =
        item.start['minute'] < 10
          ? '0' + item.start['minute']
          : item.start['minute'];
      const endHur =
        item.end['hour'] < 10 ? '0' + item.end['hour'] : item.end['hour'];
      const endMin =
        item.end['minute'] < 10 ? '0' + item.end['minute'] : item.end['minute'];

      this.avlPreview[item.direction] = {
        days,
        time:
          startHur + ':' + startMin + ' to ' + endHur + ':' + endMin + ' hrs',
      };
    }

    const sectionSeleted = this.dataSet.find(
      (ele) => ele.section === this.section
    );
    const payload = {
      directions: Object.keys(this.avlPreview),
      slots: { ...sectionSeleted.slots, ...this.avlPreview },
    };

    this.service
      .updateRailDetails('railDetails', sectionSeleted._id, payload)
      .subscribe((res) => {
        this.toastService.showSuccess('successfully submitted');
      });
  }

  addBoard() {
    const payload = {
      board: this.board,
    };
    this.service.addRailDetails('boards', payload).subscribe((res) => {
      this.toastService.showSuccess('successfully submitted');
      this.boardList.push(this.board);
    });
  }

  addSection() {
    const payload = { board: this.board, section: this.section };
    this.service.addRailDetails('railDetails', payload).subscribe((res) => {
      this.toastService.showSuccess('successfully submitted');
    });
  }

  addMPS() {
    const sectionSeleted = this.dataSet.find(
      (ele) => ele.section === this.section
    );
    const payload = { mps: this.mps };
    this.service
      .updateRailDetails('railDetails', sectionSeleted._id, payload)
      .subscribe((res) => {
        this.toastService.showSuccess('successfully submitted');
      });
  }

  addStation() {
    const sectionSeleted = this.dataSet.find(
      (ele) => ele.section === this.section
    );
    const payload = { stations: [...sectionSeleted.stations, this.station] };
    this.service
      .updateRailDetails('railDetails', sectionSeleted._id, payload)
      .subscribe((res) => {
        this.toastService.showSuccess('successfully submitted');
      });
  }

  addSlot() {}

  addMachine() {
    const payload = { machine: this.machine };
    this.service.addRailDetails('machines', payload).subscribe((res) => {
      this.toastService.showSuccess('successfully submitted');
      this.machineList.push(res);
    });
  }
}
