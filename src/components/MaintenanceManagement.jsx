import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Plus, Table, LayoutGrid, Map, User, Clock, 
  Download, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  FileSpreadsheet, FileText, Phone, UserCheck, X, PhoneCall,
  Filter, RotateCcw
} from 'lucide-react';
import GisMap from './GisMap';

export default function MaintenanceManagement() {
  const { workOrders, setIsWoModalOpen, targetSearchResult, isDateInRange, dateFilter, getDateRangeLabel, triggerExportSuccess } = useApp();

  // Search & Filter state
  const [searchWO, setSearchWO] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards' | 'map'

  // Column Filters state
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});

  // Auto-fill and filter when navigated from Global Search
  useEffect(() => {
    if (targetSearchResult?.module === 'maintenance') {
      setSearchWO(targetSearchResult.searchTerm || '');
      setCurrentPage(1);
    }
  }, [targetSearchResult]);

  // Sorting state
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  // Call Modal state
  const [activeCallModal, setActiveCallModal] = useState(null);

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Export dropdown ref & state
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter & Sort work orders
  const filteredWOs = useMemo(() => {
    return workOrders.filter(wo => {
      // Date filter check (if user is not explicitly searching by keyword)
      if (!searchWO && dateFilter !== 'ALL') {
        if (!isDateInRange(wo.createdDate || wo.dueDate)) return false;
      }

      // Search filter
      const q = searchWO.toLowerCase();
      const matchesSearch = 
        !searchWO ||
        (wo.id && wo.id.toLowerCase().includes(q)) ||
        (wo.title && wo.title.toLowerCase().includes(q)) ||
        (wo.siteName && wo.siteName.toLowerCase().includes(q)) ||
        (wo.assetName && wo.assetName.toLowerCase().includes(q)) ||
        (wo.assignedTo && wo.assignedTo.toLowerCase().includes(q)) ||
        (wo.contactPerson && wo.contactPerson.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Status filter
      if (filterStatus !== 'ALL' && wo.status !== filterStatus) return false;

      // Individual Column Filters
      for (const colKey in columnFilters) {
        const filterVal = columnFilters[colKey]?.trim().toLowerCase();
        if (filterVal) {
          let cellVal = '';
          if (colKey === 'title') cellVal = `${wo.title || ''} ${wo.siteName || ''}`.toLowerCase();
          else cellVal = String(wo[colKey] || '').toLowerCase();
          
          if (!cellVal.includes(filterVal)) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [workOrders, searchWO, filterStatus, sortField, sortDirection]);

  // Pagination math
  const totalRecords = filteredWOs.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);

  const paginatedWOs = useMemo(() => {
    return filteredWOs.slice(startIndex, endIndex);
  }, [filteredWOs, startIndex, endIndex]);

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown size={12} style={{ color: '#94A3B8', opacity: 0.6 }} />;
    return sortDirection === 'asc' ? <ArrowUp size={13} style={{ color: '#00A878' }} /> : <ArrowDown size={13} style={{ color: '#00A878' }} />;
  };

  // Export CSV / PDF handler
  const handleExport = (format) => {
    setIsExportDropdownOpen(false);

    if (filteredWOs.length === 0) {
      alert('No work order records available to export.');
      return;
    }

    if (format === 'csv') {
      const fileName = `Sharjah_EPA_WorkOrders_${filteredWOs.length}_Records.csv`;
      const headers = ['Ticket ID', 'Maintenance Type', 'Task Title & Station', 'Target Asset', 'Priority', 'Status', 'Assigned Technician', 'SLA Timer', 'Contact Person', 'Phone Number'];
      const rows = filteredWOs.map(w => [
        `"${w.id || ''}"`,
        `"${w.type || ''}"`,
        `"${w.title || ''}"`,
        `"${w.siteName || ''}"`,
        `"${w.assetName || ''}"`,
        `"${w.priority || ''}"`,
        `"${w.status || ''}"`,
        `"${w.assignedTo || ''}"`,
        `"${w.slaTimeRemaining || ''}"`,
        `"${w.contactPerson || w.assignedTo || ''}"`,
        `"${w.contactPhone || '+971 50 492 8812'}"`
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
          count: filteredWOs.length,
          title: 'Work Orders Downloaded Successfully!'
        });
      }
    } else if (format === 'pdf') {
      if (triggerExportSuccess) {
        triggerExportSuccess({
          filename: `Sharjah_EPA_WorkOrders_Report.pdf`,
          format: 'PDF',
          count: filteredWOs.length,
          title: 'Work Orders Report Generated Successfully!'
        });
      }
      window.print();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Main Work Orders Panel Container */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>

        {/* Top Toolbar Inside Panel Container */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', width: '100%' }}>
          
          {/* Left: Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 1 300px', minWidth: '220px' }}>
            <div className="page-header-search" style={{ margin: 0, width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search ticket ID, title, station, contact..." 
                value={searchWO}
                onChange={(e) => {
                  setSearchWO(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ paddingLeft: '36px', fontSize: '0.8rem', background: '#FFFFFF' }}
              />
            </div>
          </div>

          {/* Right Controls: Export + View Modes + Create Work Order CTA */}
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
                <span>Export</span>
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
                    All Filtered ({filteredWOs.length})
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

            {/* View Mode Switcher Toggle */}
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
                  height: '28px',
                  background: viewMode === 'table' ? '#00A878' : 'transparent',
                  color: viewMode === 'table' ? '#FFFFFF' : '#64748B',
                  transition: 'all 0.15s ease'
                }}
              >
                <Table size={14} /> Table
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
                  height: '28px',
                  background: viewMode === 'cards' ? '#00A878' : 'transparent',
                  color: viewMode === 'cards' ? '#FFFFFF' : '#64748B',
                  transition: 'all 0.15s ease'
                }}
              >
                <LayoutGrid size={14} /> Cards
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
                  height: '28px',
                  background: viewMode === 'map' ? '#00A878' : 'transparent',
                  color: viewMode === 'map' ? '#FFFFFF' : '#64748B',
                  transition: 'all 0.15s ease'
                }}
              >
                <Map size={14} /> Map
              </button>
            </div>

            {/* Create Work Order CTA */}
            <button 
              onClick={() => setIsWoModalOpen(true)} 
              style={{
                height: '36px',
                padding: '0 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #00A878 0%, #008F66 100%)',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 168, 120, 0.25)',
                boxSizing: 'border-box'
              }}
            >
              <Plus size={16} /> Create Work Order
            </button>
          </div>
        </div>

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
              <Filter size={14} color="#00A878" /> Filter Work Order Cards:
            </div>
            <input
              type="text"
              placeholder="Filter Ticket ID..."
              value={columnFilters.id || ''}
              onChange={(e) => { setColumnFilters(p => ({ ...p, id: e.target.value })); setCurrentPage(1); }}
              style={{ padding: '5px 10px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }}
            />
            <input
              type="text"
              placeholder="Filter Task Title..."
              value={columnFilters.title || ''}
              onChange={(e) => { setColumnFilters(p => ({ ...p, title: e.target.value })); setCurrentPage(1); }}
              style={{ padding: '5px 10px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }}
            />
            <input
              type="text"
              placeholder="Filter Asset..."
              value={columnFilters.assetName || ''}
              onChange={(e) => { setColumnFilters(p => ({ ...p, assetName: e.target.value })); setCurrentPage(1); }}
              style={{ padding: '5px 10px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }}
            />
            <input
              type="text"
              placeholder="Filter Assignee..."
              value={columnFilters.assignedTo || ''}
              onChange={(e) => { setColumnFilters(p => ({ ...p, assignedTo: e.target.value })); setCurrentPage(1); }}
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

        {/* View Mode 1: Table View (Now with CONTACT PERSON and CALL columns) */}
        {viewMode === 'table' && (
          <div className="table-responsive">
            <table className="epa-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      TICKET ID {renderSortIcon('id')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      TASK TITLE & STATION {renderSortIcon('title')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('assetName')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      TARGET ASSET {renderSortIcon('assetName')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      PRIORITY {renderSortIcon('priority')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      STATUS {renderSortIcon('status')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('assignedTo')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ASSIGNED TECHNICIAN {renderSortIcon('assignedTo')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('slaTimeRemaining')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      SLA TIMER {renderSortIcon('slaTimeRemaining')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('contactPerson')} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      CONTACT PERSON {renderSortIcon('contactPerson')}
                    </div>
                  </th>
                  <th style={{ textAlign: 'center', width: '90px', whiteSpace: 'nowrap' }}>
                    CALL
                  </th>
                </tr>

                {/* Sub-Header Column Filter Inputs */}
                {showColumnFilters && (
                  <tr style={{ background: '#F8FAFC' }}>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter ID..."
                        value={columnFilters.id || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, id: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Task..."
                        value={columnFilters.title || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, title: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Asset..."
                        value={columnFilters.assetName || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, assetName: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Priority..."
                        value={columnFilters.priority || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, priority: e.target.value })); setCurrentPage(1); }}
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
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Assignee..."
                        value={columnFilters.assignedTo || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, assignedTo: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter SLA..."
                        value={columnFilters.slaTimeRemaining || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, slaTimeRemaining: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Contact..."
                        value={columnFilters.contactPerson || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, contactPerson: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
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
                  </tr>
                )}
              </thead>
              <tbody>
                {paginatedWOs.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '32px 16px', color: '#64748B' }}>
                      No work orders found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedWOs.map((wo) => {
                    const contactName = wo.contactPerson || `Eng. ${wo.assignedTo}`;
                    const contactPhone = wo.contactPhone || '+971 50 492 8812';

                    return (
                      <tr key={wo.id}>
                        <td>
                          <span style={{ fontWeight: 700, color: '#00A878', fontFamily: 'monospace' }}>{wo.id}</span>
                          <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{wo.type}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#1F2937' }}>{wo.title}</div>
                          <div style={{ fontSize: '0.74rem', color: '#6B7280' }}>{wo.siteName}</div>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                          {wo.assetName}
                        </td>
                        <td>
                          <span className={`badge ${wo.priority === 'Critical' ? 'badge-critical' : wo.priority === 'High' ? 'badge-warning' : 'badge-blue'}`}>
                            {wo.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${wo.status === 'Completed' ? 'badge-passed' : wo.status === 'In Progress' ? 'badge-blue' : 'badge-pending'}`}>
                            {wo.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={14} color="#0891B2" /> {wo.assignedTo}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: wo.slaTimeRemaining?.includes('Urgent') ? '#DC2626' : '#00A878', fontWeight: 700 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} /> {wo.slaTimeRemaining}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <UserCheck size={14} color="#00A878" />
                            {contactName}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => setActiveCallModal({ wo, contactName, contactPhone })}
                            title={`Call ${contactName} (${contactPhone})`}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              border: '1px solid rgba(0, 168, 120, 0.4)',
                              background: 'rgba(0, 168, 120, 0.08)',
                              color: '#00A878',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <Phone size={13} color="#00A878" /> Call
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

        {/* View Mode 2: Grid Cards View */}
        {viewMode === 'cards' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '16px', marginTop: '12px' }}>
            {paginatedWOs.map((wo) => {
              const contactName = wo.contactPerson || `Eng. ${wo.assignedTo}`;
              const contactPhone = wo.contactPhone || '+971 50 492 8812';

              return (
                <div 
                  key={wo.id} 
                  className="glass-panel" 
                  style={{ 
                    padding: '16px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: '#00A878', fontFamily: 'monospace', fontSize: '0.85rem' }}>{wo.id}</span>
                    <span className={`badge ${wo.status === 'Completed' ? 'badge-passed' : wo.status === 'In Progress' ? 'badge-blue' : 'badge-pending'}`}>
                      {wo.status}
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>{wo.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#475569' }}>📍 {wo.siteName} • {wo.assetName}</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '6px 10px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.76rem' }}>
                    <span><strong>Priority:</strong> <span className={`badge ${wo.priority === 'Critical' ? 'badge-critical' : wo.priority === 'High' ? 'badge-warning' : 'badge-blue'}`}>{wo.priority}</span></span>
                    <span style={{ color: wo.slaTimeRemaining?.includes('Urgent') ? '#DC2626' : '#00A878', fontWeight: 700 }}>⏳ {wo.slaTimeRemaining}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                      👤 <strong>{contactName}</strong>
                    </div>
                    <button
                      onClick={() => setActiveCallModal({ wo, contactName, contactPhone })}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(0, 168, 120, 0.4)',
                        background: 'rgba(0, 168, 120, 0.08)',
                        color: '#00A878',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Phone size={13} color="#00A878" /> Call
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Mode 3: GIS Map View */}
        {viewMode === 'map' && (
          <div style={{ height: '520px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0', marginTop: '8px' }}>
            <GisMap />
          </div>
        )}

        {/* Standardized Bottom Pagination Bar INSIDE Panel (Matches SitesManagement) */}
        <div style={{ 
          display: 'flex', 
          justify: 'space-between', 
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
          
          {/* Left: View records (10, 50, 100, 500) Dropdown & Record Count */}
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
            <span>Showing <strong style={{ color: '#0F172A' }}>{totalRecords > 0 ? startIndex + 1 : 0}</strong> to <strong style={{ color: '#0F172A' }}>{endIndex}</strong> of <strong style={{ color: '#0F172A' }}>{totalRecords}</strong> work order records</span>
          </div>

          {/* Right: Pagination Navigation Controls */}
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

      {/* Direct Call / Contact Modal Popup */}
      {activeCallModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px'
        }}>
          <div className="glass-panel" style={{
            width: '420px',
            maxWidth: '100%',
            padding: '24px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneCall size={20} color="#00A878" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Initiate Direct Call
                </h3>
              </div>
              <button 
                onClick={() => setActiveCallModal(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', marginBottom: '20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00A878 0%, #008F66 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                margin: '0 auto 12px auto',
                boxShadow: '0 4px 14px rgba(0, 168, 120, 0.3)'
              }}>
                {activeCallModal.contactName.split(' ').pop()?.[0] || 'T'}
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                {activeCallModal.contactName}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
                Lead Field Technician • Sharjah EPA
              </div>
              
              <div style={{ 
                margin: '14px auto 0 auto', 
                display: 'inline-block',
                padding: '6px 14px', 
                background: '#F8FAFC', 
                borderRadius: '20px', 
                border: '1px solid #CBD5E1',
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#00A878',
                fontFamily: 'monospace'
              }}>
                {activeCallModal.contactPhone}
              </div>

              <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '10px' }}>
                Ref Ticket: <strong>{activeCallModal.wo.id}</strong> ({activeCallModal.wo.siteName})
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => setActiveCallModal(null)} 
                className="btn btn-secondary" 
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
              <a 
                href={`tel:${activeCallModal.contactPhone.replace(/\s+/g, '')}`}
                onClick={() => setTimeout(() => setActiveCallModal(null), 1000)}
                className="btn btn-epa" 
                style={{ flex: 1, justifyContent: 'center', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Phone size={15} /> Call Now
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
