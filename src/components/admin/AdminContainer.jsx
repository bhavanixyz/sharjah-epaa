import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import UserDirectory from './UserDirectory';
import RolePermissionManagement from '../RolePermissionManagement';
import SecurityAuditTrail from './SecurityAuditTrail';

export default function AdminContainer() {
  const { activeModule } = useApp();

  // Initialize activeAdminTab directly based on activeModule
  const [activeAdminTab, setActiveAdminTab] = useState(() => {
    if (activeModule === 'roles') return 'rbac';
    if (activeModule === 'audit') return 'audit';
    return 'users';
  });

  // Keep activeAdminTab in sync when sidebar items are clicked
  useEffect(() => {
    if (activeModule === 'roles') {
      setActiveAdminTab('rbac');
    } else if (activeModule === 'audit') {
      setActiveAdminTab('audit');
    } else if (activeModule === 'users' || activeModule === 'admin') {
      setActiveAdminTab('users');
    }
  }, [activeModule]);

  return (
    <>
      {/* Render Active View directly without top sub-navigation tab container */}
      {activeAdminTab === 'users' && <UserDirectory />}
      {activeAdminTab === 'rbac' && <RolePermissionManagement />}
      {activeAdminTab === 'audit' && <SecurityAuditTrail />}
    </>
  );
}
