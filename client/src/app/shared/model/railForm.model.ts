export interface IRailForm {
  _id: string;
  board: string;
  section: string;
  mps: number;
  slots: {
    id: number;
    direction: string;
    days: String[];
    start: object;
    end: object;
    checked: boolean;
  }[];
  directions: string[];
  stations: string[];
}
