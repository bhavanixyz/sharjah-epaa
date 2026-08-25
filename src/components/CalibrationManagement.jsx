import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Plus, Table, LayoutGrid, Map, Award, CheckCircle2, AlertTriangle, Clock, 
  Download, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, CheckSquare, Square, X, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileSpreadsheet, FileText, QrCode
} from 'lucide-react';
import GisMap from './GisMap';
import QRCodeDialog from './QRCodeDialog';

export default function CalibrationManagement() {
  const { calibrations, setCalibrations } = useApp();

  // Search & Filter state
  const [searchCal, setSearchCal] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards' | 'map'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState('certificateNo');
  const [sortDirection, setSortDirection] = useState('asc');

  // Row Selection state
  const [selectedCalIds, setSelectedCalIds] = useState([]);

  // QR Dialog state
  const [selectedQrAsset, setSelectedQrAsset] = useState(null);

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Export dropdown ref & state
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);

  // Modal Form State
  const [assetName, setAssetName] = useState('');
  const [siteName, setSiteName] = useState('Al Majaz Urban Station');
  const [calibrationType, setCalibrationType] = useState('Zero & Span Gas Standard');
  const [performedBy, setPerformedBy] = useState('Eng. Humaid Al-Suwaidi');
  const [resultStatus, setResultStatus] = useState('Passed (0.02% Drift)');

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

  const handleCreateCalibration = (e) => {
    e.preventDefault();
    const newCal = {
      id: `cal-${Date.now()}`,
      certificateNo: `EPA-CAL-2026-0${calibrations.length + 1}`,
      assetName: assetName || 'Horiba APNA-370 NOx Analyzer',
      siteName,
      calibrationType,
      performedBy,
      result: resultStatus,
      dueDate: '2026-11-15',
      status: 'Valid'
    };
    setCalibrations([newCal, ...calibrations]);
    setIsModalOpen(false);
    setAssetName('');
  };

  // Filter & Sort calibrations
  const filteredCalibrations = useMemo(() => {
    return calibrations.filter(c => {
      // Search filter
      const q = searchCal.toLowerCase();
      const matchesSearch = 
        !searchCal ||
        (c.certificateNo && c.certificateNo.toLowerCase().includes(q)) ||
        (c.assetName && c.assetName.toLowerCase().includes(q)) ||
        (c.siteName && c.siteName.toLowerCase().includes(q)) ||
        (c.calibrationType && c.calibrationType.toLowerCase().includes(q)) ||
        (c.performedBy && c.performedBy.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Status filter
      if (filterStatus === 'Passed' && !c.result.includes('Passed')) return false;
      if (filterStatus === 'Failed' && !c.result.includes('Failed')) return false;
      if (filterStatus === 'Overdue' && c.status === 'Valid') return false;

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
  }, [calibrations, searchCal, filterStatus, sortField, sortDirection]);

  // Pagination math
  const totalRecords = filteredCalibrations.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);

  const paginatedCalibrations = useMemo(() => {
    return filteredCalibrations.slice(startIndex, endIndex);
  }, [filteredCalibrations, startIndex, endIndex]);

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

  // Selection logic
  const isAllPaginatedSelected = useMemo(() => {
    if (paginatedCalibrations.length === 0) return false;
    return paginatedCalibrations.every(c => selectedCalIds.includes(c.id));
  }, [paginatedCalibrations, selectedCalIds]);

  const toggleSelectAll = () => {
    if (isAllPaginatedSelected) {
      setSelectedCalIds(prev => prev.filter(id => !paginatedCalibrations.some(pc => pc.id === id)));
    } else {
      const newIds = new Set([...selectedCalIds, ...paginatedCalibrations.map(c => c.id)]);
      setSelectedCalIds(Array.from(newIds));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedCalIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Export handler
  const handleExport = (format) => {
    setIsExportDropdownOpen(false);
    const exportData = selectedCalIds.length > 0
      ? filteredCalibrations.filter(c => selectedCalIds.includes(c.id))
      : filteredCalibrations;

    if (exportData.length === 0) {
      alert('No calibration records available to export.');
      return;
    }

    if (format === 'csv') {
      const headers = ['Certificate No', 'Target Asset', 'Station Site', 'Calibration Standard', 'Performed By', 'Result', 'Due Date'];
      const rows = exportData.map(c => [
        `"${c.certificateNo || ''}"`,
        `"${c.assetName || ''}"`,
        `"${c.siteName || ''}"`,
        `"${c.calibrationType || ''}"`,
        `"${c.performedBy || ''}"`,
        `"${c.result || ''}"`,
        `"${c.dueDate || ''}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Sharjah_EPA_Calibrations_${exportData.length}_Records.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      window.print();
    }
  };

  const handleOpenQr = (cal) => {
    setSelectedQrAsset({
      id: cal.id,
      name: cal.assetName,
      serialNo: cal.certificateNo,
      siteName: cal.siteName,
      assignedTo: cal.performedBy,
      status: cal.status
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Main Panel Container */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>

        {/* Top Header Inside Container */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', width: '100%' }}>
          
          {/* Left: Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 1 340px', minWidth: '240px' }}>
            <div className="page-header-search" style={{ margin: 0, width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search certificate, asset, station, engineer..." 
                value={searchCal}
                onChange={(e) => {
                  setSearchCal(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ paddingLeft: '36px', fontSize: '0.8rem', background: '#FFFFFF' }}
              />
            </div>
          </div>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginLeft: 'auto' }}>
            


            {/* Export Dropdown */}
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
                <span>Export {selectedCalIds.length > 0 ? `(${selectedCalIds.length})` : ''}</span>
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
                    {selectedCalIds.length > 0 ? `Selected Certs (${selectedCalIds.length})` : `All Filtered (${filteredCalibrations.length})`}
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

            {/* View Mode Switcher (Table & Map) */}
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

            {/* Schedule Drift Calibration CTA */}
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
              <Plus size={16} /> Schedule Calibration
            </button>
          </div>
        </div>

        {/* View Mode 1: Table View */}
        {viewMode === 'table' && (
          <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
            <table className="epa-table">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <div 
                      onClick={toggleSelectAll}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {isAllPaginatedSelected ? (
                        <CheckSquare size={16} color="#00A878" />
                      ) : (
                        <Square size={16} color="#94A3B8" />
                      )}
                    </div>
                  </th>
                  <th onClick={() => handleSort('certificateNo')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Certificate No {renderSortIcon('certificateNo')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('assetName')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Target Sensor / Analyzer {renderSortIcon('assetName')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('siteName')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Station Location {renderSortIcon('siteName')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('calibrationType')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Calibration Standard {renderSortIcon('calibrationType')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('performedBy')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Performed By {renderSortIcon('performedBy')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('result')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Drift Check Result {renderSortIcon('result')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('dueDate')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Next Expiry {renderSortIcon('dueDate')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCalibrations.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '32px 16px', color: '#64748B' }}>
                      No calibration certificates found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedCalibrations.map((cal) => {
                    const isSelected = selectedCalIds.includes(cal.id);

                    return (
                      <tr 
                        key={cal.id}
                        style={{
                          background: isSelected ? 'rgba(0, 168, 120, 0.04)' : 'transparent',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <td style={{ textAlign: 'center' }}>
                          <div 
                            onClick={() => toggleSelectRow(cal.id)}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            {isSelected ? (
                              <CheckSquare size={16} color="#00A878" />
                            ) : (
                              <Square size={16} color="#CBD5E1" />
                            )}
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: '#00A878', fontFamily: 'monospace' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Award size={14} color="#00A878" /> {cal.certificateNo}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#1F2937' }}>{cal.assetName}</div>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                          {cal.siteName}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                          {cal.calibrationType}
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                          {cal.performedBy}
                        </td>
                        <td>
                          <span className={`badge ${cal.result.includes('Passed') ? 'badge-passed' : 'badge-failed'}`}>
                            {cal.result}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: cal.status === 'Valid' ? '#00A878' : '#DC2626', fontWeight: 700 }}>
                          {cal.dueDate}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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
            <span>Showing <strong style={{ color: '#0F172A' }}>{totalRecords > 0 ? startIndex + 1 : 0}</strong> to <strong style={{ color: '#0F172A' }}>{endIndex}</strong> of <strong style={{ color: '#0F172A' }}>{totalRecords}</strong> calibration records</span>
            {selectedCalIds.length > 0 && (
              <span style={{ marginLeft: '8px', color: '#00A878', fontWeight: 700 }}>
                ({selectedCalIds.length} selected)
              </span>
            )}
          </div>

          {/* Right: Pagination Controls */}
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

      {/* Schedule Calibration Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '500px', maxWidth: '100%', padding: '24px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937' }}>Schedule Drift Calibration</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateCalibration} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>TARGET SENSOR / ANALYZER</label>
                <input type="text" required placeholder="e.g. Horiba APNA-370 Ambient NOx Analyzer" className="input-field" value={assetName} onChange={(e) => setAssetName(e.target.value)} />
              </div>

              <div className="card-grid-2">
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>STATION SITE</label>
                  <select className="input-field" value={siteName} onChange={(e) => setSiteName(e.target.value)}>
                    <option value="Al Majaz Urban Station">Al Majaz Urban Station</option>
                    <option value="Wasit Wetland Reserve">Wasit Wetland Reserve</option>
                    <option value="Khor Kalba Marine Station">Khor Kalba Marine Station</option>
                    <option value="Saja Industrial Zone">Saja Industrial Zone</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>CALIBRATION STANDARD</label>
                  <select className="input-field" value={calibrationType} onChange={(e) => setCalibrationType(e.target.value)}>
                    <option value="Zero & Span Gas Standard">Zero & Span Gas Standard</option>
                    <option value="Multi-point Permeation Tube">Multi-point Permeation Tube</option>
                    <option value="Gravimetric Flow Calibrator">Gravimetric Flow Calibrator</option>
                    <option value="NIST Traceable Gas Standard">NIST Traceable Gas Standard</option>
                  </select>
                </div>
              </div>

              <div className="card-grid-2">
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>PERFORMED BY</label>
                  <input type="text" className="input-field" value={performedBy} onChange={(e) => setPerformedBy(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>RESULT STATUS</label>
                  <select className="input-field" value={resultStatus} onChange={(e) => setResultStatus(e.target.value)}>
                    <option value="Passed (0.02% Drift)">Passed (0.02% Drift)</option>
                    <option value="Passed (0.05% Drift)">Passed (0.05% Drift)</option>
                    <option value="Failed (0.35% Drift - Rezero)">Failed (0.35% Drift - Rezero)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-epa">Schedule Calibration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Dialog */}
      {selectedQrAsset && (
        <QRCodeDialog
          asset={selectedQrAsset}
          onClose={() => setSelectedQrAsset(null)}
        />
      )}

    </div>
  );
}
