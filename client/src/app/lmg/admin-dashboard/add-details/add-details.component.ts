import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../app.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { NgbNavModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { IRailForm } from '../../../shared/model/railForm.model';

@Component({
  selector: 'app-add-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    JsonPipe,
    NgbTimepickerModule,
    NgbNavModule,
  ],
  templateUrl: './add-details.component.html',
  styleUrl: './add-details.component.css',
})
export class AddDetailsComponent implements OnInit {
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
    console.log('🚀 ~ sectionSeleted:', this.sectionSeleted);
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
      if (this.sectionSeleted['directions'].includes(item.direction)) {
        this.toastService.showDanger(
          'Direction ' + item.direction + ' already Add'
        );
        return;
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

    this.updateAvlSlot(payload);
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

  addMPS(add = true, edit = false) {
    if (
      (this.board == '' || this.section == '' || this.mps == '') &&
      add &&
      !edit
    ) {
      this.toastService.showWarning('enter valid Details');
      return;
    }
    if (this.sectionSeleted['mps'] !== 0 && !edit) {
      this.toastService.showDanger(this.mps + " is couldn't update");
      return;
    }

    let payload = { mps: 0 };
    if (edit) {
      this.mps = prompt('enter the new MPS', this.sectionSeleted['mps']);
      if (
        this.mps === null ||
        this.mps == '0' ||
        this.mps === this.sectionSeleted['mps']
      ) {
        return;
      }
    }

    if (add) {
      payload.mps = +this.mps;
    } else {
      const confirmDelete = confirm('Are you sure to delete :' + this.mps);
      if (!confirmDelete) {
        return;
      }
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
    this.updateStation(payload);
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

  onDeleteBoard(data) {
    const confirmDelete = confirm(
      'entire data of ' + data.board + ' is deleted'
    );
    if (!confirmDelete) {
      return;
    }

    for (let ele of this.dataSet) {
      if (ele.board == data.board) {
        this.service
          .deleteRailDetails('railDetails', ele._id)
          .subscribe((res) => {});
      }
    }

    this.service.deleteRailDetails('boards', data._id).subscribe(() => {
      this.boardList = this.boardList.filter((ele) => ele != data.board);
      this.boardDataset = this.boardDataset.filter(
        (ele) => ele.board !== data.board
      );
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
    const confirmDelete = confirm('Are you sure to delete : ' + data);
    if (!confirmDelete) {
      return;
    }
    const filterStations = this.sectionSeleted['stations'].filter(
      (ele) => ele !== data
    );
    const payload = {
      stations: filterStations,
    };
    this.updateStation(payload);
  }

  onDeleteAvlSlot(data) {
    const confirmDelete = confirm('Are you sure to delete :' + data);
    if (!confirmDelete) {
      return;
    }

    const filterDir = this.sectionSeleted['directions'].filter(
      (ele) => ele !== data
    );
    const tempSlot = { ...this.sectionSeleted['slots'] };
    delete tempSlot[data];

    const payload = {
      directions: filterDir,
      slots: tempSlot,
    };
    this.updateAvlSlot(payload);
  }

  updateAvlSlot(payload) {
    this.service
      .updateRailDetails('railDetails', this.sectionSeleted['_id'], payload)
      .subscribe((res) => {
        this.toastService.showSuccess('successfully submitted');
        this.dataSet[this.selectIndex] = res;
        this.sectionSeleted = res;
      });
  }

  updateStation(payload) {
    this.service
      .updateRailDetails('railDetails', this.sectionSeleted['_id'], payload)
      .subscribe((res) => {
        if (res.code == 11000) {
          this.toastService.showDanger(this.station + ' is already existed');
        } else {
          this.toastService.showSuccess('successfully submitted');
          this.dataSet[this.selectIndex] = res;
          this.sectionSeleted = res;
        }
      });
  }

  editBoard(data) {
    const renameBoard = prompt('Rename the board:', data.board);
    if (renameBoard === null || renameBoard === data.board) {
      return;
    }

    for (let ele of this.dataSet) {
      if (ele.board == data.board) {
        this.service
          .updateRailDetails('railDetails', ele._id, { board: renameBoard })
          .subscribe((res) => {
            this.dataSet = this.dataSet.map((item) => {
              if (item._id === res._id) {
                item.board = res.board;
              }
              return item;
            });
          });
      }
    }
    console.log('🚀 ~ dataSet:', this.dataSet);

    this.service
      .updateRailDetails('boards', data._id, { board: renameBoard })
      .subscribe(() => {
        this.boardList = this.boardList.map((ele) => {
          if (ele == data.board) {
            ele = renameBoard;
          }
          return ele;
        });
        this.boardDataset = this.boardDataset.map((ele) => {
          if (ele.board === data.board) {
            ele.board = renameBoard;
          }
          return ele;
        });
        console.log('🚀 ~ boardDataset:', this.boardDataset);
        this.toastService.showSuccess('successfully Updated');
      });
  }

  editSection(data, index) {
    const renameSection = prompt('Rename the section:', data.section);
    if (renameSection == null || renameSection === data.section) {
      return;
    }

    const payload = { section: renameSection };
    this.service
      .updateRailDetails('railDetails', data._id, payload)
      .subscribe((res) => {
        if (res.code == 11000) {
          this.toastService.showDanger(renameSection + ' is already existed');
        } else {
          this.dataSet[index] = res;

          this.sectionList.splice(
            this.sectionList.indexOf(data.section),
            1,
            renameSection
          );

          this.toastService.showSuccess('successfully Updated');
        }
      });
  }

  editStation(data, index) {
    const renameStation = prompt('Rename the Station:', data);
    if (renameStation === null || renameStation === data) {
      return;
    }
    this.sectionSeleted['stations'].splice(index, 1, renameStation);
    const payload = { stations: this.sectionSeleted['stations'] };

    this.updateStation(payload);
  }

  editMachine(data, index) {
    const renameMachine = prompt('Rename the Machine:', data.machine);
    if (renameMachine === null || renameMachine === data.machine) {
      return;
    }

    const payload = {
      machine: renameMachine,
    };

    this.service
      .updateRailDetails('machines', data._id, payload)
      .subscribe((res) => {
        this.machineList[index] = res;
        this.toastService.showSuccess('successfully Updated');
      });
  }
  onTabChange() {
    this.board = '';
    this.section = '';
    this.sectionList = [];
    this.directions = [
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
    this.sectionSeleted = {};
  }
}
