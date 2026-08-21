import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus } from 'lucide-react';

export default function ProcurementManagement() {
  const { procurement, createRequisition } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [vendor, setVendor] = useState('Thermo Fisher Scientific');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    createRequisition({
      title,
      vendor,
      totalAmount: `$${amount || '4,500.00'}`,
      department: 'Air Quality Operations',
      requestedBy: 'Eng. Humaid Al-Suwaidi'
    });
    setIsModalOpen(false);
    setTitle('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>Procurement & Purchase Requisitions</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Capital equipment requisitions, vendor quotes, purchase orders & approval workflows</p>
        </div>
        
        <div className="page-header-actions">
          <button onClick={() => setIsModalOpen(true)} className="btn btn-epa">
            <Plus size={16} /> New Purchase Requisition
          </button>
        </div>
      </div>

      {/* Procurement Table */}
      <div className="glass-panel table-responsive">
        <table className="epa-table">
          <thead>
            <tr>
              <th>PR ID & Req No</th>
              <th>Title & Description</th>
              <th>Department</th>
              <th>Vendor</th>
              <th>Total Amount</th>
              <th>Date Requested</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {procurement.map((pr) => (
              <tr key={pr.id}>
                <td>
                  <span style={{ fontWeight: 700, color: '#00A878', fontFamily: 'monospace' }}>{pr.id}</span>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{pr.requisitionNo}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: '#1F2937' }}>{pr.title}</div>
                  <div style={{ fontSize: '0.74rem', color: '#6B7280' }}>Requested by: {pr.requestedBy}</div>
                </td>
                <td style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                  {pr.department}
                </td>
                <td style={{ fontSize: '0.82rem', color: '#1F2937' }}>
                  {pr.vendor}
                </td>
                <td style={{ fontSize: '0.86rem', color: '#00A878', fontWeight: 700, fontFamily: 'monospace' }}>
                  {pr.totalAmount}
                </td>
                <td style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                  {pr.dateRequested}
                </td>
                <td>
                  <span className={`badge ${pr.status === 'Approved' ? 'badge-passed' : pr.status.includes('Order') ? 'badge-blue' : 'badge-pending'}`}>
                    {pr.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Requisition Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-panel" style={{ width: '480px', maxWidth: '90vw', padding: '24px', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: '#1F2937' }}>Create Purchase Requisition</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>REQUISITION TITLE</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Optical Filter Replacements" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>SUPPLIER VENDOR</label>
                <select className="input-field" value={vendor} onChange={(e) => setVendor(e.target.value)}>
                  <option value="Thermo Fisher Scientific">Thermo Fisher Scientific</option>
                  <option value="YSI Xylem Middle East">YSI Xylem Middle East</option>
                  <option value="Horiba Instruments Direct">Horiba Instruments Direct</option>
                  <option value="Campbell Scientific UAE">Campbell Scientific UAE</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>ESTIMATED AMOUNT ($)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="3400" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-epa">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
