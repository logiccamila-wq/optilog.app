 'use client';

 import React, { useState } from 'react';
 import Link from 'next/link';
 import AccessControl from '@/components/AccessControl';
 import { SmartDashboard } from '@/components/SmartDashboard';
 import { lightColors, darkColors } from '@/types/theme';
 import type { Colors } from '@/types/theme';
 import { useTheme } from '@/app/providers/ThemeProvider';

 export default function MechanicAppPage(): JSX.Element {
   const { effectiveMode, setMode } = useTheme();
   const [selectedVehicle, setSelectedVehicle] = useState<string>('');
   const [tab, setTab] = useState<'os' | 'manutencoes' | 'preditiva'>('os');

   const colors: Colors = effectiveMode === 'dark' ? darkColors : lightColors;

   const tabs = [
     { key: 'os' as const, label: 'Ordens de Serviço' },
     { key: 'manutencoes' as const, label: 'Manutenções' },
     { key: 'preditiva' as const, label: 'Manutenção Preditiva' },
   ];

   return (
     <AccessControl roles={['mechanic', 'admin']}>
       <main className="mechanic-dashboard animate-fadeIn" style={{ background: colors.background, color: colors.text }}>
         <div className="dashboard-content">
           <header className="header-section">
             <div>
               <h1>Painel do Mecânico</h1>
               <p className="subtitle">Gestão integrada de manutenção e OS</p>
             </div>

             <div className="header-actions">
               <label htmlFor="vehicle" className="sr-only">Selecionar veículo</label>
               <select
                 id="vehicle"
                 className="vehicle-select"
                 value={selectedVehicle}
                 onChange={(e) => setSelectedVehicle(e.target.value)}
               >
                 <option value="">Selecionar Veículo</option>
                 <option value="vehicle_001">Veículo 001</option>
                 <option value="vehicle_002">Veículo 002</option>
                 <option value="vehicle_003">Veículo 003</option>
               </select>

               <button
                 type="button"
                 aria-pressed={effectiveMode === 'dark'}
                 className="theme-toggle"
                 onClick={() => setMode(effectiveMode === 'dark' ? 'light' : 'dark')}
               >
                 {effectiveMode === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
               </button>
             </div>
           </header>

           <nav className="tabs-section" aria-label="Seções do mecânico">
             {tabs.map((t) => (
               <button
                 key={t.key}
                 type="button"
                 onClick={() => setTab(t.key)}
                 className={`tab ${tab === t.key ? 'active' : ''}`}
                 aria-current={tab === t.key ? 'true' : undefined}
               >
                 {t.label}
               </button>
             ))}
           </nav>

           <section>
             {selectedVehicle ? (
               <SmartDashboard role="mechanic" vehicleId={selectedVehicle} activeTab={tab} />
             ) : (
               <div className="select-vehicle-message">Selecione um veículo para visualizar o dashboard</div>
             )}
           </section>

           <div className="quick-links" aria-hidden={false}>
             <Link href="/frota/manutencoes" className="link-button">Manutenções</Link>
             <Link href="/frota/abastecimentos" className="link-button">Abastecimentos</Link>
             <Link href="/frota/pneus" className="link-button">Gestão de Pneus</Link>
           </div>
         </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          .mechanic-dashboard { 
            padding: 20px; 
            max-width: 1200px; 
            margin: 0 auto;
            animation: fadeIn 0.5s ease-out;
          }
          
          .dashboard-content { 
            display: flex; 
            flex-direction: column; 
            gap: 20px; 
            transition: all 0.3s ease;
          }
           .header-section { display:flex; justify-content:space-between; align-items:center; }
           .subtitle { margin:6px 0 0 0; color: ${colors.textMuted}; font-size: 0.95rem; }

           .header-actions { display:flex; gap:12px; align-items:center; }
           .vehicle-select {
             padding:8px 12px; border-radius:10px; border:1px solid ${colors.border};
             background:${colors.surface}; color:${colors.text}; min-width:220px;
           }
           .theme-toggle {
             padding:8px 12px; border-radius:10px; border:1px solid ${colors.border};
             background: linear-gradient(90deg, ${colors.accent} 0%, ${colors.surface} 100%);
             color:#fff; cursor:pointer; box-shadow: 0 6px 18px rgba(0,0,0,0.35);
           }
           .tabs-section { display:flex; gap:8px; }
           .tab { padding:8px 14px; border-radius:10px; border:1px solid ${colors.border};
             background:${colors.surface}; color:${colors.text}; cursor:pointer; }
           .tab.active { background:${colors.accent}; color:#fff; border-color:${colors.accent}; box-shadow: 0 8px 24px rgba(0,0,0,0.35); }

           .select-vehicle-message {
             text-align:center; padding:28px; background:${colors.surface}; border-radius:12px;
             border:1px solid ${colors.border}; color:${colors.textMuted};
           }

           .quick-links { display:flex; gap:8px; margin-top:6px; }
           .link-button {
             display:inline-block; text-decoration:none; padding:8px 12px; border-radius:10px;
             border:1px solid ${colors.border}; background:${colors.surface}; color:${colors.text};
           }

           .sr-only { position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px;
             overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
         `}</style>
       </main>
     </AccessControl>
   );
 }
