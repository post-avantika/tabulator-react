import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TabulatorOptions, TabulatorColumn, TabulatorRow, TabulatorInstance } from '../types';

export const useTabulator = (options: TabulatorOptions) => {
  const [data, setData] = useState<any[]>(options.data || []);
  const [columns, setColumns] = useState<TabulatorColumn[]>(options.columns || []);
  const [currentPage, setCurrentPage] = useState(options.paginationInitialPage || 1);
  const [pageSize, setPageSize] = useState(options.paginationSize || 10);
  const [selectedRows, setSelectedRows] = useState<TabulatorRow[]>([]);
  const [sorters, setSorters] = useState<Array<{column: string, dir: 'asc' | 'desc'}>>([]);
  const [filters, setFilters] = useState<Array<{field: string, type: string, value: any}>>([]);
  
  // Infinite scroll / Progressive load state
  const [loadedData, setLoadedData] = useState<any[]>(options.data || []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [progressivePage, setProgressivePage] = useState(1);

  // Processed data with sorting and filtering
  const processedData = useMemo(() => {
    // Use loadedData for progressive load, otherwise use data
    const sourceData = options.progressiveLoad ? loadedData : data;
    let result = [...sourceData];

    // Apply filters
    if (filters.length > 0) {
      result = result.filter(row => {
        return filters.every(filter => {
          const value = row[filter.field];
          switch (filter.type) {
            case '=':
              return value === filter.value;
            case '!=':
              return value !== filter.value;
            case 'like':
              return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
            case '>':
              return Number(value) > Number(filter.value);
            case '<':
              return Number(value) < Number(filter.value);
            case '>=':
              return Number(value) >= Number(filter.value);
            case '<=':
              return Number(value) <= Number(filter.value);
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (sorters.length > 0) {
      result.sort((a, b) => {
        for (const sorter of sorters) {
          const col = columns.find(c => c.field === sorter.column);
          if (!col) continue;

          let aVal = a[sorter.column];
          let bVal = b[sorter.column];

          if (col.sorter && typeof col.sorter === 'function') {
            const result = col.sorter(aVal, bVal, null as any, null as any, col, sorter.dir, col.sorterParams || {});
            if (result !== 0) return result;
          } else if (typeof col.sorter === 'string') {
            if (col.sorter === 'string') {
              aVal = String(aVal || '').toLowerCase();
              bVal = String(bVal || '').toLowerCase();
            } else if (col.sorter === 'number') {
              aVal = Number(aVal || 0);
              bVal = Number(bVal || 0);
            } else if (col.sorter === 'date') {
              aVal = new Date(aVal || 0).getTime();
              bVal = new Date(bVal || 0).getTime();
            }

            if (aVal < bVal) return sorter.dir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sorter.dir === 'asc' ? 1 : -1;
          }
        }
        return 0;
      });
    }

    return result;
  }, [data, filters, sorters, columns]);

  // Paginated data
  const paginatedData = useMemo(() => {
    // For progressive load, return all loaded data (no pagination)
    if (options.progressiveLoad) {
      return processedData;
    }
    
    if (!options.pagination) {
      return processedData;
    }

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return processedData.slice(start, end);
  }, [processedData, currentPage, pageSize, options.pagination, options.progressiveLoad]);
  
  // Progressive load function
  const loadMoreData = useCallback(async () => {
    if (!options.progressiveLoad || !options.onProgressiveLoad || isLoading || !hasMore) {
      return;
    }
    
    setIsLoading(true);
    try {
      const nextPage = progressivePage + 1;
      const newData = await Promise.resolve(options.onProgressiveLoad(nextPage));
      
      if (Array.isArray(newData)) {
        if (newData.length === 0) {
          setHasMore(false);
        } else {
          setLoadedData(prev => [...prev, ...newData]);
          setProgressivePage(nextPage);
        }
      }
    } catch (error) {
      console.error('Error loading more data:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [options.progressiveLoad, options.onProgressiveLoad, isLoading, hasMore, progressivePage]);

  const totalPages = useMemo(() => {
    if (!options.pagination) return 1;
    return Math.ceil(processedData.length / pageSize);
  }, [processedData.length, pageSize, options.pagination]);

  // Methods
  const updateData = useCallback((newData: any[]) => {
    setData(newData);
    if (options.onDataLoaded) {
      options.onDataLoaded(newData);
    }
  }, [options]);

  const addData = useCallback((newData: any[], addToTop = false) => {
    setData(prev => addToTop ? [...newData, ...prev] : [...prev, ...newData]);
  }, []);

  const deleteRow = useCallback((rowIndex: number) => {
    setData(prev => prev.filter((_, index) => index !== rowIndex));
  }, []);

  const setSort = useCallback((newSorters: Array<{column: string, dir: 'asc' | 'desc'}>) => {
    setSorters(newSorters);
  }, []);

  const setFilter = useCallback((field: string, type: string, value: any) => {
    setFilters(prev => {
      const filtered = prev.filter(f => f.field !== field);
      return [...filtered, { field, type, value }];
    });
  }, []);

  const clearFilter = useCallback((field?: string) => {
    if (field) {
      setFilters(prev => prev.filter(f => f.field !== field));
    } else {
      setFilters([]);
    }
  }, []);

  const setPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (options.onPageLoaded) {
        options.onPageLoaded(page);
      }
    }
  }, [totalPages, options]);

  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  }, []);

  const selectRow = useCallback((rows: number | HTMLElement | TabulatorRow | any[]) => {
    // Implementation depends on row structure
    // This is a simplified version
    if (typeof rows === 'number') {
      // Handle number index
    } else if (Array.isArray(rows)) {
      // Handle array of rows
    } else {
      // Handle HTMLElement or TabulatorRow
    }
  }, []);
  
  const deselectRow = useCallback((rows: number | HTMLElement | TabulatorRow | any[]) => {
    // Implementation depends on row structure
    if (typeof rows === 'number') {
      // Handle number index
    } else if (Array.isArray(rows)) {
      // Handle array of rows
    } else {
      // Handle HTMLElement or TabulatorRow
    }
  }, []);
  
  const toggleSelectRow = useCallback((row: number | HTMLElement | TabulatorRow) => {
    // Implementation depends on row structure
    if (typeof row === 'number') {
      // Handle number index
    } else {
      // Handle HTMLElement or TabulatorRow
    }
  }, []);

  const getSelectedData = useCallback(() => {
    return selectedRows.map(row => row.getData());
  }, [selectedRows]);

  // Instance object
  const instance: TabulatorInstance = useMemo(() => ({
    setData: async (newData: any[]) => {
      updateData(newData);
    },
    getData: () => processedData,
    getRows: () => [] as TabulatorRow[],
    getRow: () => false,
    getRowFromPosition: () => false,
    addData: async (newData: any[], addToTop?: boolean) => {
      addData(newData, addToTop);
    },
    updateData: async (newData: any[]) => {
      updateData(newData);
    },
    deleteRow: async (row: any) => {
      if (typeof row === 'number') {
        deleteRow(row);
      }
    },
    clearData: () => {
      setData([]);
    },
    replaceData: async (newData: any[]) => {
      updateData(newData);
    },
    getSelectedData,
    getSelectedRows: () => selectedRows,
    selectRow,
    deselectRow,
    toggleSelectRow,
    getRowsFromRange: () => [],
    clearSelection: () => setSelectedRows([]),
    scrollToRow: async () => {},
    scrollToColumn: async () => {},
    setColumns: (newColumns: TabulatorColumn[]) => {
      setColumns(newColumns);
    },
    getColumns: () => columns,
    showColumn: () => {},
    hideColumn: () => {},
    toggleColumn: () => {},
    addColumn: () => {},
    deleteColumn: () => {},
    moveColumn: () => {},
    getPage: () => currentPage,
    setPage: async (page: number | string) => {
      if (typeof page === 'number') {
        setPage(page);
      }
    },
    getPageSize: () => pageSize,
    setPageSize: setPageSizeHandler,
    getPageMax: () => totalPages,
    nextPage: async () => {
      if (currentPage < totalPages) {
        setPage(currentPage + 1);
      }
    },
    previousPage: async () => {
      if (currentPage > 1) {
        setPage(currentPage - 1);
      }
    },
    firstPage: async () => {
      setPage(1);
    },
    lastPage: async () => {
      setPage(totalPages);
    },
    setSort,
    getSorters: () => sorters,
    clearSort: () => setSorters([]),
    setFilter,
    addFilter: setFilter,
    getFilters: () => filters,
    clearFilter,
    clearHeaderFilter: () => {},
    redraw: () => {},
    destroy: () => {},
    on: () => {},
    off: () => {},
  }), [
    processedData,
    columns,
    currentPage,
    pageSize,
    totalPages,
    selectedRows,
    sorters,
    filters,
    updateData,
    addData,
    deleteRow,
    setSort,
    setFilter,
    clearFilter,
    setPage,
    setPageSizeHandler,
    selectRow,
    deselectRow,
    toggleSelectRow,
    getSelectedData,
  ]);

  return {
    data: paginatedData,
    allData: processedData,
    columns,
    currentPage,
    pageSize,
    totalPages,
    selectedRows,
    sorters,
    filters,
    instance,
    setData: updateData,
    setColumns,
    setPage,
    setPageSize: setPageSizeHandler,
    setSort,
    setFilter,
    clearFilter,
    selectRow,
    getSelectedData,
    // Progressive load
    loadMoreData,
    isLoading,
    hasMore,
  };
};

