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
  VisibilityState,
  ColumnFiltersState,
  FilterFn,
} from '@tanstack/react-table';
import {
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Button,
  CircularProgress,
  TableContainer,
} from '@mui/material';

import { TableFilters } from './components/TableFilters';
import { ColumnVisibility } from './components/ColumnVisibility';
import { TablePagination } from './components/TablePagination';
import { TableError } from './components/TableError';
import { TableLoading } from './components/TableLoading';

export interface TableProps<TData extends object> {
  data: TData[];
  columns: ColumnDef<TData>[];
  refreshFn?: () => Promise<void>;
  searchableColumns?: string[];
  initialPageSize?: number;
  pageSizeOptions?: number[];
  columnFilters?: Array<{
    column: keyof TData;
    options: string[];
    label: string;
  }>;
  onAddResource?: {
    label: string;
    onClick: () => void;
  };
}

export function DataTable<TData extends object>({ 
  data, 
  columns, 
  refreshFn, 
  searchableColumns = [],
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  columnFilters = [],
  onAddResource
}: TableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFiltersState, setColumnFiltersState] = useState<ColumnFiltersState>([]);
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const globalFilterFn: FilterFn<TData> = useCallback(
    (row, _, value) => {
      if (!value || !searchableColumns.length) return true;
      
      return searchableColumns.some(columnId => {
        const cellValue = row.getValue(columnId);
        return String(cellValue)
          .toLowerCase()
          .includes(String(value).toLowerCase());
      });
    },
    [searchableColumns]
  );

  const handleRefresh = useCallback(async () => {
    if (!refreshFn) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await refreshFn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  }, [refreshFn]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnVisibility,
      columnFilters: columnFiltersState,
      pagination,
    },
    onColumnFiltersChange: setColumnFiltersState,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
  });

  if (!data || !columns) {
    return <TableError message="Missing required props" />;
  }

  return (
    <Paper>
      <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {onAddResource && (
          <Button
            variant="contained"
            onClick={onAddResource.onClick}
            disabled={isLoading}
            data-testid={`add-${onAddResource.label.toLowerCase()}-button`}
          >
            Add {onAddResource.label}
          </Button>
        )}
        <TableFilters
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          columnFilters={columnFilters}
          table={table}
          disabled={isLoading}
        />
        
        {refreshFn && (
          <Button 
            variant="contained" 
            onClick={handleRefresh}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            data-testid="refresh-table-button"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        )}
        
        <ColumnVisibility 
          table={table} 
          columns={columns} 
          disabled={isLoading}
        />
      </Box>

      {error && (
        <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
          {error}
        </Box>
      )}

      {isLoading ? (
        <TableLoading />
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 1000 }}>
            <MuiTable stickyHeader>
              <TableHead>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableCell 
                        key={header.id}
                        data-testid={`column-header-${header.id}`}
                        sx={{
                          bgcolor: 'background.paper',
                          position: 'sticky',
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} data-testid={`table-row-${row.id}`}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} data-testid={`cell-${cell.column.id}-${row.id}`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </MuiTable>
          </TableContainer>

          <TablePagination 
            table={table}
            pageSizeOptions={pageSizeOptions}
            disabled={isLoading}
          />
        </>
      )}
    </Paper>
  );
}