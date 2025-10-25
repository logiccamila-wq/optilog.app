'use client';
import React, { useCallback, useEffect, useState } from 'react';

type UserItem = {
  uid: string;
  email: string | null;
  display_name: string | null;
  role: string | null;
  phone_number: string | null;
  disabled: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export default function AdminPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    setHasToken(typeof window !== 'undefined' && !!localStorage.getItem('token'));
  }, []);

  const [uidUpdate, setUidUpdate] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [uidDelete, setUidDelete] = useState('');
  const [serverStatus, setServerStatus] = useState<string>('');

  // Listagem de usuários
  const [users, setUsers] = useState<UserItem[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [disabledFilter, setDisabledFilter] = useState<string>('any');
  const [orderBy, setOrderBy] = useState<string>('created_at');
  const [order, setOrder] = useState<string>('desc');

  const fetchUsers = useCallback(async () => {
    if (!hasToken) return;
    try {
      setLoadingList(true);
      setErrorList('');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      if (disabledFilter !== 'any') params.set('disabled', disabledFilter);
      if (orderBy) params.set('orderBy', orderBy);
      if (order) params.set('order', order);
      const res = await fetch(`/api/admin/users/list?${params.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Falha na listagem');
      setUsers(Array.isArray(data.users) ? data.users : []);
      setTotalUsers(data.total || 0);
    } catch (e: any) {
      setErrorList(e?.message || String(e));
    } finally {
      setLoadingList(false);
    }
  }, [hasToken, page, pageSize, search, roleFilter, disabledFilter, orderBy, order]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const uploadCsv = useCallback(async () => {
    if (!csvFile) {
      setMessage('Selecione um arquivo CSV primeiro.');
      return;
    }
    try {
      setUploading(true);
      setMessage('');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const fd = new FormData();
      fd.append('file', csvFile);
      const res = await fetch('/api/admin/users/importCsv', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Falha ao importar CSV');
      }
      setMessage(`Importação concluída: ${data?.inserted || 0} registros.`);
      // Atualiza listagem após importação
      fetchUsers();
    } catch (e: any) {
      setMessage(`Falha no upload: ${e?.message || String(e)}`);
    } finally {
      setUploading(false);
    }
  }, [csvFile, fetchUsers]);

  const callUpdateUser = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ uid: uidUpdate, displayName, role, phoneNumber, disabled }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Falha ao atualizar usuário');
      }
      setMessage(`Atualização OK: ${JSON.stringify(data?.user || {})}`);
      fetchUsers();
    } catch (e: any) {
      setMessage(`Erro ao atualizar: ${e?.message || String(e)}`);
    }
  }, [uidUpdate, displayName, role, phoneNumber, disabled, fetchUsers]);

  const callDeleteUser = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ uid: uidDelete }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Falha ao excluir usuário');
      }
      setMessage(`Exclusão OK: ${JSON.stringify(data)}`);
      fetchUsers();
    } catch (e: any) {
      setMessage(`Erro ao excluir: ${e?.message || String(e)}`);
    }
  }, [uidDelete, fetchUsers]);

  const checkServer = useCallback(async () => {
    try {
      const res = await fetch('/nextServer/status');
      const json = await res.json();
      setServerStatus(JSON.stringify(json));
    } catch (e: any) {
      setServerStatus(`Erro: ${e?.message || String(e)}`);
    }
  }, []);

  const fmtDate = (v: any) => {
    try {
      const d = new Date(v);
      return isNaN(d.getTime()) ? '-' : d.toLocaleString();
    } catch {
      return '-';
    }
  };

  const copyUid = async (uid: string) => {
    try {
      await navigator.clipboard.writeText(uid);
      setMessage(`UID copiado: ${uid}`);
    } catch {}
  };

  const quickEdit = (u: UserItem) => {
    setUidUpdate(u.uid || '');
    setDisplayName(u.display_name || '');
    setRole(u.role || '');
    setPhoneNumber(u.phone_number || '');
    setDisabled(!!u.disabled);
    const el = document.getElementById('update-user');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: 1000, margin: '24px auto', padding: 16 }}>
      <h1>Admin</h1>
      <p style={{ color: '#bbb' }}>
        Upload de CSV para importar usuários, ações de atualização/remoção e listagem com filtros.
      </p>
      {!hasToken && (
        <div style={{ marginTop: 12, padding: 8, border: '1px solid #444', borderRadius: 6 }}>
          Você precisa estar autenticado via JWT. Faça login em <a href="/jwt/login">/jwt/login</a>.
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => (window.location.href = '/jwt/login')}
              style={{ padding: '6px 12px' }}
            >
              Ir para login
            </button>
          </div>
        </div>
      )}

      <section style={{ marginTop: 24, padding: 16, border: '1px solid #333', borderRadius: 8 }}>
        <h2>Upload CSV</h2>
        <p style={{ color: '#aaa' }}>
          Formato: cabeçalho mínimo <code>email</code>; opcionais:
          <code>displayName,password,role,disabled,phoneNumber</code>.
        </p>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
        />
        <div style={{ marginTop: 8 }}>
          <button onClick={uploadCsv} disabled={uploading} style={{ padding: '6px 12px' }}>
            {uploading ? 'Enviando...' : 'Enviar CSV'}
          </button>
        </div>
      </section>

      <section
        id="update-user"
        style={{ marginTop: 24, padding: 16, border: '1px solid #333', borderRadius: 8 }}
      >
        <h2>Atualizar Usuário</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input
            placeholder="UID"
            value={uidUpdate}
            onChange={(e) => setUidUpdate(e.target.value)}
          />
          <input
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <input
            placeholder="Role (ex: admin)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <input
            placeholder="Telefone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />{' '}
            Desabilitado
          </label>
        </div>
        <div style={{ marginTop: 8 }}>
          <button onClick={callUpdateUser} style={{ padding: '6px 12px' }}>
            Atualizar
          </button>
        </div>
      </section>

      <section style={{ marginTop: 24, padding: 16, border: '1px solid #333', borderRadius: 8 }}>
        <h2>Excluir Usuário</h2>
        <input
          placeholder="UID para excluir"
          value={uidDelete}
          onChange={(e) => setUidDelete(e.target.value)}
        />
        <div style={{ marginTop: 8 }}>
          <button
            onClick={callDeleteUser}
            style={{ padding: '6px 12px', background: '#a33', color: '#fff' }}
          >
            Excluir
          </button>
        </div>
      </section>

      <section style={{ marginTop: 24, padding: 16, border: '1px solid #333', borderRadius: 8 }}>
        <h2>Verificar Servidor</h2>
        <button onClick={checkServer} style={{ padding: '6px 12px' }}>
          Checar /nextServer/status
        </button>
        {serverStatus && <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{serverStatus}</pre>}
      </section>

      <section style={{ marginTop: 24, padding: 16, border: '1px solid #333', borderRadius: 8 }}>
        <h2>Listagem de Usuários</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            placeholder="Busca por email ou nome"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ minWidth: 220 }}
          />
          <input
            placeholder="Filtrar por role (ex: admin)"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            style={{ minWidth: 160 }}
          />
          <select
            value={disabledFilter}
            onChange={(e) => {
              setDisabledFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="any">Todos</option>
            <option value="true">Desabilitados</option>
            <option value="false">Habilitados</option>
          </select>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value || '10', 10));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <select
            value={orderBy}
            onChange={(e) => {
              setOrderBy(e.target.value);
              setPage(1);
            }}
          >
            <option value="created_at">Criado</option>
            <option value="updated_at">Atualizado</option>
            <option value="email">Email</option>
            <option value="display_name">Nome</option>
            <option value="role">Role</option>
          </select>
          <select
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(1);
            }}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
          <button
            onClick={() => fetchUsers()}
            disabled={!hasToken || loadingList}
            style={{ padding: '6px 12px' }}
          >
            {loadingList ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>

        {errorList && <div style={{ marginTop: 8, color: '#c55' }}>Erro: {errorList}</div>}

        <div style={{ marginTop: 12, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 6 }}>
                  UID
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 6 }}>
                  Email
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 6 }}>
                  Nome
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 6 }}>
                  Role
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 6 }}>
                  Telefone
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 6 }}>
                  Status
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 6 }}>
                  Criado
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 6 }}>
                  Atualizado
                </th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 6 }}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.uid}>
                  <td style={{ borderBottom: '1px solid #222', padding: 6 }}>{u.uid}</td>
                  <td style={{ borderBottom: '1px solid #222', padding: 6 }}>{u.email || '-'}</td>
                  <td style={{ borderBottom: '1px solid #222', padding: 6 }}>
                    {u.display_name || '-'}
                  </td>
                  <td style={{ borderBottom: '1px solid #222', padding: 6 }}>{u.role || '-'}</td>
                  <td style={{ borderBottom: '1px solid #222', padding: 6 }}>
                    {u.phone_number || '-'}
                  </td>
                  <td style={{ borderBottom: '1px solid #222', padding: 6 }}>
                    {u.disabled ? 'Desabilitado' : 'Ativo'}
                  </td>
                  <td style={{ borderBottom: '1px solid #222', padding: 6 }}>
                    {fmtDate(u.created_at)}
                  </td>
                  <td style={{ borderBottom: '1px solid #222', padding: 6 }}>
                    {fmtDate(u.updated_at)}
                  </td>
                  <td style={{ borderBottom: '1px solid #222', padding: 6 }}>
                    <button
                      onClick={() => copyUid(u.uid)}
                      style={{ padding: '4px 8px', marginRight: 6 }}
                    >
                      Copiar UID
                    </button>
                    <button onClick={() => quickEdit(u)} style={{ padding: '4px 8px' }}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loadingList && (
                <tr>
                  <td colSpan={9} style={{ padding: 8, color: '#aaa' }}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loadingList}
            style={{ padding: '6px 12px' }}
          >
            Anterior
          </button>
          <span>
            Página {page} de {Math.max(1, Math.ceil(totalUsers / pageSize))}
          </span>
          <button
            onClick={() => {
              const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));
              setPage((p) => Math.min(totalPages, p + 1));
            }}
            disabled={loadingList || page >= Math.max(1, Math.ceil(totalUsers / pageSize))}
            style={{ padding: '6px 12px' }}
          >
            Próxima
          </button>
        </div>
      </section>

      {message && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            border: '1px solid #444',
            borderRadius: 8,
            background: '#111',
          }}
        >
          <strong>Resultado:</strong>
          <div>{message}</div>
        </div>
      )}
    </div>
  );
}
