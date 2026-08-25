import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Plus, 
  Zap, 
  Wifi, 
  Wrench, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Table, 
  LayoutGrid, 
  Map, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  FileSpreadsheet, 
  FileText, 
  CheckSquare, 
  Square, 
  X, 
  MapPin,
  Filter,
  RotateCcw
} from 'lucide-react';
import GisMap from './GisMap';

export default function StationsManagement() {
  const { stations, setIsWoModalOpen, targetSearchResult, isDateInRange, dateFilter, triggerExportSuccess } = useApp();
  const [searchStn, setSearchStn] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table', 'cards', or 'map'
  const [sortField, setSortField] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedStationIds, setSelectedStationIds] = useState([]);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);

  // Column Filters state
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Auto-fill and filter when navigated from Global Search
  useEffect(() => {
    if (targetSearchResult?.module === 'stations') {
      setSearchStn(targetSearchResult.searchTerm || '');
      setCurrentPage(1);
    }
  }, [targetSearchResult]);

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter stations based on search, date & column filters
  const filteredStations = useMemo(() => {
    return stations.filter(s => {
      // Global Date Filter
      if (dateFilter !== 'ALL' && !searchStn) {
        if (!isDateInRange(s.lastInspectionDate || s.date || s.lastMaintenance)) return false;
      }

      const q = searchStn.toLowerCase();
      const matchesSearch = 
        !searchStn ||
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.code && s.code.toLowerCase().includes(q)) ||
        (s.siteName && s.siteName.toLowerCase().includes(q)) ||
        (s.type && s.type.toLowerCase().includes(q)) ||
        (s.assignedEngineer && s.assignedEngineer.toLowerCase().includes(q));
      if (!matchesSearch) return false;

      // Individual Column Filters
      for (const colKey in columnFilters) {
        const filterVal = columnFilters[colKey]?.trim().toLowerCase();
        if (filterVal) {
          const cellVal = String(s[colKey] || '').toLowerCase();
          if (!cellVal.includes(filterVal)) return false;
        }
      }

      return true;
    });
  }, [stations, searchStn, columnFilters, dateFilter, isDateInRange]);

  // Sort stations based on sortField & sortDirection
  const sortedStations = useMemo(() => {
    const data = [...filteredStations];
    data.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [filteredStations, sortField, sortDirection]);

  // Pagination calculations
  const totalRecords = sortedStations.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedStations = sortedStations.slice(startIndex, startIndex + pageSize);

  // Toggle Single Row Selection
  const handleToggleSelectRow = (id) => {
    setSelectedStationIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle All Filtered Rows Selection
  const handleToggleSelectAll = () => {
    if (selectedStationIds.length === paginatedStations.length) {
      setSelectedStationIds([]);
    } else {
      setSelectedStationIds(paginatedStations.map(s => s.id));
    }
  };

  // Column Sort Toggle Helper
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Export handler (CSV / PDF)
  const handleExport = (format) => {
    setIsExportDropdownOpen(false);

    const exportData = selectedStationIds.length > 0
      ? filteredStations.filter(s => selectedStationIds.includes(s.id))
      : filteredStations;

    if (exportData.length === 0) {
      alert('No station records available to export.');
      return;
    }

    if (format === 'csv') {
      const fileName = `Sharjah_EPA_Stations_${exportData.length}_Records.csv`;
      const headers = ['Station Code', 'Station Name', 'Type', 'Parent Site', 'Power Supply', 'Telemetry Link', 'Assigned Engineer', 'Status'];
      const rows = exportData.map(s => [
        `"${s.code || ''}"`,
        `"${s.name || ''}"`,
        `"${s.type || ''}"`,
        `"${s.siteName || ''}"`,
        `"${s.powerSource || ''}"`,
        `"${s.telemetry || ''}"`,
        `"${s.assignedEngineer || ''}"`,
        `"${s.status || ''}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (triggerExportSuccess) {
        triggerExportSuccess({
          filename: fileName,
          format: 'CSV',
          count: exportData.length,
          title: 'Station Directory Downloaded Successfully!'
        });
      }
    } else if (format === 'pdf') {
      if (triggerExportSuccess) {
        triggerExportSuccess({
          filename: `Sharjah_EPA_Stations_Report.pdf`,
          format: 'PDF',
          count: exportData.length,
          title: 'Stations Report Generated Successfully!'
        });
      }
      const printWindow = window.open('', '_blank');
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Sharjah EPA - Live Site Management Directory</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; color: #1e293b; }
              h1 { color: #00A878; font-size: 20px; margin-bottom: 4px; }
              p { color: #64748b; font-size: 12px; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 12px; }
              th, td { border: 1px solid #e2e8f0; padding: 8px 12px; font-size: 11px; text-align: left; }
              th { background-color: #f8fafc; color: #475569; font-weight: bold; }
              tr:nth-child(even) { background-color: #f8fafc; }
            </style>
          </head>
          <body>
            <h1>Sharjah Environment Protected Authority (Sharjah EPA)</h1>
            <p>Live Site Management & Remote Telemetry Directory • Generated on ${new Date().toLocaleDateString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Station Name</th>
                  <th>Type</th>
                  <th>Site</th>
                  <th>Power Source</th>
                  <th>Telemetry</th>
                  <th>Engineer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${exportData.map(s => `
                  <tr>
                    <td><strong>${s.code || ''}</strong></td>
                    <td>${s.name || ''}</td>
                    <td>${s.type || ''}</td>
                    <td>${s.siteName || ''}</td>
                    <td>${s.powerSource || ''}</td>
                    <td>${s.telemetry || ''}</td>
                    <td>${s.assignedEngineer || ''}</td>
                    <td>${s.status || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Main Container */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>

        {/* Top Header Toolbar: Search, Export Dropdown, View Mode Switcher, Add Station CTA */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '12px', 
          marginBottom: '16px', 
          borderBottom: '1px solid #E2E8F0', 
          paddingBottom: '16px',
          width: '100%'
        }}>
          
          {/* Left: Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 1 340px', minWidth: '240px' }}>
            <div className="page-header-search" style={{ margin: 0, width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search station, code, site, engineer..." 
                value={searchStn}
                onChange={(e) => {
                  setSearchStn(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ paddingLeft: '36px', fontSize: '0.8rem', background: '#FFFFFF' }}
              />
            </div>
          </div>

          {/* Right Controls: Column Filters + Export Dropdown + View Mode Switcher + Add Monitoring Station CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginLeft: 'auto' }}>
            {/* Column Filters Toggle Button */}
            <button
              type="button"
              onClick={() => setShowColumnFilters(prev => !prev)}
              style={{
                height: '36px',
                padding: '0 14px',
                borderRadius: '8px',
                border: showColumnFilters ? '1.5px solid #00A878' : '1px solid #CBD5E1',
                background: showColumnFilters ? '#E6F4EA' : '#FFFFFF',
                color: showColumnFilters ? '#00A878' : '#334155',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease'
              }}
            >
              <Filter size={14} color={showColumnFilters ? '#00A878' : '#64748B'} />
              <span>Column Filters</span>
              {Object.values(columnFilters).some(v => v) && (
                <span style={{ background: '#00A878', color: '#FFF', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.62rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {Object.values(columnFilters).filter(v => v).length}
                </span>
              )}
            </button>
            
            {/* Export Dropdown Button */}
            <div ref={exportDropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsExportDropdownOpen(prev => !prev)}
                style={{
                  height: '36px',
                  padding: '0 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  boxSizing: 'border-box'
                }}
              >
                <Download size={14} color="#00A878" />
                <span>Export {selectedStationIds.length > 0 ? `(${selectedStationIds.length})` : ''}</span>
                <ChevronDown size={14} color="#64748B" />
              </button>

              {isExportDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  right: 0,
                  zIndex: 9999,
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  width: '190px',
                  padding: '6px 0',
                  fontSize: '0.76rem'
                }}>
                  <div style={{ padding: '6px 12px', fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', borderBottom: '1px solid #F1F5F9', textTransform: 'uppercase' }}>
                    {selectedStationIds.length > 0 ? `Selected Stations (${selectedStationIds.length})` : `All Filtered (${filteredStations.length})`}
                  </div>
                  <div 
                    onClick={() => handleExport('csv')} 
                    style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1E293B', transition: 'background 0.15s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} 
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <FileSpreadsheet size={15} color="#00A878" /> Export as CSV
                  </div>
                  <div 
                    onClick={() => handleExport('pdf')} 
                    style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1E293B', transition: 'background 0.15s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} 
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <FileText size={15} color="#EF4444" /> Export as PDF
                  </div>
                </div>
              )}
            </div>

            {/* View Mode Toggle Switch (Table View, Card View, Map View) */}
            <div style={{ display: 'flex', background: '#F8FAFC', padding: '3px', borderRadius: '8px', border: '1px solid #CBD5E1', height: '36px', boxSizing: 'border-box' }}>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: viewMode === 'table' ? '#E6F6F2' : 'transparent',
                  color: viewMode === 'table' ? '#00A878' : '#64748B',
                  transition: 'all 0.15s ease'
                }}
              >
                <Table size={15} /> Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: viewMode === 'cards' ? '#E6F6F2' : 'transparent',
                  color: viewMode === 'cards' ? '#00A878' : '#64748B',
                  transition: 'all 0.15s ease'
                }}
              >
                <LayoutGrid size={15} /> Card View
              </button>
              <button
                onClick={() => setViewMode('map')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: viewMode === 'map' ? '#E6F6F2' : 'transparent',
                  color: viewMode === 'map' ? '#00A878' : '#64748B',
                  transition: 'all 0.15s ease'
                }}
              >
                <Map size={15} /> Map View
              </button>
            </div>

            {/* Add Monitoring Station CTA Button */}
            <button 
              className="btn btn-epa" 
              style={{ 
                height: '36px', 
                padding: '0 16px', 
                fontSize: '0.76rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box'
              }}
            >
              <Plus size={16} /> Add Monitoring Station
            </button>

          </div>
        </div>

        {/* Selected Items Counter Bar */}
        {selectedStationIds.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 16px',
            marginBottom: '14px',
            background: '#E6F6F2',
            border: '1px solid rgba(0, 168, 120, 0.3)',
            borderRadius: '10px',
            color: '#00A878',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={16} />
              <span>Selected {selectedStationIds.length} station(s) for bulk export or dispatch</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleExport('csv')}
                style={{ background: '#00A878', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Export Selected ({selectedStationIds.length})
              </button>
              <button 
                onClick={() => setSelectedStationIds([])} 
                style={{ background: 'transparent', color: '#64748B', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem' }}
              >
                <X size={14} /> Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Cards View Column Filters Panel */}
        {viewMode === 'cards' && showColumnFilters && (
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '14px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color="#00A878" /> Filter Station Cards:
            </div>
            <input
              type="text"
              placeholder="Filter Code..."
              value={columnFilters.code || ''}
              onChange={(e) => { setColumnFilters(p => ({ ...p, code: e.target.value })); setCurrentPage(1); }}
              style={{ padding: '5px 10px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }}
            />
            <input
              type="text"
              placeholder="Filter Name..."
              value={columnFilters.name || ''}
              onChange={(e) => { setColumnFilters(p => ({ ...p, name: e.target.value })); setCurrentPage(1); }}
              style={{ padding: '5px 10px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }}
            />
            <input
              type="text"
              placeholder="Filter Parent Site..."
              value={columnFilters.siteName || ''}
              onChange={(e) => { setColumnFilters(p => ({ ...p, siteName: e.target.value })); setCurrentPage(1); }}
              style={{ padding: '5px 10px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }}
            />
            <input
              type="text"
              placeholder="Filter Power..."
              value={columnFilters.powerSource || ''}
              onChange={(e) => { setColumnFilters(p => ({ ...p, powerSource: e.target.value })); setCurrentPage(1); }}
              style={{ padding: '5px 10px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }}
            />
            <input
              type="text"
              placeholder="Filter Status..."
              value={columnFilters.status || ''}
              onChange={(e) => { setColumnFilters(p => ({ ...p, status: e.target.value })); setCurrentPage(1); }}
              style={{ padding: '5px 10px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }}
            />
            {Object.values(columnFilters).some(v => v) && (
              <button
                type="button"
                onClick={() => setColumnFilters({})}
                style={{
                  background: '#FEE2E2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RotateCcw size={12} /> Clear Filters
              </button>
            )}
          </div>
        )}

        {/* VIEW MODE 1: Table View */}
        {viewMode === 'table' && (
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="epa-table">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title={isAllPaginatedSelected ? 'Deselect All on Page' : 'Select All on Page'}
                    >
                      {isAllPaginatedSelected ? (
                        <CheckSquare size={16} color="#00A878" />
                      ) : (
                        <Square size={16} color="#94A3B8" />
                      )}
                    </button>
                  </th>
                  <th onClick={() => handleSort('code')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Station Code {renderSortIcon('code')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Station Name & Type {renderSortIcon('name')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('siteName')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Parent Site {renderSortIcon('siteName')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('powerSource')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Power Supply {renderSortIcon('powerSource')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('telemetry')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Telemetry Link {renderSortIcon('telemetry')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('assignedEngineer')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Assigned Lead Engineer {renderSortIcon('assignedEngineer')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Status {renderSortIcon('status')}
                    </div>
                  </th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>

                {/* Sub-Header Column Filter Inputs */}
                {showColumnFilters && (
                  <tr style={{ background: '#F8FAFC' }}>
                    <th style={{ textAlign: 'center' }}>
                      {Object.values(columnFilters).some(v => v) && (
                        <button
                          type="button"
                          onClick={() => setColumnFilters({})}
                          title="Clear column filters"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: 0 }}
                        >
                          <RotateCcw size={13} />
                        </button>
                      )}
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Code..."
                        value={columnFilters.code || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, code: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Name..."
                        value={columnFilters.name || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, name: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Site..."
                        value={columnFilters.siteName || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, siteName: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Power..."
                        value={columnFilters.powerSource || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, powerSource: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Telemetry..."
                        value={columnFilters.telemetry || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, telemetry: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Engineer..."
                        value={columnFilters.assignedEngineer || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, assignedEngineer: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Status..."
                        value={columnFilters.status || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, status: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th />
                  </tr>
                )}
              </thead>
              <tbody>
                {paginatedStations.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '32px 16px', color: '#94A3B8' }}>
                      No field monitoring station records found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedStations.map((stn) => {
                    const isSelected = selectedStationIds.includes(stn.id);
                    return (
                      <tr 
                        key={stn.id}
                        style={{
                          background: isSelected ? '#F0FDF4' : 'transparent',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => toggleSelectRow(stn.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            {isSelected ? (
                              <CheckSquare size={16} color="#00A878" />
                            ) : (
                              <Square size={16} color="#CBD5E1" />
                            )}
                          </button>
                        </td>

                        <td style={{ fontWeight: 700, color: '#00A878', fontFamily: 'monospace' }}>
                          {stn.code}
                        </td>

                        <td>
                          <div style={{ fontWeight: 700, color: '#1F2937' }}>{stn.name}</div>
                          <div style={{ fontSize: '0.74rem', color: '#6B7280' }}>{stn.type}</div>
                        </td>

                        <td style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                          {stn.siteName}
                        </td>

                        <td style={{ fontSize: '0.8rem', color: '#1F2937' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Zap size={14} color="#D97706" /> {stn.powerSource}
                          </div>
                        </td>

                        <td style={{ fontSize: '0.8rem', color: '#1F2937' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Wifi size={14} color="#2563EB" /> {stn.telemetry}
                          </div>
                        </td>

                        <td style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                          {stn.assignedEngineer}
                        </td>

                        <td>
                          <span className={`badge badge-${stn.status.toLowerCase().replace(' ', '-')}`}>
                            {stn.status}
                          </span>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <button 
                            onClick={() => setIsWoModalOpen(true)}
                            className="btn btn-secondary" 
                            style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                          >
                            <Wrench size={12} /> Dispatch
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW MODE 2: Card View */}
        {viewMode === 'cards' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {paginatedStations.map((stn) => {
              const isSelected = selectedStationIds.includes(stn.id);
              return (
                <div 
                  key={stn.id}
                  style={{
                    background: isSelected ? '#F0FDF4' : '#FFFFFF',
                    border: isSelected ? '1px solid #00A878' : '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Top Row: Checkbox, Code, Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => toggleSelectRow(stn.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          {isSelected ? <CheckSquare size={16} color="#00A878" /> : <Square size={16} color="#CBD5E1" />}
                        </button>
                        <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#00A878', fontFamily: 'monospace' }}>
                          {stn.code}
                        </span>
                      </div>
                      <span className={`badge badge-${stn.status.toLowerCase().replace(' ', '-')}`}>
                        {stn.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                      {stn.name}
                    </h4>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: '12px' }}>
                      Type: {stn.type}
                    </div>

                    {/* Site & Tech Info */}
                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px', marginBottom: '12px', fontSize: '0.76rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#64748B' }}>Parent Site:</span>
                        <strong style={{ color: '#0F172A' }}>{stn.siteName}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#64748B' }}>Power:</span>
                        <strong style={{ color: '#D97706' }}>{stn.powerSource}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748B' }}>Telemetry:</span>
                        <strong style={{ color: '#2563EB' }}>{stn.telemetry}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Engineer & Action */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      Engineer: <strong style={{ color: '#334155' }}>{stn.assignedEngineer}</strong>
                    </div>
                    <button 
                      onClick={() => setIsWoModalOpen(true)}
                      className="btn btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                    >
                      <Wrench size={12} /> Dispatch
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW MODE 3: Map View */}
        {viewMode === 'map' && (
          <div style={{ height: '560px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
            <GisMap mode="stations" selectedId={null} />
          </div>
        )}

        {/* Pagination & Records Footer (Left Records info, Right Page Navigation) */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '12px', 
          padding: '12px 18px', 
          background: '#FFFFFF', 
          border: '1px solid #E2E8F0', 
          borderRadius: '10px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          marginTop: '16px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          
          {/* Bottom Left: View Records (10, 50, 100, 500) Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
            <span>View records:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#0F172A',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
            <span style={{ color: '#CBD5E1' }}>|</span>
            <span>Showing <strong style={{ color: '#0F172A' }}>{totalRecords > 0 ? startIndex + 1 : 0}</strong> to <strong style={{ color: '#0F172A' }}>{endIndex}</strong> of <strong style={{ color: '#0F172A' }}>{totalRecords}</strong> station records</span>
          </div>

          {/* Bottom Right: Pagination Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage === 1}
              title="First Page"
              style={{
                padding: '6px 9px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: safeCurrentPage === 1 ? '#F8FAFC' : '#FFFFFF',
                color: safeCurrentPage === 1 ? '#94A3B8' : '#334155',
                cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronsLeft size={14} />
            </button>

            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={safeCurrentPage === 1}
              title="Previous Page"
              style={{
                padding: '6px 9px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: safeCurrentPage === 1 ? '#F8FAFC' : '#FFFFFF',
                color: safeCurrentPage === 1 ? '#94A3B8' : '#334155',
                cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronLeft size={14} />
            </button>

            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', padding: '0 8px' }}>
              Page {safeCurrentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={safeCurrentPage === totalPages}
              title="Next Page"
              style={{
                padding: '6px 9px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: safeCurrentPage === totalPages ? '#F8FAFC' : '#FFFFFF',
                color: safeCurrentPage === totalPages ? '#94A3B8' : '#334155',
                cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronRight size={14} />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage === totalPages}
              title="Last Page"
              style={{
                padding: '6px 9px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: safeCurrentPage === totalPages ? '#F8FAFC' : '#FFFFFF',
                color: safeCurrentPage === totalPages ? '#94A3B8' : '#334155',
                cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronsRight size={14} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
