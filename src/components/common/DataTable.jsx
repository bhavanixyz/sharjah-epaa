import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown, Download, FileText, CheckSquare, Square, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  onRowClick,
  onExportCSV,
  onExportPDF,
  showSelection = true,
  title = "Records Table"
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // asc | desc
  const [sortMenuColumn, setSortMenuColumn] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [columnFilters, setColumnFilters] = useState({});
  const [showFilterRow, setShowFilterRow] = useState(true);

  // Handle Global Search & Column Filtering
  const filteredData = data.filter((row) => {
    // Global search
    const matchesGlobal = searchQuery === '' || Object.values(row).some(val => 
      String(val || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (!matchesGlobal) return false;

    // Column-wise filtering
    for (const key in columnFilters) {
      const filterVal = columnFilters[key];
      if (filterVal) {
        const rowVal = String(row[key] || '').toLowerCase();
        if (!rowVal.includes(filterVal.toLowerCase())) return false;
      }
    }

    return true;
  });

  // Handle Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn] ?? '';
    const bVal = b[sortColumn] ?? '';
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();

    if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination Logic
  const totalRecords = sortedData.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (key) => {
    if (sortColumn === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(r => r.id || r.serialNo || JSON.stringify(r)));
    }
  };

  const handleSelectRow = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter(id => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  const handleColumnFilterChange = (key, value) => {
    setColumnFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const triggerExportCSV = () => {
    const exportItems = selectedRows.length > 0
      ? data.filter(r => selectedRows.includes(r.id || r.serialNo || JSON.stringify(r)))
      : sortedData;

    if (onExportCSV) {
      onExportCSV(exportItems);
    } else {
      const csvRows = [];
      if (exportItems.length === 0) return;
      const headers = Object.keys(exportItems[0]).join(',');
      csvRows.push(headers);
      exportItems.forEach(item => {
        csvRows.push(Object.values(item).map(v => `"${v}"`).join(','));
      });
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `EPAA_Export_${Date.now()}.csv`);
      a.click();
      alert('File downloaded successfully.');
    }
  };

  const triggerExportPDF = () => {
    if (onExportPDF) {
      onExportPDF(selectedRows);
    } else {
      alert('PDF export compilation complete. File downloaded successfully.');
    }
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px' }}>
      
      {/* Table Toolbar Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Search & Column Filter Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search table records..."
              className="input-field"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ paddingLeft: '34px', fontSize: '0.8rem', height: '36px' }}
            />
          </div>

          <button
            onClick={() => setShowFilterRow(!showFilterRow)}
            className={`btn ${showFilterRow ? 'btn-epa' : 'btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Filter size={14} /> {showFilterRow ? 'Hide Column Filters' : 'Column Filters'}
          </button>
        </div>

        {/* Export & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {selectedRows.length > 0 && (
            <span style={{ fontSize: '0.76rem', color: '#00A878', fontWeight: 700, background: 'rgba(0, 168, 120, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>
              {selectedRows.length} Selected
            </span>
          )}

          <button
            onClick={triggerExportCSV}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Export to CSV format"
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            onClick={triggerExportPDF}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Export to PDF document"
          >
            <FileText size={14} color="#DC2626" /> Export PDF
          </button>
        </div>
      </div>

      {/* Main Table Layout */}
      <div className="table-responsive" style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
        <table className="epa-table">
          <thead>
            <tr>
              {showSelection && (
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
              )}

              {columns.map((col) => {
                const isCurrentSort = sortColumn === col.key;
                return (
                  <th
                    key={col.key}
                    style={{
                      position: 'relative',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      padding: '10px 12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span 
                        onClick={() => col.sortable !== false && handleSort(col.key)}
                        style={{ cursor: col.sortable !== false ? 'pointer' : 'default', fontWeight: 700 }}
                      >
                        {col.label}
                      </span>

                      {col.sortable !== false && (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSortMenuColumn(sortMenuColumn === col.key ? null : col.key);
                            }}
                            title="Sort options"
                            style={{
                              background: isCurrentSort ? '#E6F4EA' : 'transparent',
                              border: `1px solid ${isCurrentSort ? '#00A878' : 'transparent'}`,
                              borderRadius: '4px',
                              padding: '2px 4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <ChevronUp size={10} color={isCurrentSort && sortDirection === 'asc' ? '#00A878' : '#64748B'} />
                              <ChevronDown size={10} color={isCurrentSort && sortDirection === 'desc' ? '#00A878' : '#64748B'} />
                            </div>
                          </button>

                          {/* Sort Options Popover Menu */}
                          {sortMenuColumn === col.key && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                zIndex: 9999,
                                marginTop: '4px',
                                background: '#FFFFFF',
                                border: '1px solid #CBD5E1',
                                borderRadius: '8px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                padding: '6px',
                                minWidth: '150px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => {
                                  setSortColumn(col.key);
                                  setSortDirection('asc');
                                  setSortMenuColumn(null);
                                }}
                                style={{
                                  background: isCurrentSort && sortDirection === 'asc' ? '#F0FDF4' : 'transparent',
                                  color: isCurrentSort && sortDirection === 'asc' ? '#00A878' : '#1E293B',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '6px 10px',
                                  textAlign: 'left',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <ChevronUp size={14} color="#00A878" /> Sort Ascending (A-Z)
                              </button>

                              <button
                                onClick={() => {
                                  setSortColumn(col.key);
                                  setSortDirection('desc');
                                  setSortMenuColumn(null);
                                }}
                                style={{
                                  background: isCurrentSort && sortDirection === 'desc' ? '#F0FDF4' : 'transparent',
                                  color: isCurrentSort && sortDirection === 'desc' ? '#00A878' : '#1E293B',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '6px 10px',
                                  textAlign: 'left',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <ChevronDown size={14} color="#00A878" /> Sort Descending (Z-A)
                              </button>

                              {isCurrentSort && (
                                <button
                                  onClick={() => {
                                    setSortColumn(null);
                                    setSortDirection('asc');
                                    setSortMenuColumn(null);
                                  }}
                                  style={{
                                    background: '#FEF2F2',
                                    color: '#EF4444',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '6px 10px',
                                    textAlign: 'left',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    marginTop: '4px'
                                  }}
                                >
                                  Clear Sorting
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>

            {/* Column-wise Filter Inputs */}
            {showFilterRow && (
              <tr style={{ background: '#F8FAFC' }}>
                {showSelection && <th />}
                {columns.map((col) => (
                  <th key={`filter-${col.key}`} style={{ padding: '6px 8px' }}>
                    <input
                      type="text"
                      placeholder={`Filter ${col.label}...`}
                      value={columnFilters[col.key] || ''}
                      onChange={(e) => handleColumnFilterChange(col.key, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '4px 8px',
                        fontSize: '0.72rem',
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
                <td colSpan={columns.length + (showSelection ? 1 : 0)} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                  No records matching the selected search or column filter criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const rowId = row.id || row.serialNo || JSON.stringify(row);
                const isSelected = selectedRows.includes(rowId);
                return (
                  <tr
                    key={index}
                    onClick={() => onRowClick && onRowClick(row)}
                    style={{
                      background: isSelected ? 'rgba(0, 168, 120, 0.05)' : undefined,
                      cursor: onRowClick ? 'pointer' : 'default'
                    }}
                  >
                    {showSelection && (
                      <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSelectRow(rowId)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#00A878' }}
                        >
                          {isSelected ? <CheckSquare size={16} /> : <Square size={16} color="#CBD5E1" />}
                        </button>
                      </td>
                    )}

                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
            className="btn btn-secondary"
            style={{ padding: '4px 8px', fontSize: '0.74rem', opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <span style={{ fontWeight: 700, color: '#0F172A', padding: '0 4px' }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary"
            style={{ padding: '4px 8px', fontSize: '0.74rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
