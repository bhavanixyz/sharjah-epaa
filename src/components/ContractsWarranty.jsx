import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Plus, Table, Map, Download, ChevronDown, 
  ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, FileSpreadsheet, FileText, X,
  Filter, RotateCcw
} from 'lucide-react';
import GisMap from './GisMap';

export default function ContractsWarranty() {
  const { contracts, setContracts, targetSearchResult, isDateInRange, dateFilter, triggerExportSuccess } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'map'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Column Filters state
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});

  // Auto-fill and filter when navigated from Global Search
  useEffect(() => {
    if (targetSearchResult?.module === 'contracts') {
      setSearchQuery(targetSearchResult.searchTerm || '');
      setCurrentPage(1);
    }
  }, [targetSearchResult]);

  // Sorting state
  const [sortField, setSortField] = useState('endDate');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Export dropdown ref & state
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);

  // Form State for New Contract
  const [title, setTitle] = useState('');
  const [vendor, setVendor] = useState('Thermo Fisher Scientific Middle East');
  const [contractType, setContractType] = useState('Comprehensive AMC');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [value, setValue] = useState('$85,000');
  const [slaResponseTime, setSlaResponseTime] = useState('4 Hours (Emergency)');

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

  const handleAddContract = (e) => {
    e.preventDefault();
    const newContract = {
      id: `cnt-${Date.now().toString().slice(-4)}`,
      title: title || 'Environmental Equipment Support Contract',
      vendor,
      contractType,
      startDate,
      endDate,
      value: value.startsWith('$') ? value : `$${value}`,
      status: 'Active',
      slaResponseTime,
      date: startDate || '2026-08-25',
      lastAuditDate: '2026-08-25'
    };

    if (setContracts) {
      setContracts([newContract, ...contracts]);
    }
    setIsModalOpen(false);
    setTitle('');
  };

  // Filter & Sort Contracts
  const filteredContracts = useMemo(() => {
    return (contracts || []).filter(cnt => {
      // Global Date Filter
      if (dateFilter !== 'ALL' && !searchQuery) {
        if (!isDateInRange(cnt.startDate || cnt.date || cnt.lastAuditDate || cnt.endDate)) return false;
      }

      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        (cnt.id && cnt.id.toLowerCase().includes(q)) ||
        (cnt.title && cnt.title.toLowerCase().includes(q)) ||
        (cnt.vendor && cnt.vendor.toLowerCase().includes(q)) ||
        (cnt.contractType && cnt.contractType.toLowerCase().includes(q)) ||
        (cnt.status && cnt.status.toLowerCase().includes(q)) ||
        (cnt.slaResponseTime && cnt.slaResponseTime.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Individual Column Filters
      for (const colKey in columnFilters) {
        const filterVal = columnFilters[colKey]?.trim().toLowerCase();
        if (filterVal) {
          let cellVal = '';
          if (colKey === 'title') cellVal = `${cnt.title || ''} ${cnt.vendor || ''}`.toLowerCase();
          else if (colKey === 'startDate') cellVal = `${cnt.startDate || ''} ${cnt.endDate || ''}`.toLowerCase();
          else cellVal = String(cnt[colKey] || '').toLowerCase();
          
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
  }, [contracts, searchQuery, sortField, sortDirection]);

  // Pagination calculations
  const totalRecords = filteredContracts.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);

  const paginatedContracts = useMemo(() => {
    return filteredContracts.slice(startIndex, endIndex);
  }, [filteredContracts, startIndex, endIndex]);

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

    if (filteredContracts.length === 0) {
      alert('No contract records available to export.');
      return;
    }

    if (format === 'csv') {
      const fileName = `Sharjah_EPA_Contracts_${filteredContracts.length}_Records.csv`;
      const headers = ['Contract ID', 'Contract Title', 'Vendor', 'Type', 'Start Date', 'End Date', 'Value', 'SLA Response', 'Status'];
      const rows = filteredContracts.map(cnt => [
        `"${cnt.id || ''}"`,
        `"${cnt.title || ''}"`,
        `"${cnt.vendor || ''}"`,
        `"${cnt.contractType || ''}"`,
        `"${cnt.startDate || ''}"`,
        `"${cnt.endDate || ''}"`,
        `"${cnt.value || ''}"`,
        `"${cnt.slaResponseTime || ''}"`,
        `"${cnt.status || ''}"`
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
          count: filteredContracts.length,
          title: 'Contracts & Warranty Downloaded Successfully!'
        });
      }
    } else if (format === 'pdf') {
      if (triggerExportSuccess) {
        triggerExportSuccess({
          filename: `Sharjah_EPA_Contracts_Report.pdf`,
          format: 'PDF',
          count: filteredContracts.length,
          title: 'Contracts Report Generated Successfully!'
        });
      }
      window.print();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Main Glass Panel Container (Identical to Work Orders & SLA) */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>

        {/* Top Toolbar Inside Panel Container */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', width: '100%' }}>
          
          {/* Left: Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 1 320px', minWidth: '220px' }}>
            <div className="page-header-search" style={{ margin: 0, width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search contract ID, title, vendor, type..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ paddingLeft: '36px', fontSize: '0.8rem', background: '#FFFFFF' }}
              />
            </div>
          </div>

          {/* Right Controls: Export + View Modes + Register Contract CTA */}
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
                    All Filtered ({filteredContracts.length})
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

            {/* Register Contract CTA */}
            <button 
              onClick={() => setIsModalOpen(true)} 
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
              <Plus size={16} /> Register New Contract
            </button>
          </div>
        </div>

        {/* View Mode 1: Table View (Matching Work Orders & SLA Enterprise Layout) */}
        {viewMode === 'table' && (
          <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
            <table className="epa-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      CONTRACT ID {renderSortIcon('id')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      CONTRACT TITLE & VENDOR {renderSortIcon('title')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('contractType')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      TYPE {renderSortIcon('contractType')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('startDate')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      DURATION {renderSortIcon('startDate')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('value')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      CONTRACT VALUE {renderSortIcon('value')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('slaResponseTime')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      SLA RESPONSE TERM {renderSortIcon('slaResponseTime')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      STATUS {renderSortIcon('status')}
                    </div>
                  </th>
                  <th style={{ width: '40px', textAlign: 'center' }}>
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
                        placeholder="Filter Title/Vendor..."
                        value={columnFilters.title || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, title: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Type..."
                        value={columnFilters.contractType || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, contractType: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Duration..."
                        value={columnFilters.startDate || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, startDate: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter Value..."
                        value={columnFilters.value || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, value: e.target.value })); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                      />
                    </th>
                    <th style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder="Filter SLA..."
                        value={columnFilters.slaResponseTime || ''}
                        onChange={(e) => { setColumnFilters(p => ({ ...p, slaResponseTime: e.target.value })); setCurrentPage(1); }}
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
                {paginatedContracts.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px 16px', color: '#64748B' }}>
                      No contracts found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedContracts.map((cnt) => (
                    <tr key={cnt.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: '#00A878', fontFamily: 'monospace' }}>
                          {cnt.id.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#1F2937' }}>{cnt.title}</div>
                        <div style={{ fontSize: '0.74rem', color: '#6B7280' }}>Vendor: {cnt.vendor}</div>
                      </td>
                      <td>
                        <span className="badge badge-blue">
                          {cnt.contractType}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                        <div>{cnt.startDate}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>to {cnt.endDate}</div>
                      </td>
                      <td style={{ fontSize: '0.86rem', color: '#00A878', fontWeight: 700, fontFamily: 'monospace' }}>
                        {cnt.value}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#2563EB', fontWeight: 600 }}>
                        {cnt.slaResponseTime}
                      </td>
                      <td>
                        <span className={`badge ${cnt.status.includes('Expiring') ? 'badge-warning' : 'badge-passed'}`}>
                          {cnt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* View Mode 2: GIS Map View */}
        {viewMode === 'map' && (
          <div style={{ height: '520px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0', marginTop: '8px' }}>
            <GisMap />
          </div>
        )}

        {/* Standardized Bottom Pagination Bar INSIDE Panel (Matches SitesManagement & Work Orders) */}
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
          
          {/* Left: View records Dropdown & Record Count */}
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
            <span>Showing <strong style={{ color: '#0F172A' }}>{totalRecords > 0 ? startIndex + 1 : 0}</strong> to <strong style={{ color: '#0F172A' }}>{endIndex}</strong> of <strong style={{ color: '#0F172A' }}>{totalRecords}</strong> contracts</span>
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

      {/* Register Contract Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '500px', maxWidth: '100%', padding: '24px', background: '#FFFFFF', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937', margin: 0 }}>Register New Contract / Warranty</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddContract} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>CONTRACT TITLE</label>
                <input type="text" required placeholder="e.g. Annual Gas Calibration Service Agreement" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="card-grid-2">
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>VENDOR / PROVIDER</label>
                  <input type="text" required className="input-field" value={vendor} onChange={(e) => setVendor(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>CONTRACT TYPE</label>
                  <select className="input-field" value={contractType} onChange={(e) => setContractType(e.target.value)}>
                    <option value="Comprehensive AMC">Comprehensive AMC</option>
                    <option value="Preventive Maintenance">Preventive Maintenance</option>
                    <option value="Equipment Warranty">Equipment Warranty</option>
                    <option value="SLA Technical Support">SLA Technical Support</option>
                  </select>
                </div>
              </div>

              <div className="card-grid-2">
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>START DATE</label>
                  <input type="date" className="input-field" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>END DATE</label>
                  <input type="date" className="input-field" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="card-grid-2">
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>CONTRACT VALUE ($)</label>
                  <input type="text" className="input-field" value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>SLA RESPONSE TERM</label>
                  <input type="text" className="input-field" value={slaResponseTime} onChange={(e) => setSlaResponseTime(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-epa">Save Contract</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
