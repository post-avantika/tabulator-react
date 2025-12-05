import React, { useState, useMemo, useRef } from 'react';
import { TabulatorColumn } from '../types';

interface ColumnHeaderProps {
  column: TabulatorColumn;
  index: number;
  onSort?: (column: TabulatorColumn, dir: 'asc' | 'desc') => void;
  onResize?: (column: TabulatorColumn, width: number) => void;
  resizable?: boolean;
  sortable?: boolean;
  className?: string;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  index,
  onSort,
  onResize,
  resizable = true,
  sortable = true,
  className = ''
}) => {
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState<number | string | undefined>(column.width);
  const headerRef = useRef<HTMLDivElement>(null);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(0);

  const headerClasses = useMemo(() => {
    const classes = [
      'tabulator-col',
      column.cssClass || '',
      sortDir ? `tabulator-col-sort-${sortDir}` : '',
      className
    ].filter(Boolean);
    return classes.join(' ');
  }, [column.cssClass, sortDir, className]);

  const headerStyle: React.CSSProperties = useMemo(() => ({
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
    maxWidth: column.maxWidth ? `${column.maxWidth}px` : undefined,
  }), [width, column.minWidth, column.maxWidth]);

  const handleSort = () => {
    if (!sortable || !column.headerSort) return;
    
    const newDir = sortDir === 'asc' ? 'desc' : sortDir === 'desc' ? null : 'asc';
    setSortDir(newDir);
    
    if (onSort && newDir) {
      onSort(column, newDir);
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    if (!resizable || !column.resizable) return;
    
    e.preventDefault();
    setIsResizing(true);
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = headerRef.current?.offsetWidth || 0;
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const diff = e.clientX - resizeStartX.current;
    const newWidth = Math.max(column.minWidth || 50, resizeStartWidth.current + diff);
    
    setWidth(newWidth);
    
    if (onResize) {
      onResize(column, newWidth);
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  return (
    <div
      ref={headerRef}
      className={headerClasses}
      style={headerStyle}
      role="columnheader"
      tabIndex={0}
    >
      <div className="tabulator-col-content">
        <div
          className={`tabulator-col-title ${sortable && column.headerSort ? 'tabulator-sortable' : ''}`}
          onClick={handleSort}
        >
          {column.title || column.field || ''}
          {sortDir && (
            <span className={`tabulator-arrow tabulator-arrow-${sortDir}`}>
              {sortDir === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      </div>
      {resizable && column.resizable !== false && (
        <div
          className="tabulator-col-resize-handle"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

export default ColumnHeader;

