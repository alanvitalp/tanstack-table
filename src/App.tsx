// src/App.tsx
import React from 'react';
import Table from './Table';
import { createColumnHelper } from '@tanstack/react-table';

type User = {
  id: number;
  name: string;
  age: number;
  birthday: string;
  email: string;
};

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor('id', {
    header: () => 'ID',
  }),
  columnHelper.accessor('name', {
    header: () => 'Name',
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
  }),
  columnHelper.accessor('birthday', {
    header: () => 'Birthday',
  }),
  columnHelper.accessor('email', {
    header: () => 'Email',
  }),
];

const userData: User[] = [
  { id: 1, name: 'John Doe', age: 30, birthday: '1992-01-01', email: 'john@gmail.com' },
  { id: 2, name: 'Jane Smith', age: 25, birthday: '1997-05-15', email: 'jane@yahoo.com' },
];

export default function App() {
  return (
    <div>
      <h1>User List</h1>
      <Table 
        data={userData} 
        columns={columns}
        searchableColumns={['name']}
      />
    </div>
  );
}