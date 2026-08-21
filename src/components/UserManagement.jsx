import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Mail, Phone } from 'lucide-react';

export default function UserManagement() {
  const { users } = useApp();
  const [searchUser, setSearchUser] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.department.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="glass-panel page-header-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>EPA Staff & User Accounts Directory</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Personnel accounts, department assignments, authority badges & operational status</p>
        </div>

        <div className="page-header-actions">
          <div className="page-header-search">
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search staff, role, email..." 
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              style={{ paddingLeft: '36px', fontSize: '0.8rem', background: '#F8FAFC' }}
            />
          </div>

          <button className="btn btn-epa">
            <Plus size={16} /> Add EPA User Account
          </button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="card-grid-responsive">
        {filteredUsers.map((usr) => (
          <div key={usr.id} className="glass-panel glass-panel-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span className="badge badge-normal">{usr.status}</span>
                <span style={{ fontSize: '0.74rem', color: '#00A878', fontWeight: 700, fontFamily: 'monospace' }}>{usr.badge}</span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2937', marginBottom: '2px' }}>{usr.name}</h3>
              <div style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 700, marginBottom: '8px' }}>{usr.role}</div>
              <div style={{ fontSize: '0.74rem', color: '#6B7280', marginBottom: '14px' }}>{usr.department}</div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563' }}>
                  <Mail size={14} color="#6B7280" /> {usr.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563' }}>
                  <Phone size={14} color="#6B7280" /> {usr.phone}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '12px', fontSize: '0.74rem', color: '#6B7280' }}>
              Assigned Domain: <strong style={{ color: '#1F2937' }}>{usr.assignedZone}</strong>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
