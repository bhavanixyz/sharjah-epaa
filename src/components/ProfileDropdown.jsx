import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, Shield, LogOut, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { setActiveTab, setActiveModule } = useApp();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (tabName) => {
    if (tabName === 'Admin') {
      if (setActiveTab) setActiveTab('User Directory');
      if (setActiveModule) setActiveModule('users');
    } else if (tabName === 'Settings') {
      if (setActiveTab) setActiveTab('Role & RBAC Matrix');
      if (setActiveModule) setActiveModule('roles');
    } else {
      if (setActiveTab) setActiveTab(tabName);
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    alert('Signed out of Sharjah EPAA Enterprise Session.');
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#FFFFFF',
          border: '1px solid #CBD5E1',
          padding: '5px 12px 5px 6px',
          borderRadius: '24px',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          transition: 'all 0.15s ease'
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00A878, #0891B2)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.82rem'
          }}
        >
          HS
        </div>

        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>Eng. Humaid Al-Suwaidi</span>
          <span style={{ fontSize: '0.66rem', color: '#00A878', fontWeight: 700 }}>Senior EPA Inspector</span>
        </div>

        <ChevronDown size={14} color="#64748B" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '240px',
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 15px 35px -5px rgba(0,0,0,0.2)',
            border: '1px solid #E2E8F0',
            zIndex: 9999,
            padding: '8px 0',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #F1F5F9', marginBottom: '4px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>Sharjah EPAA Account</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>humaid.suwaidi@epaa.shj.ae</div>
          </div>

          <button
            onClick={() => handleNavigate('My Profile')}
            className="profile-menu-item"
            style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}
          >
            <User size={16} color="#00A878" /> My Profile
          </button>

          <button
            onClick={() => handleNavigate('Settings')}
            className="profile-menu-item"
            style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}
          >
            <Settings size={16} color="#0891B2" /> Settings
          </button>

          <button
            onClick={() => handleNavigate('Admin')}
            className="profile-menu-item"
            style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}
          >
            <Shield size={16} color="#8B5CF6" /> Admin
          </button>

          <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '4px', paddingTop: '4px' }}>
            <button
              onClick={handleLogout}
              className="profile-menu-item logout-hover"
              style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#DC2626' }}
            >
              <LogOut size={16} color="#DC2626" /> Logout
            </button>
          </div>
        </div>
      )}

      <style>{`
        .profile-menu-item:hover {
          background: #F8FAFC;
        }
        .logout-hover:hover {
          background: #FEE2E2 !important;
        }
      `}</style>
    </div>
  );
}
