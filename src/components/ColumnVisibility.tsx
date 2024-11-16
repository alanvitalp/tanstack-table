import React from 'react';
import { Table, ColumnDef } from '@tanstack/react-table';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from '@mui/material';

interface ColumnVisibilityProps<TData extends object> {
  table: Table<TData>;
  columns: ColumnDef<TData>[];
  disabled?: boolean;
}

export function ColumnVisibility<TData extends object>({ table, columns, disabled }: ColumnVisibilityProps<TData>) {
  const visibleColumns = table.getVisibleLeafColumns().map(col => col.id);

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>Show/Hide Columns</InputLabel>
      <Select
        disabled={disabled}
        multiple
        value={visibleColumns}
        onChange={(e) => {
          const selectedColumns = e.target.value as string[];
          table.setColumnVisibility(
            Object.fromEntries(
              columns.map(col => [
                (col as any).id || (col as any).accessorKey,
                selectedColumns.includes((col as any).id || (col as any).accessorKey)
              ])
            )
          );
        }}
        input={<OutlinedInput label="Show/Hide Columns" />}
        renderValue={(selected) => 
          selected
            .map(columnId => 
              columns.find(col => 
                (col as any).id === columnId || (col as any).accessorKey === columnId
              )?.header?.toString() || columnId
            )
            .join(', ')
        }
        size="small"
      >
        {columns.map(column => {
          const columnId = (column as any).id || (column as any).accessorKey;
          const columnHeader = typeof column.header === 'function' 
            ? column.header()
            : column.header || columnId;
          
          return (
            <MenuItem key={columnId} value={columnId}>
              <Checkbox checked={visibleColumns.includes(columnId)} />
              <ListItemText primary={columnHeader} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
} 