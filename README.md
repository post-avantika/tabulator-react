# Tabulator React TypeScript

<p align="center">
  <img height="200" src="http://tabulator.info/images/logos/t_hollow.png">
</p>

<p align="center">
  <strong>React TypeScript Table Component Library</strong>
</p>

<p align="center">
  A complete React TypeScript implementation of Tabulator - fully native React components with no vanilla JavaScript dependencies.
</p>

## ✨ Features

✅ **100% React TypeScript** - No vanilla JS/HTML, everything is React components  
✅ **Full TypeScript Support** - Complete type definitions  
✅ **Column Configuration** - Custom names, widths, CSS classes  
✅ **Pagination** - Full pagination with page sizing  
✅ **Infinite Scroll** - Automatic API pagination on scroll  
✅ **Sorting & Filtering** - Built-in sorting and filtering  
✅ **Row Selection** - Select single or multiple rows  
✅ **Resizable Columns** - Drag to resize columns  
✅ **Customizable Styling** - CSS classes and inline styles  
✅ **Event Handlers** - Full event support  
✅ **Ref Methods** - Programmatic control via refs  

## 🚀 Quick Start

### Installation

```bash
npm install tabulator-tables react react-dom typescript
```

### Basic Usage

```tsx
import React from 'react';
import Tabulator, { TabulatorColumn } from 'tabulator-tables';
import 'tabulator-tables/styles/tabulator.css';

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

## 📖 Documentation

- **Full Documentation**: See `src/react-ts/README.md`
- **Infinite Scroll Guide**: See `src/react-ts/INFINITE_SCROLL.md`
- **API Integration**: See `src/react-ts/examples/ApiIntegrationGuide.md`
- **Examples**: See `src/react-ts/example.tsx` and `src/react-ts/examples/`

## 🎯 Key Features

### Column Configuration
```tsx
const columns: TabulatorColumn[] = [
  {
    title: "Name",
    field: "name",
    width: 200,
    cssClass: "name-column",
    sorter: "string",
    resizable: true
  }
];
```

### Pagination
```tsx
<Tabulator
  pagination={true}
  paginationSize={25}
  paginationSizeSelector={[10, 25, 50, 100]}
/>
```

### Infinite Scroll with API
```tsx
<Tabulator
  progressiveLoad="scroll"
  progressiveLoadScrollMargin={200}
  onProgressiveLoad={async (page) => {
    const response = await fetch(`/api/users?page=${page}`);
    const data = await response.json();
    return data;
  }}
/>
```

### Using Ref
```tsx
const tableRef = useRef<TabulatorRef>(null);

// Access methods
tableRef.current?.setData(newData);
tableRef.current?.setPage(2);
tableRef.current?.getSelectedData();
```

## 📦 Project Structure

```
src/react-ts/
├── components/          # React components
│   ├── Tabulator.tsx   # Main table component
│   ├── Row.tsx
│   ├── Cell.tsx
│   ├── ColumnHeader.tsx
│   └── Pagination.tsx
├── hooks/              # React hooks
│   └── useTabulator.ts
├── types/              # TypeScript types
│   └── index.ts
├── styles/             # CSS styles
│   └── tabulator.css
├── examples/          # Usage examples
└── README.md          # Full documentation
```

## 🎨 Styling

Import the CSS file:

```tsx
import 'tabulator-tables/styles/tabulator.css';
```

Customize with CSS classes or inline styles:

```tsx
<Tabulator
  className="my-custom-table"
  style={{ border: '1px solid #ccc' }}
/>
```

## 📚 TypeScript Support

All types are fully exported:

```tsx
import type {
  TabulatorOptions,
  TabulatorColumn,
  TabulatorRow,
  TabulatorCell,
  TabulatorInstance,
  TabulatorRef,
} from 'tabulator-tables';
```

## 🔄 Migration from Vanilla JS

This is a complete React TypeScript rewrite. If you were using the vanilla JavaScript version:

1. **No more DOM manipulation** - Everything is React components
2. **No more HTML strings** - Everything is JSX
3. **TypeScript first** - Full type safety
4. **React patterns** - Uses hooks, functional components, etc.

## 📝 License

MIT

## 🔗 Links

- **Full Documentation**: See `src/react-ts/README.md`
- **Examples**: See `src/react-ts/examples/`
- **Original Tabulator**: http://tabulator.info
