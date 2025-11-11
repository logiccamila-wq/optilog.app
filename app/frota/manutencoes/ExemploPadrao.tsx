import React, { useState } from 'react';
import { GenericTable, Column } from '@/components/ui/GenericTable';
import { GenericForm, Field } from '@/components/ui/GenericForm';
import { Box, Typography, Dialog, DialogTitle, DialogContent, Button, Chip, Snackbar, CircularProgress } from '@mui/material';

const columns: Column[] = [
  { id: 'vehicle', label: 'Veículo' },
  { id: 'type', label: 'Tipo' },
  { id: 'service', label: 'Serviço' },
  { id: 'mechanic', label: 'Mecânico' },
  { id: 'scheduledDate', label: 'Data Agendada' },
  { id: 'status', label: 'Status', render: (v) => {
    let color: 'default' | 'primary' | 'success' | 'warning' = 'default';
    let label = v;
    if (v === 'completed') { color = 'success'; label = 'Concluído'; }
    else if (v === 'in_progress') { color = 'warning'; label = 'Em Andamento'; }
    else if (v === 'scheduled') { color = 'primary'; label = 'Agendado'; }
    return <Chip label={label} color={color} size="small" />;
  } },
  { id: 'cost', label: 'Custo', render: (v) => `R$ ${v}` },
];

const fields: Field[] = [
  { id: 'vehicle', label: 'Veículo', required: true },
  { id: 'type', label: 'Tipo', required: true },
  { id: 'service', label: 'Serviço', required: true },
  { id: 'mechanic', label: 'Mecânico', required: true },
  { id: 'scheduledDate', label: 'Data Agendada', required: true },
  { id: 'status', label: 'Status', required: true },
  { id: 'cost', label: 'Custo', required: true, type: 'number' },
];

const initialData = [
  { id: 1, vehicle: 'ABC-1234', type: 'preventive', service: 'Troca de óleo', mechanic: 'João Silva', scheduledDate: '2025-10-20', status: 'scheduled', cost: 450 },
  { id: 2, vehicle: 'XYZ-5678', type: 'corrective', service: 'Freios', mechanic: 'Ana Santos', scheduledDate: '2025-10-18', status: 'in_progress', cost: 1200 },
];

export default function ExemploPadrao() {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState<any | null>(null);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setEditRow(null);
    setOpen(true);
    setTimeout(() => {
      const el = document.querySelector('input');
      if (el) (el as HTMLInputElement).focus();
    }, 100);
  };

  const handleEdit = (row: any) => {
    setEditRow(row);
    setOpen(true);
  };

  const handleDelete = (row: any) => {
    setData(d => d.filter(r => r.id !== row.id));
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setTimeout(() => {
      if (editRow) {
        setData(d => d.map(r => r.id === editRow.id ? { ...editRow, ...values } : r));
        setSuccess('Manutenção editada com sucesso!');
      } else {
        setData(d => [...d, { ...values, id: Date.now() }]);
        setSuccess('Manutenção cadastrada com sucesso!');
      }
      setOpen(false);
      setLoading(false);
    }, 800);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Manutenções - Exemplo Padrão</Typography>
      <GenericTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAdd} autoFocus>
          Adicionar Manutenção
        </Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editRow ? 'Editar' : 'Nova'} Manutenção</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
              <CircularProgress />
            </Box>
          ) : (
            <GenericForm fields={fields} initialValues={editRow || {}} onSubmit={handleSubmit} submitLabel="Salvar" />
          )}
        </DialogContent>
      </Dialog>
      <Snackbar
        open={!!success}
        autoHideDuration={2500}
        onClose={() => setSuccess('')}
        message={success}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
}
