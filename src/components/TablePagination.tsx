import React from 'react';
import { Table } from '@tanstack/react-table';
import { Box, Pagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface TablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions: number[];
  disabled?: boolean;
}

export function TablePagination<TData>({ 
  table, 
  pageSizeOptions,
  disabled
}: TablePaginationProps<TData>) {
  return (
    <Box sx={{ 
      p: 2, 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <FormControl size="small">
        <InputLabel>Rows per page</InputLabel>
        <Select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          label="Rows per page"
          disabled={disabled}
        >
          {pageSizeOptions.map(pageSize => (
            <MenuItem key={pageSize} value={pageSize}>
              {pageSize}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Pagination
        count={table.getPageCount()}
        page={table.getState().pagination.pageIndex + 1}
        onChange={(event, page) => table.setPageIndex(page - 1)}
        color="primary"
        shape="rounded"
        disabled={disabled}
      />
    </Box>
  );
} 