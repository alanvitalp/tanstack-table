import React from 'react';
import { Table } from '@tanstack/react-table';
import { TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, Box } from '@mui/material';

interface TableFiltersProps<TData extends object> {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  columnFilters: Array<{
    column: keyof TData;
    options: string[];
    label: string;
  }>;
  table: Table<TData>;
  disabled?: boolean;
}

export function TableFilters<TData extends object>({ 
  globalFilter,
  onGlobalFilterChange,
  columnFilters,
  table,
  disabled
}: TableFiltersProps<TData>) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        label="Search"
        variant="outlined"
        value={globalFilter}
        onChange={(e) => onGlobalFilterChange(e.target.value)}
        size="small"
        sx={{ minWidth: 200 }}
        disabled={disabled}
      />
      
      {columnFilters.map(filter => {
        const column = table.getColumn(String(filter.column));
        const filterValue = column?.getFilterValue() as string[] ?? [];

        return (
          <FormControl key={String(filter.column)} sx={{ minWidth: 200 }}>
            <InputLabel>{filter.label}</InputLabel>
            <Select
              multiple
              value={filterValue}
              onChange={(e) => {
                column?.setFilterValue(e.target.value as string[]);
              }}
              input={<OutlinedInput label={filter.label} />}
              renderValue={(selected) => (selected as string[]).join(', ')}
              size="small"
              disabled={disabled}
            >
              {filter.options.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={filterValue.includes(option)} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      })}
    </Box>
  );
} 