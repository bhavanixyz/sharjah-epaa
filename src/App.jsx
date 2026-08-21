import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Dashboard from './components/Dashboard';
import GisMap from './components/GisMap';
import EnvironmentalNetworks from './components/EnvironmentalNetworks';
import SitesManagement from './components/SitesManagement';
import StationsManagement from './components/StationsManagement';
import AssetsManagement from './components/AssetsManagement';
import MaintenanceManagement from './components/MaintenanceManagement';
import CalibrationManagement from './components/CalibrationManagement';
import InventoryProcurement from './components/InventoryProcurement';
import ProcurementManagement from './components/ProcurementManagement';
import ContractsWarranty from './components/ContractsWarranty';
import DocumentReporting from './components/DocumentReporting';
import NotificationManagement from './components/NotificationManagement';
import UserManagement from './components/UserManagement';
import RolePermissionManagement from './components/RolePermissionManagement';
import ConfigurationManagement from './components/ConfigurationManagement';
import AdministrationAudit from './components/AdministrationAudit';
import WorkOrderModal from './components/WorkOrderModal';

function MainLayout() {
  const { activeModule } = useApp();

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'gis':
        return <GisMap />;
      case 'networks':
        return <EnvironmentalNetworks />;
      case 'sites':
        return <SitesManagement />;
      case 'stations':
        return <StationsManagement />;
      case 'assets':
        return <AssetsManagement />;
      case 'maintenance':
        return <MaintenanceManagement />;
      case 'calibration':
        return <CalibrationManagement />;
      case 'inventory':
        return <InventoryProcurement />;
      case 'procurement':
        return <ProcurementManagement />;
      case 'contracts':
        return <ContractsWarranty />;
      case 'documents':
      case 'reports':
        return <DocumentReporting />;
      case 'notifications':
        return <NotificationManagement />;
      case 'users':
        return <UserManagement />;
      case 'roles':
        return <RolePermissionManagement />;
      case 'config':
        return <ConfigurationManagement />;
      case 'audit':
      case 'admin':
        return <AdministrationAudit />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#F7F9FC' }}>
      {/* Left Sidebar Navigation (Fixed) */}
      <Sidebar />

      {/* Main Content Area (Independent Scroll) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        <TopHeader />
        
        <main style={{ flex: 1, padding: '24px' }}>
          {renderModule()}
        </main>
      </div>

      {/* Shared Work Order Dispatch Modal */}
      <WorkOrderModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
