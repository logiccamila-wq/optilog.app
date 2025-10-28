'use client';
import { MouseEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Container, IconButton } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import InstallBadge from '@/components/pwa/InstallBadge';


export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
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
  const cadastros = [
    { name: 'Motoristas', href: '/cadastro/motoristas' },
    { name: 'Veículos', href: '/cadastro/veiculos' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        backgroundColor: 'rgba(9,14,24,0.85)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Link
              href="/"
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
            >
              <Image src="/logo-xyz.svg" alt="XYZ LogicFlow" width={30} height={30} priority />
              <Box sx={{ ml: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>OptiLog</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Inteligência para operações logísticas
                </Typography>
              </Box>
            </Link>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            <Button component={Link} href="/" color="inherit">Início</Button>
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
              {modules.map((mod) => (
                <MenuItem key={mod.name} onClick={handleClose} component={Link} href={mod.href}>
                  {mod.name}
                </MenuItem>
              ))}
            </Menu>
            <Button
              id="cadastros-button"
              color="inherit"
              onClick={handleClick}
              aria-controls={open ? 'cadastros-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              Cadastros
            </Button>
            <Menu
              id="cadastros-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'cadastros-button' }}
            >
              {cadastros.map((mod) => (
                <MenuItem key={mod.name} onClick={handleClose} component={Link} href={mod.href}>
                  {mod.name}
                </MenuItem>
              ))}
            </Menu>
            <Button component={Link} href="/status" color="inherit">Status</Button>
            <Button component={Link} href="/driver" color="inherit">Motorista</Button>
            <Button
              component={Link}
              href="/signup"
              variant="contained"
              color="secondary"
              sx={{ fontWeight: 600 }}
            >
              Começar agora
            </Button>
            <InstallBadge />
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            <IconButton
              id="modules-button-mobile"
              onClick={handleClick}
              aria-controls={open ? 'modules-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              color="inherit"
              size="large"
            >
              <MenuRoundedIcon />
            </IconButton>
            <Menu
              id="modules-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'modules-button-mobile' }}
            >
              <MenuItem component={Link} href="/" onClick={handleClose}>Início</MenuItem>
              {modules.map((mod) => (
                <MenuItem key={mod.name} onClick={handleClose} component={Link} href={mod.href}>
                  {mod.name}
                </MenuItem>
              ))}
              <MenuItem disabled>Cadastros</MenuItem>
              {cadastros.map((mod) => (
                <MenuItem key={mod.name} onClick={handleClose} component={Link} href={mod.href}>
                  {mod.name}
                </MenuItem>
              ))}
              <MenuItem component={Link} href="/status" onClick={handleClose}>Status</MenuItem>
              <MenuItem component={Link} href="/driver" onClick={handleClose}>Motorista</MenuItem>
              <MenuItem component={Link} href="/signup" onClick={handleClose}>Começar agora</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
