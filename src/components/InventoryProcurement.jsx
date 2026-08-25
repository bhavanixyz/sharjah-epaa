import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Plus, Table, Map, Download, ChevronDown, 
  ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, FileSpreadsheet, FileText, 
  ArrowUpRight, ArrowDownLeft, X, AlertTriangle, Package, Layers 
} from 'lucide-react';
import GisMap from './GisMap';

export default function InventoryProcurement() {
  const { inventory, setInventory } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Export dropdown ref & state
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);

  // Form State for New Stock Item
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Consumables');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('50');
  const [minThreshold, setMinThreshold] = useState('10');
  const [unitCost, setUnitCost] = useState('$120.00');
  const [supplier, setSupplier] = useState('Horiba Scientific UAE');
  const [siteLocation, setSiteLocation] = useState('Central EPA Depot');

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

  const handleAddItem = (e) => {
    e.preventDefault();
    const newItem = {
      id: `inv-${Date.now()}`,
      name: name || 'Replacement Diaphragm Kit',
      category,
      sku: sku || `SKU-EPA-${Math.floor(1000 + Math.random() * 9000)}`,
      quantity: parseInt(quantity) || 50,
      minThreshold: parseInt(minThreshold) || 10,
      unitCost,
      supplier,
      siteLocation
    };
    setInventory([newItem, ...inventory]);
    setIsModalOpen(false);
    setName('');
    setSku('');
  };

  const handleAdjustStock = (id, delta) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  // Filter & Sort Inventory items
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      // Search filter
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.sku && item.sku.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.supplier && item.supplier.toLowerCase().includes(q)) ||
        (item.siteLocation && item.siteLocation.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Category filter
      if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;

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
  }, [inventory, searchQuery, filterCategory, sortField, sortDirection]);

  // Pagination calculations
  const totalRecords = filteredInventory.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);

  const paginatedInventory = useMemo(() => {
    return filteredInventory.slice(startIndex, endIndex);
  }, [filteredInventory, startIndex, endIndex]);

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

    if (filteredInventory.length === 0) {
      alert('No inventory records available to export.');
      return;
    }

    if (format === 'csv') {
      const headers = ['SKU Code', 'Item Description', 'Category', 'Current Stock', 'Min Safety Threshold', 'Unit Cost', 'Depot Location', 'Supplier'];
      const rows = filteredInventory.map(item => [
        `"${item.sku || ''}"`,
        `"${item.name || ''}"`,
        `"${item.category || ''}"`,
        `"${item.quantity || 0}"`,
        `"${item.minThreshold || 0}"`,
        `"${item.unitCost || ''}"`,
        `"${item.siteLocation || ''}"`,
        `"${item.supplier || ''}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Sharjah_EPA_Inventory_${filteredInventory.length}_Items.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
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
                placeholder="Search SKU, item name, category, depot..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ paddingLeft: '36px', fontSize: '0.8rem', background: '#FFFFFF' }}
              />
            </div>
          </div>

          {/* Right Controls: Export + View Modes + Register Stock CTA */}
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
                    All Filtered ({filteredInventory.length})
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

            {/* Register Stock CTA */}
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
              <Plus size={16} /> Register New Stock Item
            </button>
          </div>
        </div>

        {/* View Mode 1: Table View (Matching Work Orders & SLA 7-Column Layout) */}
        {viewMode === 'table' && (
          <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
            <table className="epa-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('sku')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      SKU CODE {renderSortIcon('sku')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ITEM NAME & DEPOT {renderSortIcon('name')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      CATEGORY {renderSortIcon('category')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      STOCK LEVEL {renderSortIcon('quantity')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('unitCost')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      UNIT PRICE {renderSortIcon('unitCost')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('supplier')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      SUPPLIER {renderSortIcon('supplier')}
                    </div>
                  </th>
                  <th style={{ textAlign: 'center', width: '140px', whiteSpace: 'nowrap' }}>
                    STOCK ADJUSTMENT
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedInventory.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px 16px', color: '#64748B' }}>
                      No inventory items found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedInventory.map((item) => {
                    const isLowStock = item.quantity <= item.minThreshold;

                    return (
                      <tr key={item.id}>
                        <td>
                          <span style={{ fontWeight: 700, color: '#00A878', fontFamily: 'monospace' }}>{item.sku}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#1F2937' }}>{item.name}</div>
                          <div style={{ fontSize: '0.74rem', color: '#6B7280' }}>📍 {item.siteLocation}</div>
                        </td>
                        <td>
                          <span className="badge badge-blue">
                            {item.category}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={`badge ${isLowStock ? 'badge-critical' : 'badge-passed'}`}>
                              {isLowStock ? 'Low Stock' : 'In Stock'}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: isLowStock ? '#DC2626' : '#1F2937', fontWeight: 700 }}>
                              {item.quantity} / {item.minThreshold} min
                            </span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#1F2937', fontWeight: 700 }}>
                          {item.unitCost}
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                          {item.supplier}
                        </td>
                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button 
                              onClick={() => handleAdjustStock(item.id, -1)}
                              className="btn btn-secondary" 
                              style={{ padding: '4px 8px', fontSize: '0.72rem', height: '28px' }}
                              title="Issue 1 Unit (Work Order Consumption)"
                            >
                              <ArrowUpRight size={12} /> Issue
                            </button>
                            <button 
                              onClick={() => handleAdjustStock(item.id, 5)}
                              className="btn btn-epa" 
                              style={{ padding: '4px 8px', fontSize: '0.72rem', height: '28px' }}
                              title="Restock +5 Units (Stock Receipt)"
                            >
                              <ArrowDownLeft size={12} /> Restock
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
            <span>Showing <strong style={{ color: '#0F172A' }}>{totalRecords > 0 ? startIndex + 1 : 0}</strong> to <strong style={{ color: '#0F172A' }}>{endIndex}</strong> of <strong style={{ color: '#0F172A' }}>{totalRecords}</strong> inventory records</span>
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

      {/* Register Stock Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '500px', maxWidth: '100%', padding: '24px', background: '#FFFFFF', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937', margin: 0 }}>Register Spare Part / Consumable</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>ITEM DESCRIPTION</label>
                <input type="text" required placeholder="e.g. PTFE 47mm Membrane Filters (Pack of 50)" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="card-grid-2">
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>SKU CODE</label>
                  <input type="text" placeholder="e.g. SKU-EPA-9088" className="input-field" value={sku} onChange={(e) => setSku(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>CATEGORY</label>
                  <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Consumables">Consumables</option>
                    <option value="Sensors & Probes">Sensors & Probes</option>
                    <option value="Power & Solar">Power & Solar</option>
                    <option value="Sampling Probes">Sampling Probes</option>
                  </select>
                </div>
              </div>

              <div className="card-grid-2">
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>INITIAL QUANTITY</label>
                  <input type="number" className="input-field" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>MIN SAFETY THRESHOLD</label>
                  <input type="number" className="input-field" value={minThreshold} onChange={(e) => setMinThreshold(e.target.value)} />
                </div>
              </div>

              <div className="card-grid-3">
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>UNIT COST</label>
                  <input type="text" className="input-field" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>SUPPLIER VENDOR</label>
                  <input type="text" className="input-field" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>DEPOT LOCATION</label>
                  <input type="text" className="input-field" value={siteLocation} onChange={(e) => setSiteLocation(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-epa">Save Inventory Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
