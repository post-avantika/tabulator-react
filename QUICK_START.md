# Quick Start Guide - Using in Other Projects

## 🚀 Fastest Way (npm link)

### 1. In this tabulator project:
```bash
npm link
```

### 2. In your other project:
```bash
npm link tabulator-tables
npm install react react-dom typescript @types/react @types/react-dom
```

### 3. Use it:
```tsx
import React from 'react';
import Tabulator, { TabulatorColumn } from 'tabulator-tables';
import 'tabulator-tables/styles/tabulator.css';

function App() {
  const columns: TabulatorColumn[] = [
    { title: "Name", field: "name", width: 200 },
    { title: "Age", field: "age", width: 100 },
  ];

  const data = [
    { id: 1, name: "John", age: 30 },
    { id: 2, name: "Jane", age: 25 },
  ];

  return (
    <Tabulator
      columns={columns}
      data={data}
      pagination={true}
    />
  );
}
```

That's it! 🎉

## 📖 For More Details

See `USAGE_IN_OTHER_PROJECTS.md` for:
- Alternative installation methods
- TypeScript configuration
- Advanced examples
- Troubleshooting

