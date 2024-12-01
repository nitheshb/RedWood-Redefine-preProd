import React, { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
} from '@mui/material';


const data = [
  { id: 1, name: 'Project 1', totalUnits: 100, available: 60, sold: 30, blocked: 5, mortgaged: 5 },
  { id: 2, name: 'Project 2', totalUnits: 150, available: 80, sold: 40, blocked: 10, mortgaged: 20 },
  { id: 3, name: 'Project 3', totalUnits: 200, available: 120, sold: 50, blocked: 10, mortgaged: 20 },
  { id: 4, name: 'Project 4', totalUnits: 120, available: 70, sold: 30, blocked: 10, mortgaged: 10 },
];

function CustomSortableTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name'); 


  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const sortedData = useMemo(() => {
    const comparator = (a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    };
    return [...data].sort(comparator);
  }, [data, order, orderBy]);

  const createSortHandler = useCallback(
    (property) => (event) => {
      handleRequestSort(property);
    },
    [order, orderBy]
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: '90%',
        margin: '30px auto',
        borderRadius: '12px',
        boxShadow: 3,
        backgroundColor: '#f9f9f9', 
      }}
    >
      <Table aria-label="sortable table">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: '#e5e5e5', 
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            <TableCell
              sx={{
                padding: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRight: '1px solid #cccccc', // Border for column separation
              }}
            >
              <TableSortLabel
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={createSortHandler('name')}
                sx={{
                  color: 'black',
                  '&:hover': {
                    color: '#ffeb3b',
                  },
                }}
              >
                Project Name
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{
                padding: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRight: '1px solid #cccccc',
              }}
            >
              <TableSortLabel
                active={orderBy === 'totalUnits'}
                direction={orderBy === 'totalUnits' ? order : 'asc'}
                onClick={createSortHandler('totalUnits')}
                sx={{
                  color: 'black',
                  '&:hover': {
                    color: '#ffeb3b',
                  },
                }}
              >
                Total Units
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{
                padding: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRight: '1px solid #cccccc',
              }}
            >
              <TableSortLabel
                active={orderBy === 'available'}
                direction={orderBy === 'available' ? order : 'asc'}
                onClick={createSortHandler('available')}
                sx={{
                  color: 'black',
                  '&:hover': {
                    color: '#ffeb3b',
                  },
                }}
              >
                Available
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{
                padding: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRight: '1px solid #cccccc',
              }}
            >
              <TableSortLabel
                active={orderBy === 'sold'}
                direction={orderBy === 'sold' ? order : 'asc'}
                onClick={createSortHandler('sold')}
                sx={{
                  color: 'black',
                  '&:hover': {
                    color: '#ffeb3b',
                  },
                }}
              >
                Sold
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{
                padding: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRight: '1px solid #cccccc',
              }}
            >
              <TableSortLabel
                active={orderBy === 'blocked'}
                direction={orderBy === 'blocked' ? order : 'asc'}
                onClick={createSortHandler('blocked')}
                sx={{
                  color: 'black',
                  '&:hover': {
                    color: '#ffeb3b',
                  },
                }}
              >
                Blocked
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{
                padding: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              <TableSortLabel
                active={orderBy === 'mortgaged'}
                direction={orderBy === 'mortgaged' ? order : 'asc'}
                onClick={createSortHandler('mortgaged')}
                sx={{
                  color: 'black',
                  '&:hover': {
                    color: '#ffeb3b',
                  },
                }}
              >
                Mortgaged
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                backgroundColor: '#fff',
                '&:nth-of-type(even)': {
                  backgroundColor: '#f7f7f7', 
                },
                '&:hover': {
                  backgroundColor: '#e5e5e5', 
                },
              }}
            >
              <TableCell sx={{ color: 'black', textAlign: 'center', padding: '12px', borderRight: '1px solid #cccccc' }}>
                {row.name}
              </TableCell>
              <TableCell sx={{ color: 'black', textAlign: 'center', padding: '12px', borderRight: '1px solid #cccccc' }}>
                {row.totalUnits}
              </TableCell>
              <TableCell sx={{ color: 'black', textAlign: 'center', padding: '12px', borderRight: '1px solid #cccccc' }}>
                {row.available}
              </TableCell>
              <TableCell sx={{ color: 'black', textAlign: 'center', padding: '12px', borderRight: '1px solid #cccccc' }}>
                {row.sold}
              </TableCell>
              <TableCell sx={{ color: 'black', textAlign: 'center', padding: '12px', borderRight: '1px solid #cccccc' }}>
                {row.blocked}
              </TableCell>
              <TableCell sx={{ color: 'black', textAlign: 'center', padding: '12px' }}>
                {row.mortgaged}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CustomSortableTable;
