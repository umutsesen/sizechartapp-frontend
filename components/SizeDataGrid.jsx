import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';

const SizeDataGrid = forwardRef(
    ({ table, sizeRange, measurements, setTable, setHasFormChanged }, ref) => {
    console.log(table, sizeRange, measurements, "3333333333333333333333333333333333333333333333333333333")
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);

    useImperativeHandle(ref, () => ({
        gridData() {
            const cleanedData = rowData.map(row => {
                const cleanedRow = { ...row };
                delete cleanedRow.id;
                for (let key in cleanedRow) {
                    if (key !== 'size' && isNaN(Number(cleanedRow[key]))) {
                        alert(`Invalid number in ${key}`);
                        return;
                    } else if (key !== 'size') {
                        cleanedRow[key] = Number(cleanedRow[key]);
                    }
                }
                return cleanedRow;
            });
            return cleanedData;
        },
    }));

    useEffect(() => {
        if (table.length) {
            setRowData(table);
        }
    }, [table]);

    useEffect(() => {
        const columns = [
            { headerName: 'Size', field: 'size', editable: true },
            ...measurements.map(measurement => ({
                headerName: capitalizeFirstLetter(measurement),
                field: measurement.toLowerCase(),
                editable: true,
            }))
        ];
        setColumnDefs(columns);
    }, [measurements]);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    console.log(sizeRange, measurements, "3")
    return (
        <div
            className="ag-theme-alpine"
            style={{
                height: '100%',
                width: '100%',
            }}
        >
            <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                onCellValueChanged={(params) => {
                    const updatedRows = [...rowData];
                    const rowIndex = params.rowIndex;
                    const field = params.colDef.field;
                    updatedRows[rowIndex][field] = params.newValue;
                    setRowData(updatedRows);
                    if (setTable) {
                        setTable(updatedRows);
                    }
                    if (setHasFormChanged) {
                        setHasFormChanged(true);
                    }
                }}
            />
        </div>
    );
});

export default SizeDataGrid;
