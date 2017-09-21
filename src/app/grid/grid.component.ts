import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
    rowData = [];
    columnDefs = [];
    gridOptions: any = {};

    constructor() {
    }

    ngOnInit() {
        this.getTestData();
        this.getColDef();

        this.gridOptions.enableFilter = true;
        // this.gridOptions.enableSorting = true;
        // this.gridOptions.enableGroupEdit = true;
        this.gridOptions.enableColResize = true;
        this.gridOptions.minColWidth = 45;
        this.gridOptions.maxColWidth = 400;
        this.gridOptions.groupUseEntireRow = true;
        this.gridOptions.pagination = true;
        this.gridOptions.paginationAutoPageSize = false;
        this.gridOptions.paginationPageSize = 15;
        this.gridOptions.getRowHeight = function (params) {
            return 25;
        };

    }

    private getTestData() {
        const rowData = [];
        for (let i = 0; i < 100; i++) {
            const col = {};
            for (let j = 0; j < 5; j++) {
                col['name' + j] = 'row_' + j + '_col_' + j;
            }
            rowData.push(col);
        }
        this.rowData = rowData;
    }


    private getColDef() {
        // let columnDefs = [];
        for (let i = 0; i < 5; i++) {
            const col = {
                headerName: '列' + i,
                field: 'name' + i,
                editable: true,
                width: 150
            };
            this.columnDefs.push(col);
        }
    }
}
