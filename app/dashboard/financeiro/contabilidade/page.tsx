"use client";
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Box,
  Tabs,
  Tab,
  TreeView,
  TreeItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DownloadIcon from '@mui/icons-material/Download';

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parent?: string;
  balance: number;
}

interface Transaction {
  id: number;
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  costCenter?: string;
}

export default function ContabilidadePage() {
  const [tab, setTab] = useState(0);
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', code: '1.0', name: 'ATIVO', type: 'asset', balance: 250000 },
    { id: '1.1', code: '1.1', name: 'Ativo Circulante', type: 'asset', parent: '1', balance: 150000 },
    { id: '1.1.1', code: '1.1.1', name: 'Caixa', type: 'asset', parent: '1.1', balance: 50000 },
    { id: '1.1.2', code: '1.1.2', name: 'Bancos', type: 'asset', parent: '1.1', balance: 100000 },
    { id: '2', code: '2.0', name: 'PASSIVO', type: 'liability', balance: 150000 },
    { id: '2.1', code: '2.1', name: 'Passivo Circulante', type: 'liability', parent: '2', balance: 80000 },
    { id: '3', code: '3.0', name: 'RECEITAS', type: 'revenue', balance: 500000 },
    { id: '4', code: '4.0', name: 'DESPESAS', type: 'expense', balance: 350000 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      date: new Date().toISOString(),
      description: 'Venda de serviços',
      debitAccount: '1.1.1',
      creditAccount: '3.0',
      amount: 5000,
      costCenter: 'Operacional',
    },
    {
      id: 2,
      date: new Date().toISOString(),
      description: 'Pagamento fornecedor',
      debitAccount: '4.0',
      creditAccount: '1.1.2',
      amount: 3000,
      costCenter: 'Administrativo',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);

  const typeColors: Record<Account['type'], 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
    asset: 'primary',
    liability: 'error',
    equity: 'info',
    revenue: 'success',
    expense: 'warning',
  };

  const typeLabels: Record<Account['type'], string> = {
    asset: 'Ativo',
    liability: 'Passivo',
    equity: 'Patrimônio Líquido',
    revenue: 'Receita',
    expense: 'Despesa',
  };

  const renderTree = (node: Account) => (
    <TreeItem 
      key={node.id} 
      nodeId={node.id} 
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
          <Typography sx={{ fontWeight: 600 }}>{node.code}</Typography>
          <Typography sx={{ flex: 1 }}>{node.name}</Typography>
          <Chip label={typeLabels[node.type]} color={typeColors[node.type]} size="small" />
          <Typography sx={{ fontWeight: 600 }}>R$ {node.balance.toLocaleString('pt-BR')}</Typography>
        </Box>
      }
    >
      {accounts.filter(child => child.parent === node.id).map(child => renderTree(child))}
    </TreeItem>
  );

  const exportBalancete = () => {
    const csv = [
      ['Código', 'Conta', 'Tipo', 'Saldo'],
      ...accounts.map(acc => [acc.code, acc.name, typeLabels[acc.type], acc.balance]),
    ].map(row => row.join(';')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `balancete_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Contabilidade
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportBalancete}
          >
            Exportar Balancete
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Novo Lançamento
          </Button>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Plano de Contas" />
        <Tab label="Lançamentos Contábeis" />
        <Tab label="Balancete" />
      </Tabs>

      {tab === 0 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Plano de Contas</Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={() => setAccountDialogOpen(true)}>
              Nova Conta
            </Button>
          </Box>
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            {accounts.filter(acc => !acc.parent).map(renderTree)}
          </TreeView>
        </Paper>
      )}

      {tab === 1 && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Data</strong></TableCell>
                <TableCell><strong>Descrição</strong></TableCell>
                <TableCell><strong>Débito</strong></TableCell>
                <TableCell><strong>Crédito</strong></TableCell>
                <TableCell align="right"><strong>Valor</strong></TableCell>
                <TableCell><strong>Centro de Custo</strong></TableCell>
                <TableCell align="right"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((trans) => (
                <TableRow key={trans.id} hover>
                  <TableCell>{new Date(trans.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{trans.description}</TableCell>
                  <TableCell>{trans.debitAccount}</TableCell>
                  <TableCell>{trans.creditAccount}</TableCell>
                  <TableCell align="right">R$ {trans.amount.toLocaleString('pt-BR')}</TableCell>
                  <TableCell>{trans.costCenter || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 2 && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Código</strong></TableCell>
                <TableCell><strong>Conta</strong></TableCell>
                <TableCell><strong>Tipo</strong></TableCell>
                <TableCell align="right"><strong>Saldo</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((acc) => (
                <TableRow key={acc.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{acc.code}</TableCell>
                  <TableCell>{acc.name}</TableCell>
                  <TableCell>
                    <Chip label={typeLabels[acc.type]} color={typeColors[acc.type]} size="small" />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    R$ {acc.balance.toLocaleString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
