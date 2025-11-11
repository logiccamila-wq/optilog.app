import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export interface Column {
  id: string;
  label: string;
  align?: 'right' | 'left' | 'center';
  render?: (value: any, row: any) => React.ReactNode;
}

interface GenericTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

export const GenericTable: React.FC<GenericTableProps> = ({ columns, data, onEdit, onDelete }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          {columns.map(col => (
            <TableCell key={col.id} align={col.align || 'left'}>{col.label}</TableCell>
          ))}
          {(onEdit || onDelete) && <TableCell align="center">Ações</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, idx) => (
          <TableRow key={idx}>
            {columns.map(col => (
              <TableCell key={col.id} align={col.align || 'left'}>
                {col.render ? col.render(row[col.id], row) : row[col.id]}
              </TableCell>
            ))}
            {(onEdit || onDelete) && (
              <TableCell align="center">
                {onEdit && <IconButton onClick={() => onEdit(row)}><EditIcon /></IconButton>}
                {onDelete && <IconButton onClick={() => onDelete(row)}><DeleteIcon /></IconButton>}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
