import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckSquare, Square } from 'lucide-react';

export default function RolePermissionManagement() {
  const { roles, toggleRolePermission } = useApp();

  const permissionLabels = {
    createWO: 'Dispatch Work Orders',
    editWO: 'Edit & Update Work Orders',
    deleteWO: 'Delete System Records',
    approveProcurement: 'Approve Procurement Requisitions',
    manageUsers: 'Manage Users & Roles',
    configureSystem: 'Configure System Telemetry Settings',
    exportReports: 'Export Compliance Reports'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>Role-Based Access Control (RBAC) & Matrix</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Manage authority levels, operational role definitions and granular system permission toggles</p>
        </div>

        <div className="page-header-actions">
          <span className="badge badge-normal">ISO 27001 Granular Security</span>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="card-grid-responsive">
        {roles.map((role) => (
          <div key={role.id} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span className="badge badge-blue">{role.code}</span>
              <span style={{ fontSize: '0.74rem', color: '#6B7280' }}>{role.usersCount} Users Assigned</span>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2937', marginBottom: '6px' }}>{role.name}</h3>
            <p style={{ fontSize: '0.76rem', color: '#6B7280', marginBottom: '16px', lineHeight: '1.4' }}>{role.description}</p>

            <h4 style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1F2937', textTransform: 'uppercase', marginBottom: '10px' }}>
              Granular Permission Toggles
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.keys(permissionLabels).map((permKey) => {
                const isEnabled = role.permissions[permKey];
                return (
                  <div 
                    key={permKey}
                    onClick={() => toggleRolePermission(role.id, permKey)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: isEnabled ? '#E6F6F2' : '#F8FAFC',
                      border: isEnabled ? '1px solid #A3E6D2' : '1px solid #E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      userSelect: 'none'
                    }}
                  >
                    <span style={{ color: isEnabled ? '#1F2937' : '#6B7280', fontWeight: isEnabled ? 600 : 400 }}>
                      {permissionLabels[permKey]}
                    </span>
                    {isEnabled ? <CheckSquare size={16} color="#00A878" /> : <Square size={16} color="#9CA3AF" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
