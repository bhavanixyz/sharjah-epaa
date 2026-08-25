import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Download, FileText, Search, Eye, X, CheckCircle, FileSpreadsheet, 
  Table, BarChart2, TrendingUp, ShieldCheck, Award, Activity, CheckCircle2,
  ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react';
import InteractiveKpiCard from './InteractiveKpiCard';
import KpiDetailModal from './KpiDetailModal';

export default function DocumentReporting() {
  const [downloading, setDownloading] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewReport, setPreviewReport] = useState(null);
  const [activeKpiFilter, setActiveKpiFilter] = useState(null);
  const [selectedKpiModal, setSelectedKpiModal] = useState(null);

  // View mode state: 'charts' | 'table' (DEFAULT IS CHARTS VIEW)
  const [viewMode, setViewMode] = useState('charts');

  // Sorting state
  const [sortField, setSortField] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Export dropdown ref & state
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);

  const reports = [
    { id: 'rep-1', code: 'RPT-AST-01', title: 'Asset Register Report', type: 'PDF / Excel', size: '3.4 MB', category: 'Asset Management', desc: 'Comprehensive inventory of all EPA sensors, gas analyzers, and weather instruments.', date: '2026-08-24' },
    { id: 'rep-2', code: 'RPT-NET-02', title: 'Network Register & Topology Audit', type: 'PDF Document', size: '2.8 MB', category: 'Asset Management', desc: 'Hierarchy mapping across Air Quality, Marine, Meteorological, and Groundwater domains.', date: '2026-08-22' },
    { id: 'rep-3', code: 'RPT-SITE-03', title: 'Site Register & Coordinates Log', type: 'CSV / GeoJSON', size: '1.2 MB', category: 'Asset Management', desc: 'Spatial coordinates, zone boundaries, and assigned engineers for all 8 monitoring sites.', date: '2026-08-21' },
    { id: 'rep-4', code: 'RPT-STN-04', title: 'Station Infrastructure Summary', type: 'PDF Document', size: '4.1 MB', category: 'Asset Management', desc: 'Enclosure health, solar power backing, and telemetry logger operational statuses.', date: '2026-08-20' },
    { id: 'rep-5', code: 'RPT-MNT-05', title: 'Maintenance Due & Inspection Schedule', type: 'PDF / Excel', size: '2.5 MB', category: 'Maintenance & Calibration', desc: 'Preventive and scheduled maintenance activities due within 30/60/90 days.', date: '2026-08-23' },
    { id: 'rep-6', code: 'RPT-MNT-06', title: 'Maintenance Completion Summary', type: 'PDF Document', size: '5.6 MB', category: 'Maintenance & Calibration', desc: 'Historical work order execution logs, technician labor hours, and closure signoffs.', date: '2026-08-19' },
    { id: 'rep-7', code: 'RPT-WO-07', title: 'Work Order SLA Aging & Resolution Report', type: 'Excel Dataset', size: '1.8 MB', category: 'Maintenance & Calibration', desc: 'Critical vs High priority work order resolution times measured against EPA SLA limits.', date: '2026-08-18' },
    { id: 'rep-8', code: 'RPT-CAL-08', title: 'Calibration Due & Expired Gas Audit', type: 'PDF Document', size: '2.1 MB', category: 'Maintenance & Calibration', desc: 'Zero/span calibration drift logs, standard gas cylinder verification, and ISO certificates.', date: '2026-08-17' },
    { id: 'rep-9', code: 'RPT-CAL-09', title: 'Calibration History & Sensor Drift Log', type: 'CSV Dataset', size: '3.9 MB', category: 'Maintenance & Calibration', desc: 'Longitudinal telemetry drift trends for particulate matter (PM2.5) and gas sensors.', date: '2026-08-16' },
    { id: 'rep-10', code: 'RPT-WAR-10', title: 'Warranty Expiry Audit', type: 'PDF Document', size: '1.5 MB', category: 'Commercial & Stock', desc: 'Upcoming OEM warranty expirations across Horiba, Teledyne, and Vaisala analyzer fleets.', date: '2026-08-15' },
    { id: 'rep-11', code: 'RPT-AMC-11', title: 'Contract & AMC Renewal Schedule', type: 'PDF / Excel', size: '2.7 MB', category: 'Commercial & Stock', desc: 'Vendor SLAs, annual maintenance contracts, and commercial renewal deadlines.', date: '2026-08-14' },
    { id: 'rep-12', code: 'RPT-INV-12', title: 'Inventory Stock & Safety Threshold Report', type: 'Excel Dataset', size: '1.4 MB', category: 'Commercial & Stock', desc: 'Stock quantities, minimum reorder thresholds, and depot balances for spare parts.', date: '2026-08-13' },
    { id: 'rep-13', code: 'RPT-INV-13', title: 'Spare Part Consumption Log', type: 'CSV Dataset', size: '2.2 MB', category: 'Commercial & Stock', desc: 'PTFE filter replacements, sampling pump diaphragms, and reagent consumption tracking.', date: '2026-08-12' },
    { id: 'rep-14', code: 'RPT-PR-14', title: 'Procurement Status & Purchase Orders', type: 'PDF Document', size: '3.1 MB', category: 'Commercial & Stock', desc: 'Purchase requisitions, vendor quotes, PO approvals, and equipment capitalization status.', date: '2026-08-11' },
    { id: 'rep-15', code: 'RPT-SUP-15', title: 'Supplier Performance Evaluation', type: 'PDF Document', size: '1.9 MB', category: 'Commercial & Stock', desc: 'Vendor delivery SLAs, quality compliance metrics, and equipment defect ratios.', date: '2026-08-10' },
    { id: 'rep-16', code: 'RPT-DOC-16', title: 'Document & SOP Master Register', type: 'PDF Document', size: '4.8 MB', category: 'Governance & Compliance', desc: 'Catalog of standard operating procedures, ISO 17025 laboratory manuals, and engineering diagrams.', date: '2026-08-09' },
    { id: 'rep-17', code: 'RPT-AUD-17', title: 'Security & Audit Trail Summary', type: 'CSV Dataset', size: '6.4 MB', category: 'Governance & Compliance', desc: 'Cryptographic activity logs, user logins, configuration alterations, and RBAC changes.', date: '2026-08-08' },
    { id: 'rep-18', code: 'RPT-USR-18', title: 'User Access & Matrix Report', type: 'PDF Document', size: '1.3 MB', category: 'Governance & Compliance', desc: 'Role assignments, system privileges, and active EPA operator account security profiles.', date: '2026-08-07' },
    { id: 'rep-19', code: 'RPT-GIS-19', title: 'GIS Spatial Coverage & Layer Audit', type: 'GeoJSON / PDF', size: '8.2 MB', category: 'Asset Management', desc: 'Spatial density mapping of environmental monitoring stations across Sharjah Emirates.', date: '2026-08-06' },
    { id: 'rep-20', code: 'RPT-KPI-20', title: 'Executive Management KPI Dashboard Report', type: 'PDF Presentation', size: '5.0 MB', category: 'Governance & Compliance', desc: 'High-level executive briefing on environmental uptime, SLA compliance, and network health.', date: '2026-08-05' }
  ];

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

  // Filter & Sort Reports
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      if (activeKpiFilter === 'asset' && r.category !== 'Asset Management') return false;
      if (activeKpiFilter === 'maint' && r.category !== 'Maintenance & Calibration') return false;
      if (activeKpiFilter === 'govern' && r.category !== 'Governance & Compliance') return false;

      const matchesCategory = activeCategory === 'ALL' || r.category === activeCategory;
      const matchesSearch = !searchQuery || 
                            r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
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
  }, [reports, activeCategory, searchQuery, activeKpiFilter, sortField, sortDirection]);

  // Category statistics for Charts view
  const categoryStats = useMemo(() => {
    const counts = {
      'Asset Management': 0,
      'Maintenance & Calibration': 0,
      'Commercial & Stock': 0,
      'Governance & Compliance': 0
    };
    reports.forEach(r => {
      if (counts[r.category] !== undefined) counts[r.category]++;
    });
    return counts;
  }, [reports]);

  // Pagination calculations
  const totalRecords = filteredReports.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);

  const paginatedReports = useMemo(() => {
    return filteredReports.slice(startIndex, endIndex);
  }, [filteredReports, startIndex, endIndex]);

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

  const handleDownload = (id, format = 'PDF') => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      alert(`Report exported successfully in ${format} format according to Sharjah EPA Standards!`);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* KPI Inspection Modal */}
      {selectedKpiModal && (
        <KpiDetailModal 
          kpiData={selectedKpiModal}
          onClose={() => setSelectedKpiModal(null)}
          onApplyFilter={(cat) => {
            if (cat === 'asset') setActiveCategory('Asset Management');
            else if (cat === 'maint') setActiveCategory('Maintenance & Calibration');
            else if (cat === 'govern') setActiveCategory('Governance & Compliance');
            else setActiveCategory('ALL');
          }}
        />
      )}

      {/* Controls & Filter Panel Container (Standardized Enterprise Layout) */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>

        {/* Top Controls Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', width: '100%' }}>
          
          {/* Left: Search Input */}
          <div style={{ position: 'relative', width: '260px', maxWidth: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search report code, title..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{ paddingLeft: '34px', fontSize: '0.8rem', height: '36px', background: '#FFFFFF' }}
            />
          </div>

          {/* Right Aligned: Category Filter Tabs + View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginLeft: 'auto' }}>
            
            {/* Category Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['ALL', 'Asset Management', 'Maintenance & Calibration', 'Commercial & Stock', 'Governance & Compliance'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: activeCategory === cat ? '#00A878' : '#F1F5F9',
                    color: activeCategory === cat ? '#FFFFFF' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Mode Switcher Toggle (Table vs Charts) */}
            <div style={{ display: 'flex', background: '#F8FAFC', padding: '3px', borderRadius: '8px', border: '1px solid #CBD5E1', height: '36px', boxSizing: 'border-box' }}>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
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
                onClick={() => setViewMode('charts')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  height: '28px',
                  background: viewMode === 'charts' ? '#00A878' : 'transparent',
                  color: viewMode === 'charts' ? '#FFFFFF' : '#64748B',
                  transition: 'all 0.15s ease'
                }}
              >
                <BarChart2 size={14} /> Charts
              </button>
            </div>

          </div>

        </div>

        {/* View Mode 1: Table View */}
        {viewMode === 'table' && (
          <>
            <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
              <table className="epa-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('code')} style={{ cursor: 'pointer', width: '140px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        REPORT CODE {renderSortIcon('code')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        DOCUMENT TITLE & DESCRIPTION {renderSortIcon('title')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        CATEGORY {renderSortIcon('category')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        FORMAT & SIZE {renderSortIcon('type')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('date')} style={{ cursor: 'pointer', width: '130px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        DATE {renderSortIcon('date')}
                      </div>
                    </th>
                    <th style={{ textAlign: 'center', width: '220px', whiteSpace: 'nowrap' }}>
                      EXPORTS & DOWNLOADS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReports.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '32px 16px', color: '#64748B' }}>
                        No compliance reports found matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedReports.map((rep) => (
                      <tr key={rep.id}>
                        <td>
                          <span style={{ fontWeight: 700, color: '#0891B2', fontFamily: 'monospace' }}>{rep.code}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#1F2937' }}>{rep.title}</div>
                          <div style={{ fontSize: '0.74rem', color: '#6B7280', marginTop: '2px', lineHeight: '1.3' }}>{rep.desc}</div>
                        </td>
                        <td>
                          <span className="badge badge-blue">
                            {rep.category}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#4B5563' }}>
                          <div><strong style={{ color: '#0F172A' }}>{rep.type}</strong></div>
                          <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{rep.size}</div>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                          {rep.date}
                        </td>
                        {/* Last Column: Adobe Acrobat Icon for PDF export & MS Excel icon for Excel export */}
                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            
                            {/* Adobe Acrobat PDF Export Button */}
                            <button
                              onClick={() => handleDownload(rep.id, 'Adobe Acrobat PDF')}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                background: '#FEF2F2',
                                color: '#DC2626',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              title="Export as Adobe Acrobat PDF Document"
                            >
                              <FileText size={15} color="#DC2626" />
                              <span>PDF</span>
                            </button>

                            {/* MS Excel Export Button */}
                            <button
                              onClick={() => handleDownload(rep.id, 'MS Excel Spreadsheet')}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                background: '#ECFDF5',
                                color: '#059669',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              title="Export as MS Excel Workbook (.xlsx)"
                            >
                              <FileSpreadsheet size={15} color="#059669" />
                              <span>Excel</span>
                            </button>

                            {/* Preview Details Button */}
                            <button
                              onClick={() => setPreviewReport(rep)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: '#64748B',
                                cursor: 'pointer'
                              }}
                              title="Preview Document Details"
                            >
                              <Eye size={14} />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Standardized Bottom Pagination Bar INSIDE Panel */}
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
                <span>Showing <strong style={{ color: '#0F172A' }}>{totalRecords > 0 ? startIndex + 1 : 0}</strong> to <strong style={{ color: '#0F172A' }}>{endIndex}</strong> of <strong style={{ color: '#0F172A' }}>{totalRecords}</strong> documents</span>
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
          </>
        )}

        {/* View Mode 2: Report Analytics Charts View */}
        {viewMode === 'charts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px' }}>
            
            {/* Top Grid: 2 Analytical Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
              
              {/* Chart 1: Reports Distribution by Category */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BarChart2 size={20} color="#00A878" />
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Reports by Domain Category</h3>
                  </div>
                  <span style={{ fontSize: '0.74rem', background: '#ECFDF5', color: '#00A878', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>20 Total BRDs</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Category 1: Asset Management */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      <span>Asset Management</span>
                      <span>5 Reports (25%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: '#F1F5F9', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: '25%', height: '100%', background: '#00A878', borderRadius: '5px' }} />
                    </div>
                  </div>

                  {/* Category 2: Maintenance & Calibration */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      <span>Maintenance & Calibration</span>
                      <span>5 Reports (25%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: '#F1F5F9', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: '25%', height: '100%', background: '#0891B2', borderRadius: '5px' }} />
                    </div>
                  </div>

                  {/* Category 3: Commercial & Stock */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      <span>Commercial & Stock</span>
                      <span>6 Reports (30%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: '#F1F5F9', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: '30%', height: '100%', background: '#3B82F6', borderRadius: '5px' }} />
                    </div>
                  </div>

                  {/* Category 4: Governance & Compliance */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      <span>Governance & Compliance</span>
                      <span>4 Reports (20%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: '#F1F5F9', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: '20%', height: '100%', background: '#8B5CF6', borderRadius: '5px' }} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Chart 2: EPA Regulatory Readiness Index */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TrendingUp size={20} color="#0891B2" />
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Monthly Audit Compliance Trend</h3>
                  </div>
                  <span style={{ fontSize: '0.74rem', background: '#E0F2FE', color: '#0369A1', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>ISO 17025 Compliant</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>98.4%</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <ArrowUp size={14} /> +2.1% this month
                  </span>
                </div>

                {/* Monthly Bar Growth Visual */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', height: '120px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                  {[
                    { month: 'Apr', score: '92.5%', height: '65%' },
                    { month: 'May', score: '94.0%', height: '75%' },
                    { month: 'Jun', score: '95.2%', height: '82%' },
                    { month: 'Jul', score: '96.8%', height: '90%' },
                    { month: 'Aug', score: '98.4%', height: '98%' }
                  ].map((m, idx) => (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B' }}>{m.score}</span>
                      <div style={{ width: '100%', height: m.height, background: idx === 4 ? 'linear-gradient(180deg, #00A878, #0891B2)' : '#CBD5E1', borderRadius: '4px' }} />
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Grid: Export Formats + Certification Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
              
              {/* Chart 3: Export Formats Distribution */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Award size={20} color="#8B5CF6" />
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Report Format & Export Types</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  
                  <div style={{ background: '#FEF2F2', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <FileText size={22} color="#DC2626" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991B1B' }}>10</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#DC2626' }}>Adobe Acrobat PDF</div>
                  </div>

                  <div style={{ background: '#ECFDF5', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <FileSpreadsheet size={22} color="#059669" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065F46' }}>7</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>MS Excel / CSV</div>
                  </div>

                  <div style={{ background: '#EFF6FF', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <Activity size={22} color="#2563EB" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E40AF' }}>3</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB' }}>GIS & GeoJSON</div>
                  </div>

                </div>
              </div>

              {/* Chart 4: Digital Security & Verification Matrix */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <ShieldCheck size={20} color="#059669" />
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Security & Cryptographic Audit Status</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                      <CheckCircle2 size={16} color="#059669" /> Digital SHA-256 Signature
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>VERIFIED</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                      <CheckCircle2 size={16} color="#059669" /> ISO 17025 Calibration Certificate
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>ACTIVE</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                      <CheckCircle2 size={16} color="#059669" /> Automated EPA Dispatch Cycle
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284C7', background: '#E0F2FE', padding: '2px 8px', borderRadius: '4px' }}>DAILY @ 00:00 UTC</span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Report Preview Modal */}
      {previewReport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '560px', maxWidth: '100%', padding: '24px', background: '#FFFFFF', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={22} color="#00A878" />
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#0891B2', fontWeight: 700, fontFamily: 'monospace' }}>{previewReport.code}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937', margin: 0 }}>{previewReport.title}</h3>
                </div>
              </div>
              <button onClick={() => setPreviewReport(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', marginBottom: '18px', fontSize: '0.82rem', color: '#334155' }}>
              <p style={{ marginBottom: '12px' }}>{previewReport.desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
                <div>Category: <strong>{previewReport.category}</strong></div>
                <div>Export Format: <strong>{previewReport.type}</strong></div>
                <div>File Size: <strong>{previewReport.size}</strong></div>
                <div>Standard: <strong>Sharjah EPA ISO 17025 Compliance</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#059669', marginBottom: '20px' }}>
              <CheckCircle size={16} /> Digitally signed by Sharjah EPA Environmental Intelligence Engine (v5.0)
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setPreviewReport(null)} className="btn btn-secondary">Close Preview</button>
              <button onClick={() => { handleDownload(previewReport.id, 'Adobe Acrobat PDF'); setPreviewReport(null); }} className="btn btn-epa">
                <Download size={14} /> Download Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
