import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, ArrowUpRight, ArrowDownLeft, X, AlertTriangle } from 'lucide-react';

export default function InventoryProcurement() {
  const { inventory, setInventory } = useApp();
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Consumables');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('50');
  const [minThreshold, setMinThreshold] = useState('10');
  const [unitCost, setUnitCost] = useState('$120.00');
  const [supplier, setSupplier] = useState('Horiba Scientific UAE');
  const [siteLocation, setSiteLocation] = useState('Central EPA Depot');

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

  const filteredInventory = filterCategory === 'ALL'
    ? inventory
    : inventory.filter(i => i.category === filterCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>Inventory & Spare Parts Management</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>PTFE filters, calibration gas cylinders, marine probes & MPPT solar controllers</p>
        </div>

        <div className="page-header-actions">
          <button onClick={() => setIsModalOpen(true)} className="btn btn-epa">
            <Plus size={16} /> Register New Stock Item
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginRight: '6px' }}>Category Filter:</span>
        {['ALL', 'Consumables', 'Sensors & Probes', 'Power & Solar', 'Sampling Probes'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: filterCategory === cat ? '#00A878' : '#F1F5F9',
              color: filterCategory === cat ? '#FFFFFF' : '#475569'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Inventory Stock Grid */}
      <div className="card-grid-responsive">
        {filteredInventory.map((item) => {
          const isLowStock = item.quantity <= item.minThreshold;
          return (
            <div key={item.id} className="glass-panel glass-panel-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span className="badge badge-blue">{item.category}</span>
                  <span className={`badge ${isLowStock ? 'badge-critical' : 'badge-normal'}`}>
                    {isLowStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2937', marginBottom: '4px' }}>{item.name}</h3>
                <div style={{ fontSize: '0.74rem', color: '#6B7280', marginBottom: '12px', fontFamily: 'monospace' }}>
                  SKU: <span style={{ color: '#0891B2' }}>{item.sku}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem', color: '#6B7280', marginBottom: '14px' }}>
                  <div>Current Stock: <strong style={{ color: isLowStock ? '#DC2626' : '#1F2937', fontSize: '1rem' }}>{item.quantity}</strong></div>
                  <div>Min Safety: <strong style={{ color: '#1F2937' }}>{item.minThreshold}</strong></div>
                  <div>Unit Price: <strong style={{ color: '#1F2937' }}>{item.unitCost}</strong></div>
                  <div>Depot: <strong style={{ color: '#1F2937' }}>{item.siteLocation}</strong></div>
                </div>

                {isLowStock && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#DC2626', background: '#FEE2E2', padding: '6px 10px', borderRadius: '6px', marginBottom: '12px' }}>
                    <AlertTriangle size={14} /> Below reorder threshold! Requisition required.
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', color: '#6B7280' }}>
                  Supplier: <strong style={{ color: '#1F2937' }}>{item.supplier}</strong>
                </span>

                {/* Stock Adjustment Controls */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    onClick={() => handleAdjustStock(item.id, -1)}
                    className="btn btn-secondary" 
                    style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                    title="Issue 1 Unit (Work Order Consumption)"
                  >
                    <ArrowUpRight size={12} /> Issue
                  </button>
                  <button 
                    onClick={() => handleAdjustStock(item.id, 5)}
                    className="btn btn-epa" 
                    style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                    title="Restock +5 Units (Stock Receipt)"
                  >
                    <ArrowDownLeft size={12} /> Restock
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Stock Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '500px', maxWidth: '100%', padding: '24px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937' }}>Register Spare Part / Consumable</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>ITEM DESCRIPTION</label>
                <input type="text" required placeholder="e.g. PTFE 47mm Membrane Filters (Pack of 50)" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>INITIAL QUANTITY</label>
                  <input type="number" className="input-field" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>MIN SAFETY THRESHOLD</label>
                  <input type="number" className="input-field" value={minThreshold} onChange={(e) => setMinThreshold(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
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
