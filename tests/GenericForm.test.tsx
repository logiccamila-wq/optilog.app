import { render, screen, fireEvent } from '@testing-library/react';
import { GenericForm, Field } from '../components/ui/GenericForm';
import React from 'react';

describe('GenericForm', () => {
  const fields: Field[] = [
    { id: 'nome', label: 'Nome', required: true },
    { id: 'email', label: 'Email', required: true },
  ];

  it('deve exibir erro se campo obrigatório não for preenchido', async () => {
    const onSubmit = vi.fn();
    render(<GenericForm fields={fields} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(await screen.findByText(/obrigatório/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('deve chamar onSubmit com dados válidos', async () => {
    const onSubmit = vi.fn();
    render(<GenericForm fields={fields} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Camila' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'camila@teste.com' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    // Aguarda o submit
    expect(onSubmit).toHaveBeenCalledWith({ nome: 'Camila', email: 'camila@teste.com' });
  });
});
