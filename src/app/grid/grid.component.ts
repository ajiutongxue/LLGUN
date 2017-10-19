import {Component, OnInit} from '@angular/core';
import { GridStringRenderer } from './string-renderer';
import { GridStringInput } from './input.component';
import { GridUserComponent } from './_users/user.component';
import { GridUserRender } from './_users/user-renderer';
import { NormalStringRendererComponent } from './normal-string-renderer';

import { GridOptions } from 'ag-grid';
import 'ag-grid-enterprise/main';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    // styles: ['div { background: red !important;}'],
    styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
    rowData = [];
    columnDefs = [];
    gridOptions: GridOptions = {};

    constructor() {
    }

    ngOnInit() {
        this.getTestData();
        this.getColDef();
        this.gridOptions = <GridOptions>{};
        this.gridOptions.enableFilter = true;
        // this.gridOptions.enableSorting = true;
        // this.gridOptions.enableGroupEdit = true;
        this.gridOptions.enableColResize = true;
        this.gridOptions.minColWidth = 15;
        this.gridOptions.maxColWidth = 400;
        this.gridOptions.groupUseEntireRow = true;
        this.gridOptions.pagination = true;
        this.gridOptions.paginationAutoPageSize = false;
        this.gridOptions.paginationPageSize = 15;
        this.gridOptions.headerHeight = 20;
        this.gridOptions.enableSorting = true;
        this.gridOptions.groupUseEntireRow = false;
        this.gridOptions.groupIncludeFooter = true;
        this.gridOptions.getRowHeight = function (params) {
            return 40;
            // if (params.data.name0 !== undefined && params.data.name0.length > 0) {
            //     return 20 * params.data.name0.length;
            // } else {
            //     return 20;
            // }
        };
        this.gridOptions.autoGroupColumnDef = {
            headerName: 'group',
            width: 200,
            suppressSorting: true
        };

    }

    onCellValueChanged() {}

    private getTestData() {
        const rowData = [];
        for (let i = 0; i < 100; i++) {
            const col = {};
            for (let j = 0; j < 5; j++) {
                if (j === 0) {
                    if (i % 3 === 1) {
                        col['name' + j] = ['a', 'b', 'c'];
                    } else {
                        col['name' + j] = ['a', 'b'];
                    }
                    // col['name' + j] = 'open';
                } else {
                    col['name' + j] = 'row_' + j + '_col_' + j;
                }
            }
            rowData.push(col);
        }
        this.rowData = rowData;
    }


    private getColDef() {
        // let columnDefs = [];
        for (let i = 0; i < 5; i++) {
            let col;
            /*if (i === 0) {
                col = {
                    headerName: '',
                    field: 'name' + i,
                    checkboxSelection: true,
                    editable: false,
                    width: 20,
                    // filter: '',
                    menuTabs: ['filterMenuTab'],

                    // cellRendererFramework: GridUserRender,
                    // cellEditorFramework: GridUserComponent,
                };
            }else*/ if (i === 0) {
                col = {
                    headerName: '3333列' + i,
                    field: 'name' + i,
                    rowGroupIndex: 0,
                    editable: true,
                    width: 150,
                    cellRendererFramework: GridStringRenderer,
                    cellEditorFramework: GridStringInput,
                    menuTabs: ['filterMenuTab'],
                };
            } else {
                col = {
                    headerName: '列' + i,
                    // field: 'name' + i,
                    editable: true,
                    width: 150,
                    // cellRendererFramework: GridStringRenderer,
                    cellEditorFramework: GridStringInput,
                    children: [{
                        headerName: '资产' + i,
                        field: 'name' + i,
                        editable: true,
                        cellRendererFramework: NormalStringRendererComponent,
                        cellEditorFramework: GridStringInput,
                    }, {
                        headerName: '资产' + i,
                        field: 'name' + i,
                        editable: true,
                        cellRendererFramework: NormalStringRendererComponent,
                        cellEditorFramework: GridStringInput,
                    }],
                };
            }
            this.columnDefs.push(col);
        }
    }
}
