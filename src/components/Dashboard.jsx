import React, { useState, useEffect, useMemo } from 'react';
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
  const { 
    networks, 
    sites, 
    assets, 
    workOrders, 
    setActiveModule, 
    activeModule, 
    activeTab,
    dateFilter,
    isDateInRange,
    getDateRangeLabel
  } = useApp();

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

  const lastUpdatedText = `25 Aug 2026, 12:00`;

  // Filter Work Orders by active Date Filter
  const filteredWorkOrders = workOrders.filter(w => isDateInRange(w.createdDate || w.dueDate));
  const openWOs = filteredWorkOrders.filter(w => w.status !== 'Completed').length;
  const criticalWOs = filteredWorkOrders.filter(w => w.priority === 'Critical' && w.status !== 'Completed').length;

  // Compute Metrics dynamically based on Date Filter
  const totalSites = sites.length;
  const criticalSites = sites.filter(s => s.status === 'Critical' || s.status === 'Warning').length;
  const activeAssets = assets.filter(a => a.status === 'Active').length;

  // Fully dynamic metrics based on active Date Filter
  const kpiMetrics = useMemo(() => {
    switch (dateFilter) {
      case 'TODAY':
        return {
          networks: {
            value: '4 Domains',
            subtitle: '98.6% Telemetry Health (Today)',
            trend: '+0.4% Daily Stream',
            sparkline: [{ v: 96 }, { v: 97 }, { v: 97 }, { v: 98 }, { v: 98 }, { v: 99 }, { v: 99 }]
          },
          stations: {
            value: '28 Sites Online',
            subtitle: '1 Active Alert Detected Today',
            trend: '99.2% Daily Uptime',
            sparkline: [{ v: 28 }, { v: 28 }, { v: 27 }, { v: 28 }, { v: 28 }, { v: 28 }, { v: 28 }]
          },
          assets: {
            value: '42 Analyzers',
            subtitle: '1 Gas Calibration Due Today',
            trend: '100% Zero-Drift',
            sparkline: [{ v: 42 }, { v: 42 }, { v: 41 }, { v: 42 }, { v: 42 }, { v: 42 }, { v: 42 }]
          },
          workOrders: {
            value: `${openWOs} Active Tickets`,
            subtitle: `${criticalWOs} Critical Urgent (Today)`,
            trend: 'Today SLA Focus',
            sparkline: [{ v: 0 }, { v: 1 }, { v: 1 }, { v: 2 }, { v: 2 }, { v: 2 }, { v: openWOs }]
          }
        };
      case '7D':
        return {
          networks: {
            value: '4 Domains',
            subtitle: '97.4% 7-Day Average Health',
            trend: '+1.8% 7D Trend',
            sparkline: [{ v: 94 }, { v: 95 }, { v: 96 }, { v: 96 }, { v: 97 }, { v: 98 }, { v: 97 }]
          },
          stations: {
            value: '28 Sites Monitored',
            subtitle: '3 Maintenance Events (7 Days)',
            trend: '98.4% 7D Uptime',
            sparkline: [{ v: 26 }, { v: 27 }, { v: 27 }, { v: 28 }, { v: 27 }, { v: 28 }, { v: 28 }]
          },
          assets: {
            value: '42 Analyzers',
            subtitle: '3 Calibrations in Last 7 Days',
            trend: '+4.8% Reliability',
            sparkline: [{ v: 39 }, { v: 40 }, { v: 41 }, { v: 41 }, { v: 42 }, { v: 42 }, { v: 42 }]
          },
          workOrders: {
            value: `${openWOs} Active Tickets`,
            subtitle: `${criticalWOs} Critical / 2 In Progress`,
            trend: '-33% 7D Backlog',
            sparkline: [{ v: 6 }, { v: 5 }, { v: 5 }, { v: 4 }, { v: 4 }, { v: 4 }, { v: openWOs }]
          }
        };
      case '15D':
        return {
          networks: {
            value: '4 Domains',
            subtitle: '96.1% 15-Day Average Health',
            trend: '+2.4% 15D Trend',
            sparkline: [{ v: 92 }, { v: 93 }, { v: 94 }, { v: 95 }, { v: 96 }, { v: 97 }, { v: 96 }]
          },
          stations: {
            value: '28 Sites Monitored',
            subtitle: '6 Maintenance Events (15 Days)',
            trend: '97.6% 15D Uptime',
            sparkline: [{ v: 25 }, { v: 26 }, { v: 27 }, { v: 27 }, { v: 28 }, { v: 27 }, { v: 28 }]
          },
          assets: {
            value: '42 Analyzers',
            subtitle: '5 Calibrations in Last 15 Days',
            trend: '+6.5% Reliability',
            sparkline: [{ v: 36 }, { v: 38 }, { v: 39 }, { v: 40 }, { v: 41 }, { v: 42 }, { v: 42 }]
          },
          workOrders: {
            value: `${openWOs} Active Tickets`,
            subtitle: `${criticalWOs} Critical / 3 Preventative`,
            trend: '-20% 15D Backlog',
            sparkline: [{ v: 8 }, { v: 7 }, { v: 6 }, { v: 5 }, { v: 5 }, { v: 5 }, { v: openWOs }]
          }
        };
      case '30D':
        return {
          networks: {
            value: '4 Domains',
            subtitle: '94.8% Monthly Average Health',
            trend: '+3.1% 30D Trend',
            sparkline: [{ v: 90 }, { v: 91 }, { v: 93 }, { v: 94 }, { v: 95 }, { v: 96 }, { v: 95 }]
          },
          stations: {
            value: '28 Sites Monitored',
            subtitle: '14 Telemetry Events (30 Days)',
            trend: '96.8% 30D Uptime',
            sparkline: [{ v: 24 }, { v: 25 }, { v: 26 }, { v: 27 }, { v: 27 }, { v: 28 }, { v: 28 }]
          },
          assets: {
            value: '42 Analyzers',
            subtitle: '8 Calibrations in Last 30 Days',
            trend: '+8.4% Reliability',
            sparkline: [{ v: 32 }, { v: 35 }, { v: 38 }, { v: 40 }, { v: 41 }, { v: 42 }, { v: 42 }]
          },
          workOrders: {
            value: `${openWOs} Active Tickets`,
            subtitle: `4 Completed on Time / ${openWOs} Active`,
            trend: '-12.5% Monthly Backlog',
            sparkline: [{ v: 11 }, { v: 10 }, { v: 9 }, { v: 8 }, { v: 7 }, { v: 7 }, { v: openWOs }]
          }
        };
      case 'ALL':
      default:
        return {
          networks: {
            value: `${networks.length} Domains`,
            subtitle: '100% Telemetry Online (All Time)',
            trend: '+5.8% Overall Growth',
            sparkline: [{ v: 80 }, { v: 85 }, { v: 84 }, { v: 92 }, { v: 96 }, { v: 98 }, { v: 100 }]
          },
          stations: {
            value: `${totalSites} Sites Total`,
            subtitle: `${criticalSites} Require Attention (Lifetime)`,
            trend: '+14.8% Station Expansion',
            sparkline: [{ v: 18 }, { v: 20 }, { v: 22 }, { v: 24 }, { v: 26 }, { v: 27 }, { v: 28 }]
          },
          assets: {
            value: `${assets.length} Analyzers`,
            subtitle: `${activeAssets} Active in Field (Lifetime)`,
            trend: '+12.2% Equipment Fleet',
            sparkline: [{ v: 22 }, { v: 26 }, { v: 30 }, { v: 34 }, { v: 38 }, { v: 40 }, { v: 42 }]
          },
          workOrders: {
            value: `${workOrders.length} Total Tickets`,
            subtitle: `${openWOs} Active / ${workOrders.length - openWOs} Completed`,
            trend: '94.2% Lifetime SLA Compliance',
            sparkline: [{ v: 14 }, { v: 12 }, { v: 10 }, { v: 8 }, { v: 6 }, { v: 5 }, { v: openWOs }]
          }
        };
    }
  }, [dateFilter, openWOs, criticalWOs, networks.length, totalSites, criticalSites, assets.length, activeAssets, workOrders.length]);

  // Filter & Sort Environmental Networks Health
  const processedNetworks = useMemo(() => {
    let list = [...networks];

    // Filter Location
    if (selectedLocations[0] && selectedLocations[0] !== 'ALL') {
      list = list.filter(n => n.location === selectedLocations[0] || (n.name && n.name.toLowerCase().includes(selectedLocations[0].toLowerCase())));
    }

    // Filter Status
    if (selectedStatuses[0] && selectedStatuses[0] !== 'ALL') {
      list = list.filter(n => n.status === selectedStatuses[0]);
    }

    // Sort
    list.sort((a, b) => {
      if (networkSort === 'AZ') return a.name.localeCompare(b.name);
      if (networkSort === 'ZA') return b.name.localeCompare(a.name);
      if (networkSort === 'HEALTH_DESC') return (b.healthScore || 0) - (a.healthScore || 0);
      if (networkSort === 'HEALTH_ASC') return (a.healthScore || 0) - (b.healthScore || 0);
      if (networkSort === 'STATIONS_DESC') return (b.totalStations || 0) - (a.totalStations || 0);
      if (networkSort === 'STATIONS_ASC') return (a.totalStations || 0) - (b.totalStations || 0);
      return 0;
    });

    return list;
  }, [networks, selectedLocations, selectedStatuses, networkSort]);

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
        breakdown: filteredWorkOrders.map(w => ({
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
          value={kpiMetrics.networks.value}
          subtitle={kpiMetrics.networks.subtitle}
          icon={Network}
          iconBg="linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.2) 100%)"
          iconColor="#2563EB"
          trend={kpiMetrics.networks.trend}
          trendDirection="up"
          sparklineData={kpiMetrics.networks.sparkline}
          isActive={activeKpiId === 'networks'}
          lastUpdated={lastUpdatedText}
          onClick={() => setActiveKpiId(activeKpiId === 'networks' ? null : 'networks')}
          onInspect={() => handleInspectKpi('networks')}
        />

        {/* Metric 2: Monitoring Stations */}
        <InteractiveKpiCard
          id="stations"
          title="MONITORING STATIONS"
          value={kpiMetrics.stations.value}
          subtitle={kpiMetrics.stations.subtitle}
          icon={MapPin}
          iconBg="linear-gradient(135deg, rgba(0, 168, 120, 0.1) 0%, rgba(13, 186, 139, 0.2) 100%)"
          iconColor="#00A878"
          trend={kpiMetrics.stations.trend}
          trendDirection="up"
          sparklineData={kpiMetrics.stations.sparkline}
          isActive={activeKpiId === 'stations'}
          lastUpdated={lastUpdatedText}
          onClick={() => setActiveKpiId(activeKpiId === 'stations' ? null : 'stations')}
          onInspect={() => handleInspectKpi('stations')}
        />

        {/* Metric 3: Equipment Assets */}
        <InteractiveKpiCard
          id="assets"
          title="EQUIPMENT ASSETS"
          value={kpiMetrics.assets.value}
          subtitle={kpiMetrics.assets.subtitle}
          icon={Cpu}
          iconBg="linear-gradient(135deg, rgba(8, 145, 178, 0.1) 0%, rgba(6, 182, 212, 0.2) 100%)"
          iconColor="#0891B2"
          trend={kpiMetrics.assets.trend}
          trendDirection="up"
          sparklineData={kpiMetrics.assets.sparkline}
          isActive={activeKpiId === 'assets'}
          lastUpdated={lastUpdatedText}
          onClick={() => setActiveKpiId(activeKpiId === 'assets' ? null : 'assets')}
          onInspect={() => handleInspectKpi('assets')}
        />

        {/* Metric 4: Open Work Orders */}
        <InteractiveKpiCard
          id="workOrders"
          title="OPEN WORK ORDERS"
          value={kpiMetrics.workOrders.value}
          subtitle={kpiMetrics.workOrders.subtitle}
          icon={Wrench}
          iconBg="linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.2) 100%)"
          iconColor="#DC2626"
          trend={kpiMetrics.workOrders.trend}
          trendDirection="down"
          sparklineData={kpiMetrics.workOrders.sparkline}
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
                  <option value="HEALTH_DESC">Health: Highest First</option>
                  <option value="HEALTH_ASC">Health: Lowest First</option>
                  <option value="STATIONS_DESC">Stations: Most First</option>
                  <option value="STATIONS_ASC">Stations: Least First</option>
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
                  <option value="Sharjah City Center">Sharjah City Center</option>
                  <option value="Coastal & Marine Reserves">Coastal & Marine Reserves</option>
                  <option value="Central Agricultural Belt">Central Agricultural Belt</option>
                  <option value="Protected Reserves & Inland">Protected Reserves & Inland</option>
                  <option value="Industrial & Free Zones">Industrial & Free Zones</option>
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
                  <option value="Warning">Warning</option>
                </select>
                <ChevronDown size={13} color="#64748B" style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }} />
              </div>
            </div>

          </div>

          {/* Network Health List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '225px', overflowY: 'auto' }}>
            {processedNetworks.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 700, fontSize: '0.84rem', color: '#334155' }}>No environmental networks match this filter</p>
                <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>Try choosing 'All Locations' or 'All Statuses'</span>
              </div>
            ) : (
              processedNetworks.map((net) => (
                <div key={net.id} style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0F172A' }}>{net.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      {net.totalStations} Stations • Code: {net.code} • {net.location}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${net.status === 'Operational' ? 'badge-passed' : net.status === 'Degraded' ? 'badge-degraded' : 'badge-warning'}`}>
                      {net.status}
                    </span>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: net.healthScore > 90 ? '#00A878' : net.healthScore > 80 ? '#0284c7' : '#e11d48', marginTop: '2px' }}>
                      {net.healthScore}% Health
                    </div>
                  </div>
                </div>
              ))
            )}
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
