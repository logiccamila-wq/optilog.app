"use client";

import * as React from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Timestamp, addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@/lib/firebaseClient";

type Status = "Ativo" | "Inativo";

interface UserItem {
  id: string;
  nome: string;
  email: string;
  status: Status;
  createdAt?: Timestamp | null;
  uid?: string;
}

const validateEmail = (email: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

export default function UsuariosPage() {
  const [rows, setRows] = React.useState<UserItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<string>("");

  const [openForm, setOpenForm] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<UserItem | null>(null);

  const [nome, setNome] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [senha, setSenha] = React.useState<string>("");
  const [status, setStatus] = React.useState<Status>("Ativo");

  const [snack, setSnack] = React.useState<{ open: boolean; type: "success" | "error"; msg: string }>({ open: false, type: "success", msg: "" });

  React.useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: UserItem[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            nome: data.nome || data.name || "",
            email: data.email || "",
            status: (data.status as Status) || "Ativo",
            createdAt: data.createdAt || null,
            uid: data.uid || undefined,
          };
        });
        setRows(list);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setNome("");
    setEmail("");
    setSenha("");
    setStatus("Ativo");
  };

  const handleOpenNew = () => {
    resetForm();
    setOpenForm(true);
  };

  const handleEdit = (u: UserItem) => {
    setEditing(u);
    setNome(u.nome);
    setEmail(u.email);
    setSenha("");
    setStatus(u.status);
    setOpenForm(true);
  };

  const handleDelete = async (u: UserItem) => {
    try {
      await deleteDoc(doc(db, "users", u.id));
      setSnack({ open: true, type: "success", msg: "Usuário excluído." });
    } catch (e: any) {
      setSnack({ open: true, type: "error", msg: e.message || "Erro ao excluir." });
    }
  };

  const handleSubmit = async () => {
    if (!nome.trim()) return setSnack({ open: true, type: "error", msg: "Informe o nome." });
    if (!validateEmail(email)) return setSnack({ open: true, type: "error", msg: "E-mail inválido." });

    try {
      if (editing) {
        await updateDoc(doc(db, "users", editing.id), {
          nome,
          email,
          status,
        });
        setSnack({ open: true, type: "success", msg: "Usuário atualizado." });
      } else {
        let uid: string | undefined;
        if (senha && senha.length >= 6) {
          try {
            const cred = await createUserWithEmailAndPassword(auth, email, senha);
            uid = cred.user.uid;
          } catch (authErr: any) {
            // Falha ao criar no Auth; seguimos apenas com Firestore
            console.warn("Falha ao criar usuário no Auth:", authErr?.message);
          }
        }
        await addDoc(collection(db, "users"), {
          nome,
          email,
          status,
          uid: uid || null,
          createdAt: serverTimestamp(),
        });
        setSnack({ open: true, type: "success", msg: "Usuário cadastrado." });
      }
      setOpenForm(false);
      resetForm();
    } catch (e: any) {
      setSnack({ open: true, type: "error", msg: e.message || "Erro ao salvar." });
    }
  };

  const filtered = rows.filter((r) => {
    const term = filter.toLowerCase();
    return (
      r.nome.toLowerCase().includes(term) ||
      r.email.toLowerCase().includes(term) ||
      r.status.toLowerCase().includes(term)
    );
  });

  const exportCSV = () => {
    const header = ["Nome", "E-mail", "Status", "Data de Cadastro"];
    const lines = filtered.map((r) => {
      const date = r.createdAt ? new Date((r.createdAt as any).toDate()).toISOString() : "";
      return [r.nome, r.email, r.status, date].map((x) => `"${String(x).replace(/"/g, '"')}"`).join(",");
    });
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `usuarios_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>Usuários</Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            placeholder="Buscar por nome, e-mail ou status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button variant="outlined" onClick={exportCSV}>Exportar CSV</Button>
          <Button variant="contained" onClick={handleOpenNew}>Novo Usuário</Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data de Cadastro</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5}>Carregando...</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={5}>Erro: {error}</TableCell>
              </TableRow>
            )}
            {!loading && !error && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>Nenhum usuário encontrado.</TableCell>
              </TableRow>
            )}
            {filtered.map((r) => {
              const dateStr = r.createdAt ? new Date((r.createdAt as any).toDate()).toLocaleString() : "";
              return (
                <TableRow key={r.id} hover>
                  <TableCell>{r.nome}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{r.status}</TableCell>
                  <TableCell>{dateStr}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" variant="outlined" onClick={() => handleEdit(r)}>Editar</Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(r)}>Excluir</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />
            <TextField label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            {!editing && (
              <TextField label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} fullWidth helperText="Mínimo 6 caracteres" />
            )}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                <MenuItem value="Ativo">Ativo</MenuItem>
                <MenuItem value="Inativo">Inativo</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>{editing ? "Salvar" : "Cadastrar"}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.type} variant="filled" sx={{ width: "100%" }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}