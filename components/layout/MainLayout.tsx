'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Divider,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  LocalShipping,
  Person,
  DirectionsCar,
  Build,
  AttachMoney,
  Assessment,
  Settings,
  ExpandLess,
  ExpandMore,
  Business,
  ShoppingCart,
  Article,
  Map,
  Chat,
  SmartToy,
  AdminPanelSettings,
  Logout
} from '@mui/icons-material';

const drawerWidth = 280;

interface MenuItem {
  label: string;
  path?: string;
  icon: JSX.Element;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: '🔐 SuperGestor',
    icon: <AdminPanelSettings />,
    children: [
      { label: 'Dashboard Executivo', path: '/dashboard', icon: <Dashboard /> },
      { label: 'Torre de Controle', path: '/control-tower', icon: <Map /> },
      { label: 'BI Analytics', path: '/bi', icon: <Assessment /> },
      { label: 'Financeiro DRE', path: '/dashboard/financeiro/dre', icon: <Assessment /> },
      { label: 'Centros de Custo', path: '/dashboard/financeiro/centros-de-custo', icon: <Business /> },
      { label: 'Contabilidade', path: '/dashboard/financeiro/contabilidade', icon: <Assessment /> },
      { label: 'CFO Virtual', path: '/supergestor/ai/cfo', icon: <AttachMoney /> },
      { label: 'Economista Virtual', path: '/supergestor/ai/economista', icon: <Assessment /> },
      { label: 'Consultor Virtual', path: '/supergestor/ai/consultor', icon: <SmartToy /> },
      { label: 'Advogado Virtual', path: '/supergestor/ai/advogado', icon: <AdminPanelSettings /> }
    ]
  },
  {
    label: 'Cadastros',
    icon: <Business />,
    children: [
      { label: 'Clientes', path: '/cadastro/clientes', icon: <Person /> },
      { label: 'Fornecedores', path: '/cadastro/fornecedores', icon: <Business /> },
      { label: 'Veículos', path: '/cadastro/veiculos', icon: <DirectionsCar /> },
      { label: 'Motoristas', path: '/cadastro/motoristas', icon: <Person /> },
      { label: 'Importar Motoristas', path: '/modules/importar-motoristas', icon: <Person /> },
      { label: 'Importação/Exportação', path: '/cadastro/importacao', icon: <Article /> }
    ]
  },
  {
    label: 'Operacional',
    icon: <LocalShipping />,
    children: [
      { label: 'Viagens', path: '/motorista', icon: <LocalShipping /> },
      { label: 'Ordens de Serviço', path: '/service-orders', icon: <Build /> },
      { label: 'POP - Procedimentos', path: '/operacoes/pop', icon: <Article /> },
      { label: 'Revisão de Gestão', path: '/operacoes/revisao-gestao', icon: <Assessment /> }
    ]
  },
  {
    label: 'Gestão de Frota',
    icon: <DirectionsCar />,
    children: [
      { label: 'Visão Geral', path: '/frota', icon: <Dashboard /> },
      { label: 'Gestão Completa', path: '/frota/gestao', icon: <Settings /> },
      { label: 'Manutenções', path: '/frota/manutencoes', icon: <Build /> },
      { label: 'Abastecimentos', path: '/frota/abastecimentos', icon: <LocalShipping /> },
      { label: 'Pneus', path: '/frota/pneus', icon: <DirectionsCar /> },
      { label: 'Ordens de Manutenção', path: '/frota/ordens', icon: <Article /> },
      { label: 'Pedidos', path: '/frota/pedidos', icon: <ShoppingCart /> },
      { label: 'Estoque', path: '/frota/estoque', icon: <Business /> },
      { label: 'Ferramentas', path: '/frota/ferramentas', icon: <Build /> },
      { label: 'Lava Jato', path: '/frota/lava-jato', icon: <LocalShipping /> }
    ]
  },
  {
    label: 'Financeiro',
    icon: <AttachMoney />,
    children: [
      { label: 'Tabela de Frete', path: '/modules/tabela-frete', icon: <Assessment /> },
      { label: 'Custos Operacionais', path: '/modules/custos-operacionais', icon: <AttachMoney /> },
      { label: 'Contas a Pagar', path: '/dashboard/financeiro/contas-a-pagar', icon: <AttachMoney /> },
      { label: 'Contas a Receber', path: '/dashboard/financeiro/contas-a-receber', icon: <AttachMoney /> },
      { label: 'Impostos', path: '/dashboard/financeiro/impostos', icon: <Article /> },
      { label: 'Conciliação Bancária', path: '/dashboard/financeiro/conciliacao', icon: <AttachMoney /> }
    ]
  },
  {
    label: 'Relatórios',
    icon: <Assessment />,
    children: [
      { label: 'Capacidade', path: '/relatorios/capacidade', icon: <Assessment /> },
      { label: 'Frete', path: '/relatorios/frete', icon: <Assessment /> }
    ]
  },
  {
    label: '🚀 Inovação',
    icon: <SmartToy />,
    children: [
      { label: '🤖 Copiloto de Rota IA', path: '/modules/copiloto-rota', icon: <Map /> },
      { label: '💰 Precificação Dinâmica', path: '/modules/precificacao-dinamica', icon: <AttachMoney /> },
      { label: '📱 Super App Motorista', path: '/modules/super-app-motorista', icon: <Person /> }
    ]
  },
  {
    label: 'Módulos',
    icon: <Settings />,
    children: [
      { label: 'TMS', path: '/modules/tms', icon: <LocalShipping /> },
      { label: 'WMS', path: '/modules/wms', icon: <Business /> },
      { label: 'ERP', path: '/modules/erp', icon: <Settings /> },
      { label: 'CRM', path: '/modules/crm', icon: <Person /> },
      { label: 'OMS', path: '/modules/oms', icon: <ShoppingCart /> },
      { label: 'SCM', path: '/modules/scm', icon: <LocalShipping /> },
      { label: 'Roadmap', path: '/modules/roadmap', icon: <Map /> }
    ]
  },
  {
    label: 'Gestão',
    icon: <Assessment />,
    children: [
      { label: '🎯 KPIs e Metas', path: '/admin/kpis-metas', icon: <Assessment /> },
      { label: '🛡️ Apólices de Seguro', path: '/modules/seguros', icon: <AdminPanelSettings /> },
      { label: '✅ Auditoria SASSMAQ/ISO', path: '/modules/auditoria', icon: <AdminPanelSettings /> },
      { label: '📋 Monitoramento POPs', path: '/modules/pops', icon: <Article /> }
    ]
  },
  {
    label: 'Administração',
    icon: <AdminPanelSettings />,
    children: [
      { label: 'Admin', path: '/admin', icon: <Settings /> },
      { label: 'Usuários', path: '/usuarios', icon: <Person /> },
      { label: 'Dev Tools', path: '/dev', icon: <Settings /> }
    ]
  }
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Abrir TODOS os menus por padrão para exibir os 48+ módulos
  const [openMenus, setOpenMenus] = useState<string[]>([
    '🔐 SuperGestor',
    'Cadastros',
    'Operacional',
    'Gestão de Frota',
    'Financeiro',
    'Relatórios',
    '🚀 Inovação',
    'Módulos',
    'Gestão',
    'Administração'
  ]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (label: string) => {
    setOpenMenus(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenuItems = (items: MenuItem[], level = 0) => {
    return items.map((item) => {
      const isOpen = openMenus.includes(item.label);
      const isActive = pathname === item.path;

      if (item.children) {
        return (
          <Box key={item.label}>
            <ListItemButton
              onClick={() => handleMenuClick(item.label)}
              sx={{ pl: 2 + level * 2 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.children, level + 1)}
              </List>
            </Collapse>
          </Box>
        );
      }

      return (
        <ListItemButton
          key={item.label}
          onClick={() => item.path && handleNavigation(item.path)}
          sx={{
            pl: 2 + level * 2,
            bgcolor: isActive ? 'action.selected' : 'transparent',
            '&:hover': {
              bgcolor: isActive ? 'action.selected' : 'action.hover'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      );
    });
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <LocalShipping sx={{ mr: 2 }} />
        <Typography variant="h6" noWrap component="div">
          OptiLog TMS
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ pt: 0 }}>
        {renderMenuItems(menuItems)}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {pathname.split('/').filter(Boolean).join(' / ').toUpperCase() || 'Dashboard'}
          </Typography>
          <IconButton onClick={handleProfileMenuOpen} color="inherit">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              U
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={() => { handleNavigation('/usuarios'); handleProfileMenuClose(); }}>
              <Person sx={{ mr: 1 }} /> Perfil
            </MenuItem>
            <MenuItem onClick={() => { handleNavigation('/logout'); handleProfileMenuClose(); }}>
              <Logout sx={{ mr: 1 }} /> Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
