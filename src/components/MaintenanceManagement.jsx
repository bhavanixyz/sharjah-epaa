import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Clock, User } from 'lucide-react';

export default function MaintenanceManagement() {
  const { workOrders, setIsWoModalOpen } = useApp();
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredWOs = statusFilter === 'ALL' 
    ? workOrders 
    : workOrders.filter(w => w.status === statusFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Controls */}
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>Maintenance & Work Order Lifecycle</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>SLA response tracking, technician dispatch, preventive maintenance & corrective tickets</p>
        </div>

        <div className="page-header-actions">
          {/* Status Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', background: '#F8FAFC', padding: '4px', borderRadius: '8px', border: '1px solid #E5E7EB', maxWidth: '100%' }}>
            {['ALL', 'Open', 'In Progress', 'Pending Approval', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: statusFilter === st ? '#00A878' : 'transparent',
                  color: statusFilter === st ? '#FFFFFF' : '#4B5563'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <button onClick={() => setIsWoModalOpen(true)} className="btn btn-epa">
            <Plus size={16} /> Create Work Order
          </button>
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="glass-panel table-responsive">
        <table className="epa-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Task Title & Station</th>
              <th>Target Asset</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Technician</th>
              <th>SLA Timer</th>
            </tr>
          </thead>
          <tbody>
            {filteredWOs.map((wo) => (
              <tr key={wo.id}>
                <td>
                  <span style={{ fontWeight: 700, color: '#00A878', fontFamily: 'monospace' }}>{wo.id}</span>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{wo.type}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: '#1F2937' }}>{wo.title}</div>
                  <div style={{ fontSize: '0.74rem', color: '#6B7280' }}>{wo.siteName}</div>
                </td>
                <td style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                  {wo.assetName}
                </td>
                <td>
                  <span className={`badge ${wo.priority === 'Critical' ? 'badge-critical' : wo.priority === 'High' ? 'badge-warning' : 'badge-blue'}`}>
                    {wo.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge ${wo.status === 'Completed' ? 'badge-passed' : wo.status === 'In Progress' ? 'badge-blue' : 'badge-pending'}`}>
                    {wo.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} color="#0891B2" /> {wo.assignedTo}
                  </div>
                </td>
                <td style={{ fontSize: '0.78rem', color: wo.slaTimeRemaining.includes('Urgent') ? '#DC2626' : '#00A878', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {wo.slaTimeRemaining}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
