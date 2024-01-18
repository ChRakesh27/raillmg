export interface IMachineRoll {
  _id?: string;
  date: string;
  department: string;
  section: string;
  stationTo: string;
  stationFrom: string;
  direction: string;
  lineNo: string;
  machine: string;
  dmd_duration: number;
  avl_duration: number;
  avl_start: string;
  avl_end: string;
  quantum: string;
  deputedSupervisor: string;
  resources: string;
  crew: number;
  loco: number;
  board: string;
  typeOfWork: string;
  ni: string;
  remarks: string;
  approval: string;
  s_tStaff: string;
  tpcStaff: string;
  grant_status: string;
  Avl_status: boolean;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  logs: ILog[];
  series: string;
  time_granted: string;
  caution: [];
  cancelTrain: string;
  integrated: string;
  km: string;
  Apl_remarks: string;
  Dmd_remarks: string;
  slots: string;
  output: string;
  OPTG_remarks: string;
}

export interface ILog {
  updatedBy: string;
  updatedAt: string;
  field: string;
  oldValue: string;
  newValue: string;
}
