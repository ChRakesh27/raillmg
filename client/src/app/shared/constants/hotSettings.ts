import Handsontable from "handsontable";
import { columns } from "./table-columns";

export const hotSettings: Handsontable.GridSettings = {
    rowHeaders: true,
    colWidths: '150',
    columns: columns,
    columnHeaderHeight: 50,
    rowHeights: 50,
    height: 'auto',
    multiColumnSorting: true,
    manualColumnResize: true,
    filters: true,
    manualColumnMove: true,
    dropdownMenu: ['filter_by_value', 'filter_operators', 'filter_action_bar'],
    hiddenColumns: {
        columns: [0],
        indicators: false
    }
}