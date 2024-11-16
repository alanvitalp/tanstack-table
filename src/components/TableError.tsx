import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface TableErrorProps {
  message: string;
}

export function TableError({ message }: TableErrorProps) {
  return (
    <Paper>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {message}
        </Typography>
      </Box>
    </Paper>
  );
} 