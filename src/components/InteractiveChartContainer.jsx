import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart, Bar, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart 
} from 'recharts';
import { 
  BarChart3, AreaChart as AreaIcon, PieChart as PieIcon, Table as TableIcon, 
  Download, Calendar, Sparkles, ChevronDown, Clock, Filter, CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const COLOR_PALETTE = ['#00A878', '#0891B2', '#2563EB', '#8B5CF6', '#F59E0B', '#EF4444'];

export default function InteractiveChartContainer({
  title = "Work Order SLA & Resolution Velocity",
  subtitle = "Field dispatch & SLA performance metrics",
  datasets = {},
  initialRange = "TODAY",
  onPointClick
}) {
  const { dateFilter: globalDateFilter, startDate: globalStartDate, endDate: globalEndDate, triggerExportSuccess } = useApp();
  const [timeRange, setTimeRange] = useState(globalDateFilter || initialRange); // 'TODAY', '7D', '15D', '30D', 'ALL', 'CUSTOM'
  const [chartType, setChartType] = useState('column'); // 'column', 'bar', 'pie', 'table'
  const [exportFormat, setExportFormat] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [startDate, setStartDate] = useState(globalStartDate || '2026-08-25');
  const [endDate, setEndDate] = useState(globalEndDate || '2026-08-25');

  // Synchronize chart data with the global PageHeaderBar date dropdown
  useEffect(() => {
    if (globalDateFilter) {
      setTimeRange(globalDateFilter);
      if (globalStartDate) setStartDate(globalStartDate);
      if (globalEndDate) setEndDate(globalEndDate);
    }
  }, [globalDateFilter, globalStartDate, globalEndDate]);

  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  const dateDropdownRef = useRef(null);
  const exportDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) {
        setIsDateDropdownOpen(false);
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [visibleSeries, setVisibleSeries] = useState({
    completedWO: true,
    openWO: true,
    avgResponseHours: true
  });

  // Dynamically compute/select dataset based on selected date range / filter
  let currentData;
  if (timeRange === 'CUSTOM') {
    currentData = generateCustomRangeData(startDate, endDate);
  } else {
    currentData = datasets[timeRange] || defaultDataSets[timeRange] || defaultDataSets['TODAY'];
  }

  const toggleSeries = (key) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBarClick = (entry) => {
    if (!entry) return;
    const pointData = entry.payload || entry;
    if (onPointClick) {
      onPointClick(pointData);
    } else {
      alert(`[METRIC POINT INSPECTION]\nPeriod: ${pointData.day || pointData.label || 'N/A'}\nCompleted Work Orders: ${pointData.completedWO || 0}\nPending Tickets: ${pointData.openWO || 0}\nMTTR Response: ${pointData.avgResponseHours || 2.4} Hours`);
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleExportSelect = (format) => {
    if (!format) return;
    setExportFormat(format);

    let formatLabel = '';
    if (format === 'csv') formatLabel = 'CSV File';
    else if (format === 'pdf') formatLabel = 'PDF Document';
    else if (format === 'png') formatLabel = 'PNG Image';

    const fileName = `${title.replace(/\s+/g, '_')}_${timeRange}_Data.${format.toLowerCase()}`;

    if (format === 'csv') {
      const csvRows = [];
      if (currentData && currentData.length > 0) {
        const headers = Object.keys(currentData[0]).join(',');
        csvRows.push(headers);
        currentData.forEach(row => {
          csvRows.push(Object.values(row).join(','));
        });
      }
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', fileName);
      a.click();
    }

    if (triggerExportSuccess) {
      triggerExportSuccess({
        filename: fileName,
        format: format.toUpperCase(),
        count: currentData ? currentData.length : 0,
        title: `${title} Exported Successfully!`
      });
    }

    triggerToast(`Download successfully completed: ${formatLabel}`);
    setTimeout(() => setExportFormat(''), 300);
  };

  const getDateDisplayLabel = () => {
    switch (timeRange) {
      case 'DAY': return 'Day';
      case 'WEEK': return 'Weekly';
      case 'MONTH': return 'Monthly';
      case 'YEAR': return 'Yearly';
      case 'CUSTOM': 
        return startDate && endDate ? `${startDate} to ${endDate}` : 'Custom Date Range';
      default: return 'Weekly';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>

      {/* Download Success Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 9999,
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '10px 16px',
          borderRadius: '10px',
          border: '1px solid #00A878',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          fontWeight: 700,
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <CheckCircle2 size={16} color="#00A878" />
          {toastMessage}
        </div>
      )}

      {/* 1. Title Row Header (Filters aligned to top with flex-start) */}
      <div className="card-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {title}
          </h3>
          <p style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px', marginBottom: 0 }}>{subtitle}</p>
        </div>

        {/* 3 Action Control Dropdowns Aligned to Top */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginLeft: 'auto' }}>
          
          {/* 1. Date Range Aggregation Dropdown */}
          <div ref={dateDropdownRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setIsDateDropdownOpen(prev => !prev);
                setIsExportDropdownOpen(false);
              }}
              style={{
                padding: '4px 10px 4px 24px',
                borderRadius: '7px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#0F172A',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                position: 'relative',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                whiteSpace: 'nowrap',
                maxWidth: '220px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              <Calendar size={12} color="#00A878" style={{ position: 'absolute', left: '7px', pointerEvents: 'none' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{getDateDisplayLabel()}</span>
              <ChevronDown size={12} color="#64748B" style={{ flexShrink: 0 }} />
            </button>

            {isDateDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                zIndex: 99999,
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
                width: '240px',
                padding: '6px 0',
                fontSize: '0.76rem'
              }}>
                {[
                  { id: 'DAY', label: 'Day' },
                  { id: 'WEEK', label: 'Weekly' },
                  { id: 'MONTH', label: 'Monthly' },
                  { id: 'YEAR', label: 'Yearly' },
                  { id: 'CUSTOM', label: 'Custom Date Range' }
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setTimeRange(opt.id);
                      if (opt.id !== 'CUSTOM') {
                        setIsDateDropdownOpen(false);
                      }
                    }}
                    style={{
                      padding: '8px 14px',
                      cursor: 'pointer',
                      fontWeight: timeRange === opt.id ? 700 : 500,
                      background: timeRange === opt.id ? '#F1F5F9' : 'transparent',
                      color: timeRange === opt.id ? '#00A878' : '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <span>{opt.label}</span>
                    {timeRange === opt.id && <CheckCircle2 size={13} color="#00A878" />}
                  </div>
                ))}

                {/* From and To Date Range in the SAME dropdown tab */}
                {timeRange === 'CUSTOM' && (
                  <div style={{
                    marginTop: '4px',
                    padding: '10px 12px',
                    borderTop: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>From:</span>
                      <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 6px',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          background: '#FFFFFF',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>To:</span>
                      <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 6px',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          background: '#FFFFFF',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        triggerToast(`Custom date range applied: ${startDate} to ${endDate}`);
                        setIsDateDropdownOpen(false);
                      }}
                      className="btn btn-epa"
                      style={{
                        width: '100%',
                        padding: '6px 0',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      Apply Range
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Chart View */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <BarChart3 size={12} color="#00A878" style={{ position: 'absolute', left: '7px', pointerEvents: 'none' }} />
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="chart-dropdown-select"
              style={{
                width: '120px',
                padding: '4px 22px 4px 22px',
                borderRadius: '7px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#0F172A',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                outline: 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              <option value="column">Column Chart</option>
              <option value="bar">Bar Chart (Horizontal)</option>
              <option value="pie">Pie / Donut Chart</option>
              <option value="table">Data Table View</option>
            </select>
            <ChevronDown size={12} color="#64748B" style={{ position: 'absolute', right: '7px', pointerEvents: 'none' }} />
          </div>

          {/* 3. Export Custom Dropdown (No 'Export' in dropdown items list) */}
          <div ref={exportDropdownRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setIsExportDropdownOpen(prev => !prev);
                setIsDateDropdownOpen(false);
              }}
              style={{
                padding: '4px 10px 4px 24px',
                borderRadius: '7px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#0F172A',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                position: 'relative',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                whiteSpace: 'nowrap'
              }}
            >
              <Download size={12} color="#00A878" style={{ position: 'absolute', left: '7px', pointerEvents: 'none' }} />
              <span>Export</span>
              <ChevronDown size={12} color="#64748B" />
            </button>

            {isExportDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                zIndex: 99999,
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
                width: '130px',
                padding: '4px 0',
                fontSize: '0.74rem'
              }}>
                {[
                  { id: 'png', label: 'PNG Image' },
                  { id: 'csv', label: 'CSV File' },
                  { id: 'pdf', label: 'PDF Document' }
                ].map(fmt => (
                  <div
                    key={fmt.id}
                    onClick={() => {
                      handleExportSelect(fmt.id);
                      setIsExportDropdownOpen(false);
                    }}
                    style={{
                      padding: '7px 14px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      color: '#334155',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {fmt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Interactive SVG Recharts Render Area */}
      <div style={{ width: '100%', height: '215px', position: 'relative' }}>
        
        {chartType === 'table' ? (
          <div style={{ width: '100%', height: '100%', overflowX: 'auto', border: '1px solid #CBD5E1', borderRadius: '10px' }}>
            <table className="epa-table" style={{ width: '100%', minWidth: '550px' }}>
              <thead>
                <tr>
                  <th>Interval Period ({timeRange})</th>
                  <th>Completed Work Orders</th>
                  <th>Pending Tickets</th>
                  <th>Average MTTR (Hours)</th>
                  <th>Compliance Status</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, idx) => (
                  <tr key={idx} onClick={() => handleBarClick(row)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontWeight: 800, color: '#0F172A' }}>{row.day || row.label}</td>
                    <td style={{ fontWeight: 800, color: '#00A878' }}>{row.completedWO} Tickets</td>
                    <td style={{ fontWeight: 800, color: '#EF4444' }}>{row.openWO} Open</td>
                    <td style={{ fontWeight: 800, color: '#2563EB' }}>{row.avgResponseHours} Hours</td>
                    <td>
                      <span className="badge badge-normal" style={{ fontSize: '0.68rem' }}>
                        100% Target Met
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            
            {/* Column Chart (Vertical Bars) */}
            {chartType === 'column' && (
              <ComposedChart data={currentData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} onClick={(e) => e && e.activePayload && handleBarClick(e.activePayload[0].payload)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.8)" />
                <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} fontWeight={600} />
                <YAxis yAxisId="left" stroke="#64748B" fontSize={11} tickLine={false} fontWeight={600} />
                <YAxis yAxisId="right" orientation="right" stroke="#2563EB" fontSize={11} tickLine={false} unit="h" fontWeight={600} />
                <Tooltip content={<CustomTooltip />} />
                {visibleSeries.completedWO && (
                  <Bar yAxisId="left" dataKey="completedWO" fill="#00A878" radius={[6, 6, 0, 0]} name="Completed Work Orders" cursor="pointer" />
                )}
                {visibleSeries.openWO && (
                  <Bar yAxisId="left" dataKey="openWO" fill="#EF4444" radius={[6, 6, 0, 0]} name="Pending Tickets" cursor="pointer" />
                )}
                {visibleSeries.avgResponseHours && (
                  <Line yAxisId="right" type="monotone" dataKey="avgResponseHours" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: '#2563EB' }} name="Avg MTTR Response (Hours)" />
                )}
              </ComposedChart>
            )}

            {/* Horizontal Bar Chart */}
            {chartType === 'bar' && (
              <BarChart layout="vertical" data={currentData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }} onClick={(e) => e && e.activePayload && handleBarClick(e.activePayload[0].payload)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.8)" />
                <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} fontWeight={600} />
                <YAxis type="category" dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} fontWeight={600} />
                <Tooltip content={<CustomTooltip />} />
                {visibleSeries.completedWO && (
                  <Bar dataKey="completedWO" fill="#00A878" radius={[0, 6, 6, 0]} name="Completed Work Orders" cursor="pointer" />
                )}
                {visibleSeries.openWO && (
                  <Bar dataKey="openWO" fill="#EF4444" radius={[0, 6, 6, 0]} name="Pending Tickets" cursor="pointer" />
                )}
              </BarChart>
            )}

            {/* Pie / Donut Chart */}
            {chartType === 'pie' && (
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={currentData}
                  dataKey="completedWO"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  label={({ label, day, completedWO }) => `${label || day}: ${completedWO}`}
                  onClick={handleBarClick}
                  cursor="pointer"
                >
                  {currentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}

          </ResponsiveContainer>
        )}

      </div>

      {/* 3. Bottom Footer Section after Graph */}
      {chartType !== 'pie' && chartType !== 'table' && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '22px', width: '100%', flexWrap: 'wrap', paddingTop: '4px' }}>
          <button
            onClick={() => toggleSeries('completedWO')}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '2px 4px',
              color: visibleSeries.completedWO ? '#0F172A' : '#94A3B8',
              fontWeight: 500,
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: visibleSeries.completedWO ? 1 : 0.45,
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00A878', flexShrink: 0 }}></span>
            Completed Tickets
          </button>

          <button
            onClick={() => toggleSeries('openWO')}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '2px 4px',
              color: visibleSeries.openWO ? '#0F172A' : '#94A3B8',
              fontWeight: 500,
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: visibleSeries.openWO ? 1 : 0.45,
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', flexShrink: 0 }}></span>
            Pending Tickets
          </button>

          <button
            onClick={() => toggleSeries('avgResponseHours')}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '2px 4px',
              color: visibleSeries.avgResponseHours ? '#0F172A' : '#94A3B8',
              fontWeight: 500,
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: visibleSeries.avgResponseHours ? 1 : 0.45,
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB', flexShrink: 0 }}></span>
            Response MTTR (Hours)
          </button>
        </div>
      )}

    </div>
  );
}

// Custom Glass Tooltip Component
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '10px',
        padding: '10px 14px',
        color: '#FFFFFF',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        fontSize: '0.76rem'
      }}>
        <div style={{ fontWeight: 800, color: '#38BDF8', marginBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
          Period: {label || payload[0]?.payload?.day || payload[0]?.payload?.label}
        </div>
        {payload.map((pld, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', margin: '3px 0' }}>
            <span style={{ color: pld.color || pld.fill, fontWeight: 700 }}>{pld.name}:</span>
            <span style={{ fontWeight: 800 }}>{pld.value} {pld.unit || ''}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// Dynamic data generator for custom date ranges
const generateCustomRangeData = (startStr, endStr) => {
  if (!startStr || !endStr) return defaultDataSets.WEEK;

  const [sYear, sMonth, sDay] = startStr.split('-').map(Number);
  const [eYear, eMonth, eDay] = endStr.split('-').map(Number);

  const start = new Date(sYear, sMonth - 1, sDay);
  const end = new Date(eYear, eMonth - 1, eDay);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return defaultDataSets.WEEK;
  }

  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const result = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (diffDays <= 14) {
    for (let i = 0; i < diffDays; i++) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      const labelStr = `${monthNames[current.getMonth()]} ${String(current.getDate()).padStart(2, '0')}`;
      
      const seed = current.getDate() * 7 + (current.getMonth() + 1) * 13;
      const completedWO = 4 + (seed % 15);
      const openWO = 1 + (seed % 5);
      const avgResponseHours = Number((1.6 + (seed % 19) / 10).toFixed(1));

      result.push({
        label: labelStr,
        completedWO,
        openWO,
        avgResponseHours
      });
    }
  } else {
    const step = Math.ceil(diffDays / 8);
    for (let i = 0; i < diffDays; i += step) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      const labelStr = `${monthNames[current.getMonth()]} ${String(current.getDate()).padStart(2, '0')}`;

      const seed = current.getDate() * 7 + (current.getMonth() + 1) * 13;
      const completedWO = 10 + (seed % 22);
      const openWO = 2 + (seed % 6);
      const avgResponseHours = Number((1.5 + (seed % 20) / 10).toFixed(1));

      result.push({
        label: labelStr,
        completedWO,
        openWO,
        avgResponseHours
      });
    }
  }

  return result.length > 0 ? result : defaultDataSets.WEEK;
};

// Datasets categorized by Aggregation
const defaultDataSets = {
  TODAY: [
    { label: '00:00 - 04:00', completedWO: 1, openWO: 0, avgResponseHours: 1.2 },
    { label: '04:00 - 08:00', completedWO: 0, openWO: 1, avgResponseHours: 2.1 },
    { label: '08:00 - 12:00', completedWO: 2, openWO: 1, avgResponseHours: 1.5 },
    { label: '12:00 - 16:00', completedWO: 1, openWO: 0, avgResponseHours: 1.8 },
    { label: '16:00 - 20:00', completedWO: 1, openWO: 0, avgResponseHours: 2.0 },
    { label: '20:00 - 24:00', completedWO: 0, openWO: 0, avgResponseHours: 1.4 }
  ],
  '7D': [
    { label: 'Wed (19 Aug)', completedWO: 6, openWO: 1, avgResponseHours: 2.8 },
    { label: 'Thu (20 Aug)', completedWO: 3, openWO: 2, avgResponseHours: 3.2 },
    { label: 'Fri (21 Aug)', completedWO: 8, openWO: 1, avgResponseHours: 2.5 },
    { label: 'Sat (22 Aug)', completedWO: 5, openWO: 2, avgResponseHours: 2.9 },
    { label: 'Sun (23 Aug)', completedWO: 7, openWO: 1, avgResponseHours: 2.2 },
    { label: 'Mon (24 Aug)', completedWO: 6, openWO: 2, avgResponseHours: 2.4 },
    { label: 'Tue (25 Aug)', completedWO: 4, openWO: 2, avgResponseHours: 1.9 }
  ],
  '15D': [
    { label: '11 Aug', completedWO: 4, openWO: 1, avgResponseHours: 3.0 },
    { label: '13 Aug', completedWO: 5, openWO: 2, avgResponseHours: 2.8 },
    { label: '15 Aug', completedWO: 7, openWO: 1, avgResponseHours: 2.4 },
    { label: '17 Aug', completedWO: 6, openWO: 3, avgResponseHours: 3.1 },
    { label: '19 Aug', completedWO: 8, openWO: 1, avgResponseHours: 2.2 },
    { label: '21 Aug', completedWO: 9, openWO: 2, avgResponseHours: 2.0 },
    { label: '23 Aug', completedWO: 7, openWO: 1, avgResponseHours: 2.1 },
    { label: '25 Aug', completedWO: 5, openWO: 2, avgResponseHours: 1.8 }
  ],
  '30D': [
    { label: 'Week 1 (27 Jul - 2 Aug)', completedWO: 18, openWO: 4, avgResponseHours: 2.6 },
    { label: 'Week 2 (3 - 9 Aug)', completedWO: 24, openWO: 3, avgResponseHours: 2.2 },
    { label: 'Week 3 (10 - 16 Aug)', completedWO: 21, openWO: 5, avgResponseHours: 2.9 },
    { label: 'Week 4 (17 - 25 Aug)', completedWO: 32, openWO: 2, avgResponseHours: 1.8 }
  ],
  ALL: [
    { label: 'Jan', completedWO: 65, openWO: 12, avgResponseHours: 2.8 },
    { label: 'Feb', completedWO: 72, openWO: 8, avgResponseHours: 2.3 },
    { label: 'Mar', completedWO: 84, openWO: 10, avgResponseHours: 2.1 },
    { label: 'Apr', completedWO: 78, openWO: 14, avgResponseHours: 2.6 },
    { label: 'May', completedWO: 92, openWO: 6, avgResponseHours: 1.8 },
    { label: 'Jun', completedWO: 88, openWO: 9, avgResponseHours: 2.0 },
    { label: 'Jul', completedWO: 95, openWO: 7, avgResponseHours: 1.9 },
    { label: 'Aug', completedWO: 98, openWO: 4, avgResponseHours: 1.7 }
  ],
  DAY: [
    { label: '00:00 - 04:00', completedWO: 1, openWO: 0, avgResponseHours: 1.2 },
    { label: '04:00 - 08:00', completedWO: 0, openWO: 1, avgResponseHours: 2.1 },
    { label: '08:00 - 12:00', completedWO: 2, openWO: 1, avgResponseHours: 1.5 },
    { label: '12:00 - 16:00', completedWO: 1, openWO: 0, avgResponseHours: 1.8 },
    { label: '16:00 - 20:00', completedWO: 1, openWO: 0, avgResponseHours: 2.0 },
    { label: '20:00 - 24:00', completedWO: 0, openWO: 0, avgResponseHours: 1.4 }
  ],
  WEEK: [
    { label: 'Wed (19 Aug)', completedWO: 6, openWO: 1, avgResponseHours: 2.8 },
    { label: 'Thu (20 Aug)', completedWO: 3, openWO: 2, avgResponseHours: 3.2 },
    { label: 'Fri (21 Aug)', completedWO: 8, openWO: 1, avgResponseHours: 2.5 },
    { label: 'Sat (22 Aug)', completedWO: 5, openWO: 2, avgResponseHours: 2.9 },
    { label: 'Sun (23 Aug)', completedWO: 7, openWO: 1, avgResponseHours: 2.2 },
    { label: 'Mon (24 Aug)', completedWO: 6, openWO: 2, avgResponseHours: 2.4 },
    { label: 'Tue (25 Aug)', completedWO: 4, openWO: 2, avgResponseHours: 1.9 }
  ],
  MONTH: [
    { label: 'Jan', completedWO: 65, openWO: 12, avgResponseHours: 2.8 },
    { label: 'Feb', completedWO: 72, openWO: 8, avgResponseHours: 2.3 },
    { label: 'Mar', completedWO: 84, openWO: 10, avgResponseHours: 2.1 },
    { label: 'Apr', completedWO: 78, openWO: 14, avgResponseHours: 2.6 },
    { label: 'May', completedWO: 92, openWO: 6, avgResponseHours: 1.8 },
    { label: 'Jun', completedWO: 88, openWO: 9, avgResponseHours: 2.0 },
    { label: 'Jul', completedWO: 95, openWO: 7, avgResponseHours: 1.9 },
    { label: 'Aug', completedWO: 90, openWO: 5, avgResponseHours: 2.2 }
  ],
  YEAR: [
    { label: '2023', completedWO: 640, openWO: 85, avgResponseHours: 3.4 },
    { label: '2024', completedWO: 810, openWO: 52, avgResponseHours: 2.7 },
    { label: '2025', completedWO: 950, openWO: 34, avgResponseHours: 2.2 },
    { label: '2026', completedWO: 1120, openWO: 21, avgResponseHours: 1.8 }
  ]
};
