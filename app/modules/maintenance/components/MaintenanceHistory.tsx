'use client';

import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { MaintenanceRecord } from '@/app/modules/maintenance/types';

interface MaintenanceHistoryProps {
  history: MaintenanceRecord[];
}

export default function MaintenanceHistory({ history }: MaintenanceHistoryProps) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Quilometragem</TableCell>
            <TableCell>Técnico</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.type}</TableCell>
              <TableCell>{record.description}</TableCell>
              <TableCell>{record.mileage} km</TableCell>
              <TableCell>{record.technician}</TableCell>
              <TableCell>{record.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}