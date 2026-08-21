import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart } from 'lucide-react';

export default function InventoryProcurement() {
  const { inventory } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>Inventory & Spare Parts Management</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>PTFE filters, calibration gas cylinders, marine probes & MPPT solar controllers</p>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-epa">
            <ShoppingCart size={16} /> Create Requisition Request
          </button>
        </div>
      </div>

      {/* Inventory Stock Grid */}
      <div className="card-grid-responsive">
        {inventory.map((item) => {
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
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '12px', fontSize: '0.74rem', color: '#6B7280' }}>
                Supplier: <strong style={{ color: '#1F2937' }}>{item.supplier}</strong>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
