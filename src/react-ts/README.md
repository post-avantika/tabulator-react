# Tabulator React TypeScript

A complete React TypeScript implementation of Tabulator - a fully native React component with no vanilla JavaScript dependencies.

## Features

✅ **100% React TypeScript** - No vanilla JS/HTML, everything is React components  
✅ **Full TypeScript Support** - Complete type definitions  
✅ **Column Configuration** - Custom names, widths, CSS classes  
✅ **Pagination** - Full pagination with page sizing  
✅ **Sorting & Filtering** - Built-in sorting and filtering  
✅ **Row Selection** - Select single or multiple rows  
✅ **Resizable Columns** - Drag to resize columns  
✅ **Customizable Styling** - CSS classes and inline styles  
✅ **Event Handlers** - Full event support  
✅ **Ref Methods** - Programmatic control via refs  

## Installation

```bash
npm install react react-dom typescript
```

## Basic Usage

```tsx
import React from 'react';
import Tabulator, { TabulatorColumn } from './src/react-ts';
import './src/react-ts/styles/tabulator.css';

function App() {
  const columns: TabulatorColumn[] = [
    { title: "Name", field: "name", width: 200, cssClass: "name-column" },
    { title: "Age", field: "age", width: 100 },
    { title: "Email", field: "email", width: 250 }
  ];

  const data = [
    { id: 1, name: "John Doe", age: 30, email: "john@example.com" },
    { id: 2, name: "Jane Smith", age: 25, email: "jane@example.com" }
  ];

  return (
    <Tabulator
      columns={columns}
      data={data}
      pagination={true}
      paginationSize={10}
      className="my-table"
    />
  );
}
```

## Props

### Data & Columns

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `TabulatorColumn[]` | `[]` | Column definitions |
| `data` | `any[]` | `[]` | Table data |
| `autoColumns` | `boolean` | `false` | Auto-generate columns from data |

### Column Configuration

Each column supports:
- `title`: Column header text
- `field`: Data field name
- `width`: Column width (number or string)
- `cssClass`: Custom CSS class
- `sorter`: Sort type ("string", "number", "date", or function)
- `formatter`: Formatter function
- `editor`: Editor type for inline editing
- `visible`: Show/hide column
- `resizable`: Allow resizing
- And more...

### Pagination

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pagination` | `boolean` | `false` | Enable pagination |
| `paginationSize` | `number` | `10` | Rows per page |
| `paginationSizeSelector` | `number[]` | `[10, 25, 50, 100]` | Page size options |
| `paginationCounter` | `string \| boolean` | `'rows'` | Counter display |
| `paginationButtonCount` | `number` | `5` | Number of page buttons |

### Layout & Styling

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Custom CSS class |
| `style` | `CSSProperties` | `{}` | Inline styles |
| `height` | `string \| number` | `false` | Table height |
| `minHeight` | `string \| number` | `false` | Min height |
| `maxHeight` | `string \| number` | `false` | Max height |
| `layout` | `string` | `'fitColumns'` | Layout mode |

### Features

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `resizableColumns` | `boolean` | `true` | Allow column resizing |
| `sortable` | `boolean` | `true` | Enable sorting |
| `selectable` | `boolean` | `false` | Enable row selection |
| `headerVisible` | `boolean` | `true` | Show header |
| `placeholder` | `string` | `'No Data Available'` | Placeholder text |

### Events

| Prop | Type | Description |
|------|------|-------------|
| `onRowClick` | `(e, row) => void` | Row click handler |
| `onRowDblClick` | `(e, row) => void` | Row double-click handler |
| `onCellClick` | `(e, cell) => void` | Cell click handler |
| `onRowSelectionChanged` | `(data, rows) => void` | Selection changed |
| `onDataLoaded` | `(data) => void` | Data loaded |
| `onPageLoaded` | `(pageNo) => void` | Page loaded |
| `onTableBuilt` | `() => void` | Table built |

## Using Ref

```tsx
import React, { useRef } from 'react';
import Tabulator, { TabulatorRef } from './src/react-ts';

function App() {
  const tableRef = useRef<TabulatorRef>(null);

  const handleAddRow = () => {
    tableRef.current?.addData([{ id: 3, name: "New User", age: 28 }]);
  };

  const handleGetSelected = () => {
    const selected = tableRef.current?.getSelectedData();
    console.log(selected);
  };

  return (
    <div>
      <button onClick={handleAddRow}>Add Row</button>
      <button onClick={handleGetSelected}>Get Selected</button>
      
      <Tabulator
        ref={tableRef}
        columns={columns}
        data={data}
        pagination={true}
      />
    </div>
  );
}
```

## Available Ref Methods

- `getInstance()` - Get Tabulator instance
- `setData(data)` - Set table data
- `getData()` - Get all data
- `getSelectedData()` - Get selected rows
- `clearData()` - Clear all data
- `addData(data, addToTop)` - Add rows
- `updateData(data)` - Update rows
- `deleteRow(rowIndex)` - Delete a row
- `getPage()` / `setPage(page)` - Page navigation
- `getPageSize()` / `setPageSize(size)` - Page size
- `nextPage()` / `previousPage()` / `firstPage()` / `lastPage()` - Navigation
- `setColumns(columns)` - Update columns
- `getColumns()` - Get columns
- `redraw()` - Redraw table
- `destroy()` - Destroy instance

## Complete Example

```tsx
import React, { useRef, useState } from 'react';
import Tabulator, { TabulatorRef, TabulatorColumn } from './src/react-ts';
import './src/react-ts/styles/tabulator.css';

function DataTable() {
  const tableRef = useRef<TabulatorRef>(null);
  const [pageSize, setPageSize] = useState(10);

  const columns: TabulatorColumn[] = [
    {
      title: "ID",
      field: "id",
      width: 80,
      cssClass: "id-column",
      sorter: "number"
    },
    {
      title: "Name",
      field: "name",
      width: 200,
      cssClass: "name-column",
      sorter: "string"
    },
    {
      title: "Age",
      field: "age",
      width: 100,
      cssClass: "age-column",
      sorter: "number"
    }
  ];

  const [data, setData] = useState([
    { id: 1, name: "John Doe", age: 30 },
    { id: 2, name: "Jane Smith", age: 25 }
  ]);

  return (
    <Tabulator
      ref={tableRef}
      columns={columns}
      data={data}
      className="my-custom-table"
      pagination={true}
      paginationSize={pageSize}
      paginationSizeSelector={[10, 25, 50, 100]}
      resizableColumns={true}
      sortable={true}
      selectable={true}
      onRowClick={(e, row) => console.log(row.getData())}
    />
  );
}
```

## TypeScript Types

All types are exported:

```tsx
import type {
  TabulatorOptions,
  TabulatorColumn,
  TabulatorRow,
  TabulatorCell,
  TabulatorInstance,
  TabulatorRef,
} from './src/react-ts';
```

## Styling

Import the CSS file:

```tsx
import './src/react-ts/styles/tabulator.css';
```

You can customize styles by overriding CSS classes or using inline styles via the `style` prop.

## Architecture

This is a **complete React TypeScript rewrite** of Tabulator:

- ✅ All components are React functional components
- ✅ All state management uses React hooks
- ✅ All rendering is JSX (no DOM manipulation)
- ✅ Full TypeScript support throughout
- ✅ No vanilla JavaScript dependencies
- ✅ No HTML string manipulation
- ✅ Pure React patterns

## Differences from Original

This React TypeScript version:
- Uses React state instead of class-based state
- Uses JSX instead of DOM manipulation
- Uses React hooks for lifecycle and state
- Fully typed with TypeScript
- More React-idiomatic patterns

## License

MIT

