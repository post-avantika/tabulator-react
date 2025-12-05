# Fix: Using Tabulator in Your Project

The link is working, but your build tool needs to be configured to handle TypeScript files from node_modules.

## ✅ Quick Fix: Use Direct Path Import

Instead of `npm link`, use a direct import path. This works immediately:

```tsx
// In your component file
import Tabulator, { TabulatorColumn } from '../../../tabulator/src/react-ts';
import '../../../tabulator/src/react-ts/styles/tabulator.css';

// Use it normally
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
    />
  );
}
```

**Adjust the path** based on your project structure. If your project is at:
- `/home/repozitory/Documents/projects/theFareGuide/theFareGuide-FE`
- And tabulator is at:
- `/home/repozitory/Documents/projects/tabulator`

Then the relative path from your component would be:
```tsx
import Tabulator from '../../tabulator/src/react-ts';
```

## 🔧 Alternative: Configure Build Tool

### If using Vite:

Create/update `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'tabulator-tables': path.resolve(__dirname, '../../tabulator/src/react-ts'),
    },
  },
});
```

Then import normally:
```tsx
import Tabulator from 'tabulator-tables';
```

### If using Next.js:

Update `next.config.js`:

```js
const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'tabulator-tables': path.resolve(__dirname, '../../tabulator/src/react-ts'),
    };
    return config;
  },
};
```

### If using Create React App:

You'll need to use `react-app-rewired` or eject. Or just use the direct path import method above.

## 🎯 Recommended: Direct Path (Easiest)

For now, use the direct path import - it's the simplest and works immediately:

```tsx
import Tabulator from '../../tabulator/src/react-ts';
import '../../tabulator/src/react-ts/styles/tabulator.css';
```

No configuration needed!

