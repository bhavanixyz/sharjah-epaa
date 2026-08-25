import React, { useState, useMemo } from 'react';
import { Filter, Download, Search, ChevronUp, ChevronDown, CheckSquare, Square, ChevronLeft, ChevronRight, FileText, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SecurityAuditTrail() {
  const { auditLogs: contextAuditLogs } = useApp();

  // Multi-Filter State
  const [filterUser, setFilterUser] = useState('ALL');
  const [filterModule, setFilterModule] = useState('ALL');
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Search & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('slNo');
  const [sortDirection, setSortDirection] = useState('asc');

  // Column Filters State
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});

  // Selection & Pagination
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Full Rich Audit Logs Dataset matching screenshot & reference standards
  const rawAuditLogs = useMemo(() => [
    { slNo: 1, id: 'aud-101', user: 'Eng. Humaid Al-Suwaidi', role: 'Super Admin', module: 'Equipment Management', action: 'UPDATE_CALIBRATION_SPAN', ipAddress: '192.168.1.45', timestamp: '2026-08-24 14:15:22', status: 'SUCCESS' },
    { slNo: 2, id: 'aud-102', user: 'Dr. Mariam Al-Qasimi', role: 'Director', module: 'Environmental Networks', action: 'EXPORT_NETWORK_TOPOLOGY', ipAddress: '192.168.1.12', timestamp: '2026-08-24 11:46:10', status: 'SUCCESS' },
    { slNo: 3, id: 'aud-103', user: 'Eng. Tariq Al-Mansoori', role: 'Calibration Lead', module: 'Drift & Gas Calibration', action: 'SIGN_OFF_DRIFT_CERT', ipAddress: '192.168.2.88', timestamp: '2026-08-24 09:32:05', status: 'SUCCESS' },
    { slNo: 4, id: 'aud-104', user: 'Fatima Rashid', role: 'Stock Manager', module: 'Inventory & Spare Parts', action: 'ADJUST_SAFETY_THRESHOLD', ipAddress: '192.168.1.99', timestamp: '2026-08-23 16:22:40', status: 'SUCCESS' },
    { slNo: 5, id: 'aud-105', user: 'Sultan Al-Nuaimi', role: 'Field Technician', module: 'Work Orders & SLA', action: 'CLOSE_WORK_ORDER_WO-89', ipAddress: '192.168.3.14', timestamp: '2026-08-23 14:08:19', status: 'SUCCESS' },
    { slNo: 6, id: 'aud-106', user: 'System Auto-Engine', role: 'Automated Bot', module: 'Live Site Management', action: 'TELEMETRY_POLL_CYCLE', ipAddress: '127.0.0.1', timestamp: '2026-08-23 12:00:00', status: 'SUCCESS' },
    { slNo: 7, id: 'aud-107', user: 'Eng. Humaid Al-Suwaidi', role: 'Super Admin', module: 'User Directory', action: 'CREATE_USER_ACCOUNT', ipAddress: '192.168.1.45', timestamp: '2026-08-22 15:10:04', status: 'SUCCESS' },
    { slNo: 8, id: 'aud-108', user: 'Fatima Rashid', role: 'Stock Manager', module: 'Procurement & Orders', action: 'SUBMIT_REQUISITION_REQ-109', ipAddress: '192.168.1.99', timestamp: '2026-08-22 11:05:30', status: 'SUCCESS' }
  ], []);

  // Filter Dropdown Options
  const userOptions = useMemo(() => ['ALL', ...new Set(rawAuditLogs.map(l => l.user))], [rawAuditLogs]);
  const moduleOptions = useMemo(() => ['ALL', ...new Set(rawAuditLogs.map(l => l.module))], [rawAuditLogs]);
  const actionOptions = useMemo(() => ['ALL', ...new Set(rawAuditLogs.map(l => l.action))], [rawAuditLogs]);
  const statusOptions = useMemo(() => ['ALL', ...new Set(rawAuditLogs.map(l => l.status))], [rawAuditLogs]);

  // Overall & Column Filtering Logic
  const filteredData = useMemo(() => {
    return rawAuditLogs.filter(row => {
      // Top Global Multi-Filter Dropdowns
      if (filterUser !== 'ALL' && row.user !== filterUser) return false;
      if (filterModule !== 'ALL' && row.module !== filterModule) return false;
      if (filterAction !== 'ALL' && row.action !== filterAction) return false;
      if (filterStatus !== 'ALL' && row.status !== filterStatus) return false;

      // Table Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          String(row.slNo).includes(q) ||
          row.user.toLowerCase().includes(q) ||
          row.role.toLowerCase().includes(q) ||
          row.module.toLowerCase().includes(q) ||
          row.action.toLowerCase().includes(q) ||
          row.ipAddress.toLowerCase().includes(q) ||
          row.timestamp.toLowerCase().includes(q) ||
          row.status.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Individual Column Filters
      for (const colKey in columnFilters) {
        const filterVal = columnFilters[colKey]?.trim().toLowerCase();
        if (filterVal) {
          let cellVal = '';
          if (colKey === 'user') cellVal = `${row.user} ${row.role}`.toLowerCase();
          else cellVal = String(row[colKey] || '').toLowerCase();
          
          if (!cellVal.includes(filterVal)) return false;
        }
      }

      return true;
    });
  }, [rawAuditLogs, filterUser, filterModule, filterAction, filterStatus, searchQuery, columnFilters]);

  // Sorting Logic
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (!sortColumn) return 0;
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();

      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination Calculations
  const totalRecords = sortedData.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  // Sorting Handler
  const handleSort = (colKey) => {
    if (sortColumn === colKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(colKey);
      setSortDirection('asc');
    }
  };

  // Selection Handlers
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(r => r.id));
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rId => rId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setFilterUser('ALL');
    setFilterModule('ALL');
    setFilterAction('ALL');
    setFilterStatus('ALL');
    setSearchQuery('');
    setColumnFilters({});
    setCurrentPage(1);
  };

  // Export to CSV Function
  const handleExportCSV = () => {
    const dataToExport = selectedRows.length > 0
      ? rawAuditLogs.filter(r => selectedRows.includes(r.id))
      : sortedData;

    if (dataToExport.length === 0) {
      alert('No records available to export.');
      return;
    }

    const headers = ['SL. NO.', 'User', 'Role', 'Target Module', 'Security Action Event', 'IP Address', 'Event Timestamp', 'Audit Status'];
    const rows = dataToExport.map(r => [
      r.slNo,
      `"${r.user}"`,
      `"${r.role}"`,
      `"${r.module}"`,
      `"${r.action}"`,
      `"${r.ipAddress}"`,
      `"${r.timestamp}"`,
      `"${r.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Security_Audit_Trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF Handler
  const handleExportPDF = () => {
    alert('Security Audit Log report generated and exported as PDF.');
  };

  const columns = [
    { key: 'slNo', label: 'SL. NO.', width: '90px' },
    { key: 'user', label: 'USER & ROLE', width: '220px' },
    { key: 'module', label: 'TARGET MODULE', width: '200px' },
    { key: 'action', label: 'SECURITY ACTION EVENT', width: '240px' },
    { key: 'ipAddress', label: 'IP ADDRESS', width: '140px' },
    { key: 'timestamp', label: 'EVENT TIMESTAMP', width: '180px' },
    { key: 'status', label: 'AUDIT STATUS', width: '130px' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Global Multi-Filter Panel */}
      <div className="glass-panel" style={{ 
        padding: '14px 20px', 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '12px', 
        alignItems: 'center',
        borderRadius: '12px'
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={16} color="#00A878" /> Global Multi-Filter Panel:
        </div>

        {/* Filter by User */}
        <select
          value={filterUser}
          onChange={(e) => { setFilterUser(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '6px 12px',
            fontSize: '0.78rem',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            fontWeight: 600,
            color: '#0F172A',
            background: '#FFFFFF',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">Filter by User: All</option>
          {userOptions.filter(u => u !== 'ALL').map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>

        {/* Filter by Module */}
        <select
          value={filterModule}
          onChange={(e) => { setFilterModule(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '6px 12px',
            fontSize: '0.78rem',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            fontWeight: 600,
            color: '#0F172A',
            background: '#FFFFFF',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">Filter by Module: All</option>
          {moduleOptions.filter(m => m !== 'ALL').map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* Filter by Action */}
        <select
          value={filterAction}
          onChange={(e) => { setFilterAction(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '6px 12px',
            fontSize: '0.78rem',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            fontWeight: 600,
            color: '#0F172A',
            background: '#FFFFFF',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">Filter by Action: All</option>
          {actionOptions.filter(a => a !== 'ALL').map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        {/* Filter by Status */}
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '6px 12px',
            fontSize: '0.78rem',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            fontWeight: 600,
            color: '#0F172A',
            background: '#FFFFFF',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">Filter by Status: All</option>
          {statusOptions.filter(s => s !== 'ALL').map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Reset Filters CTA */}
        <button
          onClick={handleResetFilters}
          style={{
            padding: '6px 14px',
            fontSize: '0.76rem',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            background: '#F1F5F9',
            color: '#475569',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RotateCcw size={13} /> Reset Filters
        </button>
      </div>

      {/* Main Table Card Container */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Toolbar: Search input, Column Filters Toggle, Export CSV & PDF */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search table records..."
                className="input-field"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{ paddingLeft: '36px', fontSize: '0.8rem', height: '36px', borderRadius: '8px' }}
              />
            </div>

            <button
              onClick={() => setShowColumnFilters(!showColumnFilters)}
              style={{
                padding: '7px 14px',
                fontSize: '0.78rem',
                borderRadius: '8px',
                border: showColumnFilters ? '1px solid #00A878' : '1px solid #CBD5E1',
                background: showColumnFilters ? '#E6F4EA' : '#FFFFFF',
                color: showColumnFilters ? '#00A878' : '#475569',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Filter size={14} /> Column Filters
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {selectedRows.length > 0 && (
              <span style={{ fontSize: '0.76rem', color: '#00A878', fontWeight: 700, background: '#E6F4EA', padding: '4px 10px', borderRadius: '6px' }}>
                {selectedRows.length} Selected
              </span>
            )}

            <button
              onClick={handleExportCSV}
              style={{
                padding: '7px 14px',
                fontSize: '0.78rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#334155',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Enterprise Table Container */}
        <div className="table-responsive" style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
          <table className="epa-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <button
                    onClick={handleSelectAll}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#00A878' }}
                  >
                    {selectedRows.length === paginatedData.length && paginatedData.length > 0 ? (
                      <CheckSquare size={16} />
                    ) : (
                      <Square size={16} color="#94A3B8" />
                    )}
                  </button>
                </th>

                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    style={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      width: col.width
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{col.label}</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <ChevronUp size={10} color={sortColumn === col.key && sortDirection === 'asc' ? '#00A878' : '#CBD5E1'} />
                        <ChevronDown size={10} color={sortColumn === col.key && sortDirection === 'desc' ? '#00A878' : '#CBD5E1'} />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>

              {/* Per-Column Filter Input Row */}
              {showColumnFilters && (
                <tr style={{ background: '#F8FAFC' }}>
                  <th />
                  {columns.map(col => (
                    <th key={`filter-${col.key}`} style={{ padding: '6px 8px' }}>
                      <input
                        type="text"
                        placeholder={`Filter ${col.label}...`}
                        value={columnFilters[col.key] || ''}
                        onChange={(e) => {
                          setColumnFilters(prev => ({ ...prev, [col.key]: e.target.value }));
                          setCurrentPage(1);
                        }}
                        style={{
                          width: '100%',
                          padding: '4px 8px',
                          fontSize: '0.74rem',
                          borderRadius: '4px',
                          border: '1px solid #CBD5E1',
                          outline: 'none',
                          background: '#FFFFFF'
                        }}
                      />
                    </th>
                  ))}
                </tr>
              )}
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                    No security audit logs match the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  const isSelected = selectedRows.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      style={{
                        background: isSelected ? 'rgba(0, 168, 120, 0.05)' : undefined
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleSelectRow(row.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#00A878' }}
                        >
                          {isSelected ? <CheckSquare size={16} /> : <Square size={16} color="#CBD5E1" />}
                        </button>
                      </td>

                      {/* SL. NO. */}
                      <td>
                        <span style={{ fontWeight: 800, color: '#00A878', fontFamily: 'monospace' }}>
                          #{row.slNo}
                        </span>
                      </td>

                      {/* USER & ROLE */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>
                            {row.user}
                          </span>
                          <span style={{ 
                            fontSize: '0.68rem', 
                            fontWeight: 700, 
                            color: '#2563EB', 
                            background: '#EFF6FF', 
                            padding: '2px 8px', 
                            borderRadius: '10px', 
                            width: 'fit-content' 
                          }}>
                            {row.role}
                          </span>
                        </div>
                      </td>

                      {/* TARGET MODULE */}
                      <td style={{ color: '#334155', fontWeight: 600 }}>
                        {row.module}
                      </td>

                      {/* SECURITY ACTION EVENT */}
                      <td>
                        <span style={{ 
                          fontFamily: 'monospace', 
                          fontSize: '0.75rem', 
                          color: '#0891B2', 
                          fontWeight: 700 
                        }}>
                          {row.action}
                        </span>
                      </td>

                      {/* IP ADDRESS */}
                      <td>
                        <span style={{ fontFamily: 'monospace', color: '#64748B', fontSize: '0.78rem' }}>
                          {row.ipAddress}
                        </span>
                      </td>

                      {/* EVENT TIMESTAMP */}
                      <td style={{ color: '#475569', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        {row.timestamp}
                      </td>

                      {/* AUDIT STATUS */}
                      <td>
                        <span style={{ 
                          background: '#E6F4EA', 
                          color: '#0D9488', 
                          padding: '3px 10px', 
                          borderRadius: '12px', 
                          fontSize: '0.72rem', 
                          fontWeight: 800 
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Standard Bottom Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.78rem', color: '#64748B' }}>
          
          {/* Page Size Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>View records per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontWeight: 700,
                color: '#0F172A',
                cursor: 'pointer'
              }}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </div>

          {/* Showing Count */}
          <div>
            Showing {totalRecords > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + pageSize, totalRecords)} of {totalRecords} records
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '5px 10px',
                fontSize: '0.74rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: currentPage === 1 ? '#94A3B8' : '#334155',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600
              }}
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <span style={{ fontWeight: 700, color: '#0F172A', padding: '0 6px' }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '5px 10px',
                fontSize: '0.74rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: currentPage === totalPages ? '#94A3B8' : '#334155',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
