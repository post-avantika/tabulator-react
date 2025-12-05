# Using Tabulator React TypeScript in Other Projects

This guide shows you how to use this Tabulator component in your other React projects.

## 📦 Option 1: Using npm link (Recommended for Local Development)

### Step 1: Link this package

In the `tabulator` project directory:

```bash
cd /home/repozitory/Documents/projects/tabulator
npm link
```

This creates a global symlink to your local package.

### Step 2: Link in your other project

In your other React project:

```bash
cd /path/to/your/other/project
npm link tabulator-tables
```

### Step 3: Install peer dependencies

Make sure your project has React and React DOM:

```bash
npm install react react-dom typescript @types/react @types/react-dom
```

### Step 4: Use the component

```tsx
import React from 'react';
import Tabulator, { TabulatorColumn } from 'tabulator-tables';
import 'tabulator-tables/styles/tabulator.css';

function MyTable() {
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
      paginationSize={10}
    />
  );
}
```

---

## 📦 Option 2: Direct Path Import (Simple but Less Flexible)

### Step 1: Install dependencies in your project

```bash
cd /path/to/your/other/project
npm install react react-dom typescript @types/react @types/react-dom
```

### Step 2: Import directly from path

```tsx
import React from 'react';
import Tabulator, { TabulatorColumn } from '../../tabulator/src/react-ts';
import '../../tabulator/src/react-ts/styles/tabulator.css';

// ... rest of your code
```

**Note**: Adjust the relative path based on your project structure.

---

## 📦 Option 3: Publish to npm (For Production Use)

### Step 1: Prepare package.json

Make sure `package.json` is properly configured (already done).

### Step 2: Build/Prepare (if needed)

Since we're using TypeScript directly, you might want to add a build step or configure your consuming project to handle TypeScript.

### Step 3: Publish

```bash
npm login
npm publish
```

### Step 4: Install in your project

```bash
cd /path/to/your/other/project
npm install tabulator-tables
```

---

## 🚀 Complete Setup Example

### In Your Other Project

1. **Create/Update `package.json`**:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tabulator-tables": "file:../tabulator"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

2. **Install dependencies**:

```bash
npm install
```

3. **Use in your component**:

```tsx
// src/components/DataTable.tsx
import React, { useState } from 'react';
import Tabulator, { TabulatorColumn, TabulatorRef } from 'tabulator-tables';
import 'tabulator-tables/styles/tabulator.css';

const DataTable: React.FC = () => {
  const tableRef = React.useRef<TabulatorRef>(null);
  
  const columns: TabulatorColumn[] = [
    { title: "ID", field: "id", width: 80, sorter: "number" },
    { title: "Name", field: "name", width: 200, sorter: "string" },
    { title: "Email", field: "email", width: 250 },
  ];

  const [data, setData] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ]);

  return (
    <div>
      <Tabulator
        ref={tableRef}
        columns={columns}
        data={data}
        pagination={true}
        paginationSize={10}
        resizableColumns={true}
        sortable={true}
        onRowClick={(e, row) => {
          console.log('Row clicked:', row.getData());
        }}
      />
    </div>
  );
};

export default DataTable;
```

---

## ⚙️ TypeScript Configuration

Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true
  },
  "include": [
    "src"
  ]
}
```

---

## 📝 Example: With Infinite Scroll API

```tsx
import React, { useState, useEffect } from 'react';
import Tabulator, { TabulatorColumn } from 'tabulator-tables';
import 'tabulator-tables/styles/tabulator.css';

function ApiTable() {
  const [allData, setAllData] = useState<any[]>([]);

  const columns: TabulatorColumn[] = [
    { title: "ID", field: "id", width: 80 },
    { title: "Name", field: "name", width: 200 },
  ];

  // Load initial data
  useEffect(() => {
    fetch('/api/users?page=1')
      .then(res => res.json())
      .then(data => setAllData(data));
  }, []);

  // Infinite scroll handler
  const handleProgressiveLoad = async (page: number) => {
    const response = await fetch(`/api/users?page=${page}`);
    const data = await response.json();
    setAllData(prev => [...prev, ...data]);
    return data;
  };

  return (
    <Tabulator
      columns={columns}
      data={allData}
      height="500px"
      progressiveLoad="scroll"
      onProgressiveLoad={handleProgressiveLoad}
    />
  );
}
```

---

## 🔧 Troubleshooting

### Issue: Module not found

**Solution**: Make sure you've linked the package or installed it correctly.

```bash
# In tabulator directory
npm link

# In your project
npm link tabulator-tables
```

### Issue: TypeScript errors

**Solution**: Make sure TypeScript can resolve the module. Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "tabulator-tables": ["../tabulator/src/react-ts"]
    }
  }
}
```

### Issue: CSS not loading

**Solution**: Make sure you import the CSS:

```tsx
import 'tabulator-tables/styles/tabulator.css';
```

Or if using direct path:

```tsx
import '../../tabulator/src/react-ts/styles/tabulator.css';
```

### Issue: React version mismatch

**Solution**: Make sure both projects use compatible React versions (>=16.8.0).

---

## 📚 Available Imports

```tsx
// Main component
import Tabulator from 'tabulator-tables';

// Types
import type {
  TabulatorOptions,
  TabulatorColumn,
  TabulatorRow,
  TabulatorCell,
  TabulatorInstance,
  TabulatorRef,
} from 'tabulator-tables';

// Hook (if needed)
import { useTabulator } from 'tabulator-tables/hooks';

// Styles
import 'tabulator-tables/styles/tabulator.css';
```

---

## ✅ Quick Checklist

- [ ] Installed React and React DOM (>=16.8.0)
- [ ] Installed TypeScript and type definitions
- [ ] Linked or installed tabulator-tables package
- [ ] Imported the CSS file
- [ ] Configured TypeScript (if using TS)
- [ ] Created columns and data arrays
- [ ] Rendered the Tabulator component

---

## 🎉 You're Ready!

Your Tabulator component is now ready to use in your other projects! See the examples in `src/react-ts/examples/` for more advanced usage.

