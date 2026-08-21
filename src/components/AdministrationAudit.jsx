import React from 'react';
import { useApp } from '../context/AppContext';

export default function AdministrationAudit() {
  const { auditLogs } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>System Administration & Security Audit Trail</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Role-based access control (RBAC), user activity logs & cryptographic audit records</p>
        </div>
        
        <div className="page-header-actions">
          <span className="badge badge-normal">ISO 27001 Security Standard</span>
        </div>
      </div>

      <div className="glass-panel table-responsive">
        <table className="epa-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User Account & Role</th>
              <th>System Action</th>
              <th>Target Component / Station</th>
              <th>IP Address</th>
              <th>Security Status</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id}>
                <td style={{ fontSize: '0.78rem', color: '#6B7280', fontFamily: 'monospace' }}>
                  {log.timestamp}
                </td>
                <td style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.82rem' }}>
                  {log.user}
                </td>
                <td>
                  <span className="badge badge-blue">{log.action}</span>
                </td>
                <td style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                  {log.target}
                </td>
                <td style={{ fontSize: '0.76rem', color: '#9CA3AF', fontFamily: 'monospace' }}>
                  {log.ipAddress}
                </td>
                <td>
                  <span className={`badge ${log.status === 'SUCCESS' ? 'badge-passed' : 'badge-critical'}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
