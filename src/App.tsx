// src/App.tsx
import React from 'react';
import { DataTable } from './Table';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Chip, IconButton, Tooltip } from '@mui/material';
import { FilterFn } from '@tanstack/react-table';

type UserType = 'admin' | 'user' | 'guest';
type UserStatus = 'active' | 'inactive' | 'pending';

type User = {
  id: number;
  name: string;
  age: number;
  birthday: string;
  email: string;
  type: UserType;
  status: UserStatus;
};

const columnHelper = createColumnHelper<User>();

const multiSelectFilter: FilterFn<User> = (row, columnId, value: string[]) => {
  const cellValue = row.getValue(columnId);
  return value.length === 0 ? true : value.includes(String(cellValue));
};

const columns: ColumnDef<User, any>[] = [
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor('name', {
    header: 'Name',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    filterFn: multiSelectFilter,
    cell: ({ row }) => {
      const status = row.original.status;
      
      const chipColors: Record<UserStatus, 'success' | 'error' | 'warning'> = {
        active: 'success',
        inactive: 'error',
        pending: 'warning'
      };

      return (
        <Chip 
          label={status} 
          color={chipColors[status]}
          size="small"
        />
      );
    }
  }),
  columnHelper.accessor('email', {
    header: 'Email',
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    filterFn: multiSelectFilter,
    cell: ({ row }) => (
      <Chip 
        label={row.original.type}
        variant="outlined"
        size="small"
      />
    )
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      
      const handleEdit = () => {
        console.log('Edit user:', user);
      };

      const handleDelete = () => {
        console.log('Delete user:', user);
      };

      
      const canDelete = user.type !== 'admin'

      return (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip title="Edit">
            <IconButton 
              size="small"
              onClick={handleEdit}
            >
              Edit
            </IconButton>
          </Tooltip>
          
          {canDelete && (
            <Tooltip title="Delete">
              <IconButton 
                size="small"
                onClick={handleDelete}
                color="error"
              >
                Delete
              </IconButton>
            </Tooltip>
          )}
        </div>
      );
    }
  })
];


const userData: User[] = [
  { 
    id: 1, 
    name: 'John Doe', 
    age: 30, 
    birthday: '1992-01-01', 
    email: 'john@gmail.com',
    type: 'admin',
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    age: 25, 
    birthday: '1997-05-15', 
    email: 'jane@yahoo.com',
    type: 'user',
    status: 'inactive'
  },
  { 
    id: 3, 
    name: 'Bob Wilson', 
    age: 28, 
    birthday: '1995-03-20', 
    email: 'bob@gmail.com',
    type: 'guest',
    status: 'pending'
  },
];

export default function App() {
  return (
    <div>
      <h1>User List</h1>
      <DataTable 
        data={userData} 
        columns={columns}
        refreshFn={() => Promise.resolve()}	
        searchableColumns={['name']}
        columnFilters={[
          {
            column: 'status',
            options: ['active', 'inactive', 'pending'],
            label: 'Status Filter'
          },
          {
            column: 'type',
            options: ['admin', 'user', 'guest'],
            label: 'User Type'
          }
        ]}
      />
    </div>
  );
}