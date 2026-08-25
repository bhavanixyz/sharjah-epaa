import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  QrCode, 
  Wrench, 
  Table, 
  LayoutGrid, 
  Map, 
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
  Plus,
  Cpu
} from 'lucide-react';
import GisMap from './GisMap';
import QRCodeDialog from './QRCodeDialog';

export default function AssetsManagement() {
  const { assets, setIsWoModalOpen } = useApp();
  const [searchAsset, setSearchAsset] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'table', 'cards', or 'map'
  const [sortField, setSortField] = useState('serialNo');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedAssetIds, setSelectedAssetIds] = useState([]);
  const [selectedQrAsset, setSelectedQrAsset] = useState(null);
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

  // Filter assets based on search query
  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const q = searchAsset.toLowerCase();
      return (
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.serialNo && a.serialNo.toLowerCase().includes(q)) ||
        (a.siteName && a.siteName.toLowerCase().includes(q)) ||
        (a.category && a.category.toLowerCase().includes(q)) ||
        (a.manufacturer && a.manufacturer.toLowerCase().includes(q))
      );
    });
  }, [assets, searchAsset]);

  // Sort assets based on sortField & sortDirection
  const sortedAssets = useMemo(() => {
    const data = [...filteredAssets];
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
  }, [filteredAssets, sortField, sortDirection]);

  // Pagination math
  const totalRecords = sortedAssets.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);

  const paginatedAssets = useMemo(() => {
    return sortedAssets.slice(startIndex, endIndex);
  }, [sortedAssets, startIndex, endIndex]);

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
    if (paginatedAssets.length === 0) return false;
    return paginatedAssets.every(a => selectedAssetIds.includes(a.id));
  }, [paginatedAssets, selectedAssetIds]);

  const toggleSelectAll = () => {
    if (isAllPaginatedSelected) {
      setSelectedAssetIds(prev => prev.filter(id => !paginatedAssets.some(pa => pa.id === id)));
    } else {
      const newIds = new Set([...selectedAssetIds, ...paginatedAssets.map(a => a.id)]);
      setSelectedAssetIds(Array.from(newIds));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedAssetIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Export handler (CSV / PDF)
  const handleExport = (format) => {
    setIsExportDropdownOpen(false);

    const exportData = selectedAssetIds.length > 0
      ? filteredAssets.filter(a => selectedAssetIds.includes(a.id))
      : filteredAssets;

    if (exportData.length === 0) {
      alert('No equipment asset records available to export.');
      return;
    }

    if (format === 'csv') {
      const headers = ['Serial Number', 'Asset Name', 'Category', 'Location / Site', 'Manufacturer', 'Health Score (%)', 'Last Calibrated', 'Next Due', 'Status'];
      const rows = exportData.map(a => [
        `"${a.serialNo || ''}"`,
        `"${a.name || ''}"`,
        `"${a.category || ''}"`,
        `"${a.siteName || ''}"`,
        `"${a.manufacturer || ''}"`,
        a.healthScore || 0,
        `"${a.lastCalibrated || ''}"`,
        `"${a.nextCalibration || ''}"`,
        `"${a.status || ''}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Sharjah_EPA_Assets_${exportData.length}_Records.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      const printWindow = window.open('', '_blank');
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Sharjah EPA - Equipment & Asset Directory</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; color: #1e293b; }
              h1 { color: #00A878; font-size: 20px; margin-bottom: 4px; }
              p { color: #64748b; font-size: 12px; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 12px; }
              th, td { border: 1px solid #e2e8f0; padding: 8px 12px; font-size: 11px; text-align: left; }
              th { background-color: #f8fafc; color: #475569; font-weight: bold; }
              tr:nth-child(even) { background-color: #f1f5f9; }
              .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; }
              .badge-active { background: #dcfce7; color: #166534; }
              .badge-degraded, .badge-under-maintenance { background: #fee2e2; color: #991b1b; }
            </style>
          </head>
          <body>
            <h1>Sharjah Environment Protected Authority (Sharjah EPA)</h1>
            <p>Field Equipment & Sensor Asset Inventory — Exported ${new Date().toLocaleDateString()} (${exportData.length} records)</p>
            <table>
              <thead>
                <tr>
                  <th>Serial Number</th>
                  <th>Asset Name & Category</th>
                  <th>Location / Site</th>
                  <th>Manufacturer</th>
                  <th>Health Score</th>
                  <th>Last Calibrated</th>
                  <th>Next Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${exportData.map(a => `
                  <tr>
                    <td><strong>${a.serialNo || ''}</strong></td>
                    <td>${a.name || ''}<br/><small style="color:#64748b">${a.category || ''}</small></td>
                    <td>${a.siteName || ''}</td>
                    <td>${a.manufacturer || ''}</td>
                    <td>${a.healthScore || 0}%</td>
                    <td>${a.lastCalibrated || ''}</td>
                    <td>${a.nextCalibration || ''}</td>
                    <td><span class="badge badge-${(a.status || 'active').toLowerCase().replace(' ', '-')}">${a.status || 'Active'}</span></td>
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

      {/* Main Asset Management Panel Container */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>

        {/* Top Header Toolbar: Search on Left, Right Aligned Export + View Switcher + CTA */}
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
          
          {/* Left Aligned Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 1 340px', minWidth: '240px' }}>
            <div className="page-header-search" style={{ margin: 0, width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search serial, name, category, site..." 
                value={searchAsset}
                onChange={(e) => {
                  setSearchAsset(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ paddingLeft: '36px', fontSize: '0.8rem', background: '#FFFFFF' }}
              />
            </div>
          </div>

          {/* Right Aligned Controls: Export Dropdown + View Mode Switcher + Register New Asset CTA */}
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
                <span>Export {selectedAssetIds.length > 0 ? `(${selectedAssetIds.length})` : ''}</span>
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
                    {selectedAssetIds.length > 0 ? `Selected Assets (${selectedAssetIds.length})` : `All Filtered (${filteredAssets.length})`}
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

            {/* Register New Asset CTA */}
            <button 
              onClick={() => setIsWoModalOpen(true)}
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
              <Plus size={16} /> Register New Asset
            </button>

          </div>
        </div>

        {/* Selected Items Counter Bar */}
        {selectedAssetIds.length > 0 && (
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
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={16} color="#00A878" />
              <span><strong>{selectedAssetIds.length}</strong> equipment assets selected out of {filteredAssets.length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => handleExport('csv')} 
                style={{ background: '#00A878', color: '#FFF', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 700 }}
              >
                Export Selected ({selectedAssetIds.length})
              </button>
              <button 
                onClick={() => setSelectedAssetIds([])} 
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
                  <th onClick={() => handleSort('serialNo')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Serial Number {renderSortIcon('serialNo')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Asset Name & Category {renderSortIcon('name')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('siteName')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Station / Site Location {renderSortIcon('siteName')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('manufacturer')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Manufacturer {renderSortIcon('manufacturer')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('healthScore')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Health Score {renderSortIcon('healthScore')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('lastCalibrated')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Last Calibrated {renderSortIcon('lastCalibrated')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('nextCalibration')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Next Due {renderSortIcon('nextCalibration')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Status {renderSortIcon('status')}
                    </div>
                  </th>
                  <th style={{ textAlign: 'center' }}>QR Tag</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssets.length === 0 ? (
                  <tr>
                    <td colSpan="11" style={{ textAlign: 'center', padding: '32px 16px', color: '#94A3B8' }}>
                      No equipment asset records found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedAssets.map((asset) => {
                    const isSelected = selectedAssetIds.includes(asset.id);
                    return (
                      <tr 
                        key={asset.id}
                        style={{
                          background: isSelected ? '#F0FDF4' : 'transparent',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => toggleSelectRow(asset.id)}
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
                          <span style={{ fontWeight: 700, color: '#00A878', fontFamily: 'monospace', background: '#E6F6F2', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(0, 168, 120, 0.2)' }}>
                            {asset.serialNo}
                          </span>
                        </td>

                        <td>
                          <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.88rem' }}>{asset.name}</div>
                          <span className="badge badge-blue" style={{ marginTop: '3px', display: 'inline-block', fontSize: '0.68rem' }}>{asset.category}</span>
                        </td>

                        <td style={{ fontSize: '0.82rem', color: '#4B5563', fontWeight: 600 }}>
                          {asset.siteName}
                        </td>

                        <td style={{ fontSize: '0.82rem', color: '#1F2937' }}>
                          {asset.manufacturer}
                        </td>

                        <td>
                          <span style={{ fontWeight: 800, color: asset.healthScore > 80 ? '#00A878' : '#DC2626', fontSize: '0.86rem' }}>
                            {asset.healthScore}%
                          </span>
                        </td>

                        <td style={{ fontSize: '0.78rem', color: '#64748B' }}>
                          {asset.lastCalibrated}
                        </td>

                        <td style={{ fontSize: '0.78rem', color: asset.nextCalibration.includes('OVERDUE') ? '#DC2626' : '#1F2937', fontWeight: 700 }}>
                          {asset.nextCalibration}
                        </td>

                        <td>
                          <span className={`badge badge-${asset.status.toLowerCase().replace(' ', '-')}`}>
                            {asset.status}
                          </span>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedQrAsset(asset)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px', borderColor: '#0891B2', color: '#0891B2', fontWeight: 600 }}
                            title="View & Print QR Code Tag"
                          >
                            <QrCode size={13} color="#0891B2" /> QR Tag
                          </button>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <button 
                            onClick={() => setIsWoModalOpen(true)}
                            className="btn btn-secondary" 
                            style={{ padding: '4px 10px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Wrench size={12} /> Service Request
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
            {paginatedAssets.map((asset) => {
              const isSelected = selectedAssetIds.includes(asset.id);
              return (
                <div 
                  key={asset.id}
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
                    {/* Top Row: Selection Checkbox, Category, Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => toggleSelectRow(asset.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          {isSelected ? <CheckSquare size={16} color="#00A878" /> : <Square size={16} color="#CBD5E1" />}
                        </button>
                        <span className="badge badge-blue">{asset.category}</span>
                      </div>
                      <span className={`badge badge-${asset.status.toLowerCase().replace(' ', '-')}`}>{asset.status}</span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1F2937', marginBottom: '4px' }}>{asset.name}</h4>
                    <div style={{ fontSize: '0.76rem', color: '#6B7280', marginBottom: '12px', fontFamily: 'monospace' }}>
                      Serial: <span style={{ color: '#00A878', fontWeight: 700 }}>{asset.serialNo}</span>
                    </div>

                    {/* Location Info */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.78rem' }}>
                      <span style={{ color: '#6B7280' }}>Location: </span>
                      <strong style={{ color: '#1F2937' }}>{asset.siteName}</strong>
                    </div>

                    {/* Specs & Health */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem', color: '#6B7280', marginBottom: '14px' }}>
                      <div>Manufacturer: <strong style={{ color: '#1F2937' }}>{asset.manufacturer}</strong></div>
                      <div>Health Score: <strong style={{ color: asset.healthScore > 80 ? '#00A878' : '#DC2626' }}>{asset.healthScore}%</strong></div>
                      <div>Last Calibrated: <strong style={{ color: '#1F2937' }}>{asset.lastCalibrated}</strong></div>
                      <div>Next Due: <strong style={{ color: asset.nextCalibration.includes('OVERDUE') ? '#DC2626' : '#1F2937' }}>{asset.nextCalibration}</strong></div>
                    </div>
                  </div>

                  {/* Card Footer: Interactive QR Tag Badge & Service Action */}
                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div 
                      onClick={() => setSelectedQrAsset(asset)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontSize: '0.74rem', 
                        color: '#0891B2',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: '#ECFEFF',
                        border: '1px solid rgba(8, 145, 178, 0.25)',
                        transition: 'all 0.15s ease'
                      }}
                      title="Click to view & print QR Code Tag"
                    >
                      <QrCode size={14} color="#0891B2" /> QR Tagged
                    </div>
                    <button 
                      onClick={() => setIsWoModalOpen(true)}
                      className="btn btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Wrench size={12} /> Service Request
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
            <GisMap mode="assets" selectedId={null} />
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
            <span>Showing <strong style={{ color: '#0F172A' }}>{totalRecords > 0 ? startIndex + 1 : 0}</strong> to <strong style={{ color: '#0F172A' }}>{endIndex}</strong> of <strong style={{ color: '#0F172A' }}>{totalRecords}</strong> asset records</span>
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

      {/* Equipment QR Code Tag Dialog Modal */}
      {selectedQrAsset && (
        <QRCodeDialog 
          asset={selectedQrAsset} 
          onClose={() => setSelectedQrAsset(null)} 
        />
      )}

    </div>
  );
}
