import React from 'react';
import { Paper, CircularProgress, Box } from '@mui/material';

export function TableLoading() {
  return (
    <Paper>
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress />
      </Box>
    </Paper>
  );
} 