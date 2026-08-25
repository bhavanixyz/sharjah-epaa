import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckSquare, Square, ShieldCheck } from 'lucide-react';

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
      
      {/* Top Header Panel Container */}
      <div className="glass-panel" style={{ padding: '20px 24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Role-Based Access Control (RBAC) & Matrix
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Manage authority levels, operational role definitions and granular system permission toggles
          </p>
        </div>

        {/* Security Standard Badge */}
        <span style={{ 
          background: '#E6F4EA', 
          color: '#0D9488', 
          padding: '6px 16px', 
          borderRadius: '20px', 
          fontSize: '0.76rem', 
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid #A7F3D0'
        }}>
          <ShieldCheck size={16} /> ISO 27001 Granular Security
        </span>
      </div>

      {/* 5-Column Grid Card Layout Matching Reference Image */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', 
        gap: '16px',
        alignItems: 'stretch'
      }}>
        {roles.map((role) => (
          <div 
            key={role.id} 
            style={{ 
              background: '#FFFFFF', 
              border: '1px solid #E2E8F0', 
              borderRadius: '14px', 
              padding: '18px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            className="glass-panel-hover"
          >
            <div>
              {/* Header: Role Code Badge & Users Assigned */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ 
                  background: '#EFF6FF', 
                  color: '#2563EB', 
                  borderRadius: '14px', 
                  padding: '3px 10px', 
                  fontSize: '0.7rem', 
                  fontWeight: 700,
                  fontFamily: 'sans-serif'
                }}>
                  {role.code}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>
                  {role.usersCount} Users Assigned
                </span>
              </div>

              {/* Role Title & Description */}
              <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                {role.name}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '16px', lineHeight: '1.45', minHeight: '52px' }}>
                {role.description}
              </p>

              {/* Section Title */}
              <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                Granular Permission Toggles
              </h4>

              {/* Permission Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.keys(permissionLabels).map((permKey) => {
                  const isEnabled = role.permissions[permKey];
                  return (
                    <div 
                      key={permKey}
                      onClick={() => toggleRolePermission(role.id, permKey)}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '8px',
                        background: isEnabled ? '#E6F4EA' : '#F8FAFC',
                        border: isEnabled ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        cursor: 'pointer',
                        fontSize: '0.76rem',
                        userSelect: 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ color: isEnabled ? '#0F172A' : '#94A3B8', fontWeight: isEnabled ? 700 : 500 }}>
                        {permissionLabels[permKey]}
                      </span>
                      {isEnabled ? (
                        <CheckSquare size={16} color="#0D9488" style={{ flexShrink: 0 }} />
                      ) : (
                        <Square size={16} color="#CBD5E1" style={{ flexShrink: 0 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
