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
import GlobalSearchModal from './components/GlobalSearchModal';
import ChatAIWidget from './components/ChatAIWidget';
import PageHeaderBar from './components/common/PageHeaderBar';
import NotificationDrawer from './components/NotificationDrawer';
import NotificationsPage from './components/NotificationsPage';

function MainLayout() {
  const { activeModule, activeTab } = useApp();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Keyboard shortcut for Ctrl + F / Cmd + F
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F' || e.code === 'KeyF')) {
        e.preventDefault();
        e.stopPropagation();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
          <TopHeader onOpenSearch={() => setIsSearchModalOpen(true)} />
          
          <main style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <PageHeaderBar />
            {renderModule()}
          </main>
        </div>

        {/* Shared Work Order Dispatch Modal */}
        <WorkOrderModal />

        {/* Global Search Modal (Ctrl+F) */}
        <GlobalSearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />

        {/* Sliding Right Notifications Drawer */}
        <NotificationDrawer />

        {/* Floating ChatAI Widget */}
        <ChatAIWidget />
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
