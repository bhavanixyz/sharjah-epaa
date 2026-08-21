import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Network, 
  MapPin, 
  Cpu, 
  Wrench, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Map 
} from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';

const slaChartData = [
  { day: 'Mon', completedWO: 4, openWO: 2, avgResponseHours: 3.1 },
  { day: 'Tue', completedWO: 6, openWO: 1, avgResponseHours: 2.8 },
  { day: 'Wed', completedWO: 3, openWO: 4, avgResponseHours: 4.2 },
  { day: 'Thu', completedWO: 8, openWO: 2, avgResponseHours: 2.5 },
  { day: 'Fri', completedWO: 5, openWO: 3, avgResponseHours: 3.0 },
  { day: 'Sat', completedWO: 7, openWO: 1, avgResponseHours: 2.2 },
  { day: 'Sun', completedWO: 4, openWO: 2, avgResponseHours: 2.7 },
];

export default function Dashboard() {
  const { networks, sites, assets, workOrders, setActiveModule, setIsWoModalOpen } = useApp();

  const totalSites = sites.length;
  const criticalSites = sites.filter(s => s.status === 'Critical' || s.status === 'Warning').length;
  const openWOs = workOrders.filter(w => w.status !== 'Completed').length;
  const activeAssets = assets.filter(a => a.status === 'Active').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Welcome Hero Banner */}
      <div className="glass-panel" style={{
        padding: '26px 30px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(230, 246, 242, 0.9) 100%)',
        border: '1px solid rgba(0, 168, 120, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'var(--shadow-glass-md)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-normal" style={{ boxShadow: '0 2px 8px rgba(0,168,120,0.15)' }}>
              Sharjah EPA Operations Platform
            </span>
            <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Real-time Sync Active</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            Environmental Asset & Maintenance Command Center
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#334155', marginTop: '6px', maxWidth: '780px' }}>
            Centralized monitoring and maintenance lifecycle dispatch for air quality, marine sanctuaries, groundwater aquifers, and biosphere protected land reserves across Sharjah.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveModule('gis')} className="btn btn-epa">
            <Map size={16} /> Open GIS Command Center
          </button>
          <button onClick={() => setIsWoModalOpen(true)} className="btn btn-secondary">
            <Wrench size={16} /> Dispatch Maintenance
          </button>
        </div>
      </div>

      {/* Metric Floating KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        
        {/* Metric 1 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>MONITORING NETWORKS</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.2) 100%)', color: '#2563EB' }}>
              <Network size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{networks.length} Domains</div>
          <div style={{ fontSize: '0.76rem', color: '#00A878', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={14} /> 100% Telemetry Online
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>MONITORING STATIONS</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(0, 168, 120, 0.1) 0%, rgba(13, 186, 139, 0.2) 100%)', color: '#00A878' }}>
              <MapPin size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{totalSites} Sites</div>
          <div style={{ fontSize: '0.76rem', color: criticalSites > 0 ? '#DC2626' : '#00A878', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={14} /> {criticalSites} Require Inspection
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>EQUIPMENT ASSETS</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.1) 0%, rgba(6, 182, 212, 0.2) 100%)', color: '#0891B2' }}>
              <Cpu size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{assets.length} Analyzers</div>
          <div style={{ fontSize: '0.76rem', color: '#0891B2', marginTop: '6px', fontWeight: 700 }}>
            {activeAssets} Active in Field
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>OPEN WORK ORDERS</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.2) 100%)', color: '#DC2626' }}>
              <Wrench size={22} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{openWOs} Active</div>
          <div style={{ fontSize: '0.76rem', color: '#DC2626', marginTop: '6px', fontWeight: 700 }}>
            2 Urgent Critical SLA
          </div>
        </div>

      </div>

      {/* Main Grid Section: Chart & Operational Health */}
      <div className="dashboard-grid-2">
        
        {/* Maintenance SLA Performance Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="card-header-flex" style={{ marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
                <TrendingUp size={20} color="#00A878" />
                Work Order SLA & Resolution Velocity
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Weekly field technician dispatch & average MTTR response hours</p>
            </div>
            <span className="badge badge-normal" style={{ fontSize: '0.7rem', flexShrink: 0 }}>98.2% SLA Compliance</span>
          </div>

          <div style={{ width: '100%', height: '270px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slaChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.8)" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '10px',
                    color: '#0F172A',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
                  }} 
                />
                <Bar dataKey="completedWO" fill="#00A878" radius={[6, 6, 0, 0]} name="Completed Work Orders" />
                <Bar dataKey="openWO" fill="#EF4444" radius={[6, 6, 0, 0]} name="Pending Tickets" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Network Operational Status List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
            <Activity size={20} color="#0891B2" />
            Environmental Networks Health
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {networks.map((net) => (
              <div 
                key={net.id}
                style={{
                  background: 'rgba(248, 250, 252, 0.8)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  borderRadius: '10px',
                  padding: '14px 16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A' }}>{net.name}</span>
                  <span className={`badge ${net.status === 'Operational' ? 'badge-normal' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                    {net.status}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#64748B', marginBottom: '8px' }}>
                  <span>{net.totalStations} Stations • {net.activeAssets} Assets</span>
                  <span style={{ color: net.healthScore > 90 ? '#00A878' : '#D97706', fontWeight: 800 }}>
                    Health: {net.healthScore}%
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${net.healthScore}%`,
                    height: '100%',
                    background: net.healthScore > 90 ? 'linear-gradient(90deg, #00A878 0%, #0DBA8B 100%)' : 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
                    borderRadius: '3px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
