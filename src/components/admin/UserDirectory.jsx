import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, Shield, Mail, Phone, Lock, CheckCircle2, Search, 
  Download, FileSpreadsheet, FileText, ChevronDown, Table, LayoutGrid, Plus,
  ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, UserPlus, X,
  Filter, RotateCcw
} from 'lucide-react';

export default function UserDirectory() {
  const { targetSearchResult, isDateInRange, dateFilter, triggerExportSuccess } = useApp();
  // Default View Mode is LIST/TABLE VIEW per request
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserModal, setSelectedUserModal] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Column Filters state
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});

  // Auto-fill and filter when navigated from Global Search
  useEffect(() => {
    if (targetSearchResult?.module === 'users') {
      setSearchQuery(targetSearchResult.searchTerm || '');
      setCurrentPage(1);
    }
  }, [targetSearchResult]);

  // Sorting state
  const [sortField, setSortField] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');

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

  const [users, setUsers] = useState([
    { 
      id: 'usr-1', 
      code: 'EPA-DIR-01',
      name: 'Eng. Humaid Al-Suwaidi', 
      role: 'EPA Director of Operations', 
      department: 'Executive Leadership', 
      email: 'h.alsuwaidi@epa.shj.ae', 
      phone: '+971 6 500 4001', 
      domain: 'All Sharjah Territories',
      status: 'Active', 
      lastLogin: '2026-08-24 14:10' 
    },
    { 
      id: 'usr-2', 
      code: 'EPA-ENG-12',
      name: 'Tariq Al-Mansoori', 
      role: 'Lead Air Quality Engineer', 
      department: 'Air Monitoring Network', 
      email: 't.mansoori@epa.shj.ae', 
      phone: '+971 50 442 8901', 
      domain: 'Sharjah City & Hamriyah',
      status: 'Active', 
      lastLogin: '2026-08-24 11:45' 
    },
    { 
      id: 'usr-3', 
      code: 'EPA-QA-04',
      name: 'Fatima Al-Zahra', 
      role: 'Quality Assurance Officer', 
      department: 'Environmental Compliance', 
      email: 'f.alzahra@epa.shj.ae', 
      phone: '+971 52 889 1204', 
      domain: 'Wasit & Protected Reserves',
      status: 'Active', 
      lastLogin: '2026-08-24 09:30' 
    },
    { 
      id: 'usr-4', 
      code: 'EPA-MR-08',
      name: 'Rashid Al-Kaitoob', 
      role: 'Marine Ecosystem Specialist', 
      department: 'Marine Water Quality', 
      email: 'r.kaitoob@epa.shj.ae', 
      phone: '+971 55 331 9022', 
      domain: 'Kalba & East Coast',
      status: 'Active', 
      lastLogin: '2026-08-23 16:20' 
    },
    { 
      id: 'usr-5', 
      code: 'EPA-TECH-22',
      name: 'Khalid Al-Nuaimi', 
      role: 'Senior Field Calibration Tech', 
      department: 'Field Operations & SLA', 
      email: 'k.nuaimi@epa.shj.ae', 
      phone: '+971 50 119 4533', 
      domain: 'Central Agricultural Belt',
      status: 'Active', 
      lastLogin: '2026-08-23 13:15' 
    },
    { 
      id: 'usr-6', 
      code: 'EPA-INV-03',
      name: 'Maryam Al-Qasimi', 
      role: 'Inventory & Procurement Lead', 
      department: 'Supply Chain & Depot', 
      email: 'm.qasimi@epa.shj.ae', 
      phone: '+971 56 774 2209', 
      domain: 'Central EPA Depot',
      status: 'Active', 
      lastLogin: '2026-08-22 17:05' 
    },
    { 
      id: 'usr-7', 
      code: 'EPA-ADMIN-02',
      name: 'Aisha Al-Mazrouei', 
      role: 'Security & Access Administrator', 
      department: 'IT & Digital Infrastructure', 
      email: 'a.mazrouei@epa.shj.ae', 
      phone: '+971 50 882 3411', 
      domain: 'Central Cloud & RBAC',
      status: 'Active', 
      lastLogin: '2026-08-22 10:40' 
    },
    { 
      id: 'usr-8', 
      code: 'EPA-TECH-19',
      name: 'Sultan Al-Shamsi', 
      role: 'Junior Telemetry Technician', 
      department: 'Field Operations & SLA', 
      email: 's.shamsi@epa.shj.ae', 
      phone: '+971 54 990 1288', 
      domain: 'Khorfakkan Maritime',
      status: 'Inactive', 
      lastLogin: '2026-08-15 08:30' 
    }
  ]);

  // Dynamic search & sorting
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Global Date Filter
      if (dateFilter !== 'ALL' && !searchQuery) {
        if (!isDateInRange(u.lastLogin || u.date)) return false;
      }

      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        (u.code && u.code.toLowerCase().includes(q)) ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.role && u.role.toLowerCase().includes(q)) ||
        (u.department && u.department.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.domain && u.domain.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Individual Column Filters
      for (const colKey in columnFilters) {
        const filterVal = columnFilters[colKey]?.trim().toLowerCase();
        if (filterVal) {
          let cellVal = '';
          if (colKey === 'name') cellVal = `${u.name || ''} ${u.role || ''}`.toLowerCase();
          else if (colKey === 'department') cellVal = `${u.department || ''} ${u.domain || ''}`.toLowerCase();
          else if (colKey === 'email') cellVal = `${u.email || ''} ${u.phone || ''}`.toLowerCase();
          else cellVal = String(u[colKey] || '').toLowerCase();
          
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
  }, [users, searchQuery, sortField, sortDirection]);

  // Pagination calculations
  const totalRecords = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, startIndex, endIndex]);

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

  // Export functionality
  const handleExport = (format) => {
    setIsExportDropdownOpen(false);
    
    if (filteredUsers.length === 0) {
      alert('No user directory records available to export.');
      return;
    }

    const fileName = `Sharjah_EPA_Users_${filteredUsers.length}_Records.${format.toLowerCase()}`;

    if (format === 'csv') {
      const headers = ['User ID', 'Employee Name', 'EPA Role & Title', 'Department', 'Email Address', 'Phone Number', 'Assigned Territory', 'Status', 'Last Active'];
      const rows = filteredUsers.map(u => [
        `"${u.code || u.id || ''}"`,
        `"${u.name || ''}"`,
        `"${u.role || ''}"`,
        `"${u.department || ''}"`,
        `"${u.email || ''}"`,
        `"${u.phone || ''}"`,
        `"${u.domain || ''}"`,
        `"${u.status || ''}"`,
        `"${u.lastLogin || ''}"`
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
    }

    if (triggerExportSuccess) {
      triggerExportSuccess({
        filename: fileName,
        format: format.toUpperCase(),
        count: filteredUsers.length,
        title: 'User Directory Downloaded Successfully!'
      });
    }

    if (format === 'pdf') {
      window.print();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Outer Panel Container (Matches Work Orders & SLA Layout) */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>

        {/* Top Controls Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', width: '100%' }}>
          
          {/* Left: Search Input */}
          <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search users, roles, email, domain..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{ paddingLeft: '36px', height: '36px', fontSize: '0.8rem', background: '#FFFFFF' }}
            />
          </div>

          {/* Right Controls: Export Dropdown + View Mode Switcher + Add User CTA */}
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
                    All Users ({filteredUsers.length})
                  </div>
                  <div 
                    onClick={() => handleExport('csv')} 
                    style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1E293B' }}
                  >
                    <FileSpreadsheet size={15} color="#00A878" /> Export as CSV
                  </div>
                  <div 
                    onClick={() => handleExport('pdf')} 
                    style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1E293B' }}
                  >
                    <FileText size={15} color="#EF4444" /> Export as PDF
                  </div>
                </div>
              )}
            </div>

            {/* View Mode Switcher Toggle (Table vs Cards) */}
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
            </div>

            {/* Add User CTA Button */}
            <button 
              onClick={() => setIsAddUserModalOpen(true)}
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
                boxShadow: '0 4px 12px rgba(0, 168, 120, 0.25)'
              }}
            >
              <UserPlus size={16} /> Add User
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
              <Filter size={14} color="#00A878" /> Filter User Cards:
            </div>
            <input
              type="text"
              placeholder="Filter User Code..."
              value={columnFilters.code || ''}
              onChange={(e) => { setColumnFilters(p => ({ ...p, code: e.target.value })); setCurrentPage(1); }}
              style={{ padding: '5px 10px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }}
            />
            <input
              type="text"
              placeholder="Filter Full Name / Role..."
              value={columnFilters.name || ''}
              onChange={(e) => { setColumnFilters(p => ({ ...p, name: e.target.value })); setCurrentPage(1); }}
              style={{ padding: '5px 10px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }}
            />
            <input
              type="text"
              placeholder="Filter Department..."
              value={columnFilters.department || ''}
              onChange={(e) => { setColumnFilters(p => ({ ...p, department: e.target.value })); setCurrentPage(1); }}
              style={{ padding: '5px 10px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }}
            />
            <input
              type="text"
              placeholder="Filter Email..."
              value={columnFilters.email || ''}
              onChange={(e) => { setColumnFilters(p => ({ ...p, email: e.target.value })); setCurrentPage(1); }}
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

        {/* View Mode 1: Enterprise Table View (Same design as Work Orders & SLA) */}
        {viewMode === 'table' && (
          <>
            <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
              <table className="epa-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('code')} style={{ cursor: 'pointer', width: '130px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        USER CODE {renderSortIcon('code')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        USER FULL NAME & ROLE {renderSortIcon('name')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('department')} style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        DEPARTMENT & DOMAIN {renderSortIcon('department')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        CONTACT INFORMATION {renderSortIcon('email')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('status')} style={{ cursor: 'pointer', width: '110px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        STATUS {renderSortIcon('status')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('lastLogin')} style={{ cursor: 'pointer', width: '150px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        LAST LOGIN {renderSortIcon('lastLogin')}
                      </div>
                    </th>
                    <th style={{ textAlign: 'center', width: '120px', whiteSpace: 'nowrap' }}>
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
                          placeholder="Filter Name/Role..."
                          value={columnFilters.name || ''}
                          onChange={(e) => { setColumnFilters(p => ({ ...p, name: e.target.value })); setCurrentPage(1); }}
                          style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                        />
                      </th>
                      <th style={{ padding: '6px 8px' }}>
                        <input
                          type="text"
                          placeholder="Filter Department..."
                          value={columnFilters.department || ''}
                          onChange={(e) => { setColumnFilters(p => ({ ...p, department: e.target.value })); setCurrentPage(1); }}
                          style={{ width: '100%', padding: '4px 8px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', background: '#FFF' }}
                        />
                      </th>
                      <th style={{ padding: '6px 8px' }}>
                        <input
                          type="text"
                          placeholder="Filter Contact..."
                          value={columnFilters.email || ''}
                          onChange={(e) => { setColumnFilters(p => ({ ...p, email: e.target.value })); setCurrentPage(1); }}
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
                          placeholder="Filter Last Login..."
                          value={columnFilters.lastLogin || ''}
                          onChange={(e) => { setColumnFilters(p => ({ ...p, lastLogin: e.target.value })); setCurrentPage(1); }}
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
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '32px 16px', color: '#64748B' }}>
                        No user accounts found matching your search query.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <span style={{ fontWeight: 700, color: '#00A878', fontFamily: 'monospace' }}>{u.code}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#0F172A' }}>{u.name}</div>
                          <div style={{ fontSize: '0.74rem', color: '#2563EB', fontWeight: 700, marginTop: '2px' }}>{u.role}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.8rem' }}>{u.department}</div>
                          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                            Domain: <strong style={{ color: '#0F172A' }}>{u.domain}</strong>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.78rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontWeight: 500 }}>
                            <Mail size={13} color="#64748B" /> {u.email}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', marginTop: '3px', fontSize: '0.74rem' }}>
                            <Phone size={13} color="#64748B" /> {u.phone}
                          </div>
                        </td>
                        <td>
                          <span style={{ 
                            background: '#E6F4EA', 
                            color: '#0D9488', 
                            borderRadius: '16px', 
                            padding: '3px 10px', 
                            fontSize: '0.72rem', 
                            fontWeight: 700,
                            display: 'inline-block'
                          }}>
                            {u.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#64748B', fontFamily: 'monospace' }}>
                          {u.lastLogin}
                        </td>
                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <button
                              onClick={() => setSelectedUserModal(u)}
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
                              title="View Profile Details"
                            >
                              <Eye size={14} />
                            </button>
                            <a
                              href={`mailto:${u.email}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                border: '1px solid #00A878',
                                background: '#ECFDF5',
                                color: '#00A878',
                                textDecoration: 'none'
                              }}
                              title="Send Email"
                            >
                              <Mail size={14} />
                            </a>
                            <a
                              href={`tel:${u.phone}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                border: '1px solid #3B82F6',
                                background: '#EFF6FF',
                                color: '#2563EB',
                                textDecoration: 'none'
                              }}
                              title="Call Technician"
                            >
                              <Phone size={14} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Standardized Bottom Pagination Bar (Matches Work Orders & SLA) */}
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
                <span>Showing <strong style={{ color: '#0F172A' }}>{totalRecords > 0 ? startIndex + 1 : 0}</strong> to <strong style={{ color: '#0F172A' }}>{endIndex}</strong> of <strong style={{ color: '#0F172A' }}>{totalRecords}</strong> users</span>
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
          </>
        )}

        {/* View Mode 2: Card View (Preserved EXACT Card Layout Design) */}
        {viewMode === 'cards' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '8px' }}>
            {filteredUsers.map(u => (
              <div 
                key={u.id} 
                style={{ 
                  background: '#FFFFFF', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '14px', 
                  padding: '16px 18px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
                className="glass-panel-hover"
              >
                <div>
                  {/* Header: Active Badge (Left) & User Code (Right) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ 
                      background: '#E6F4EA', 
                      color: '#0D9488', 
                      borderRadius: '16px', 
                      padding: '3px 12px', 
                      fontSize: '0.74rem', 
                      fontWeight: 700 
                    }}>
                      {u.status}
                    </span>
                    <span style={{ color: '#00A878', fontWeight: 700, fontSize: '0.74rem', fontFamily: 'sans-serif' }}>
                      {u.code}
                    </span>
                  </div>

                  {/* Name, Role & Subtitle Department */}
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0', lineHeight: 1.3 }}>
                    {u.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563EB', marginBottom: '2px' }}>
                    {u.role}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginBottom: '14px' }}>
                    {u.department}
                  </div>

                  {/* Contact Info Box Container */}
                  <div style={{ 
                    background: '#F8FAFC', 
                    border: '1px solid #F1F5F9', 
                    borderRadius: '10px', 
                    padding: '10px 12px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '8px', 
                    marginBottom: '14px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={14} style={{ color: '#64748B', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 500, wordBreak: 'break-all' }}>
                        {u.email}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={14} style={{ color: '#64748B', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 500 }}>
                        {u.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Assigned Domain Footer */}
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', fontSize: '0.74rem', color: '#64748B' }}>
                  Assigned Domain: <strong style={{ color: '#0F172A', fontWeight: 700 }}>{u.domain}</strong>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* User Profile Modal */}
      {selectedUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '500px', maxWidth: '100%', padding: '24px', background: '#FFFFFF', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={22} color="#00A878" />
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#00A878', fontWeight: 700, fontFamily: 'monospace' }}>{selectedUserModal.code}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937', margin: 0 }}>{selectedUserModal.name}</h3>
                </div>
              </div>
              <button onClick={() => setSelectedUserModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '16px', marginBottom: '18px', fontSize: '0.82rem', color: '#334155' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.78rem' }}>
                <div>Role: <strong style={{ color: '#2563EB' }}>{selectedUserModal.role}</strong></div>
                <div>Department: <strong>{selectedUserModal.department}</strong></div>
                <div>Domain: <strong>{selectedUserModal.domain}</strong></div>
                <div>Status: <strong style={{ color: '#059669' }}>{selectedUserModal.status}</strong></div>
                <div>Email: <strong>{selectedUserModal.email}</strong></div>
                <div>Phone: <strong>{selectedUserModal.phone}</strong></div>
                <div>Last Login: <strong>{selectedUserModal.lastLogin}</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setSelectedUserModal(null)} className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '520px', maxWidth: '100%', padding: '24px', background: '#FFFFFF', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} color="#00A878" /> Add New EPA Operator / User
              </h3>
              <button onClick={() => setIsAddUserModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const newUser = {
                id: `usr-${Date.now()}`,
                code: `EPA-USR-${Math.floor(10 + Math.random() * 90)}`,
                name: form.fullName.value,
                role: form.role.value,
                department: form.department.value,
                email: form.email.value,
                phone: form.phone.value,
                domain: form.domain.value,
                status: 'Active',
                lastLogin: 'Just now'
              };
              setUsers(prev => [newUser, ...prev]);
              setIsAddUserModalOpen(false);
              alert('New EPA user account provisioned successfully!');
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Full Name</label>
                  <input type="text" name="fullName" required className="input-field" placeholder="e.g. Eng. Salem Al-Ketbi" style={{ background: '#FFFFFF', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Official Email</label>
                  <input type="email" name="email" required className="input-field" placeholder="s.ketbi@epa.shj.ae" style={{ background: '#FFFFFF', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Role / Designation</label>
                  <input type="text" name="role" required className="input-field" placeholder="e.g. Senior Air Inspector" style={{ background: '#FFFFFF', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Department</label>
                  <input type="text" name="department" required className="input-field" placeholder="e.g. Air Quality Monitoring" style={{ background: '#FFFFFF', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                  <input type="text" name="phone" required className="input-field" placeholder="+971 50 123 4567" style={{ background: '#FFFFFF', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Assigned Domain</label>
                  <input type="text" name="domain" required className="input-field" placeholder="e.g. Central Sharjah" style={{ background: '#FFFFFF', width: '100%' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-epa">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
