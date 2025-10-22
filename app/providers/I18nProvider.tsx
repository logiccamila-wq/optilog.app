'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'pt' | 'en' | 'es';

type I18nContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const defaultLang: Lang = 'pt';

const dictionaries: Record<Lang, Record<string, string>> = {
  pt: {
    'nav.dashboard': 'Dashboard',
    'nav.register.drivers': 'Cadastro: Motoristas',
    'nav.register.vehicles': 'Cadastro: Veículos',
    'nav.register.users': 'Cadastro: Usuários',
    'nav.admin': 'Admin',
    'nav.ai.cfo': 'CFO',
    'nav.ai.economist': 'Economista',
    'nav.finance.fpa': 'FPA',
    'nav.finance.risk': 'Risco',
    'nav.login': 'Login',
    'nav.signup': 'Cadastro',
    'nav.supergestor': 'SuperGestor',

    'common.modules': 'Módulos',
    'common.shortcuts': 'Atalhos',
    'shortcuts.driver_app': 'App do Motorista',
    'shortcuts.mechanic_app': 'App do Mecânico',
    'shortcuts.register_users': 'Cadastro: Usuários',
    'shortcuts.register_drivers': 'Cadastro: Motoristas',
    'shortcuts.register_vehicles': 'Cadastro: Veículos',

    'modules.overview.title': 'Visão Geral',
    'modules.overview.desc': 'KPIs e status operacional em tempo real.',
    'modules.orders.title': 'Pedidos',
    'modules.orders.desc': 'Gestão de pedidos, tracking e SLA.',
    'modules.crm.title': 'CRM',
    'modules.crm.desc': 'Clientes e Produtos.',
    'modules.logistics.title': 'Logística',
    'modules.logistics.desc': 'Rotas, last-mile e custos.',
    'modules.inventory.title': 'Estoque',
    'modules.inventory.desc': 'Níveis, reposição e rupturas.',
    'modules.fleet.title': 'Gestão de Frota',
    'modules.fleet.desc': 'Veículos, manutenções e pneus.',
    'modules.finance.title': 'Financeiro',
    'modules.finance.desc': 'Faturamento, custos e conciliações.',
    'modules.analytics.title': 'Análise',
    'modules.analytics.desc': 'Relatórios e insights preditivos.',

    'dashboard.title': 'Dashboard EJG',
    'dashboard.external.redirecting': 'Redirecionando para o Dashboard externo configurado...',
    'dashboard.external.click': 'Caso não redirecione automaticamente, clique:',
    'dashboard.explore': 'Explore os módulos locais abaixo. Para acessar dados reais, faça login ou cadastro.',
    'dashboard.external.help': 'Para habilitar o redirecionamento automático, defina NEXT_PUBLIC_DASHBOARD_URL com a URL do seu dashboard externo (Render, Vercel, etc.).',

    // Dashboard módulo dinâmico
    'common.kpis': 'KPIs',
    'common.no_data': 'Sem dados para exibir',
    'common.status': 'Status',
    'common.actions': 'Ações',
    'common.search': 'Buscar...',
    'common.add': 'Adicionar',
    'common.save': 'Salvar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.cancel': 'Cancelar',
    'common.page': 'Página',
    'common.size': 'Tamanho',
    'common.prev': 'Anterior',
    'common.next': 'Próxima',
    'common.confirm_delete': 'Confirmar exclusão',
    'common.id': 'ID',
    'common.created_at': 'Criado',
    'common.amount': 'Valor',
    'common.due': 'Vencimento',

    'finance.charts': 'Gráficos Financeiros',
    'finance.open': 'A receber (open)',
    'finance.paid': 'Recebido (paid)',
    'finance.overdue': 'Em atraso',
    'finance.latest_invoices': 'Últimas faturas',

    'orders.section': 'Pedidos',
    'orders.none': 'Nenhum pedido encontrado',
    'orders.date': 'Data',
    'orders.sla': 'SLA',

    'logistics.latest_shipments': 'Últimos Shipments',
    'logistics.none_shipments': 'Sem registros recentes',
    'logistics.filters': 'Filtros',
    'logistics.vehicle': 'Veículo',
    'logistics.routes': 'Rotas',
    'logistics.stops': 'Paradas',
    'logistics.alerts': 'Alertas',

    'fleet.vehicles': 'Veículos',
    'fleet.none_vehicles': 'Nenhum veículo encontrado',
    'fleet.plate': 'Placa',
    'fleet.model': 'Modelo',
    'fleet.km': 'KM',

    'inventory.table': 'Tabela de Estoque',
    'inventory.none': 'Nenhum item de estoque',
    'inventory.item': 'Item',
    'inventory.level': 'Nível',
    'inventory.reorder_point': 'Ponto de Reposição',
    'inventory.alert': 'Alerta',

    'crm.customers': 'Clientes',
    'crm.no_customers': 'Nenhum cliente',
    'crm.products': 'Produtos',
    'crm.no_products': 'Nenhum produto',
    'crm.name': 'Nome',
    'crm.email': 'Email',
    'crm.phone': 'Telefone',
    'crm.sku': 'SKU',
    'crm.price': 'Preço',
    'crm.search_customers': 'Buscar clientes...',
    'crm.search_products': 'Buscar produtos...',
    'crm.activity': 'Atividades',
    'crm.no_activity': 'Sem atividades recentes',
    'modules.tires.title': 'Gestão de Pneus',
    'modules.tires.desc': 'Manutenções, sensores e ciclo de vida.',
    'tires.low_life': 'Pneus com vida baixa',
    'tires.none': 'Nenhum pneu encontrado',
    'tires.position': 'Posição',
    'tires.vehicle': 'Veículo',
    'tires.life': 'Vida útil',
    'tires.pressure': 'Pressão',
    'tires.temperature': 'Temperatura',
    'tires.maintenance': 'Manutenção de Pneus',
    'tires.corrective': 'Corretiva',
    'tires.preventive': 'Preventiva',
    'tires.predictive': 'Preditiva',
    'tires.iot': 'Integração IoT',
  },
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.register.drivers': 'Register: Drivers',
    'nav.register.vehicles': 'Register: Vehicles',
    'nav.register.users': 'Register: Users',
    'nav.admin': 'Admin',
    'nav.ai.cfo': 'CFO',
    'nav.ai.economist': 'Economist',
    'nav.finance.fpa': 'FP&A',
    'nav.finance.risk': 'Risk',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.supergestor': 'SuperGestor',

    'common.modules': 'Modules',
    'common.shortcuts': 'Shortcuts',
    'shortcuts.driver_app': 'Driver App',
    'shortcuts.mechanic_app': 'Mechanic App',
    'shortcuts.register_users': 'Register: Users',
    'shortcuts.register_drivers': 'Register: Drivers',
    'shortcuts.register_vehicles': 'Register: Vehicles',

    'modules.overview.title': 'Overview',
    'modules.overview.desc': 'KPIs and operational status in real time.',
    'modules.orders.title': 'Orders',
    'modules.orders.desc': 'Order management, tracking and SLA.',
    'modules.crm.title': 'CRM',
    'modules.crm.desc': 'Customers and Products.',
    'modules.logistics.title': 'Logistics',
    'modules.logistics.desc': 'Routes, last-mile and costs.',
    'modules.inventory.title': 'Inventory',
    'modules.inventory.desc': 'Levels, replenishment and stockouts.',
    'modules.fleet.title': 'Fleet Management',
    'modules.fleet.desc': 'Vehicles, maintenance and tires.',
    'modules.finance.title': 'Finance',
    'modules.finance.desc': 'Billing, costs and reconciliations.',
    'modules.analytics.title': 'Analytics',
    'modules.analytics.desc': 'Reports and predictive insights.',

    'dashboard.title': 'EJG Dashboard',
    'dashboard.external.redirecting': 'Redirecting to the configured external Dashboard...',
    'dashboard.external.click': 'If it does not redirect automatically, click:',
    'dashboard.explore': 'Explore the local modules below. To access real data, log in or sign up.',
    'dashboard.external.help': 'To enable automatic redirection, set NEXT_PUBLIC_DASHBOARD_URL with your external dashboard URL (Render, Vercel, etc.).',

    // Dynamic module dashboard
    'common.kpis': 'KPIs',
    'common.no_data': 'No data to display',
    'common.status': 'Status',
    'common.actions': 'Actions',
    'common.search': 'Search...',
    'common.add': 'Add',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.cancel': 'Cancel',
    'common.page': 'Page',
    'common.size': 'Size',
    'common.prev': 'Previous',
    'common.next': 'Next',
    'common.confirm_delete': 'Confirm deletion',
    'common.id': 'ID',
    'common.created_at': 'Created',
    'common.amount': 'Amount',
    'common.due': 'Due',

    'finance.charts': 'Financial Charts',
    'finance.open': 'Open receivables',
    'finance.paid': 'Paid',
    'finance.overdue': 'Overdue',
    'finance.latest_invoices': 'Latest invoices',

    'orders.section': 'Orders',
    'orders.none': 'No orders found',
    'orders.date': 'Date',
    'orders.sla': 'SLA',

    'logistics.latest_shipments': 'Latest shipments',
    'logistics.none_shipments': 'No recent records',
    'logistics.filters': 'Filters',
    'logistics.vehicle': 'Vehicle',
    'logistics.routes': 'Routes',
    'logistics.stops': 'Stops',
    'logistics.alerts': 'Alerts',

    'fleet.vehicles': 'Vehicles',
    'fleet.none_vehicles': 'No vehicles found',
    'fleet.plate': 'Plate',
    'fleet.model': 'Model',
    'fleet.km': 'Odometer',

    'inventory.table': 'Inventory Table',
    'inventory.none': 'No inventory items',
    'inventory.item': 'Item',
    'inventory.level': 'Level',
    'inventory.reorder_point': 'Reorder Point',
    'inventory.alert': 'Alert',

    'crm.customers': 'Customers',
    'crm.no_customers': 'No customers',
    'crm.products': 'Products',
    'crm.no_products': 'No products',
    'crm.name': 'Name',
    'crm.email': 'Email',
    'crm.phone': 'Phone',
    'crm.sku': 'SKU',
    'crm.price': 'Price',
    'crm.search_customers': 'Search customers...',
    'crm.search_products': 'Search products...',
    'crm.activity': 'Activity',
    'crm.no_activity': 'No recent activity',
    'modules.tires.title': 'Tire Management',
    'modules.tires.desc': 'Maintenance, sensors and lifecycle.',
    'tires.low_life': 'Low life tires',
    'tires.none': 'No tires found',
    'tires.position': 'Position',
    'tires.vehicle': 'Vehicle',
    'tires.life': 'Lifecycle',
    'tires.pressure': 'Pressure',
    'tires.temperature': 'Temperature',
    'tires.maintenance': 'Tire Maintenance',
    'tires.corrective': 'Corrective',
    'tires.preventive': 'Preventive',
    'tires.predictive': 'Predictive',
    'tires.iot': 'IoT Integration',
  },
  es: {
    'nav.dashboard': 'Panel',
    'nav.register.drivers': 'Registro: Conductores',
    'nav.register.vehicles': 'Registro: Vehículos',
    'nav.register.users': 'Registro: Usuarios',
    'nav.admin': 'Admin',
    'nav.ai.cfo': 'CFO',
    'nav.ai.economist': 'Economista',
    'nav.finance.fpa': 'FP&A',
    'nav.finance.risk': 'Riesgo',
    'nav.login': 'Iniciar sesión',
    'nav.signup': 'Registrarse',
    'nav.supergestor': 'SuperGestor',

    'common.modules': 'Módulos',
    'common.shortcuts': 'Atajos',
    'shortcuts.driver_app': 'App del Conductor',
    'shortcuts.mechanic_app': 'App del Mecánico',
    'shortcuts.register_users': 'Registro: Usuarios',
    'shortcuts.register_drivers': 'Registro: Conductores',
    'shortcuts.register_vehicles': 'Registro: Vehículos',

    'modules.overview.title': 'Visión General',
    'modules.overview.desc': 'KPIs y estado operativo en tiempo real.',
    'modules.orders.title': 'Pedidos',
    'modules.orders.desc': 'Gestión de pedidos, seguimiento y SLA.',
    'modules.crm.title': 'CRM',
    'modules.crm.desc': 'Clientes y Productos.',
    'modules.logistics.title': 'Logística',
    'modules.logistics.desc': 'Rutas, última milla y costos.',
    'modules.inventory.title': 'Inventario',
    'modules.inventory.desc': 'Niveles, reposición y rupturas.',
    'modules.fleet.title': 'Gestión de Flota',
    'modules.fleet.desc': 'Vehículos, mantenimientos y neumáticos.',
    'modules.finance.title': 'Finanzas',
    'modules.finance.desc': 'Facturación, costos y conciliaciones.',
    'modules.analytics.title': 'Análisis',
    'modules.analytics.desc': 'Informes e insights predictivos.',

    'dashboard.title': 'Panel EJG',
    'dashboard.external.redirecting': 'Redirigiendo al Panel externo configurado...',
    'dashboard.external.click': 'Si no redirige automáticamente, haga clic:',
    'dashboard.explore': 'Explora los módulos locales abajo. Para acceder a datos reales, inicia sesión o regístrate.',
    'dashboard.external.help': 'Para habilitar la redirección automática, define NEXT_PUBLIC_DASHBOARD_URL con la URL de tu panel externo (Render, Vercel, etc.).',

    // Tablero de módulo dinámico
    'common.kpis': 'KPIs',
    'common.no_data': 'Sin datos para mostrar',
    'common.status': 'Estado',
    'common.actions': 'Acciones',
    'common.search': 'Buscar...',
    'common.add': 'Añadir',
    'common.save': 'Guardar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.cancel': 'Cancelar',
    'common.page': 'Página',
    'common.size': 'Tamaño',
    'common.prev': 'Anterior',
    'common.next': 'Siguiente',
    'common.confirm_delete': 'Confirmar eliminación',
    'common.id': 'ID',
    'common.created_at': 'Creado',
    'common.amount': 'Importe',
    'common.due': 'Vence',

    'finance.charts': 'Gráficos Financieros',
    'finance.open': 'Por cobrar (open)',
    'finance.paid': 'Pagado',
    'finance.overdue': 'Atrasado',
    'finance.latest_invoices': 'Últimas facturas',

    'orders.section': 'Pedidos',
    'orders.none': 'No se encontraron pedidos',
    'orders.date': 'Fecha',
    'orders.sla': 'SLA',

    'logistics.latest_shipments': 'Últimos envíos',
    'logistics.none_shipments': 'Sin registros recientes',
    'logistics.filters': 'Filtros',
    'logistics.vehicle': 'Vehículo',
    'logistics.routes': 'Rutas',
    'logistics.stops': 'Paradas',
    'logistics.alerts': 'Alertas',

    'fleet.vehicles': 'Vehículos',
    'fleet.none_vehicles': 'No se encontraron vehículos',
    'fleet.plate': 'Placa',
    'fleet.model': 'Modelo',
    'fleet.km': 'Odómetro',

    'inventory.table': 'Tabla de Inventario',
    'inventory.none': 'Sin elementos de inventario',
    'inventory.item': 'Artículo',
    'inventory.level': 'Nivel',
    'inventory.reorder_point': 'Punto de reposición',
    'inventory.alert': 'Alerta',

    'crm.customers': 'Clientes',
    'crm.no_customers': 'Sin clientes',
    'crm.products': 'Productos',
    'crm.no_products': 'Sin productos',
    'crm.name': 'Nombre',
    'crm.email': 'Correo',
    'crm.phone': 'Teléfono',
    'crm.sku': 'SKU',
    'crm.price': 'Precio',
    'crm.search_customers': 'Buscar clientes...',
    'crm.search_products': 'Buscar productos...',
    'crm.activity': 'Actividad',
    'crm.no_activity': 'Sin actividad reciente',
    'modules.tires.title': 'Gestión de Neumáticos',
    'modules.tires.desc': 'Mantenimientos, sensores y ciclo de vida.',
    'tires.low_life': 'Neumáticos con vida baja',
    'tires.none': 'No se encontraron neumáticos',
    'tires.position': 'Posición',
    'tires.vehicle': 'Vehículo',
    'tires.life': 'Vida útil',
    'tires.pressure': 'Presión',
    'tires.temperature': 'Temperatura',
    'tires.maintenance': 'Mantenimiento de Neumáticos',
    'tires.corrective': 'Correctiva',
    'tires.preventive': 'Preventiva',
    'tires.predictive': 'Predictiva',
    'tires.iot': 'Integración IoT',
  },
};

const I18nContext = createContext<I18nContextType>({
  lang: defaultLang,
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(defaultLang);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang');
      if (saved === 'pt' || saved === 'en' || saved === 'es') {
        setLangState(saved);
      } else {
        // Infer from browser language
        const nav = navigator.language.toLowerCase();
        if (nav.startsWith('pt')) setLangState('pt');
        else if (nav.startsWith('es')) setLangState('es');
        else setLangState('en');
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lang', lang);
    } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en' : 'es';
    }
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = useMemo(() => {
    return (key: string) => {
      const dict = dictionaries[lang] || dictionaries[defaultLang];
      return dict[key] ?? dictionaries[defaultLang][key] ?? key;
    };
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);