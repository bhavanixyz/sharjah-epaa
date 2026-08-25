import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Download, FileText, Search, Eye, X, CheckCircle, FileSpreadsheet, 
  Table, BarChart2, TrendingUp, ShieldCheck, Award, Activity, CheckCircle2,
  ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Filter, RotateCcw, BookOpen, Layers, ChevronDown
} from 'lucide-react';
import InteractiveKpiCard from './InteractiveKpiCard';
import KpiDetailModal from './KpiDetailModal';

export default function DocumentReporting() {
  const { activeModule, targetSearchResult, isDateInRange, dateFilter, triggerExportSuccess } = useApp();
  const isSopMode = activeModule === 'documents';

  const [downloading, setDownloading] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewReport, setPreviewReport] = useState(null);
  const [activeKpiFilter, setActiveKpiFilter] = useState(null);
  const [selectedKpiModal, setSelectedKpiModal] = useState(null);

  // Column Filters state
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});

  // View mode state: 'charts' | 'table' (DEFAULT IS CHARTS VIEW)
  const [viewMode, setViewMode] = useState('charts');

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset category and filters when switching between SOPs and Reports
  useEffect(() => {
    setActiveCategory('ALL');
    setSearchQuery('');
    setColumnFilters({});
    setCurrentPage(1);
  }, [activeModule]);

  // Auto-fill and filter when navigated from Global Search
  useEffect(() => {
    if (targetSearchResult?.module === 'documents' || targetSearchResult?.module === 'reports') {
      setSearchQuery(targetSearchResult.searchTerm || '');
      setViewMode('table');
      setCurrentPage(1);
    }
  }, [targetSearchResult]);

  // Sorting state
  const [sortField, setSortField] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');

  // Export dropdown ref & state
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);

  // 1. Dedicated Standard Operating Procedures (SOPs) Dataset
  const sopDocuments = useMemo(() => [
    { 
      id: 'sop-1', 
      code: 'SOP-AQ-01', 
      title: 'Continuous Ambient Air Quality Monitoring SOP', 
      type: 'PDF Document', 
      size: '3.2 MB', 
      category: 'Standard Operating Procedures', 
      version: 'v3.2', 
      approvedBy: 'Dr. Mariam Al-Qasimi', 
      status: 'Active / ISO 17025', 
      desc: 'Detailed procedural standard for sampling line integrity, manifold maintenance, and particulate inlet cleaning.', 
      date: '2026-08-25' 
    },
    { 
      id: 'sop-2', 
      code: 'SOP-CAL-02', 
      title: 'Zero & Span Gas Dilution Calibration Protocol', 
      type: 'PDF Document', 
      size: '2.8 MB', 
      category: 'Laboratory & Calibration Protocols', 
      version: 'v4.0', 
      approvedBy: 'Eng. Tariq Al-Mansoori', 
      status: 'Traceable NIST', 
      desc: 'Calibration sequence execution for Teledyne NOx, SO2, CO, and Ozone photometric analyzers.', 
      date: '2026-08-22' 
    },
    { 
      id: 'sop-3', 
      code: 'SOP-MAR-03', 
      title: 'Marine Water Quality Multiparameter Sonde Deployment', 
      type: 'PDF / Video', 
      size: '4.5 MB', 
      category: 'Standard Operating Procedures', 
      version: 'v2.1', 
      approvedBy: 'Saeed Al-Mutawa', 
      status: 'Active', 
      desc: 'Coastal telemetry mooring, bio-fouling wiper replacement, and optical dissolved oxygen calibration.', 
      date: '2026-08-20' 
    },
    { 
      id: 'sop-4', 
      code: 'SOP-SAF-04', 
      title: 'Hazardous Gas Cylinder Handling & High-Pressure HSE Guide', 
      type: 'PDF Document', 
      size: '1.9 MB', 
      category: 'Safety & HSE Guidelines', 
      version: 'v5.0', 
      approvedBy: 'Sharjah Civil Defense', 
      status: 'Mandatory', 
      desc: 'Safe transportation, manifold regulator assembly, and leak test procedures for toxic calibration gases.', 
      date: '2026-08-18' 
    },
    { 
      id: 'sop-5', 
      code: 'SOP-LAB-05', 
      title: 'ISO 17025 Chain of Custody & Sample Preservation Protocol', 
      type: 'PDF / Checklist', 
      size: '2.1 MB', 
      category: 'Laboratory & Calibration Protocols', 
      version: 'v3.4', 
      approvedBy: 'Dr. Mariam Al-Qasimi', 
      status: 'Accredited', 
      desc: 'Sample identification, temperature-controlled transit, and tamper-evident custody logging procedures.', 
      date: '2026-08-16' 
    },
    { 
      id: 'sop-6', 
      code: 'SOP-ENG-06', 
      title: 'Solar Photovoltaic & Enclosure Climate Control Maintenance', 
      type: 'Technical Manual', 
      size: '5.4 MB', 
      category: 'Engineering & Operations Manuals', 
      version: 'v1.8', 
      approvedBy: 'Eng. Humaid Al-Suwaidi', 
      status: 'Active', 
      desc: 'Battery charge controller diagnostics, HVAC filter service, and grounding rod impedance checks.', 
      date: '2026-08-14' 
    },
    { 
      id: 'sop-7', 
      code: 'SOP-TEL-07', 
      title: '4G LTE IoT Gateway & MQTT Telemetry Recovery SOP', 
      type: 'Engineering Manual', 
      size: '3.7 MB', 
      category: 'Engineering & Operations Manuals', 
      version: 'v2.3', 
      approvedBy: 'Systems Admin', 
      status: 'Active', 
      desc: 'Remote edge router configuration, VPN failover routing, and packet buffer retransmission protocols.', 
      date: '2026-08-11' 
    },
    { 
      id: 'sop-8', 
      code: 'SOP-SPI-08', 
      title: 'Coastal Oil Spill Emergency Containment & Drone Rapid Response', 
      type: 'PDF / Protocol', 
      size: '6.1 MB', 
      category: 'Safety & HSE Guidelines', 
      version: 'v4.1', 
      approvedBy: 'Emergency Operations', 
      status: 'Critical', 
      desc: 'Drone thermal payload search, boom deployment protocols, and rapid hydrocarbon sensor telemetry.', 
      date: '2026-08-08' 
    },
    { 
      id: 'sop-9', 
      code: 'SOP-VOC-09', 
      title: 'Industrial VOC & GC-MS Thermal Desorption Analysis Guide', 
      type: 'PDF Document', 
      size: '2.9 MB', 
      category: 'Laboratory & Calibration Protocols', 
      version: 'v2.0', 
      approvedBy: 'Senior Chemist', 
      status: 'Active', 
      desc: 'Canister sampling, cryo-trapping, and mass spectrometer calibration standards for benzene and toluene.', 
      date: '2026-08-05' 
    },
    { 
      id: 'sop-10', 
      code: 'SOP-AUD-10', 
      title: 'Quarterly Station Physical Security & Access Audit Protocol', 
      type: 'PDF / Checklist', 
      size: '1.6 MB', 
      category: 'Standard Operating Procedures', 
      version: 'v1.5', 
      approvedBy: 'Security Operations', 
      status: 'Active', 
      desc: 'Access badge auditing, intrusion alarm testing, and biometric logging inspection for all stations.', 
      date: '2026-08-02' 
    }
  ], []);

  // 2. Dedicated EPA Compliance Reports Dataset
  const complianceReports = useMemo(() => [
    { 
      id: 'rep-01', 
      code: 'RPT-AQ-01', 
      title: 'Monthly Air Quality Compliance Summary (Sharjah Urban)', 
      type: 'PDF / Excel', 
      size: '2.4 MB', 
      category: 'Air Quality Compliance', 
      status: '100% Compliant', 
      desc: 'Comprehensive monthly EPA compliance reporting for NOx, PM2.5, PM10, SO2, CO, and Ozone across all 12 stations.', 
      date: '2026-08-25' 
    },
    { 
      id: 'rep-02', 
      code: 'RPT-MAR-02', 
      title: 'Marine Water Quality Monitoring & Sonde Drift Audit', 
      type: 'PDF Document', 
      size: '3.1 MB', 
      category: 'Marine & Coastal Reports', 
      status: '98.2% Compliant', 
      desc: 'Coastal telemetry analysis, chlorophyll-a, turbidity, salinity, and dissolved oxygen index reporting.', 
      date: '2026-08-24' 
    },
    { 
      id: 'rep-03', 
      code: 'RPT-MOCCAE-03', 
      title: 'UAE Federal Ministry (MOCCAE) Q2 Statutory Deliverable', 
      type: 'PDF / Excel', 
      size: '4.2 MB', 
      category: 'Statutory Ministry Submissions', 
      status: 'Submitted & Approved', 
      desc: 'Quarterly statutory greenhouse gas baseline and air shed inventory submitted to Federal Ministry of Environment.', 
      date: '2026-08-23' 
    },
    { 
      id: 'rep-04', 
      code: 'RPT-IND-04', 
      title: 'Industrial Emissions Baseline & Buffer Zone Analysis', 
      type: 'CSV Dataset', 
      size: '5.8 MB', 
      category: 'Industrial Emissions & Dust', 
      status: '100% Compliant', 
      desc: 'High-frequency VOC, SOx, and fugitive dust sensor logging from Hamriyah and Sajaa industrial zones.', 
      date: '2026-08-21' 
    },
    { 
      id: 'rep-05', 
      code: 'RPT-CAL-05', 
      title: 'Zero/Span Gas Calibration & Accuracy Audit Logs', 
      type: 'PDF Document', 
      size: '1.8 MB', 
      category: 'Statutory Ministry Submissions', 
      status: 'Certified', 
      desc: 'Traceable NIST gas standards, multi-point linearity checks, and automated calibration sequence telemetry.', 
      date: '2026-08-19' 
    },
    { 
      id: 'rep-06', 
      code: 'RPT-NOI-06', 
      title: 'Urban Acoustic Noise & Environmental Vibration Study', 
      type: 'PDF / Excel', 
      size: '2.8 MB', 
      category: 'Air Quality Compliance', 
      status: '97.5% Compliant', 
      desc: 'Continuous dBA sound pressure level compliance logs from major residential and commercial traffic corridors.', 
      date: '2026-08-17' 
    },
    { 
      id: 'rep-07', 
      code: 'RPT-SLA-07', 
      title: 'Annual Maintenance Contracts (AMC) SLA Compliance Audit', 
      type: 'PDF Document', 
      size: '3.4 MB', 
      category: 'Statutory Ministry Submissions', 
      status: '99.1% Compliant', 
      desc: 'Audit of contractor response times, spare parts replenishment SLAs, and emergency station repair turnarounds.', 
      date: '2026-08-15' 
    },
    { 
      id: 'rep-08', 
      code: 'RPT-MAR-08', 
      title: 'Khor Kalba Mangrove Ecosystem Water & Sediment Report', 
      type: 'PDF Document', 
      size: '2.6 MB', 
      category: 'Marine & Coastal Reports', 
      status: 'Optimal Quality', 
      desc: 'Ecological monitoring of tidal flush, heavy metal traces, and aquatic health metrics in protected mangrove reserves.', 
      date: '2026-08-12' 
    },
    { 
      id: 'rep-09', 
      code: 'RPT-DUST-09', 
      title: 'Eastern Region Particulate Matter (PM10) Mineral Dust Study', 
      type: 'CSV Dataset', 
      size: '3.9 MB', 
      category: 'Industrial Emissions & Dust', 
      status: '100% Compliant', 
      desc: 'Quarry and port fugitive dust dispersion analysis with wind vector meteorological cross-referencing.', 
      date: '2026-08-09' 
    },
    { 
      id: 'rep-10', 
      code: 'RPT-SEC-10', 
      title: 'Security & Audit Trail Regulatory Compliance Summary', 
      type: 'PDF Document', 
      size: '6.4 MB', 
      category: 'Statutory Ministry Submissions', 
      status: 'Audited', 
      desc: 'Cryptographic activity logs, user logins, configuration alterations, and RBAC changes.', 
      date: '2026-08-04' 
    }
  ], []);

  // Choose the active dataset based on mode
  const currentDataset = isSopMode ? sopDocuments : complianceReports;

  // Category filter tabs tailored for each mode
  const categories = useMemo(() => {
    if (isSopMode) {
      return [
        'ALL',
        'Standard Operating Procedures',
        'Laboratory & Calibration Protocols',
        'Safety & HSE Guidelines',
        'Engineering & Operations Manuals'
      ];
    }
    return [
      'ALL',
      'Air Quality Compliance',
      'Marine & Coastal Reports',
      'Industrial Emissions & Dust',
      'Statutory Ministry Submissions'
    ];
  }, [isSopMode]);

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

  // Filter & Sort Items
  const filteredReports = useMemo(() => {
    return currentDataset.filter(r => {
      // Date filter check
      if (!searchQuery && dateFilter !== 'ALL') {
        if (!isDateInRange(r.date)) return false;
      }

      // Category matching
      const matchesCategory = activeCategory === 'ALL' || r.category === activeCategory;
      if (!matchesCategory) return false;

      // Search Query
      const matchesSearch = !searchQuery || 
                            r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (r.approvedBy && r.approvedBy.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      // Individual Column Filters
      for (const colKey in columnFilters) {
        const filterVal = columnFilters[colKey]?.trim().toLowerCase();
        if (filterVal) {
          let cellVal = String(r[colKey] || '').toLowerCase();
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
  }, [currentDataset, activeCategory, searchQuery, columnFilters, sortField, sortDirection, dateFilter, isDateInRange]);

  // Category statistics calculated dynamically from current dataset
  const categoryStats = useMemo(() => {
    const counts = {};
    categories.filter(c => c !== 'ALL').forEach(c => {
      counts[c] = 0;
    });
    currentDataset.forEach(r => {
      if (counts[r.category] !== undefined) {
        counts[r.category]++;
      }
    });
    return counts;
  }, [currentDataset, categories]);

  // Dynamic format counts calculated from filteredReports
  const formatStats = useMemo(() => {
    let pdfCount = 0;
    let excelCount = 0;
    let otherCount = 0;

    filteredReports.forEach(r => {
      const typeLower = (r.type || '').toLowerCase();
      if (typeLower.includes('pdf')) pdfCount++;
      if (typeLower.includes('excel') || typeLower.includes('csv') || typeLower.includes('spreadsheet')) excelCount++;
      if (typeLower.includes('manual') || typeLower.includes('checklist') || typeLower.includes('video') || typeLower.includes('geojson')) otherCount++;
    });

    return {
      pdf: pdfCount,
      excel: excelCount,
      other: otherCount
    };
  }, [filteredReports]);

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
    const doc = filteredReports.find(r => r.id === id);
    const docTitle = doc ? doc.title : 'EPA_Document';
    const fileName = `${docTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.${format.toLowerCase()}`;

    setTimeout(() => {
      setDownloading(null);
      if (triggerExportSuccess) {
        triggerExportSuccess({
          filename: fileName,
          format: format.toUpperCase(),
          count: 1,
          title: `${docTitle} Downloaded Successfully!`
        });
      }
    }, 500);
  };

  const handleExportAll = (type) => {
    setIsExportDropdownOpen(false);
    const fileName = `Sharjah_EPA_${isSopMode ? 'SOP_Documents' : 'Compliance_Reports'}_${filteredReports.length}_Records.${type.toLowerCase()}`;
    
    if (type === 'csv') {
      const headers = isSopMode 
        ? ['Document Code', 'SOP Title', 'Category', 'ISO Standard', 'Revision', 'Effective Date', 'Review Cycle', 'Sign-off Lead', 'Status']
        : ['Report ID', 'Statutory Report Title', 'Compliance Sector', 'Submission Deadline', 'Submission Status', 'MOCCAE Reference', 'Approving Director'];
      
      const rows = filteredReports.map(r => isSopMode ? [
        `"${r.code || ''}"`,
        `"${r.title || ''}"`,
        `"${r.category || ''}"`,
        `"${r.isoStandard || ''}"`,
        `"${r.revision || ''}"`,
        `"${r.effectiveDate || ''}"`,
        `"${r.reviewCycle || ''}"`,
        `"${r.signOffLead || ''}"`,
        `"${r.status || ''}"`
      ] : [
        `"${r.id || ''}"`,
        `"${r.title || ''}"`,
        `"${r.category || ''}"`,
        `"${r.deadline || ''}"`,
        `"${r.status || ''}"`,
        `"${r.mocaeRef || ''}"`,
        `"${r.director || ''}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    if (triggerExportSuccess) {
      triggerExportSuccess({
        filename: fileName,
        format: type.toUpperCase(),
        count: filteredReports.length,
        title: `${isSopMode ? 'SOP Documents' : 'Compliance Reports'} Downloaded Successfully!`
      });
    }

    if (type === 'pdf') {
      window.print();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Controls & Filter Panel Container (Standardized Enterprise Layout) */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>

        {/* Top Controls Toolbar */}
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
          
          {/* Left: Search Input with clearly visible search icon */}
          <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
            <Search 
              size={16} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#64748B',
                pointerEvents: 'none',
                zIndex: 2 
              }} 
            />
            <input
              type="text"
              className="input-field"
              placeholder={isSopMode ? "Search SOP code, title, procedure..." : "Search compliance report code, title..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{ paddingLeft: '36px', fontSize: '0.8rem', height: '36px', background: '#FFFFFF' }}
            />
          </div>

          {/* Right Aligned: Dynamic Category Filter Tabs + Column Filters + View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginLeft: 'auto' }}>
            
            {/* Category Filter Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', background: '#F8FAFC', padding: '3px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: activeCategory === cat ? '#00A878' : 'transparent',
                    color: activeCategory === cat ? '#FFFFFF' : '#64748B',
                    boxShadow: activeCategory === cat ? '0 1px 3px rgba(0,168,120,0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat === 'ALL' ? (isSopMode ? 'All SOPs' : 'All Reports') : cat}
                </button>
              ))}
            </div>

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
              <span>Filters</span>
              {Object.values(columnFilters).filter(v => v).length > 0 && (
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
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
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
                    All Filtered ({filteredReports.length})
                  </div>
                  <div 
                    onClick={() => handleExportAll('csv')} 
                    style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1E293B', transition: 'background 0.15s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} 
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <FileSpreadsheet size={15} color="#00A878" /> Export as CSV
                  </div>
                  <div 
                    onClick={() => handleExportAll('pdf')} 
                    style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1E293B', transition: 'background 0.15s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} 
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <FileText size={15} color="#EF4444" /> Export as PDF
                  </div>
                </div>
              )}
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

        {/* VIEW MODE 1: Table View */}
        {viewMode === 'table' && (
          <>
            <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
              <table className="epa-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('code')} style={{ cursor: 'pointer', width: '140px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isSopMode ? 'SOP CODE' : 'REPORT CODE'} {renderSortIcon('code')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isSopMode ? 'PROCEDURE TITLE & SPECIFICATION' : 'REPORT TITLE & DESCRIPTION'} {renderSortIcon('title')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        CATEGORY {renderSortIcon('category')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isSopMode ? 'APPROVAL & ACCREDITATION' : 'COMPLIANCE STATUS'} {renderSortIcon('status')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        FORMAT & SIZE {renderSortIcon('type')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('date')} style={{ cursor: 'pointer', width: '130px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isSopMode ? 'REVISED DATE' : 'REPORT DATE'} {renderSortIcon('date')}
                      </div>
                    </th>
                    <th style={{ textAlign: 'center', width: '210px', whiteSpace: 'nowrap' }}>
                      ACTIONS
                    </th>
                  </tr>

                  {/* Sub-Header Column Filter Inputs */}
                  {showColumnFilters && (
                    <tr style={{ background: '#F8FAFC' }}>
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
                          placeholder="Filter Title..."
                          value={columnFilters.title || ''}
                          onChange={(e) => { setColumnFilters(p => ({ ...p, title: e.target.value })); setCurrentPage(1); }}
                          style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                        />
                      </th>
                      <th style={{ padding: '6px 8px' }}>
                        <input
                          type="text"
                          placeholder="Filter Category..."
                          value={columnFilters.category || ''}
                          onChange={(e) => { setColumnFilters(p => ({ ...p, category: e.target.value })); setCurrentPage(1); }}
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
                          placeholder="Filter Format..."
                          value={columnFilters.type || ''}
                          onChange={(e) => { setColumnFilters(p => ({ ...p, type: e.target.value })); setCurrentPage(1); }}
                          style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                        />
                      </th>
                      <th style={{ padding: '6px 8px' }}>
                        <input
                          type="text"
                          placeholder="Filter Date..."
                          value={columnFilters.date || ''}
                          onChange={(e) => { setColumnFilters(p => ({ ...p, date: e.target.value })); setCurrentPage(1); }}
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
                  {paginatedReports.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '32px 16px', color: '#64748B' }}>
                        No {isSopMode ? 'SOP documents' : 'compliance reports'} found matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedReports.map((rep) => (
                      <tr key={rep.id}>
                        <td>
                          <span style={{ fontWeight: 700, color: isSopMode ? '#00A878' : '#0891B2', fontFamily: 'monospace' }}>{rep.code}</span>
                          {rep.version && <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{rep.version}</div>}
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#1F2937' }}>{rep.title}</div>
                          <div style={{ fontSize: '0.74rem', color: '#6B7280', marginTop: '2px', lineHeight: '1.3' }}>{rep.desc}</div>
                          {rep.approvedBy && (
                            <div style={{ fontSize: '0.7rem', color: '#00A878', marginTop: '2px', fontWeight: 600 }}>
                              Sign-off: {rep.approvedBy}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                            {rep.category}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-normal" style={{ fontSize: '0.72rem' }}>
                            {rep.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#4B5563' }}>
                          <div><strong style={{ color: '#0F172A' }}>{rep.type}</strong></div>
                          <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{rep.size}</div>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                          {rep.date}
                        </td>
                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            
                            {/* PDF Download Button */}
                            <button
                              onClick={() => handleDownload(rep.id, 'Adobe Acrobat PDF')}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '5px 9px',
                                borderRadius: '6px',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                background: '#FEF2F2',
                                color: '#DC2626',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              title="Export as PDF Document"
                            >
                              <FileText size={13} color="#DC2626" />
                              <span>PDF</span>
                            </button>

                            {/* Excel / CSV Button */}
                            <button
                              onClick={() => handleDownload(rep.id, 'MS Excel Spreadsheet')}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '5px 9px',
                                borderRadius: '6px',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                background: '#ECFDF5',
                                color: '#059669',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              title="Export as Excel / Data file"
                            >
                              <FileSpreadsheet size={13} color="#059669" />
                              <span>Excel</span>
                            </button>

                            {/* Preview Modal Button */}
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
                <span>
                  Showing <strong style={{ color: '#0F172A' }}>{totalRecords > 0 ? startIndex + 1 : 0}</strong> to <strong style={{ color: '#0F172A' }}>{endIndex}</strong> of <strong style={{ color: '#0F172A' }}>{totalRecords}</strong> {isSopMode ? 'SOP documents' : 'compliance reports'}
                  {activeCategory !== 'ALL' && <span style={{ color: '#00A878', marginLeft: '6px' }}>({activeCategory})</span>}
                </span>
              </div>

              {/* Right: Pagination Navigation Controls pinned to Right Corner */}
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

        {/* VIEW MODE 2: Report / SOP Analytics Charts View */}
        {viewMode === 'charts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px' }}>
            
            {/* Top Grid: 2 Analytical Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
              
              {/* Chart 1: Distribution by Category with Active Tab Highlighting */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BarChart2 size={20} color="#00A878" />
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {isSopMode ? 'SOPs by Operational Domain' : 'Reports by Compliance Domain'}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.74rem', background: '#ECFDF5', color: '#00A878', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                    {activeCategory === 'ALL' ? `${currentDataset.length} Total Documents` : `${filteredReports.length} ${activeCategory}`}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categories.filter(c => c !== 'ALL').map((catName, idx) => {
                    const count = categoryStats[catName] || 0;
                    const total = currentDataset.length || 1;
                    const pct = Math.round((count / total) * 100);
                    const isSelected = activeCategory === catName;
                    const palette = ['#00A878', '#0891B2', '#3B82F6', '#8B5CF6'];
                    const barColor = palette[idx % palette.length];

                    return (
                      <div 
                        key={catName}
                        onClick={() => {
                          setActiveCategory(activeCategory === catName ? 'ALL' : catName);
                          setCurrentPage(1);
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          background: isSelected ? '#F0FDF4' : 'transparent',
                          border: isSelected ? '1px solid #A7F3D0' : '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: isSelected ? '#00A878' : '#334155', marginBottom: '4px' }}>
                          <span>{catName}</span>
                          <span>{count} ({pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '4px', transition: 'width 0.3s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 2: Statutory / ISO Compliance Readiness Index */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TrendingUp size={20} color="#0891B2" />
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {isSopMode ? 'SOP Review & Audit Readiness' : 'Monthly Audit Compliance Trend'}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.74rem', background: '#E0F2FE', color: '#0369A1', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                    {isSopMode ? 'ISO 17025 Accredited' : 'Statutory Submission Ready'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>
                    {isSopMode ? '99.2%' : '98.4%'}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <ArrowUp size={14} /> +{isSopMode ? '1.8%' : '2.1%'} this cycle
                  </span>
                </div>

                {/* Monthly Bar Growth Visual */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', height: '120px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                  {(isSopMode ? [
                    { month: 'Apr', score: '95.0%', height: '70%' },
                    { month: 'May', score: '96.2%', height: '78%' },
                    { month: 'Jun', score: '97.5%', height: '85%' },
                    { month: 'Jul', score: '98.4%', height: '92%' },
                    { month: 'Aug', score: '99.2%', height: '99%' }
                  ] : [
                    { month: 'Apr', score: '92.5%', height: '65%' },
                    { month: 'May', score: '94.0%', height: '75%' },
                    { month: 'Jun', score: '95.2%', height: '82%' },
                    { month: 'Jul', score: '96.8%', height: '90%' },
                    { month: 'Aug', score: '98.4%', height: '98%' }
                  ]).map((m, idx) => (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B' }}>{m.score}</span>
                      <div style={{ width: '100%', height: m.height, background: idx === 4 ? 'linear-gradient(180deg, #00A878, #0891B2)' : '#CBD5E1', borderRadius: '4px' }} />
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Grid: Dynamic Format Breakdown + Cryptographic Certification */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
              
              {/* Card 3: Dynamic Format Breakdown */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Award size={20} color="#8B5CF6" />
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isSopMode ? 'SOP Format & Media Types' : 'Report Format & Export Types'}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  
                  <div style={{ background: '#FEF2F2', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <FileText size={22} color="#DC2626" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991B1B' }}>{formatStats.pdf}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#DC2626' }}>Adobe Acrobat PDF</div>
                  </div>

                  <div style={{ background: '#ECFDF5', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <FileSpreadsheet size={22} color="#059669" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065F46' }}>{formatStats.excel}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>MS Excel / CSV</div>
                  </div>

                  <div style={{ background: '#EFF6FF', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <Activity size={22} color="#2563EB" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E40AF' }}>{formatStats.other}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB' }}>
                      {isSopMode ? 'Manuals & Video' : 'GIS & GeoJSON'}
                    </div>
                  </div>

                </div>
              </div>

              {/* Card 4: Cryptographic & Security Verification */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <ShieldCheck size={20} color="#00A878" />
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Security & Cryptographic Audit Status
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#1E293B' }}>
                      <CheckCircle2 size={16} color="#00A878" /> Digital SHA-256 Signature
                    </div>
                    <span className="badge badge-normal" style={{ fontSize: '0.68rem' }}>VERIFIED</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#1E293B' }}>
                      <CheckCircle2 size={16} color="#00A878" /> ISO 17025 Calibration Certificate
                    </div>
                    <span className="badge badge-normal" style={{ fontSize: '0.68rem' }}>ACTIVE</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#1E293B' }}>
                      <CheckCircle2 size={16} color="#00A878" /> Immutable Audit Ledger
                    </div>
                    <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>LOCKED</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Preview Document Modal */}
      {previewReport && (
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
            width: '600px',
            maxWidth: '100%',
            padding: '24px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-blue">{previewReport.code}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '6px', margin: 0 }}>
                  {previewReport.title}
                </h3>
              </div>
              <button 
                onClick={() => setPreviewReport(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '16px', fontSize: '0.8rem', color: '#334155', lineHeight: '1.5' }}>
              {previewReport.desc}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', fontSize: '0.78rem' }}>
              <div>
                <span style={{ color: '#64748B' }}>Domain Category:</span>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{previewReport.category}</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Format & Size:</span>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{previewReport.type} ({previewReport.size})</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Status / Accreditation:</span>
                <div style={{ fontWeight: 700, color: '#00A878' }}>{previewReport.status}</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Release / Revised Date:</span>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{previewReport.date}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => setPreviewReport(null)} 
                className="btn btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                Close Preview
              </button>
              <button 
                type="button" 
                onClick={() => {
                  handleDownload(previewReport.id, 'PDF');
                  setPreviewReport(null);
                }} 
                className="btn btn-epa" 
                style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={15} /> Download Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
