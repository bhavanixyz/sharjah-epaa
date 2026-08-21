import React from 'react';
import { useApp } from '../context/AppContext';

export default function ContractsWarranty() {
  const { contracts } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>Vendor Contracts & Warranty Tracking</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Annual maintenance contracts (AMC), vendor SLAs, emergency response terms & expiration alerts</p>
        </div>
        
        <div className="page-header-actions">
          <span className="badge badge-normal">{contracts.length} Active SLA Contracts</span>
        </div>
      </div>

      <div className="card-grid-responsive">
        {contracts.map((cnt) => (
          <div key={cnt.id} className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span className="badge badge-blue">{cnt.contractType}</span>
              <span className={`badge ${cnt.status.includes('Expiring') ? 'badge-warning' : 'badge-normal'}`}>
                {cnt.status}
              </span>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2937', marginBottom: '4px' }}>{cnt.title}</h3>
            <p style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: '14px' }}>Vendor: {cnt.vendor}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem', color: '#6B7280', marginBottom: '14px' }}>
              <div>Start Date: <strong style={{ color: '#1F2937' }}>{cnt.startDate}</strong></div>
              <div>End Date: <strong style={{ color: '#1F2937' }}>{cnt.endDate}</strong></div>
              <div>Value: <strong style={{ color: '#00A878' }}>{cnt.value}</strong></div>
              <div>SLA Term: <strong style={{ color: '#2563EB' }}>{cnt.slaResponseTime}</strong></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
