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

  const getColumnHeader = (column: ColumnDef<TData>) => {
    const columnId = column.id || (column as any).accessorKey;
    
    if (typeof column.header === 'function') {
      const tableColumn = table.getColumn(columnId);
      if (!tableColumn) return columnId;
      return column.header({ column: tableColumn, header: tableColumn.columnDef.header as any, table }) as string;
    }
    
    return column.header || columnId;
  };

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
                col.id || (col as any).accessorKey,
                selectedColumns.includes(col.id || (col as any).accessorKey)
              ])
            )
          );
        }}
        input={<OutlinedInput label="Show/Hide Columns" />}
        renderValue={(selected) => 
          selected
            .map(columnId => 
              getColumnHeader(
                columns.find(col => 
                  col.id === columnId || (col as any).accessorKey === columnId
                )!
              )
            )
            .join(', ')
        }
        size="small"
      >
        {columns.map(column => {
          const columnId = column.id || (column as any).accessorKey;
          const columnHeader = getColumnHeader(column);
          
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