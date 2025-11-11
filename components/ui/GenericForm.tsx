import React, { useState } from 'react';
import { Box, Button, TextField, Grid, Alert } from '@mui/material';

export interface Field {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
}

interface GenericFormProps {
  fields: Field[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
  submitLabel?: string;
}

export const GenericForm: React.FC<GenericFormProps> = ({ fields, initialValues = {}, onSubmit, submitLabel = 'Salvar' }) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (id: string, value: any) => {
    setValues(v => ({ ...v, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      for (const field of fields) {
        if (field.required && !values[field.id]) {
          setError(`O campo "${field.label}" é obrigatório.`);
          setLoading(false);
          return;
        }
      }
      await onSubmit(values);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {fields.map(field => (
          <Grid item xs={12} sm={field.type === 'textarea' ? 12 : 6} key={field.id}>
            <TextField
              fullWidth
              label={field.label}
              value={values[field.id] || ''}
              onChange={e => handleChange(field.id, e.target.value)}
              required={field.required}
              multiline={field.multiline}
              minRows={field.multiline ? 3 : undefined}
              type={field.type === 'textarea' ? undefined : field.type || 'text'}
            />
          </Grid>
        ))}
      </Grid>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
        {submitLabel}
      </Button>
    </Box>
  );
};
