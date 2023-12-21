import Handsontable from "handsontable";
import { columns } from "./table-columns";

export const hotSettings: Handsontable.GridSettings = {
    rowHeaders: true,
    columns: columns,
    columnHeaderHeight: 50,
    multiColumnSorting: true,
    manualColumnResize: true,
    filters: true,
    manualColumnMove: true,
    rowHeights: 23,
    colWidths: 100,
    width: '100%',
    height: '70vh',
    viewportColumnRenderingOffset: 20,
    viewportRowRenderingOffset: "auto",
    dropdownMenu: ['filter_by_value', 'filter_operators', 'filter_action_bar'],
    hiddenColumns: {
        columns: [0],
        indicators: false
    },
    cells: function (row, col) {
        return {
            className: row % 2 == 0 ? 'evenCell' : 'oddCell',

        };
    }


}