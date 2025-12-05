import React, { useRef, useImperativeHandle, forwardRef, useEffect, useCallback, useState } from 'react';
import { TabulatorOptions, TabulatorInstance } from '../types';
import { useTabulator } from '../hooks/useTabulator';
import Row from './Row';
import ColumnHeader from './ColumnHeader';
import Pagination from './Pagination';
import '../styles/tabulator.css';

export interface TabulatorRef {
  getInstance: () => TabulatorInstance;
  setData: (data: any[]) => void;
  getData: () => any[];
  getSelectedData: () => any[];
  clearData: () => void;
  addData: (data: any[], addToTop?: boolean) => void;
  updateData: (data: any[]) => void;
  deleteRow: (row: number) => void;
  getPage: () => number;
  setPage: (page: number) => void;
  getPageSize: () => number;
  setPageSize: (size: number) => void;
  getPageMax: () => number;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  setColumns: (columns: any[]) => void;
  getColumns: () => any[];
  redraw: () => void;
  destroy: () => void;
}

const Tabulator = forwardRef<TabulatorRef, TabulatorOptions>((props, ref) => {
  const {
    columns = [],
    data: initialData = [],
    className = '',
    style = {},
    height,
    minHeight,
    maxHeight,
    layout = 'fitColumns',
    pagination = false,
    paginationSize = 10,
    paginationSizeSelector = [10, 25, 50, 100],
    paginationCounter = 'rows',
    paginationButtonCount = 5,
    progressiveLoad = false,
    progressiveLoadScrollMargin = 0,
    onProgressiveLoad,
    resizableColumns = true,
    sortable = true,
    selectable = false,
    placeholder = 'No Data Available',
    headerVisible = true,
    rowFormatter,
    onRowClick,
    onRowDblClick,
    onCellClick,
    onCellDblClick,
    onRowSelectionChanged,
    onDataLoaded,
    onPageLoaded,
    onTableBuilt,
    ...otherProps
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const {
    data,
    allData,
    columns: processedColumns,
    currentPage,
    pageSize,
    totalPages,
    selectedRows,
    instance,
    setData,
    setColumns,
    setPage,
    setPageSize,
    setSort,
    selectRow,
    getSelectedData,
    loadMoreData,
    isLoading,
    hasMore,
  } = useTabulator({
    ...props,
    columns: columns.length > 0 ? columns : (props.autoColumns ? undefined : []),
    data: initialData,
  });
  
  const tableHolderRef = useRef<HTMLDivElement>(null);
  
  // Infinite scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!progressiveLoad || progressiveLoad !== 'scroll' || !onProgressiveLoad) {
      return;
    }
    
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    // Calculate distance from bottom
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    const margin = progressiveLoadScrollMargin || (clientHeight * 2);
    
    // Load more when near bottom
    if (distanceFromBottom <= margin && hasMore && !isLoading) {
      loadMoreData();
    }
  }, [progressiveLoad, onProgressiveLoad, progressiveLoadScrollMargin, hasMore, isLoading, loadMoreData]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getInstance: () => instance,
    setData: (newData: any[]) => {
      setData(newData);
    },
    getData: () => allData,
    getSelectedData,
    clearData: () => {
      setData([]);
    },
    addData: (newData: any[], addToTop = false) => {
      instance.addData(newData, addToTop);
    },
    updateData: (newData: any[]) => {
      instance.updateData(newData);
    },
    deleteRow: (rowIndex: number) => {
      instance.deleteRow(rowIndex);
    },
    getPage: () => currentPage,
    setPage: (page: number) => {
      setPage(page);
    },
    getPageSize: () => pageSize,
    setPageSize: (size: number) => {
      setPageSize(size);
    },
    getPageMax: () => totalPages,
    nextPage: () => {
      instance.nextPage();
    },
    previousPage: () => {
      instance.previousPage();
    },
    firstPage: () => {
      instance.firstPage();
    },
    lastPage: () => {
      instance.lastPage();
    },
    setColumns: (newColumns: any[]) => {
      setColumns(newColumns);
    },
    getColumns: () => processedColumns,
    redraw: () => {
      // Force re-render
    },
    destroy: () => {
      // Cleanup if needed
    },
  }));

  useEffect(() => {
    if (onTableBuilt) {
      onTableBuilt();
    }
  }, []);

  useEffect(() => {
    if (onDataLoaded && data.length > 0) {
      onDataLoaded(allData);
    }
  }, [allData.length, onDataLoaded]);

  // Handle HTMLElement placeholder
  useEffect(() => {
    if (placeholderRef.current && placeholder && typeof placeholder !== 'string' && placeholder instanceof HTMLElement) {
      placeholderRef.current.innerHTML = '';
      placeholderRef.current.appendChild(placeholder);
    }
  }, [placeholder]);

  const handleSort = (column: any, dir: 'asc' | 'desc') => {
    setSort([{ column: column.field || '', dir }]);
  };

  const handleRowSelection = (rowIndex: number) => {
    if (selectable) {
      selectRow(rowIndex);
      if (onRowSelectionChanged) {
        onRowSelectionChanged(getSelectedData(), selectedRows);
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    ...style,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    minHeight: minHeight ? (typeof minHeight === 'number' ? `${minHeight}px` : minHeight) : undefined,
    maxHeight: maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : undefined,
  };

  const tableClasses = [
    'tabulator',
    className,
    layout ? `tabulator-layout-${layout}` : '',
  ].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={tableClasses} style={containerStyle}>
      {headerVisible && (
        <div className="tabulator-header" role="rowgroup">
          <div className="tabulator-header-contents">
            <div className="tabulator-headers" role="row">
              {processedColumns.map((column, index) => (
                <ColumnHeader
                  key={column.field || index}
                  column={column}
                  index={index}
                  onSort={handleSort}
                  resizable={resizableColumns}
                  sortable={sortable !== false}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div 
        ref={tableHolderRef}
        className="tabulator-tableHolder" 
        role="group"
        onScroll={handleScroll}
        style={{
          overflowY: progressiveLoad === 'scroll' ? 'auto' : undefined,
          maxHeight: progressiveLoad === 'scroll' && height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        }}
      >
        <div className="tabulator-table" role="table">
          {data.length === 0 ? (
            <div 
              ref={placeholderRef}
              className="tabulator-placeholder"
            >
              {typeof placeholder === 'string' 
                ? placeholder 
                : placeholder === false 
                  ? 'No Data Available' 
                  : null}
            </div>
          ) : (
            data.map((rowData, index) => {
              const actualIndex = pagination 
                ? (currentPage - 1) * pageSize + index 
                : index;
              
              // Create a mock row object for compatibility
              const mockRow = {
                getData: () => rowData,
                getElement: () => document.createElement('div'),
                getCells: () => [],
                getCell: () => null,
                getPosition: () => actualIndex,
                getGroup: () => null,
                getTable: () => instance,
                delete: async () => {},
                update: async () => {},
                select: () => handleRowSelection(actualIndex),
                deselect: () => {},
                toggleSelect: () => {},
                isSelected: () => selectedRows.some(r => r.getData() === rowData),
                normalizeHeight: () => {},
                reformat: () => {},
                getHeight: () => 0,
                getNextRow: () => null,
                getPrevRow: () => null,
                move: () => {},
                scrollTo: async () => {},
                freeze: () => {},
                unfreeze: () => {},
                isFrozen: () => false,
              };

              return (
                <Row
                  key={rowData[props.index || 'id'] || actualIndex}
                  row={mockRow as any}
                  rowData={rowData}
                  rowIndex={actualIndex}
                  columns={processedColumns}
                  isEven={actualIndex % 2 === 0}
                  isSelected={mockRow.isSelected()}
                  onRowClick={onRowClick}
                  onRowDblClick={onRowDblClick}
                  onCellClick={onCellClick}
                  onCellDblClick={onCellDblClick}
                  rowFormatter={rowFormatter}
                />
              );
            })
          )}
        </div>
      </div>
      
      {pagination && totalPages > 0 && !progressiveLoad && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRows={allData.length}
          pageSizeOptions={paginationSizeSelector as number[]}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          counter={paginationCounter}
          buttonCount={paginationButtonCount}
        />
      )}
      
      {progressiveLoad === 'scroll' && (
        <div className="tabulator-progressive-load">
          {isLoading && (
            <div className="tabulator-loading">
              Loading more data...
            </div>
          )}
          {!hasMore && data.length > 0 && (
            <div className="tabulator-no-more">
              No more data to load
            </div>
          )}
        </div>
      )}
    </div>
  );
});

Tabulator.displayName = 'Tabulator';

export default Tabulator;

