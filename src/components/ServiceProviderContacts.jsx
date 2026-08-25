import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Phone, 
  Mail, 
  Building, 
  Download, 
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
  UserCheck,
  User,
  Table,
  Map
} from 'lucide-react';
import GisMap from './GisMap';

export default function ServiceProviderContacts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'map'
  const [sortField, setSortField] = useState('provider');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  const contacts = [
    { id: 'sp-1', provider: 'Teledyne API Environmental', contactPerson: 'Mark Harrison', role: 'Chief Calibration Engineer', email: 'mharrison@teledyne-api.com', phone: '+1 858 657 9800', region: 'North America / Middle East', status: 'Active Vendor' },
    { id: 'sp-2', provider: 'Horiba Instruments Middle East', contactPerson: 'Eng. Ahmed Al-Standard', role: 'Regional Maintenance Manager', email: 'ahmed.standard@horiba.ae', phone: '+971 4 883 7070', region: 'UAE & GCC Region', status: 'Active Vendor' },
    { id: 'sp-3', provider: 'Thermo Fisher Scientific', contactPerson: 'David Miller', role: 'Gas Analyzer Specialist', email: 'david.miller@thermofisher.com', phone: '+971 4 457 1100', region: 'Global Field Support', status: 'Active Vendor' },
    { id: 'sp-4', provider: 'Emirates Calibration Laboratories', contactPerson: 'Mariam Al-Kabi', role: 'ISO 17025 Lead Auditor', email: 'mariam@emicalib.ae', phone: '+971 6 534 2200', region: 'Sharjah Industrial', status: 'Active Vendor' },
    { id: 'sp-5', provider: 'Vaisala Gulf Meteorological FZE', contactPerson: 'Hassan Al-Zahabi', role: 'Microclimate Technical Lead', email: 'h.alzahabi@vaisala.com', phone: '+971 4 881 9920', region: 'GCC Regional Office', status: 'Active Vendor' },
    { id: 'sp-6', provider: 'YSI Xylem Water Solutions', contactPerson: 'Dr. Sarah Jenkins', role: 'Marine Sonde Calibration Lead', email: 's.jenkins@xylem.com', phone: '+971 4 347 5588', region: 'Middle East & North Africa', status: 'Active Vendor' },
    { id: 'sp-7', provider: 'Campbell Scientific Middle East', contactPerson: 'Omar Al-Sabah', role: 'Telemetry & Data Logger Engineer', email: 'o.alsabah@campbellsci.ae', phone: '+971 6 557 4100', region: 'Sharjah Freezone', status: 'Active Vendor' },
    { id: 'sp-8', provider: 'Endress+Hauser Water Analytics', contactPerson: 'Kambiz Rostami', role: 'Flow Sensor Specialist', email: 'kambiz.rostami@endress.com', phone: '+971 4 810 5000', region: 'UAE Support Hub', status: 'Active Vendor' },
    { id: 'sp-9', provider: 'Aeroqual Air Monitoring Systems', contactPerson: 'Rachel Adams', role: 'Ambient AQ Sensor Auditor', email: 'r.adams@aeroqual.com', phone: '+971 4 329 1100', region: 'Middle East Division', status: 'Active Vendor' },
    { id: 'sp-10', provider: 'Tisch Environmental Inc.', contactPerson: 'Michael O\'Connor', role: 'High Volume Air Sampler Lead', email: 'moconnor@tisch-env.com', phone: '+1 513 467 9000', region: 'Global Technical Support', status: 'Active Vendor' },
    { id: 'sp-11', provider: 'OTT HydroMet GCC', contactPerson: 'Khalifa Al-Hajri', role: 'Hydrological Station Specialist', email: 'k.alhajri@otthydromet.com', phone: '+971 4 338 9090', region: 'GCC & Oman Territory', status: 'Active Vendor' },
    { id: 'sp-12', provider: 'Hach Water Analytics Middle East', contactPerson: 'Fatima Al-Rumaithi', role: 'Water Quality Chemist', email: 'falrumaithi@hach.com', phone: '+971 4 887 6677', region: 'Sharjah & Northern Emirates', status: 'Active Vendor' }
  ];

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const q = searchQuery.toLowerCase();
      return (
        (c.provider && c.provider.toLowerCase().includes(q)) ||
        (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) ||
        (c.role && c.role.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.region && c.region.toLowerCase().includes(q))
      );
    });
  }, [contacts, searchQuery]);

  // Sort contacts based on sortField & sortDirection
  const sortedContacts = useMemo(() => {
    const data = [...filteredContacts];
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
  }, [filteredContacts, sortField, sortDirection]);

  // Pagination math
  const totalRecords = sortedContacts.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);

  const paginatedContacts = useMemo(() => {
    return sortedContacts.slice(startIndex, endIndex);
  }, [sortedContacts, startIndex, endIndex]);

  // Handle Sort Toggle
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

  // Row selection logic
  const isAllPaginatedSelected = useMemo(() => {
    if (paginatedContacts.length === 0) return false;
    return paginatedContacts.every(c => selectedIds.includes(c.id));
  }, [paginatedContacts, selectedIds]);

  const toggleSelectAll = () => {
    if (isAllPaginatedSelected) {
      setSelectedIds(prev => prev.filter(id => !paginatedContacts.some(pc => pc.id === id)));
    } else {
      const newIds = new Set([...selectedIds, ...paginatedContacts.map(c => c.id)]);
      setSelectedIds(Array.from(newIds));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Export handler (CSV / PDF)
  const handleExport = (format) => {
    setIsExportDropdownOpen(false);

    const exportData = selectedIds.length > 0
      ? filteredContacts.filter(c => selectedIds.includes(c.id))
      : filteredContacts;

    if (exportData.length === 0) {
      alert('No service provider contact records available to export.');
      return;
    }

    if (format === 'csv') {
      const headers = ['Service Provider / Company', 'Specialist Role', 'Email', 'Phone Number', 'Support Region', 'Primary Contact Person', 'Status'];
      const rows = exportData.map(c => [
        `"${c.provider || ''}"`,
        `"${c.role || ''}"`,
        `"${c.email || ''}"`,
        `"${c.phone || ''}"`,
        `"${c.region || ''}"`,
        `"${c.contactPerson || ''}"`,
        `"${c.status || ''}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Sharjah_EPA_Service_Providers_${exportData.length}_Records.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      const printWindow = window.open('', '_blank');
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Sharjah EPA - Service Providers & Vendor Directory</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; color: #1e293b; }
              h1 { color: #00A878; font-size: 20px; margin-bottom: 4px; }
              p { color: #64748b; font-size: 12px; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 12px; }
              th, td { border: 1px solid #e2e8f0; padding: 8px 12px; font-size: 11px; text-align: left; }
              th { background-color: #f8fafc; color: #475569; font-weight: bold; }
              tr:nth-child(even) { background-color: #f1f5f9; }
              .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; background: #e0f2fe; color: #0369a1; }
            </style>
          </head>
          <body>
            <h1>Sharjah Environment Protected Authority (Sharjah EPA)</h1>
            <p>Approved Vendor & Technical Service Providers Directory — Exported ${new Date().toLocaleDateString()} (${exportData.length} records)</p>
            <table>
              <thead>
                <tr>
                  <th>Service Provider / Company</th>
                  <th>Specialist Role</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Support Region</th>
                  <th>Primary Contact Person</th>
                </tr>
              </thead>
              <tbody>
                ${exportData.map(c => `
                  <tr>
                    <td><strong>${c.provider || ''}</strong><br/><span class="badge">${c.status || 'Active Vendor'}</span></td>
                    <td>${c.role || ''}</td>
                    <td>${c.email || ''}</td>
                    <td>${c.phone || ''}</td>
                    <td>${c.region || ''}</td>
                    <td><strong>${c.contactPerson || ''}</strong></td>
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
      }, 500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Main Glass Panel Table Container */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>

        {/* Top Header Inside Card: Search on Left, Right Aligned Export Dropdown & View Mode Switcher */}
        <div style={{ 
          display: 'flex', 
          justify: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '12px', 
          marginBottom: '16px', 
          borderBottom: '1px solid #E2E8F0', 
          paddingBottom: '16px',
          width: '100%'
        }}>
          
          {/* Left Aligned Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 1 340px', minWidth: '240px' }}>
            <div className="page-header-search" style={{ margin: 0, width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search provider, contact person, role, email..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ paddingLeft: '36px', fontSize: '0.8rem', background: '#FFFFFF' }}
              />
            </div>
          </div>

          {/* Right Aligned Controls: Export Dropdown + View Mode Switcher (Table View / Map View) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginLeft: 'auto' }}>
            
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
                <span>Export {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
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
                    {selectedIds.length > 0 ? `Selected Contacts (${selectedIds.length})` : `All Filtered (${filteredContacts.length})`}
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

            {/* View Mode Toggle Switch (Table View, Map View) */}
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

          </div>
        </div>

        {/* Selected Items Counter Bar */}
        {selectedIds.length > 0 && (
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            padding: '10px 16px',
            marginBottom: '14px',
            background: '#E6F6F2',
            border: '1px solid rgba(0, 168, 120, 0.3)',
            borderRadius: '10px',
            color: '#00A878',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={16} color="#00A878" />
              <span><strong>{selectedIds.length}</strong> service provider contacts selected out of {filteredContacts.length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => handleExport('csv')} 
                style={{ background: '#00A878', color: '#FFF', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 700 }}
              >
                Export Selected ({selectedIds.length})
              </button>
              <button 
                onClick={() => setSelectedIds([])} 
                style={{ background: 'transparent', color: '#64748B', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem' }}
              >
                <X size={14} /> Clear Selection
              </button>
            </div>
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
                  <th onClick={() => handleSort('provider')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Service Provider / Company {renderSortIcon('provider')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('role')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Specialist Role {renderSortIcon('role')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('email')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Email {renderSortIcon('email')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('phone')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Phone Number {renderSortIcon('phone')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('region')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Support Region {renderSortIcon('region')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('contactPerson')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Primary Contact Person {renderSortIcon('contactPerson')}
                    </div>
                  </th>
                  <th style={{ textAlign: 'right' }}>Call</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '32px 16px', color: '#94A3B8' }}>
                      No vendor or service provider contacts found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedContacts.map((c) => {
                    const isSelected = selectedIds.includes(c.id);
                    const firstName = c.contactPerson ? c.contactPerson.split(' ')[0] : 'Contact';
                    return (
                      <tr 
                        key={c.id}
                        style={{
                          background: isSelected ? '#F0FDF4' : 'transparent',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => toggleSelectRow(c.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            {isSelected ? (
                              <CheckSquare size={16} color="#00A878" />
                            ) : (
                              <Square size={16} color="#CBD5E1" />
                            )}
                          </button>
                        </td>

                        <td>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>{c.provider}</div>
                          <span className="badge badge-blue" style={{ marginTop: '3px', display: 'inline-block', fontSize: '0.66rem' }}>{c.status}</span>
                        </td>

                        <td style={{ fontSize: '0.82rem', color: '#334155' }}>
                          {c.role}
                        </td>

                        <td>
                          <a 
                            href={`mailto:${c.email}`} 
                            style={{ fontFamily: 'monospace', color: '#0891B2', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none' }}
                          >
                            {c.email}
                          </a>
                        </td>

                        <td style={{ fontSize: '0.82rem', color: '#1F2937', fontWeight: 600, fontFamily: 'monospace' }}>
                          {c.phone}
                        </td>

                        <td style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                          {c.region}
                        </td>

                        {/* Primary Contact Person Column */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E6F6F2', color: '#00A878', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.74rem' }}>
                              <User size={14} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.86rem' }}>{c.contactPerson}</div>
                              <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Primary Representative</div>
                            </div>
                          </div>
                        </td>

                        {/* Call Action Button */}
                        <td style={{ textAlign: 'right' }}>
                          <a 
                            href={`tel:${c.phone}`}
                            className="btn btn-epa"
                            style={{
                              padding: '5px 12px',
                              fontSize: '0.74rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              textDecoration: 'none',
                              fontWeight: 700,
                              borderRadius: '6px'
                            }}
                            title={`Call ${c.contactPerson} (${c.phone})`}
                          >
                            <Phone size={13} /> Call {firstName}
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW MODE 2: Map View */}
        {viewMode === 'map' && (
          <div style={{ height: '560px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
            <GisMap mode="stations" selectedId={null} />
          </div>
        )}

        {/* Pagination & Records Footer (Left Records info, Right Page Navigation) */}
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
          
          {/* Bottom Left: View Records (10, 50, 100, 500) Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
            <span>View records per page:</span>
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
            <span>Showing <strong style={{ color: '#0F172A' }}>{totalRecords > 0 ? startIndex + 1 : 0}</strong> to <strong style={{ color: '#0F172A' }}>{endIndex}</strong> of <strong style={{ color: '#0F172A' }}>{totalRecords}</strong> contact records</span>
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
