"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import InstallBadge from '@/components/pwa/InstallBadge';


export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const modules = [
    { name: 'Financeiro', href: '/modules/finance' },
    { name: 'Logística (TMS)', href: '/modules/tms' },
    { name: 'Análise (BI)', href: '/modules/bi' },
    { name: 'Estoque (WMS)', href: '/modules/wms' },
  ];

  return (
    <AppBar position="static" color="primary" sx={{ mb: 3 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Image src="/logo-xyz.svg" alt="XYZ LogicFlow" width={28} height={28} priority />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>OptiLog</Typography>
          </Link>
          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>XYZ LogicFlow Technology</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button component={Link} href="/" color="inherit">Home</Button>
          <Button
            id="modules-button"
            color="inherit"
            onClick={handleClick}
            aria-controls={open ? 'modules-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            Módulos
          </Button>
          <Menu
            id="modules-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'modules-button' }}
          >
            {modules.map((mod) => <MenuItem key={mod.name} onClick={handleClose} component={Link} href={mod.href}>{mod.name}</MenuItem>)}
          </Menu>
          <Button component={Link} href="/status" color="inherit">Status</Button>
          <Button component={Link} href="/driver" color="inherit">Motorista</Button>
          <Button component={Link} href="/signup" color="inherit">Cadastro</Button>
          <InstallBadge />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
