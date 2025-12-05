import React, { useRef, useState } from 'react';
import Tabulator, { TabulatorRef, TabulatorColumn } from './index';
import './styles/tabulator.css';

/**
 * Example usage of Tabulator React TypeScript component
 */
const TabulatorExample: React.FC = () => {
  const tableRef = useRef<TabulatorRef>(null);
  const [pageSize, setPageSize] = useState(10);

  // Column definitions with custom widths and CSS classes
  const columns: TabulatorColumn[] = [
    {
      title: "ID",
      field: "id",
      width: 80,
      cssClass: "id-column",
      sorter: "number",
      headerSort: true
    },
    {
      title: "Name",
      field: "name",
      width: 200,
      cssClass: "name-column custom-bold",
      sorter: "string",
      headerSort: true
    },
    {
      title: "Age",
      field: "age",
      width: 100,
      cssClass: "age-column",
      sorter: "number",
      headerSort: true
    },
    {
      title: "Email",
      field: "email",
      width: 250,
      cssClass: "email-column",
      sorter: "string"
    },
    {
      title: "Status",
      field: "status",
      width: 120,
      cssClass: "status-column",
      formatter: (cell) => {
        const value = cell.getValue();
        const color = value === 'Active' ? 'green' : 'red';
        return `<span style="color: ${color}; font-weight: bold;">${value}</span>`;
      }
    },
    {
      title: "Actions",
      field: "actions",
      width: 150,
      cssClass: "actions-column",
      formatter: () => {
        return '<button class="btn-edit">Edit</button> <button class="btn-delete">Delete</button>';
      }
    }
  ];

  // Sample data
  const [data, setData] = useState([
    { id: 1, name: "John Doe", age: 30, email: "john@example.com", status: "Active" },
    { id: 2, name: "Jane Smith", age: 25, email: "jane@example.com", status: "Active" },
    { id: 3, name: "Bob Johnson", age: 35, email: "bob@example.com", status: "Inactive" },
    { id: 4, name: "Alice Williams", age: 28, email: "alice@example.com", status: "Active" },
    { id: 5, name: "Charlie Brown", age: 42, email: "charlie@example.com", status: "Active" },
    { id: 6, name: "Diana Prince", age: 29, email: "diana@example.com", status: "Inactive" },
    { id: 7, name: "Ethan Hunt", age: 38, email: "ethan@example.com", status: "Active" },
    { id: 8, name: "Fiona Apple", age: 27, email: "fiona@example.com", status: "Active" },
    { id: 9, name: "George Lucas", age: 45, email: "george@example.com", status: "Active" },
    { id: 10, name: "Hannah Montana", age: 24, email: "hannah@example.com", status: "Inactive" },
    { id: 11, name: "Ian Fleming", age: 50, email: "ian@example.com", status: "Active" },
    { id: 12, name: "Julia Roberts", age: 33, email: "julia@example.com", status: "Active" },
  ]);

  const handleAddRow = () => {
    const newRow = {
      id: data.length + 1,
      name: `New User ${data.length + 1}`,
      age: Math.floor(Math.random() * 50) + 20,
      email: `user${data.length + 1}@example.com`,
      status: "Active"
    };
    setData([...data, newRow]);
  };

  const handleDeleteSelected = () => {
    if (tableRef.current) {
      const selected = tableRef.current.getSelectedData();
      if (selected.length > 0) {
        const selectedIds = selected.map((row: any) => row.id);
        setData(data.filter(row => !selectedIds.includes(row.id)));
      }
    }
  };

  const handleChangePageSize = (newSize: number) => {
    setPageSize(newSize);
    if (tableRef.current) {
      tableRef.current.setPageSize(newSize);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tabulator React TypeScript Example</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleAddRow} 
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Add Row
        </button>
        <button 
          onClick={handleDeleteSelected} 
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Delete Selected
        </button>
        <select 
          value={pageSize} 
          onChange={(e) => handleChangePageSize(Number(e.target.value))}
          style={{ padding: '8px', marginLeft: '10px' }}
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      <Tabulator
        ref={tableRef}
        columns={columns}
        data={data}
        className="custom-tabulator-table"
        style={{ border: '1px solid #ddd', borderRadius: '8px' }}
        height="500px"
        pagination={true}
        paginationSize={pageSize}
        paginationSizeSelector={[5, 10, 25, 50, 100]}
        paginationCounter="rows"
        paginationButtonCount={5}
        resizableColumns={true}
        sortable={true}
        selectable={true}
        selectableRangeMode="click"
        onRowClick={(e, row) => {
          console.log('Row clicked:', row.getData());
        }}
        onRowSelectionChanged={(data, rows) => {
          console.log('Selected rows:', data);
        }}
        placeholder="No data available"
      />

      <style>{`
        .custom-tabulator-table {
          font-family: Arial, sans-serif;
        }
        .custom-bold {
          font-weight: bold;
        }
        .id-column {
          text-align: center;
        }
        .age-column {
          text-align: center;
        }
        .status-column {
          text-align: center;
        }
        .actions-column {
          text-align: center;
        }
        .btn-edit, .btn-delete {
          padding: 4px 8px;
          margin: 0 2px;
          cursor: pointer;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #f0f0f0;
        }
        .btn-edit:hover {
          background: #e0e0e0;
        }
        .btn-delete:hover {
          background: #ffcccc;
        }
      `}</style>
    </div>
  );
};

export default TabulatorExample;

