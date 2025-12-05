# Infinite Scroll / On-Scroll Pagination

Yes! The React TypeScript version **fully supports infinite scroll pagination** (also called "on-scroll pagination" or "progressive load").

## 🔄 API Integration

**Yes, it automatically calls your API with pagination!** When the user scrolls near the bottom, the component automatically calls your `onProgressiveLoad` function with the next page number, allowing you to make API calls.

## ✅ Features

- **Automatic loading** when scrolling near the bottom
- **Configurable scroll margin** - control when to trigger loading
- **Loading indicators** - shows loading state
- **End of data detection** - automatically stops when no more data
- **Async data loading** - supports API calls and promises

## 🚀 Basic Usage with API

```tsx
import React, { useState, useEffect } from 'react';
import Tabulator, { TabulatorColumn } from './src/react-ts';
import './src/react-ts/styles/tabulator.css';

function InfiniteScrollTable() {
  const [allData, setAllData] = useState<any[]>([]);

  const columns: TabulatorColumn[] = [
    { title: "ID", field: "id", width: 80 },
    { title: "Name", field: "name", width: 200 },
    { title: "Email", field: "email", width: 250 },
  ];

  // Load initial data
  useEffect(() => {
    fetch('/api/users?page=1&pageSize=20')
      .then(res => res.json())
      .then(data => setAllData(data.data || data));
  }, []);

  // This function is called AUTOMATICALLY when scrolling near bottom
  // It makes API calls with pagination automatically
  const handleProgressiveLoad = async (page: number): Promise<any[]> => {
    // API call with pagination - called automatically!
    const response = await fetch(`/api/users?page=${page}&pageSize=20`);
    const result = await response.json();
    const newData = result.data || result;
    
    // Append to existing data
    setAllData(prev => [...prev, ...newData]);
    
    // Return empty array when no more data (stops loading)
    return newData.length === 0 ? [] : newData;
  };

  return (
    <Tabulator
      columns={columns}
      data={allData}
      height="500px"
      progressiveLoad="scroll"              // Enable infinite scroll
      progressiveLoadScrollMargin={200}      // Trigger 200px from bottom
      onProgressiveLoad={handleProgressiveLoad}  // Your API function
    />
  );
}
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progressiveLoad` | `'scroll' \| 'load' \| false` | `false` | Enable infinite scroll (`'scroll'`) or manual load (`'load'`) |
| `progressiveLoadScrollMargin` | `number` | `0` | Distance from bottom (in pixels) to trigger loading. Defaults to 2x container height if not set |
| `onProgressiveLoad` | `(page: number) => Promise<any[]> \| any[]` | - | **Required** - Function to load more data. Returns array of new rows, or empty array when done |

## 🎯 How It Works

1. **Initial Load**: Load your first page of data and pass it to the `data` prop
2. **Scroll Detection**: When user scrolls near the bottom (within `progressiveLoadScrollMargin`), the component automatically calls `onProgressiveLoad`
3. **Data Loading**: Your function loads the next page and returns the new data
4. **Auto-Append**: The component automatically appends new data to the table
5. **End Detection**: When your function returns an empty array, loading stops

## 📝 Complete Example

```tsx
import React, { useState, useEffect } from 'react';
import Tabulator, { TabulatorColumn } from './src/react-ts';
import './src/react-ts/styles/tabulator.css';

function App() {
  const [allData, setAllData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const columns: TabulatorColumn[] = [
    { title: "ID", field: "id", width: 80, sorter: "number" },
    { title: "Name", field: "name", width: 200, sorter: "string" },
    { title: "Email", field: "email", width: 250 },
  ];

  // Load initial data
  useEffect(() => {
    loadPage(1).then(data => {
      setAllData(data);
    });
  }, []);

  // Simulate API call
  const loadPage = async (page: number): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    
    const pageSize = 20;
    const newData = [];
    for (let i = 0; i < pageSize; i++) {
      newData.push({
        id: (page - 1) * pageSize + i + 1,
        name: `User ${(page - 1) * pageSize + i + 1}`,
        email: `user${(page - 1) * pageSize + i + 1}@example.com`,
      });
    }
    
    // Stop after 5 pages
    return page > 5 ? [] : newData;
  };

  // Progressive load handler
  const handleProgressiveLoad = async (page: number): Promise<any[]> => {
    console.log(`Loading page ${page}...`);
    const newData = await loadPage(page);
    
    if (newData.length > 0) {
      setAllData(prev => [...prev, ...newData]);
      setCurrentPage(page);
    }
    
    return newData;
  };

  return (
    <div>
      <p>Loaded: {allData.length} rows | Current Page: {currentPage}</p>
      
      <Tabulator
        columns={columns}
        data={allData}
        height="500px"
        progressiveLoad="scroll"
        progressiveLoadScrollMargin={200}
        onProgressiveLoad={handleProgressiveLoad}
      />
    </div>
  );
}
```

## ⚙️ Configuration Options

### Scroll Margin

Control when loading triggers:

```tsx
// Load when 200px from bottom
progressiveLoadScrollMargin={200}

// Load when 2x container height from bottom (default if not set)
progressiveLoadScrollMargin={0} // Uses 2x height automatically
```

### Loading States

The component automatically shows:
- **Loading indicator** when fetching data
- **"No more data"** message when all data is loaded

## 🔄 Manual Loading (Alternative)

If you prefer manual "Load More" button instead of scroll:

```tsx
// Use 'load' mode (not implemented yet, but can be added)
progressiveLoad="load"
```

## 🎨 Styling

The loading indicators use these CSS classes:
- `.tabulator-progressive-load` - Container
- `.tabulator-loading` - Loading message
- `.tabulator-no-more` - End of data message

## ⚠️ Important Notes

1. **Initial Data**: You must provide initial data in the `data` prop
2. **Page Tracking**: The component tracks pages internally, starting from page 1
3. **Empty Array**: Return `[]` when no more data is available
4. **Async Support**: The function can return a Promise or array directly
5. **Data Management**: You're responsible for managing the full dataset in your state

## 🆚 Comparison with Regular Pagination

| Feature | Regular Pagination | Infinite Scroll |
|---------|-------------------|-----------------|
| User Action | Click page buttons | Scroll down |
| Data Display | One page at a time | All loaded data |
| Navigation | Page numbers | Continuous scroll |
| Use Case | Known data size | Unknown/large datasets |
| Performance | Better for small data | Better for large data |

## ✅ Summary

**Yes, infinite scroll pagination is fully supported!** Just set:
- `progressiveLoad="scroll"`
- `onProgressiveLoad={yourLoadFunction}`
- Optionally set `progressiveLoadScrollMargin` for custom trigger distance

The component handles everything else automatically! 🎉

