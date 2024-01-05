export interface IRailForm {
  section: string;
  mps: number;
  avl_slot: {
    id: number;
    direction: string;
    days: String[];
    start: object;
    end: object;
    checked: boolean;
  }[];
  machines: string[];
  stations: string[];
}
