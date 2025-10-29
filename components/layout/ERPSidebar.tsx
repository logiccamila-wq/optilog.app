import React from 'react';
import { Drawer, List, ListItem, ListItemText, Collapse, Divider } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { BRANDING } from 'path-to-branding-constants'; // Adjust the import path as necessary

const ERPSidebar = () => {
  const [openFinanceiro, setOpenFinanceiro] = React.useState(false);
  const [openLogistica, setOpenLogistica] = React.useState(false);
  const [openAtivos, setOpenAtivos] = React.useState(false);
  const [openBI, setOpenBI] = React.useState(false);
  const [openConfiguracoes, setOpenConfiguracoes] = React.useState(false);

  const handleToggle = (section: string) => {
    switch(section) {
      case 'financeiro':
        setOpenFinanceiro(!openFinanceiro);
        break;
      case 'logistica':
        setOpenLogistica(!openLogistica);
        break;
      case 'ativos':
        setOpenAtivos(!openAtivos);
        break;
      case 'bi':
        setOpenBI(!openBI);
        break;
      case 'configuracoes':
        setOpenConfiguracoes(!openConfiguracoes);
        break;
      default:
        break;
    }
  };

  return (
    <Drawer variant="permanent" sx={{ width: 280, flexShrink: 0 }}>
      <div>
        <h2>{BRANDING.name} v2.0.0</h2>
      </div>
      <Divider />
      <List>
        <ListItem button>
          <ListItemText primary="Principal" />
        </ListItem>
        <ListItem button onClick={() => handleToggle('financeiro')}> 
          <ListItemText primary="Financeiro" />
          {openFinanceiro ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openFinanceiro} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button>
              <ListItemText primary="AP" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="AR" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="GL" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Treasury" />
            </ListItem>
          </List>
        </Collapse>
        
        <ListItem button onClick={() => handleToggle('logistica')}> 
          <ListItemText primary="Logística" />
          {openLogistica ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openLogistica} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button>
              <ListItemText primary="TMS" />
              <Collapse>
                <List component="div" disablePadding>
                  <ListItem button>
                    <ListItemText primary="freight-table" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="tracking" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="documents" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="route-planning" />
                  </ListItem>
                </List>
              </Collapse>
            </ListItem>
            <ListItem button>
              <ListItemText primary="WMS" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="OMS" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={() => handleToggle('ativos')}> 
          <ListItemText primary="Ativos" />
          {openAtivos ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openAtivos} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button>
              <ListItemText primary="Fleet" />
              <Collapse>
                <List component="div" disablePadding>
                  <ListItem button>
                    <ListItemText primary="vehicles" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="drivers" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="maintenance" />
                  </ListItem>
                </List>
              </Collapse>
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={() => handleToggle('bi')}> 
          <ListItemText primary="BI" />
          {openBI ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openBI} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button>
              <ListItemText primary="reports" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="dashboards" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="analytics" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={() => handleToggle('configuracoes')}> 
          <ListItemText primary="Configurações" />
          {openConfiguracoes ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openConfiguracoes} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button>
              <ListItemText primary="users" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="roles" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="company" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="integrations" />
            </ListItem>
          </List>
        </Collapse>

        {/* Badges for NEW and IoT features can be added here */}
        <ListItem>
          <ListItemText primary="NEW Features" secondary="IoT" />
        </ListItem>

      </List>
      <Divider />
      <div>
        {/* User Info Footer */}
        <p>User Info</p>
      </div>
    </Drawer>
  );
};

export default ERPSidebar;