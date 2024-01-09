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
  sectionSeleted = {};
  boardList = [];
  sectionList = [];
  machineList = [];
  stationList = [];
  selectIndex: number;
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
    {
      id: 4,
      direction: 'north',
      days: [],
      start: {},
      end: {},
      checked: false,
    },
    {
      id: 5,
      direction: 'south',
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
  boardDataset = [];
  constructor(
    private service: AppService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    Promise.resolve().then(() => {
      this.service.getAllRailDetails('boards').subscribe((data) => {
        this.boardDataset = data;
        for (let item of data) {
          this.boardList.push(item.board);
        }
      });
    });
    Promise.resolve().then(() => {
      this.service.getAllRailDetails('railDetails').subscribe((data) => {
        this.dataSet = data;
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

  onSelectBoard(e) {
    this.board = e.target.value;
    this.sectionList = [];
    for (let item of this.dataSet) {
      if (item.board === this.board) {
        this.sectionList.push(item.section);
      }
    }
  }

  onSelectSection(e) {
    this.section = e.target.value;
    for (let index in this.dataSet) {
      if (
        this.dataSet[index].board === this.board &&
        this.dataSet[index].section === this.section
      ) {
        this.sectionSeleted = this.dataSet[index];
        this.selectIndex = +index;
      }
    }
    this.dataSet.forEach(function (item, i) {});
  }

  onSubmitAvl() {
    if (this.board == '' || this.section == '') {
      this.toastService.showWarning('enter valid Details');
      return;
    }

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
    const payload = {
      directions: [
        ...this.sectionSeleted['directions'],
        ...Object.keys(this.avlPreview),
      ],
      slots: { ...this.sectionSeleted['slots'], ...this.avlPreview },
    };
    if (
      this.board == '' ||
      this.section == '' ||
      Object.keys(this.avlPreview).length == 0
    ) {
      this.toastService.showWarning('enter valid Details');
      return;
    }

    this.service
      .updateRailDetails('railDetails', this.sectionSeleted['_id'], payload)
      .subscribe((res) => {
        this.toastService.showSuccess('successfully submitted');
        this.dataSet[this.selectIndex] = res;
        this.sectionSeleted = res;
      });
  }

  addBoard() {
    if (this.board == '') {
      this.toastService.showWarning('enter valid Details');
      return;
    }
    if (this.boardList.includes(this.board)) {
      this.toastService.showDanger(this.board + ' is already existed');
      return;
    }

    const payload = {
      board: this.board,
    };
    this.service.addRailDetails('boards', payload).subscribe((res) => {
      this.toastService.showSuccess('successfully submitted');
      this.boardList.push(this.board);
      this.board = '';
      this.boardDataset.push(res);
    });
  }

  addSection() {
    if (this.board == '' || this.section == '') {
      this.toastService.showWarning('enter valid Details');
      return;
    }
    const payload = { board: this.board, section: this.section };
    this.service.addRailDetails('railDetails', payload).subscribe((res) => {
      if (res.code == 11000) {
        this.toastService.showDanger(this.section + ' is already existed');
      } else {
        this.dataSet[this.dataSet.length] = res;
        this.sectionList.push(this.section);
        this.toastService.showSuccess('successfully submitted');
      }
    });
  }

  addMPS(add = true) {
    if ((this.board == '' || this.section == '' || this.mps == '') && add) {
      this.toastService.showWarning('enter valid Details');
      return;
    }
    let payload = { mps: 0 };
    if (add) {
      payload.mps = +this.mps;
    }

    this.service
      .updateRailDetails('railDetails', this.sectionSeleted['_id'], payload)
      .subscribe((res) => {
        this.dataSet[this.selectIndex] = res;
        this.sectionSeleted = res;
        this.toastService.showSuccess('successfully submitted');
      });
  }

  addStation() {
    if (this.board == '' || this.section == '' || this.station == '') {
      this.toastService.showWarning('enter valid Details');
      return;
    }

    const payload = {
      stations: [...this.sectionSeleted['stations'], this.station],
    };
    this.service
      .updateRailDetails('railDetails', this.sectionSeleted['_id'], payload)
      .subscribe((res) => {
        if (res.code == 11000) {
          this.toastService.showDanger(this.station + ' is already existed');
        } else {
          this.toastService.showSuccess('successfully submitted');
          this.dataSet[this.selectIndex] = res;
          this.stationList.push(this.station);
          this.sectionSeleted = res;
        }
      });
  }

  addMachine() {
    if (this.machine == '') {
      this.toastService.showWarning('enter valid Details');
      return;
    }
    if (this.machineList.includes(this.machine)) {
      this.toastService.showDanger(this.machine + ' is already existed');
      return;
    }
    const payload = { machine: this.machine };
    this.service.addRailDetails('machines', payload).subscribe((res) => {
      this.toastService.showSuccess('successfully submitted');
      this.machineList.push(res);
      this.machine = '';
    });
  }

  onDeleteBoard(board) {
    const boardDelete = this.boardDataset.find((ele) => ele.board === board);

    const confirmDelete = confirm('entire data of ' + board + ' is deleted');
    if (!confirmDelete) {
      return;
    }

    for (let ele of this.dataSet) {
      if (ele.board == board) {
        this.service
          .deleteRailDetails('railDetails', ele._id)
          .subscribe((res) => {});
      }
    }

    this.service.deleteRailDetails('boards', boardDelete._id).subscribe(() => {
      this.boardList = this.boardList.filter((ele) => ele != board);
      this.toastService.showSuccess('successfully deleted');
    });
  }

  onDeleteSection(id, section) {
    const confirmDelete = confirm('entire data of ' + section + ' is deleted');
    if (!confirmDelete) {
      return;
    }
    this.service.deleteRailDetails('railDetails', id).subscribe((res) => {
      this.dataSet = this.dataSet.filter((ele) => ele._id != id);
      this.toastService.showSuccess('successfully deleted');
    });
  }

  onDeleteMachine(data) {
    const confirmDelete = confirm('Are you sure to delete :' + data.machine);
    if (!confirmDelete) {
      return;
    }
    this.service.deleteRailDetails('machines', data._id).subscribe((res) => {
      this.machineList = this.machineList.filter((ele) => ele._id != data._id);
      this.toastService.showSuccess('successfully deleted');
    });
  }

  onDeleteStation(data) {
    const filterStations = this.sectionSeleted['stations'].filter(
      (ele) => ele !== data
    );
    const payload = {
      stations: filterStations,
    };
    this.service
      .updateRailDetails('railDetails', this.sectionSeleted['_id'], payload)
      .subscribe((res) => {
        if (res.code == 11000) {
          this.toastService.showDanger(this.station + ' is already existed');
        } else {
          this.toastService.showSuccess('successfully submitted');
          this.dataSet[this.selectIndex] = res;
          this.stationList.push(this.station);
          this.sectionSeleted = res;
        }
      });
  }
  onDeleteAvlSlot(data) {
    console.log('🚀 ~ data:', data, this.dataSet, this.sectionSeleted);

    const filterDir = this.sectionSeleted['directions'].filter(
      (ele) => ele !== data
    );
    const tempSlot = { ...this.sectionSeleted['slots'] };
    delete tempSlot[data];

    const payload = {
      directions: filterDir,
      slots: tempSlot,
    };
    console.log('🚀 ~ payload:', payload);
    this.service
      .updateRailDetails('railDetails', this.sectionSeleted['_id'], payload)
      .subscribe((res) => {
        this.toastService.showSuccess('successfully submitted');
        this.dataSet[this.selectIndex] = res;
        this.sectionSeleted = res;
      });
  }
  onTabChange() {
    this.board = '';
    this.section = '';
  }
}
