// Core TypeScript types for Tabulator React

export interface TabulatorOptions {
    // Layout
    height?: string | number | false;
    minHeight?: string | number | false;
    maxHeight?: string | number | false;
    layout?: 'fitColumns' | 'fitData' | 'fitDataFill' | 'fitDataStretch';

    //css
    className?: string;
    style?: React.CSSProperties;

    // Data
    data?: any[];
    index?: string;
    autoColumns?: boolean;
    autoColumnsDefinitions?: boolean;
    nestedFieldSeparator?: string;

    // Columns
    columns?: TabulatorColumn[];
    columnDefaults?: Partial<TabulatorColumn>;
    rowHeader?: boolean;

    // Rendering
    renderVertical?: 'virtual' | 'basic';
    renderHorizontal?: 'virtual' | 'basic';
    renderVerticalBuffer?: number;
    rowHeight?: number | string | null;
    rowFormatter?: (row: TabulatorRow) => void;

    // Header/Footer
    headerVisible?: boolean;
    footerElement?: string | HTMLElement | false;
    columnHeaderVertAlign?: 'top' | 'middle' | 'bottom';

    // Pagination
    pagination?: boolean;
    paginationSize?: number;
    paginationSizeSelector?: number[];
    paginationCounter?: string;
    paginationButtonCount?: number;
    paginationMode?: 'local' | 'remote';
    paginationInitialPage?: number;

    // Infinite Scroll / Progressive Load
    progressiveLoad?: false | 'scroll' | 'load';
    progressiveLoadScrollMargin?: number;
    onProgressiveLoad?: (page: number) => Promise<any[]> | any[];

    // Features
    resizableColumns?: boolean;
    movableColumns?: boolean;
    sortable?: boolean | string[];
    filterable?: boolean;
    selectable?: boolean | number | 'highlight';
    selectableRangeMode?: 'click' | 'drag';

    // Styling
    placeholder?: string | HTMLElement | false;
    popupContainer?: string | HTMLElement | false;

    // Events
    onRowClick?: (e: React.MouseEvent, row: TabulatorRow) => void;
    onRowDblClick?: (e: React.MouseEvent, row: TabulatorRow) => void;
    onCellClick?: (e: React.MouseEvent, cell: TabulatorCell) => void;
    onCellDblClick?: (e: React.MouseEvent, cell: TabulatorCell) => void;
    onRowSelectionChanged?: (data: any[], rows: TabulatorRow[]) => void;
    onDataLoaded?: (data: any[]) => void;
    onPageLoaded?: (pageNo: number) => void;
    onTableBuilt?: () => void;

    // Debug
    debugEventsExternal?: boolean;
    debugEventsInternal?: boolean;
    debugInvalidOptions?: boolean;
    debugInvalidComponentFuncs?: boolean;
    debugInitialization?: boolean;
    debugDeprecation?: boolean;

    // Other
    textDirection?: 'auto' | 'ltr' | 'rtl';
    addRowPos?: 'top' | 'bottom';
    scrollToRowPosition?: 'top' | 'center' | 'bottom' | 'nearest';
    scrollToRowIfVisible?: boolean;
    scrollToColumnPosition?: 'left' | 'center' | 'right' | 'nearest';
    scrollToColumnIfVisible?: boolean;
    dataLoader?: boolean;
    dataLoaderLoading?: boolean | string | HTMLElement;
    dataLoaderError?: boolean | string | HTMLElement;
    dataLoaderErrorTimeout?: number;
    dataSendParams?: Record<string, any>;
    dataReceiveParams?: Record<string, any>;
    dependencies?: Record<string, any>;
}

export interface TabulatorColumn {
    title?: string;
    field?: string;
    width?: number | string;
    minWidth?: number;
    maxWidth?: number;
    widthGrow?: number;
    widthShrink?: number;
    visible?: boolean;
    cssClass?: string;
    headerFilter?: boolean | string | ((cell: TabulatorCell, onRendered: (callback: () => void) => void) => HTMLElement);
    headerFilterPlaceholder?: string;
    headerFilterEmptyCheck?: (value: any) => boolean;
    sorter?: string | ((a: any, b: any, aRow: TabulatorRow, bRow: TabulatorRow, column: TabulatorColumn, dir: 'asc' | 'desc', sorterParams: any) => number);
    headerSort?: boolean;
    headerSortStartingDir?: 'asc' | 'desc';
    formatter?: string | ((cell: TabulatorCell, formatterParams: any, onRendered: (callback: () => void) => void) => string | HTMLElement);
    editor?: string | boolean | ((cell: TabulatorCell, onRendered: (callback: () => void) => void, success: (value: any) => void, cancel: () => void, editorParams: any) => HTMLElement);
    editable?: boolean | ((cell: TabulatorCell) => boolean);
    validator?: string | ((cell: TabulatorCell, value: any, parameters: any) => boolean | string);
    tooltip?: string | boolean | ((cell: TabulatorCell) => string);
    frozen?: boolean;
    resizable?: boolean;
    responsive?: number;
    formatterParams?: any;
    editorParams?: any;
    sorterParams?: any;
    headerFilterParams?: any;
    mutator?: (value: any, data: any, type: 'data' | 'edit', cell?: TabulatorCell, column?: TabulatorColumn, row?: TabulatorRow, params?: any) => any;
    accessor?: (value: any, data: any, type: 'data' | 'download' | 'clipboard', cell?: TabulatorCell, column?: TabulatorColumn, row?: TabulatorRow, params?: any) => any;
    bottomCalc?: string | ((values: any[], data: any[], calcParams: any) => any);
    topCalc?: string | ((values: any[], data: any[], calcParams: any) => any);
    columns?: TabulatorColumn[];
    [key: string]: any;
}

export interface TabulatorRow {
    getData: () => any;
    getElement: () => HTMLElement;
    getCells: () => TabulatorCell[];
    getCell: (column: TabulatorColumn) => TabulatorCell;
    getPosition: (visible?: boolean) => number;
    getGroup: () => any;
    getTable: () => TabulatorInstance;
    delete: () => Promise<void>;
    update: (data: any) => Promise<void>;
    select: () => void;
    deselect: () => void;
    toggleSelect: () => void;
    isSelected: () => boolean;
    normalizeHeight: () => void;
    reformat: () => void;
    getHeight: () => number;
    getNextRow: () => TabulatorRow | false;
    getPrevRow: () => TabulatorRow | false;
    move: (target: number | TabulatorRow, moveAfter?: boolean) => void;
    scrollTo: () => Promise<void>;
    freeze: () => void;
    unfreeze: () => void;
    isFrozen: () => boolean;
    [key: string]: any;
}

export interface TabulatorCell {
    getValue: () => any;
    getOldValue: () => any;
    getElement: () => HTMLElement;
    getRow: () => TabulatorRow;
    getColumn: () => TabulatorColumn;
    getData: () => any;
    getField: () => string;
    getTable: () => TabulatorInstance;
    setValue: (value: any, mutate?: boolean) => void;
    restoreOldValue: () => void;
    edit: (force?: boolean) => void;
    cancelEdit: () => void;
    isEdited: () => boolean;
    nav: () => boolean;
    getInitialValue: () => any;
    [key: string]: any;
}

export interface TabulatorInstance {
    setData: (data: any[], mutate?: boolean) => Promise<void>;
    getData: (active?: boolean | 'all') => any[];
    getRows: (active?: boolean | 'all') => TabulatorRow[];
    getRow: (row: number | HTMLElement | TabulatorRow) => TabulatorRow | false;
    getRowFromPosition: (position: number, visible?: boolean) => TabulatorRow | false;
    addData: (data: any[], addToTop?: boolean, position?: number | TabulatorRow) => Promise<void>;
    updateData: (data: any[]) => Promise<void>;
    deleteRow: (row: number | HTMLElement | TabulatorRow | any[]) => Promise<void>;
    clearData: () => void;
    replaceData: (data: any[]) => Promise<void>;
    getSelectedData: () => any[];
    getSelectedRows: () => TabulatorRow[];
    selectRow: (rows: number | HTMLElement | TabulatorRow | any[]) => void;
    deselectRow: (rows: number | HTMLElement | TabulatorRow | any[]) => void;
    toggleSelectRow: (row: number | HTMLElement | TabulatorRow) => void;
    getRowsFromRange: (start: TabulatorRow, end: TabulatorRow) => TabulatorRow[];
    clearSelection: () => void;
    scrollToRow: (row: number | HTMLElement | TabulatorRow, position?: 'top' | 'center' | 'bottom' | 'nearest', ifVisible?: boolean) => Promise<void>;
    scrollToColumn: (column: string | TabulatorColumn, position?: 'left' | 'center' | 'right' | 'nearest', ifVisible?: boolean) => Promise<void>;
    setColumns: (columns: TabulatorColumn[]) => void;
    getColumns: () => TabulatorColumn[];
    showColumn: (column: string | TabulatorColumn) => void;
    hideColumn: (column: string | TabulatorColumn) => void;
    toggleColumn: (column: string | TabulatorColumn) => void;
    addColumn: (column: TabulatorColumn, before?: boolean, target?: string | TabulatorColumn) => void;
    deleteColumn: (column: string | TabulatorColumn) => void;
    moveColumn: (column: string | TabulatorColumn, target: string | TabulatorColumn, before?: boolean) => void;
    getPage: () => number;
    setPage: (page: number | 'next' | 'prev' | 'first' | 'last') => Promise<void>;
    getPageSize: () => number;
    setPageSize: (size: number) => void;
    getPageMax: () => number;
    nextPage: () => Promise<void>;
    previousPage: () => Promise<void>;
    firstPage: () => Promise<void>;
    lastPage: () => Promise<void>;
    setSort: (sort: Array<{ column: string, dir: 'asc' | 'desc' }>) => void;
    getSorters: () => Array<{ column: string, dir: 'asc' | 'desc' }>;
    clearSort: () => void;
    setFilter: (field: string, type: string, value: any) => void;
    addFilter: (field: string, type: string, value: any) => void;
    getFilters: (includeHeaderFilters?: boolean) => Array<{ field: string, type: string, value: any }>;
    clearFilter: (field?: string) => void;
    clearHeaderFilter: () => void;
    redraw: (force?: boolean) => void;
    destroy: () => void;
    on: (event: string, callback: (...args: any[]) => void) => void;
    off: (event: string, callback: (...args: any[]) => void) => void;
    [key: string]: any;
}

