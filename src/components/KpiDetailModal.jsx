import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Activity, 
  Search, 
  FileSpreadsheet, 
  FileText, 
  Image as ImageIcon,
  BarChart2,
  PieChart as PieChartIcon,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

import { useApp } from '../context/AppContext';

export default function KpiDetailModal({ kpiData, modalData, onClose, onApplyFilter }) {
  const { triggerExportSuccess } = useApp();
  const data = kpiData || modalData;
  if (!data) return null;

  const { title, value, category, breakdown = [], trendHistory = [], color = '#00A878' } = data;

  const [dateRange, setDateRange] = useState('30D'); // '7D', '15D', '30D', 'CUSTOM'
  const [chartView, setChartView] = useState('area'); // 'area', 'bar', 'donut'
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Default Chart History if not supplied
  const historyData = trendHistory.length > 0 ? trendHistory : defaultHistory;
  const breakdownItems = breakdown.length > 0 ? breakdown : defaultBreakdown;

  // Filter breakdown items
  const filteredBreakdown = breakdownItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.value && item.value.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.status && item.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleExportFormat = (format) => {
    const fileName = `${title.replace(/\s+/g, '_')}_KPI_Analysis.${format.toLowerCase()}`;
    if (triggerExportSuccess) {
      triggerExportSuccess({
        filename: fileName,
        format: format.toUpperCase(),
        count: filteredBreakdown.length,
        title: `${title} Exported Successfully!`
      });
    }
  };

  // Pie chart colors
  const PIE_COLORS = ['#00A878', '#2563EB', '#0891B2', '#F59E0B', '#EF4444'];

  return (
    <div className="modal-overlay" style={{ zIndex: 100000, backdropFilter: 'blur(8px)', background: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="glass-panel" 
        style={{
          width: '840px',
          maxWidth: '95vw',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 168, 120, 0.15)',
          animation: 'fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          padding: 0
        }}
      >
        {/* Sticky Header */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 20, 
          background: 'rgba(255, 255, 255, 0.98)', 
          backdropFilter: 'blur(8px)', 
          padding: '18px 24px 14px 24px', 
          borderBottom: '1px solid #E2E8F0',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start' 
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge" style={{ background: `${color}15`, color: color, borderColor: `${color}40`, fontWeight: 800, fontSize: 'clamp(0.68rem, 1vw, 0.72rem)' }}>
                EPA Interactive Analytics Pop-Up
              </span>
              <span style={{ fontSize: 'clamp(0.7rem, 1vw, 0.75rem)', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Activity size={13} color="#00A878" /> Real-Time Telemetry Stream
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
              {title} Deep Inspection
            </h2>
            <p style={{ fontSize: 'clamp(0.74rem, 1.1vw, 0.8rem)', color: '#64748B', marginTop: '2px', marginBottom: 0, fontWeight: 500 }}>
              Interactive distribution analysis, time-series metrics, and subsystem operational audit.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={handleRefreshData}
              title="Refresh Live Metrics"
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={15} className={isRefreshing ? 'spin-anim' : ''} />
            </button>

            <button 
              onClick={onClose} 
              style={{ 
                background: '#F1F5F9', 
                border: '1px solid #CBD5E1', 
                borderRadius: '50%', 
                width: '34px', 
                height: '34px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                color: '#64748B',
                transition: 'all 0.15s ease'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Middle Content Section */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Controls Toolbar with Timeframe & Visualization Dropdowns */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            gap: '12px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '10px 14px'
          }}>
            {/* Left: Timeframe Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={15} color="#00A878" />
              <span style={{ fontSize: 'clamp(0.72rem, 1.1vw, 0.78rem)', fontWeight: 800, color: '#334155' }}>Timeframe:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: 'clamp(0.72rem, 1vw, 0.76rem)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <option value="7D">Last 7 Days</option>
                <option value="15D">Last 15 Days</option>
                <option value="30D">Last 30 Days</option>
                <option value="CUSTOM">Custom Range</option>
              </select>
            </div>

            {/* Right: Visualization View Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: 'clamp(0.72rem, 1.1vw, 0.78rem)', fontWeight: 800, color: '#334155' }}>Visualization:</span>
              <select
                value={chartView}
                onChange={(e) => setChartView(e.target.value)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: 'clamp(0.72rem, 1vw, 0.76rem)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <option value="area">Velocity Area Chart</option>
                <option value="bar">Distribution Bar Chart</option>
                <option value="donut">Subsystem Donut Chart</option>
              </select>
            </div>
          </div>

          {/* Metric High-Level Summary Stat Cards Grid (Font size scaled to 18px / clamp) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ background: '#FFFFFF', border: `1.5px solid ${color}33`, borderRadius: '12px', padding: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: 'clamp(0.65rem, 1vw, 0.7rem)', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Current Value</span>
              <div style={{ fontSize: 'clamp(1rem, 1.6vw, 1.15rem)', fontWeight: 800, color: '#0F172A', marginTop: '4px', lineHeight: 1.1, whiteSpace: 'nowrap' }}>{value}</div>
              <div style={{ fontSize: 'clamp(0.68rem, 1vw, 0.72rem)', color: color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                <ArrowUpRight size={13} /> Live Stream Active
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: 'clamp(0.65rem, 1vw, 0.7rem)', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Regulatory Target</span>
              <div style={{ fontSize: 'clamp(1rem, 1.6vw, 1.15rem)', fontWeight: 800, color: '#0F172A', marginTop: '4px', lineHeight: 1.1, whiteSpace: 'nowrap' }}>99.8% SLA</div>
              <div style={{ fontSize: 'clamp(0.68rem, 1vw, 0.72rem)', color: '#0891B2', fontWeight: 700, marginTop: '6px' }}>
                ISO 17025 Compliant
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: 'clamp(0.65rem, 1vw, 0.7rem)', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sampling Trajectory</span>
              <div style={{ fontSize: 'clamp(1rem, 1.6vw, 1.15rem)', fontWeight: 800, color: '#00A878', marginTop: '4px', lineHeight: 1.1, whiteSpace: 'nowrap' }}>+14.2% Growth</div>
              <div style={{ fontSize: 'clamp(0.68rem, 1vw, 0.72rem)', color: '#64748B', fontWeight: 600, marginTop: '6px' }}>
                vs preceding baseline
              </div>
            </div>
          </div>

          {/* Main Interactive Chart Section */}
          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '14px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: 'clamp(0.85rem, 1.2vw, 0.92rem)', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <TrendingUp size={16} color={color} />
                {chartView === 'area' && `${title} Historical Velocity Stream`}
                {chartView === 'bar' && `${title} Subsystem Distribution`}
                {chartView === 'donut' && `${title} Operational Share Breakdown`}
              </h4>
              <span style={{ fontSize: 'clamp(0.68rem, 1vw, 0.72rem)', color: '#64748B', fontWeight: 600 }}>
                Live telemetry sampling • Auto-refreshed
              </span>
            </div>

            <div style={{ width: '100%', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'area' ? (
                  <AreaChart data={historyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="modalInteractiveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.45} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.9)" />
                    <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} fontWeight={600} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} fontWeight={600} />
                    <Tooltip 
                      contentStyle={{
                        background: '#0F172A',
                        color: '#FFF',
                        borderRadius: '10px',
                        fontSize: '0.78rem',
                        border: 'none',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                      }}
                    />
                    <Area type="monotone" dataKey="val" stroke={color} strokeWidth={3} fillOpacity={1} fill="url(#modalInteractiveGrad)" name="Value" />
                  </AreaChart>
                ) : chartView === 'bar' ? (
                  <BarChart data={historyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.9)" />
                    <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} fontWeight={600} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} fontWeight={600} />
                    <Tooltip 
                      contentStyle={{
                        background: '#0F172A',
                        color: '#FFF',
                        borderRadius: '10px',
                        fontSize: '0.78rem',
                        border: 'none'
                      }}
                    />
                    <Bar dataKey="val" fill={color} radius={[6, 6, 0, 0]} name="Score Value" />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={breakdownItems}
                      dataKey={(d) => parseInt(d.value) || 10}
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {breakdownItems.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        background: '#0F172A',
                        color: '#FFF',
                        borderRadius: '10px',
                        fontSize: '0.78rem',
                        border: 'none'
                      }}
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Itemized Sub-system Breakdown Table with Filter Input and Horizontal Scroll Container */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: 'clamp(0.85rem, 1.2vw, 0.92rem)', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Category & Sub-System Itemized Breakdown ({filteredBreakdown.length})
              </h4>

              {/* Filter Search Input */}
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="text"
                  placeholder="Search subsystem item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '28px',
                    paddingRight: '10px',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    fontSize: 'clamp(0.7rem, 1vw, 0.76rem)',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#F8FAFC'
                  }}
                />
              </div>
            </div>

            {/* Horizontal Scrollable Table Wrapper */}
            <div style={{ border: '1px solid #CBD5E1', borderRadius: '12px', overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
              <table className="epa-table" style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ fontSize: 'clamp(0.7rem, 1vw, 0.74rem)' }}>Sub-Domain / Asset Name</th>
                    <th style={{ fontSize: 'clamp(0.7rem, 1vw, 0.74rem)' }}>Current Metric Score</th>
                    <th style={{ fontSize: 'clamp(0.7rem, 1vw, 0.74rem)' }}>Status Indicator</th>
                    <th style={{ fontSize: 'clamp(0.7rem, 1vw, 0.74rem)' }}>Field Action Needed</th>
                    <th style={{ fontSize: 'clamp(0.7rem, 1vw, 0.74rem)' }}>Diagnostics</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBreakdown.length > 0 ? (
                    filteredBreakdown.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 800, color: '#0F172A', fontSize: 'clamp(0.72rem, 1vw, 0.78rem)' }}>{item.name}</td>
                        <td style={{ fontWeight: 800, color: color, fontSize: 'clamp(0.72rem, 1vw, 0.78rem)' }}>{item.value}</td>
                        <td>
                          <span className={`badge ${item.status === 'Optimal' || item.status === 'Active' || item.status === 'Passed' || item.status === 'Normal' ? 'badge-normal' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                            {item.status || 'Optimal'}
                          </span>
                        </td>
                        <td style={{ fontSize: 'clamp(0.7rem, 1vw, 0.75rem)', color: '#475569', fontWeight: 500 }}>{item.action || 'Optimal operational status'}</td>
                        <td>
                          <button
                            onClick={() => alert(`[DIAGNOSTIC EXECUTED] Diagnostics complete for ${item.name}. Stream signal verified.`)}
                            style={{
                              background: '#F1F5F9',
                              border: '1px solid #CBD5E1',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              color: '#0F172A',
                              cursor: 'pointer'
                            }}
                          >
                            Run Test
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: '#64748B', padding: '20px' }}>
                        No subsystem items matched "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Sticky Footer */}
        <div style={{ 
          position: 'sticky', 
          bottom: 0, 
          zIndex: 20, 
          background: 'rgba(255, 255, 255, 0.98)', 
          backdropFilter: 'blur(8px)', 
          padding: '14px 24px', 
          borderTop: '1px solid #E2E8F0', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          gap: '12px' 
        }}>
          {/* Left: Apply Filter CTA */}
          <button 
            onClick={() => {
              if (onApplyFilter) onApplyFilter(category);
              onClose();
            }}
            className="btn btn-epa" 
            style={{ fontSize: 'clamp(0.74rem, 1vw, 0.8rem)', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Filter size={14} /> Apply Active View Filter
          </button>

          {/* Right: Export Toolbar & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: 'clamp(0.7rem, 1vw, 0.74rem)', color: '#64748B', fontWeight: 700 }}>Export Inspection:</span>
            
            <button 
              onClick={() => handleExportFormat('csv')} 
              className="btn btn-secondary" 
              style={{ fontSize: '0.72rem', padding: '5px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <FileSpreadsheet size={13} color="#00A878" /> CSV
            </button>

            <button 
              onClick={() => handleExportFormat('pdf')} 
              className="btn btn-secondary" 
              style={{ fontSize: '0.72rem', padding: '5px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <FileText size={13} color="#DC2626" /> PDF
            </button>

            <button 
              onClick={() => handleExportFormat('png')} 
              className="btn btn-secondary" 
              style={{ fontSize: '0.72rem', padding: '5px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ImageIcon size={13} color="#2563EB" /> PNG
            </button>

            <button 
              onClick={onClose} 
              className="btn btn-secondary" 
              style={{ fontSize: 'clamp(0.74rem, 1vw, 0.8rem)', padding: '7px 14px', marginLeft: '4px' }}
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

const defaultHistory = [
  { day: 'Aug 1', val: 78 }, 
  { day: 'Aug 5', val: 82 }, 
  { day: 'Aug 9', val: 80 },
  { day: 'Aug 13', val: 88 }, 
  { day: 'Aug 17', val: 92 }, 
  { day: 'Aug 21', val: 95 }, 
  { day: 'Aug 24', val: 98 }
];

const defaultBreakdown = [
  { name: 'Air Quality Monitoring Network (AQMN)', value: '12 Stations', status: 'Optimal', action: 'Telemetry synchronized' },
  { name: 'Marine Buoy & Water Quality Network', value: '8 Stations', status: 'Optimal', action: 'Bi-weekly calibration completed' },
  { name: 'Groundwater Monitoring Wells', value: '10 Stations', status: 'Warning', action: 'Sensor #3 calibration recommended' },
  { name: 'Ambient Noise Monitoring Stations', value: '6 Stations', status: 'Optimal', action: 'Battery & solar stream healthy' },
  { name: 'Emissions & Stack Sensor Fleet', value: '4 Stations', status: 'Optimal', action: 'Zero drift within parameters' }
];
