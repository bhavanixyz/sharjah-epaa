import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AppPreloader from './components/AppPreloader';
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
import ServiceProviderContacts from './components/ServiceProviderContacts';
import AdminContainer from './components/admin/AdminContainer';
import WorkOrderModal from './components/WorkOrderModal';
import ChatAIWidget from './components/ChatAIWidget';
import PageHeaderBar from './components/common/PageHeaderBar';
import NotificationDrawer from './components/NotificationDrawer';
import NotificationsPage from './components/NotificationsPage';
import ExportSuccessToast from './components/common/ExportSuccessToast';

function MainLayout() {
  const { activeModule, activeTab } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  // Update Page Document Title dynamically
  useEffect(() => {
    const pageTitles = {
      'dashboard': 'Executive Dashboard',
      'gis': 'GIS Command Center',
      'networks': 'Environmental Networks',
      'sites': 'Site Management',
      'stations': 'Station Management',
      'assets': 'Asset Catalog & Equipment',
      'providers': 'Service Providers / Contacts',
      'maintenance': 'Work Orders & SLA',
      'calibration': 'Drift & Gas Calibration',
      'inventory': 'Inventory & Spare Parts',
      'procurement': 'Procurement & Orders',
      'contracts': 'Contracts & Warranty',
      'documents': 'Document SOPs',
      'reports': 'EPA Compliance Reports',
      'notifications': 'Notification Center',
      'users': 'User Directory',
      'roles': 'Role & RBAC Matrix',
      'audit': 'Security Audit Trail'
    };

    const currentTitle = pageTitles[activeModule] || activeTab || 'Environmental Operations';
    document.title = `Sharjah EPAA | ${currentTitle}`;
  }, [activeModule, activeTab]);

  const renderModule = () => {
    // Tab override check
    if (activeTab === 'Notifications') return <NotificationsPage />;
    if (activeTab === 'Admin') return <AdminContainer />;

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
      case 'providers':
        return <ServiceProviderContacts />;
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
        return <NotificationsPage />;
      case 'admin':
      case 'users':
      case 'roles':
      case 'audit':
        return <AdminContainer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {/* Platform Preloader Splash Screen */}
      <AppPreloader isLoading={isLoading} onComplete={() => setIsLoading(false)} />

      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#F8FAFC' }}>
        {/* Left Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
          
          {/* Fixed & Sticky Top Navigation Header & Page Header Bar */}
          <div style={{ 
            flexShrink: 0, 
            zIndex: 100, 
            background: '#F8FAFC', 
            borderBottom: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <TopHeader />
            <div style={{ padding: '12px 24px 14px 24px' }}>
              <PageHeaderBar />
            </div>
          </div>
          
          {/* Scrollable Main Content */}
          <main style={{ flex: 1, padding: '20px 24px 32px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {renderModule()}
          </main>
        </div>

        {/* Shared Work Order Dispatch Modal */}
        <WorkOrderModal />

        {/* Sliding Right Notifications Drawer */}
        <NotificationDrawer />

        {/* Floating ChatAI Widget */}
        <ChatAIWidget />

        {/* Global Export Download Success Toast Popup */}
        <ExportSuccessToast />
      </div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
