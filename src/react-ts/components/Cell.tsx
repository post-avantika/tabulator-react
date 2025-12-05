import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TabulatorCell, TabulatorColumn } from '../types';

interface CellProps {
  cell: TabulatorCell;
  column: TabulatorColumn;
  rowData: any;
  rowIndex: number;
  isEven: boolean;
  onCellClick?: (e: React.MouseEvent, cell: TabulatorCell) => void;
  onCellDblClick?: (e: React.MouseEvent, cell: TabulatorCell) => void;
  className?: string;
}

const Cell: React.FC<CellProps> = ({
  cell,
  column,
  rowData,
  rowIndex,
  isEven,
  onCellClick,
  onCellDblClick,
  className = ''
}) => {
  const [value, setValue] = useState(cell?.getValue?.() ?? rowData[column.field || '']);
  const [isEditing, setIsEditing] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cell) {
      const currentValue = cell.getValue();
      if (currentValue !== value) {
        setValue(currentValue);
      }
    }
  }, [cell, value]);

  const formattedValue = useMemo(() => {
    if (!column.formatter || typeof column.formatter === 'string') {
      return value;
    }
    
    try {
      if (cell) {
        const result = column.formatter(cell, column.formatterParams || {}, () => {});
        return typeof result === 'string' ? result : value;
      }
      return value;
    } catch (error) {
      console.error('Formatter error:', error);
      return value;
    }
  }, [value, column.formatter, cell, column.formatterParams]);

  const handleClick = (e: React.MouseEvent) => {
    if (onCellClick) {
      onCellClick(e, cell);
    }
  };

  const handleDblClick = (e: React.MouseEvent) => {
    if (column.editable && column.editor) {
      setIsEditing(true);
      setTimeout(() => {
        editInputRef.current?.focus();
      }, 0);
    }
    if (onCellDblClick) {
      onCellDblClick(e, cell);
    }
  };

  const handleEditBlur = () => {
    if (cell && isEditing) {
      const newValue = editInputRef.current?.value;
      if (newValue !== undefined) {
        cell.setValue(newValue);
        setValue(newValue);
      }
      setIsEditing(false);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      if (cell) {
        cell.restoreOldValue();
      }
    }
  };

  const cellClasses = [
    'tabulator-cell',
    column.cssClass || '',
    isEven ? 'tabulator-cell-even' : 'tabulator-cell-odd',
    className
  ].filter(Boolean).join(' ');

  const cellStyle: React.CSSProperties = {
    width: column.width ? (typeof column.width === 'number' ? `${column.width}px` : column.width) : undefined,
    minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
    maxWidth: column.maxWidth ? `${column.maxWidth}px` : undefined,
  };

  if (isEditing && column.editor) {
    return (
      <div
        ref={cellRef}
        className={cellClasses}
        style={cellStyle}
        role="gridcell"
        tabIndex={0}
      >
        {typeof column.editor === 'string' ? (
          <input
            ref={editInputRef}
            type={column.editor === 'number' ? 'number' : 'text'}
            defaultValue={String(value || '')}
            onBlur={handleEditBlur}
            onKeyDown={handleEditKeyDown}
            className="tabulator-cell-editor"
          />
        ) : (
          <input
            ref={editInputRef}
            type="text"
            defaultValue={String(value || '')}
            onBlur={handleEditBlur}
            onKeyDown={handleEditKeyDown}
            className="tabulator-cell-editor"
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={cellRef}
      className={cellClasses}
      style={cellStyle}
      role="gridcell"
      tabIndex={0}
      onClick={handleClick}
      onDoubleClick={handleDblClick}
      title={column.tooltip && typeof column.tooltip === 'string' ? column.tooltip : undefined}
    >
      {formattedValue !== null && formattedValue !== undefined ? String(formattedValue) : ''}
    </div>
  );
};

export default Cell;

