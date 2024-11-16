// src/Table.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  Row,
} from '@tanstack/react-table';
import {
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Pagination,
} from '@mui/material';

type TableProps<TData extends object> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  refreshFn?: () => Promise<void>;
  searchableColumns?: string[];
  initialPageSize?: number;
  pageSizeOptions?: number[];
};

type FilterFn = <TData extends object>(
  row: Row<TData>,
  columnId: string,
  filterValue: string
) => boolean;

export default function Table<TData extends object>({ 
  data, 
  columns, 
  refreshFn, 
  searchableColumns = [],
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50]
}: TableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(false);
  
  const customGlobalFilter = useCallback<FilterFn>((row, columnId: string, filterValue: string) => {
    if (searchableColumns.length === 0) {
      return row.getValue(columnId)?.toString().toLowerCase().includes(filterValue.toLowerCase()) ?? false;
    }

    const matchingColumns = searchableColumns
      .map(colId => row.getAllCells().find((cell) => cell.column.id === colId))
      .filter(cell => cell !== undefined);

    return matchingColumns.some(cell => 
      cell?.getValue<any>()?.toString().toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [searchableColumns]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      customGlobalFilter,
    },
    globalFilterFn: customGlobalFilter,
  });

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  }, []);

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    table.setPageIndex(page - 1);
  }, [table]);

  const handleRefresh = async () => {
    if (refreshFn) {
      setIsLoading(true);
      try {
        await refreshFn();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const PageSizeSelector = () => (
    <select
      value={pageSize}
      onChange={e => setPageSize(Number(e.target.value))}
      style={{ marginRight: '1rem' }}
    >
      {pageSizeOptions.map(size => (
        <option key={size} value={size}>
          Show {size}
        </option>
      ))}
    </select>
  );

  // Add error boundary
  if (!data || !columns) {
    return <div>Unable to display table: Missing required props</div>;
  }

  return (
    <Paper>
      <div style={{ padding: '16px' }}>
        <TextField
          label="Search"
          variant="outlined"
          value={globalFilter}
          onChange={handleSearch}
          style={{ marginBottom: '16px' }}
          disabled={isLoading}
        />
        <Button 
          variant="contained" 
          onClick={handleRefresh} 
          style={{ marginLeft: '8px' }}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      <MuiTable>
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableCell key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageSizeSelector />
        <Pagination
          count={table.getPageCount()}
          page={table.getState().pagination.pageIndex + 1}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </Paper>
  );
}