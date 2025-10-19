Kits Frontend (UI/UX)

- Objetivo: padronizar componentes, listas e tabelas para dashboards.
- Stack: Next.js 14, React 18, MUI 5.

Componentes base
- Layout: use `components/layout/Sidebar.tsx` e `components/layout/SidebarNav.tsx`.
- Tabela: use `@mui/material` `Table`, `TableHead`, `TableRow`, `TableCell`, `TableBody`.
- Grids: `components/ui/GridLite` para listas responsivas.

Padrões de listas
- Carregamento: exibir texto de estado com `t('common.no_data')` quando vazio.
- Colunas: preferir chaves i18n (`t('common.id')`, etc.).
- Paginação: usar `common.page`, `common.next`, `common.prev` quando necessário.

Exemplo de tabela
```
<Table size="small">
  <TableHead>
    <TableRow>
      <TableCell>{t('common.id')}</TableCell>
      <TableCell>{t('fleet.plate')}</TableCell>
      <TableCell>{t('fleet.model')}</TableCell>
      <TableCell>{t('fleet.km')}</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {items.map((it) => (
      <TableRow key={it.id}>
        <TableCell>{it.id}</TableCell>
        <TableCell>{it.plate}</TableCell>
        <TableCell>{it.model}</TableCell>
        <TableCell>{it.km}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

Pneus (tires) UI
- Lista de pneus com vida baixa: use `lowLifeTires`.
- Colunas: `tires.position`, `tires.vehicle`, `tires.life`, `tires.pressure`, `tires.temperature`.

Diretrizes de UX
- Texto curto, contraste alto, estados vazios claros.
- Mantenha a navegação consistente: sempre linkar `/dashboard/{modulo}`.
- Internacionalização: todas as labels vêm de `app/providers/I18nProvider.tsx`.