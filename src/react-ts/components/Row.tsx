import React, { useMemo, useEffect } from 'react';
import Cell from './Cell';
import { TabulatorRow, TabulatorColumn, TabulatorCell } from '../types';

interface RowProps {
  row: TabulatorRow;
  rowData: any;
  rowIndex: number;
  columns: TabulatorColumn[];
  isEven: boolean;
  isSelected?: boolean;
  onRowClick?: (e: React.MouseEvent, row: TabulatorRow) => void;
  onRowDblClick?: (e: React.MouseEvent, row: TabulatorRow) => void;
  onCellClick?: (e: React.MouseEvent, cell: TabulatorCell) => void;
  onCellDblClick?: (e: React.MouseEvent, cell: TabulatorCell) => void;
  rowFormatter?: (row: TabulatorRow) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Row: React.FC<RowProps> = ({
  row,
  rowData,
  rowIndex,
  columns,
  isEven,
  isSelected = false,
  onRowClick,
  onRowDblClick,
  onCellClick,
  onCellDblClick,
  rowFormatter,
  className = '',
  style = {}
}) => {
  const cells = useMemo(() => {
    if (row?.getCells) {
      return row.getCells();
    }
    return columns.map(col => ({
      getValue: () => rowData[col.field || ''],
      getOldValue: () => rowData[col.field || ''],
      getElement: () => document.createElement('div'),
      getRow: () => row,
      getColumn: () => col,
      getData: () => rowData,
      getField: () => col.field || '',
      getTable: () => row.getTable(),
      setValue: (value: any) => {
        if (rowData) {
          rowData[col.field || ''] = value;
        }
      },
      restoreOldValue: () => {},
      edit: () => {},
      cancelEdit: () => {},
      isEdited: () => false,
      nav: () => false,
      getInitialValue: () => rowData[col.field || ''],
    } as TabulatorCell));
  }, [row, columns, rowData]);

  const rowClasses = useMemo(() => {
    const classes = [
      'tabulator-row',
      isEven ? 'tabulator-row-even' : 'tabulator-row-odd',
      isSelected ? 'tabulator-selected' : '',
      className
    ].filter(Boolean);
    return classes.join(' ');
  }, [isEven, isSelected, className]);

  const handleClick = (e: React.MouseEvent) => {
    if (onRowClick) {
      onRowClick(e, row);
    }
  };

  const handleDblClick = (e: React.MouseEvent) => {
    if (onRowDblClick) {
      onRowDblClick(e, row);
    }
  };

  useEffect(() => {
    if (rowFormatter && row) {
      rowFormatter(row);
    }
  }, [rowFormatter, row]);

  return (
    <div
      className={rowClasses}
      style={style}
      role="row"
      tabIndex={0}
      onClick={handleClick}
      onDoubleClick={handleDblClick}
      data-index={rowIndex}
    >
      {columns.map((column, colIndex) => {
        const cell = cells[colIndex];
        return (
          <Cell
            key={column.field || colIndex}
            cell={cell}
            column={column}
            rowData={rowData}
            rowIndex={rowIndex}
            isEven={isEven}
            onCellClick={onCellClick}
            onCellDblClick={onCellDblClick}
            className={column.cssClass}
          />
        );
      })}
    </div>
  );
};

export default Row;

