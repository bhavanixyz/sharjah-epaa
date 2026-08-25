import React, { createContext, useContext, useState } from 'react';
import { 
  NETWORKS_DATA, 
  SITES_DATA, 
  STATIONS_DATA,
  ASSETS_DATA, 
  WORK_ORDERS_DATA, 
  CALIBRATIONS_DATA, 
  INVENTORY_DATA, 
  PROCUREMENT_DATA,
  CONTRACTS_DATA, 
  USERS_DATA,
  ROLES_DATA,
  CONFIG_DATA,
  NOTIFICATIONS_DATA,
  AUDIT_LOGS_DATA
} from '../data/mockData';
import { isDateInRange, getDateRangeLabel, REF_TODAY } from '../utils/dateHelper';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('Executive Dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Global Date Filter State (Default: ALL)
  const [dateFilter, setDateFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('2026-08-25');
  const [endDate, setEndDate] = useState('2026-08-25');
  
  // Enterprise Core Datasets
  const [networks, setNetworks] = useState(NETWORKS_DATA);
  const [sites, setSites] = useState(SITES_DATA);
  const [stations, setStations] = useState(STATIONS_DATA);
  const [assets, setAssets] = useState(ASSETS_DATA);
  const [workOrders, setWorkOrders] = useState(WORK_ORDERS_DATA);
  const [calibrations, setCalibrations] = useState(CALIBRATIONS_DATA);
  const [inventory, setInventory] = useState(INVENTORY_DATA);
  const [procurement, setProcurement] = useState(PROCUREMENT_DATA);
  const [contracts] = useState(CONTRACTS_DATA);
  const [users, setUsers] = useState(USERS_DATA);
  const [roles, setRoles] = useState(ROLES_DATA);
  const [config, setConfig] = useState(CONFIG_DATA);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [auditLogs, setAuditLogs] = useState(AUDIT_LOGS_DATA);

  // Selection & UI States
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isWoModalOpen, setIsWoModalOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [targetSearchResult, setTargetSearchResult] = useState(null);

  // Global Export Download Success Popup State
  const [exportToast, setExportToast] = useState(null);

  const triggerExportSuccess = ({ filename, format = 'CSV', count, title = 'Downloaded Successfully!' }) => {
    setExportToast({
      isOpen: true,
      filename: filename || `Sharjah_EPA_Export_${Date.now()}.${(format || 'csv').toLowerCase()}`,
      format: (format || 'CSV').toUpperCase(),
      count: count !== undefined ? count : null,
      title: title || 'Downloaded Successfully!'
    });
  };

  const closeExportToast = () => {
    setExportToast(null);
  };

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  // Unified global navigation and redirection helper
  const navigateToTarget = (targetModule, targetTab, searchTerm = '', item = null) => {
    if (targetModule) setActiveModule(targetModule);
    if (targetTab) setActiveTab(targetTab);
    
    if (item) {
      if (item.site) setSelectedSite(item.site);
      else if (targetModule === 'sites') setSelectedSite(item);

      if (item.station) setSelectedStation(item.station);
      else if (targetModule === 'stations') setSelectedStation(item);

      if (item.asset) setSelectedAsset(item.asset);
      else if (targetModule === 'assets') setSelectedAsset(item);
    }

    if (searchTerm) {
      setSearchQuery(searchTerm);
    }

    setTargetSearchResult({
      module: targetModule,
      tab: targetTab,
      searchTerm: searchTerm || (item?.name || item?.title || item?.code || item?.id || item?.serialNo || item?.sku || item?.certificateNo || ''),
      item,
      timestamp: Date.now()
    });

    setIsMobileMenuOpen(false);
  };

  // Current User Profile
  const currentUser = {
    name: 'Eng. Humaid Al-Suwaidi',
    role: 'EPA Director of Operations',
    authority: 'Sharjah Environment Protected Authority (Sharjah EPA)',
    badge: 'EPA-DIR-01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  };

  // Actions
  const createWorkOrder = (newWO) => {
    const woObj = {
      id: `WO-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Open',
      slaTimeRemaining: '48 Hours',
      ...newWO
    };
    setWorkOrders([woObj, ...workOrders]);

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: `${currentUser.name} (${currentUser.role})`,
      action: 'CREATE_WORK_ORDER',
      target: `${woObj.id} - ${woObj.title}`,
      ipAddress: '194.170.42.10',
      status: 'SUCCESS'
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const createRequisition = (newReq) => {
    const reqObj = {
      id: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      requisitionNo: `REQ-EPA-2026-${Math.floor(100 + Math.random() * 900)}`,
      dateRequested: new Date().toISOString().split('T')[0],
      status: 'Pending Finance Approval',
      ...newReq
    };
    setProcurement([reqObj, ...procurement]);
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true, isRead: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const toggleRolePermission = (roleId, permKey) => {
    setRoles(roles.map(r => {
      if (r.id === roleId) {
        return {
          ...r,
          permissions: {
            ...r.permissions,
            [permKey]: !r.permissions[permKey]
          }
        };
      }
      return r;
    }));
  };

  return (
    <AppContext.Provider value={{
      activeModule,
      setActiveModule,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      targetSearchResult,
      setTargetSearchResult,
      navigateToTarget,
      networks,
      setNetworks,
      sites,
      setSites,
      stations,
      setStations,
      assets,
      setAssets,
      workOrders,
      createWorkOrder,
      calibrations,
      setCalibrations,
      inventory,
      setInventory,
      procurement,
      createRequisition,
      contracts,
      users,
      setUsers,
      roles,
      toggleRolePermission,
      config,
      setConfig,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      clearAllNotifications,
      auditLogs,
      selectedSite,
      setSelectedSite,
      selectedStation,
      setSelectedStation,
      selectedAsset,
      setSelectedAsset,
      isWoModalOpen,
      setIsWoModalOpen,
      isNotifDrawerOpen,
      setIsNotifDrawerOpen,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      toggleSidebar,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      toggleMobileMenu,
      currentUser,
      dateFilter,
      setDateFilter,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      isDateInRange: (dateStr) => isDateInRange(dateStr, dateFilter, startDate, endDate),
      getDateRangeLabel: () => getDateRangeLabel(dateFilter, startDate, endDate),
      REF_TODAY,
      exportToast,
      triggerExportSuccess,
      closeExportToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
