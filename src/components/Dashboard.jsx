import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Network, 
  MapPin, 
  Cpu, 
  Wrench, 
  Activity, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Calendar, 
  BarChart3, 
  PieChart as PieIcon, 
  Table as TableIcon,
  CheckCircle2,
  Clock,
  ChevronDown
} from 'lucide-react';
import InteractiveKpiCard from './InteractiveKpiCard';
import KpiDetailModal from './KpiDetailModal';
import InteractiveChartContainer from './InteractiveChartContainer';
import MapView from './common/MapView';

export default function Dashboard() {
  const { networks, sites, assets, workOrders, setActiveModule, activeModule, activeTab } = useApp();

  // Date Filter State (Last 7, Last 15, Last 30, Custom)
  const [dateFilter, setDateFilter] = useState('7D'); // '7D', '15D', '30D', 'CUSTOM'
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-24');

  // Networks Health Controls
  const [networkSort, setNetworkSort] = useState('AZ'); // 'AZ', 'ZA', 'DATE_ASC', 'DATE_DESC'
  const [selectedLocations, setSelectedLocations] = useState(['ALL']);
  const [selectedStatuses, setSelectedStatuses] = useState(['ALL']);

  // SLA Chart Controls
  const [slaTimeAgg, setSlaTimeAgg] = useState('week'); // 'day', 'week', 'month', 'year'
  const [slaViewType, setSlaViewType] = useState('column'); // 'bar', 'pie', 'column', 'table'

  // Modal State
  const [selectedKpiModal, setSelectedKpiModal] = useState(null);
  const [activeKpiId, setActiveKpiId] = useState(null);

  const lastUpdatedText = `24 Aug 2026, 16:40`;

  // Compute Module Dynamic Filter Title
  const getFilterTitle = () => {
    if (activeTab === 'Notifications') return 'Notification Center';
    if (activeTab === 'Admin') return 'Administration & Governance';
    if (activeTab === 'Settings') return 'System Settings & Configuration';

    switch (activeModule) {
      case 'dashboard': return 'Executive Dashboard';
      case 'gis': return 'Map';
      case 'networks': return 'Environmental Networks';
      case 'sites': return 'Site Management';
      case 'stations': return 'Live Site Management';
      case 'assets': return 'Equipment Management';
      case 'providers': return 'Service Providers / Contacts';
      case 'maintenance': return 'Work Orders & SLA';
      case 'calibration': return 'Drift & Gas Calibration';
      case 'inventory': return 'Inventory & Spare Parts';
      case 'procurement': return 'Procurement & Orders';
      case 'contracts': return 'Contracts & Warranty';
      case 'documents': return 'Document SOPs';
      case 'reports': return 'EPA Compliance Reports';
      case 'notifications': return 'Notification Center';
      case 'admin': return 'Administration & Governance';
      case 'config': return 'System Settings & Configuration';
      default: return activeTab || 'Executive Dashboard';
    }
  };

  // Compute Metrics
  const totalSites = sites.length;
  const criticalSites = sites.filter(s => s.status === 'Critical' || s.status === 'Warning').length;
  const openWOs = workOrders.filter(w => w.status !== 'Completed').length;
  const activeAssets = assets.filter(a => a.status === 'Active').length;

  // Filter & Sort Environmental Networks Health
  let processedNetworks = [...networks];

  // Filter Location
  if (!selectedLocations.includes('ALL')) {
    processedNetworks = processedNetworks.filter(n => selectedLocations.includes(n.location || n.name));
  }

  // Filter Status
  if (!selectedStatuses.includes('ALL')) {
    processedNetworks = processedNetworks.filter(n => selectedStatuses.includes(n.status));
  }

  // Sort
  processedNetworks.sort((a, b) => {
    if (networkSort === 'AZ') return a.name.localeCompare(b.name);
    if (networkSort === 'ZA') return b.name.localeCompare(a.name);
    if (networkSort === 'DATE_ASC') return (a.id || '').localeCompare(b.id || '');
    if (networkSort === 'DATE_DESC') return (b.id || '').localeCompare(a.id || '');
    return 0;
  });

  const handleInspectKpi = (id) => {
    if (id === 'networks') {
      setSelectedKpiModal({
        title: 'Environmental Networks Infrastructure',
        value: `${networks.length} Monitoring Domains`,
        category: 'networks',
        color: '#2563EB',
        trendHistory: [
          { day: 'Aug 1', val: 92 }, { day: 'Aug 5', val: 94 }, { day: 'Aug 9', val: 94 },
          { day: 'Aug 13', val: 96 }, { day: 'Aug 17', val: 96 }, { day: 'Aug 21', val: 98 }, { day: 'Aug 24', val: 100 }
        ],
        breakdown: networks.map(n => ({
          name: n.name,
          value: `${n.totalStations} Stations`,
          status: n.status,
          action: `Health Score: ${n.healthScore}%`
        }))
      });
    } else if (id === 'stations') {
      setSelectedKpiModal({
        title: 'Monitoring Station Sites & Field Telemetry',
        value: `${totalSites} Active Sites`,
        category: 'stations',
        color: '#00A878',
        trendHistory: [
          { day: 'Aug 1', val: 6 }, { day: 'Aug 5', val: 7 }, { day: 'Aug 9', val: 7 },
          { day: 'Aug 13', val: 8 }, { day: 'Aug 17', val: 8 }, { day: 'Aug 21', val: 8 }, { day: 'Aug 24', val: 8 }
        ],
        breakdown: sites.map(s => ({
          name: s.name,
          value: `${s.stationsCount} Stations (${s.zone})`,
          status: s.status === 'Normal' ? 'Optimal' : s.status,
          action: `Engineer: ${s.assignedEngineer}`
        }))
      });
    } else if (id === 'assets') {
      setSelectedKpiModal({
        title: 'Environmental Gas & Sensor Analyzers',
        value: `${assets.length} Field Analyzers`,
        category: 'assets',
        color: '#0891B2',
        trendHistory: [
          { day: 'Aug 1', val: 32 }, { day: 'Aug 5', val: 34 }, { day: 'Aug 9', val: 34 },
          { day: 'Aug 13', val: 36 }, { day: 'Aug 17', val: 36 }, { day: 'Aug 21', val: 38 }, { day: 'Aug 24', val: 40 }
        ],
        breakdown: assets.map(a => ({
          name: a.name,
          value: a.category,
          status: a.status,
          action: `Health: ${a.healthScore}% (${a.siteName})`
        }))
      });
    } else if (id === 'workOrders') {
      setSelectedKpiModal({
        title: 'Maintenance Dispatch & Active Work Orders',
        value: `${openWOs} Active Tickets`,
        category: 'workOrders',
        color: '#EF4444',
        trendHistory: [
          { day: 'Aug 1', val: 12 }, { day: 'Aug 5', val: 9 }, { day: 'Aug 9', val: 7 },
          { day: 'Aug 13', val: 6 }, { day: 'Aug 17', val: 5 }, { day: 'Aug 21', val: 4 }, { day: 'Aug 24', val: openWOs }
        ],
        breakdown: workOrders.map(w => ({
          name: `${w.id}: ${w.title}`,
          value: w.priority,
          status: w.status,
          action: `Assignee: ${w.assignedTo}`
        }))
      });
    }
  };

  const handleDownloadSlaReport = (format) => {
    alert(`Work Order SLA & Resolution Velocity report compiled in ${format.toUpperCase()} format. Download successfully completed.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

      {/* Metric Interactive KPI Cards Grid */}
      <div className="metric-cards-grid">
        
        {/* Metric 1: Monitoring Networks */}
        <InteractiveKpiCard
          id="networks"
          title="MONITORING NETWORKS"
          value={`${networks.length} Domains`}
          subtitle="100% Telemetry Stream Online"
          icon={Network}
          iconBg="linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.2) 100%)"
          iconColor="#2563EB"
          trend="+5.2%"
          trendDirection="up"
          sparklineData={[{ v: 80 }, { v: 85 }, { v: 84 }, { v: 92 }, { v: 96 }, { v: 98 }, { v: 100 }]}
          isActive={activeKpiId === 'networks'}
          lastUpdated={lastUpdatedText}
          onClick={() => setActiveKpiId(activeKpiId === 'networks' ? null : 'networks')}
          onInspect={() => handleInspectKpi('networks')}
        />

        {/* Metric 2: Monitoring Stations */}
        <InteractiveKpiCard
          id="stations"
          title="MONITORING STATIONS"
          value={`${totalSites} Sites`}
          subtitle={`${criticalSites} Require Inspection`}
          icon={MapPin}
          iconBg="linear-gradient(135deg, rgba(0, 168, 120, 0.1) 0%, rgba(13, 186, 139, 0.2) 100%)"
          iconColor="#00A878"
          trend="+14.8%"
          trendDirection="up"
          sparklineData={[{ v: 5 }, { v: 6 }, { v: 6 }, { v: 7 }, { v: 7 }, { v: 8 }, { v: 8 }]}
          isActive={activeKpiId === 'stations'}
          lastUpdated={lastUpdatedText}
          onClick={() => setActiveKpiId(activeKpiId === 'stations' ? null : 'stations')}
          onInspect={() => handleInspectKpi('stations')}
        />

        {/* Metric 3: Equipment Assets */}
        <InteractiveKpiCard
          id="assets"
          title="EQUIPMENT ASSETS"
          value={`${assets.length} Analyzers`}
          subtitle={`${activeAssets} Active in Field`}
          icon={Cpu}
          iconBg="linear-gradient(135deg, rgba(8, 145, 178, 0.1) 0%, rgba(6, 182, 212, 0.2) 100%)"
          iconColor="#0891B2"
          trend="+8.4%"
          trendDirection="up"
          sparklineData={[{ v: 22 }, { v: 24 }, { v: 28 }, { v: 30 }, { v: 35 }, { v: 38 }, { v: 40 }]}
          isActive={activeKpiId === 'assets'}
          lastUpdated={lastUpdatedText}
          onClick={() => setActiveKpiId(activeKpiId === 'assets' ? null : 'assets')}
          onInspect={() => handleInspectKpi('assets')}
        />

        {/* Metric 4: Open Work Orders */}
        <InteractiveKpiCard
          id="workOrders"
          title="OPEN WORK ORDERS"
          value={`${openWOs} Active`}
          subtitle="2 Urgent Critical SLA"
          icon={Wrench}
          iconBg="linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.2) 100%)"
          iconColor="#DC2626"
          trend="-12.5%"
          trendDirection="down"
          sparklineData={[{ v: 12 }, { v: 10 }, { v: 8 }, { v: 6 }, { v: 5 }, { v: 4 }, { v: openWOs }]}
          isActive={activeKpiId === 'workOrders'}
          lastUpdated={lastUpdatedText}
          onClick={() => setActiveKpiId(activeKpiId === 'workOrders' ? null : 'workOrders')}
          onInspect={() => handleInspectKpi('workOrders')}
        />

      </div>

      {/* Main Grid Section: Work Order SLA Velocity & Environmental Networks Health */}
      <div className="dashboard-grid-2">
        
        {/* Interactive Work Order SLA & Resolution Velocity Component */}
        <InteractiveChartContainer 
          title="Work Order SLA & Resolution Velocity" 
          subtitle="Field dispatch & SLA performance metrics" 
        />

        {/* Environmental Networks Health Component with Sorting & Filters */}
        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Header Title & Subtitle */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Environmental Networks Health
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px', marginBottom: 0 }}>
              Environmental network operational overview
            </p>
          </div>

          {/* 3 Filters Occupying the Complete Row with Title Case Labels Above */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%' }}>
            
            {/* Filter 1: Sort Control */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>Sort</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                <select
                  value={networkSort}
                  onChange={(e) => setNetworkSort(e.target.value)}
                  className="chart-dropdown-select"
                  style={{
                    width: '100%',
                    padding: '5px 30px 5px 10px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    borderRadius: '7px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <option value="AZ">A to Z</option>
                  <option value="ZA">Z to A</option>
                  <option value="DATE_DESC">Date Range Descending</option>
                  <option value="DATE_ASC">Date Range Ascending</option>
                </select>
                <ChevronDown size={13} color="#64748B" style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Filter 2: Location Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>Location</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                <select
                  value={selectedLocations[0]}
                  onChange={(e) => setSelectedLocations([e.target.value])}
                  className="chart-dropdown-select"
                  style={{
                    width: '100%',
                    padding: '5px 30px 5px 10px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    borderRadius: '7px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <option value="ALL">All Locations</option>
                  <option value="Wasit Wetland Reserve">Wasit Wetland Reserve</option>
                  <option value="Khorfakkan Harbor">Khorfakkan Harbor</option>
                  <option value="Al Dhaid Depot">Al Dhaid Depot</option>
                </select>
                <ChevronDown size={13} color="#64748B" style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Filter 3: Status Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>Status</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                <select
                  value={selectedStatuses[0]}
                  onChange={(e) => setSelectedStatuses([e.target.value])}
                  className="chart-dropdown-select"
                  style={{
                    width: '100%',
                    padding: '5px 30px 5px 10px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    borderRadius: '7px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Operational">Operational</option>
                  <option value="Degraded">Degraded</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Offline">Offline</option>
                  <option value="Warning">Warning</option>
                </select>
                <ChevronDown size={13} color="#64748B" style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }} />
              </div>
            </div>

          </div>

          {/* Network Health List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '225px', overflowY: 'auto' }}>
            {processedNetworks.map((net) => (
              <div key={net.id} style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0F172A' }}>{net.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{net.totalStations} Stations • Code: {net.code}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${net.status === 'Operational' ? 'badge-passed' : 'badge-degraded'}`}>
                    {net.status}
                  </span>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00A878', marginTop: '2px' }}>
                    {net.healthScore}% Health
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Dashboard Horizontal GIS Map Component */}
      <MapView height="480px" />

      {/* Modal Drill-Down Inspector */}
      {selectedKpiModal && (
        <KpiDetailModal modalData={selectedKpiModal} onClose={() => setSelectedKpiModal(null)} />
      )}

    </div>
  );
}
