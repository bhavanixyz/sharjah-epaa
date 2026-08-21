// ==========================================================================
// SHARJAH ENVIRONMENT PROTECTED AUTHORITY (SHARJAH EPA)
// Enterprise Environmental Asset & Maintenance Management Platform Mock Data
// ==========================================================================

export const NETWORKS_DATA = [
  {
    id: 'net-aqmn',
    code: 'AQMN',
    name: 'Air Quality Monitoring Network',
    type: 'Air Quality',
    status: 'Operational',
    totalStations: 12,
    activeAssets: 48,
    healthScore: 96,
    icon: 'Wind',
    color: '#3b82f6'
  },
  {
    id: 'net-mcwmn',
    code: 'MCWMN',
    name: 'Marine & Coastal Water Quality Network',
    type: 'Marine Water',
    status: 'Operational',
    totalStations: 8,
    activeAssets: 32,
    healthScore: 91,
    icon: 'Waves',
    color: '#06b6d4'
  },
  {
    id: 'net-gapn',
    code: 'GAPN',
    name: 'Groundwater & Aquifer Protection Network',
    type: 'Groundwater',
    status: 'Degraded',
    totalStations: 10,
    activeAssets: 40,
    healthScore: 84,
    icon: 'Droplets',
    color: '#10b981'
  },
  {
    id: 'net-anmn',
    code: 'ANMN',
    name: 'Ambient Noise Monitoring Network',
    type: 'Noise Pollution',
    status: 'Operational',
    totalStations: 6,
    activeAssets: 18,
    healthScore: 98,
    icon: 'Volume2',
    color: '#8b5cf6'
  },
  {
    id: 'net-splen',
    code: 'SPLEN',
    name: 'Soil & Protected Land Ecosystem Network',
    type: 'Soil & Land',
    status: 'Operational',
    totalStations: 5,
    activeAssets: 22,
    healthScore: 94,
    icon: 'Trees',
    color: '#f59e0b'
  }
];

export const SITES_DATA = [
  {
    id: 'site-al-majaz',
    networkId: 'net-aqmn',
    networkName: 'Air Quality Monitoring Network',
    name: 'Al Majaz Waterfront Site',
    code: 'SEPA-SITE-001',
    zone: 'Sharjah City Center',
    lat: 25.3315,
    lng: 55.3850,
    status: 'Normal',
    protectedStatus: 'Urban Reserve',
    stationsCount: 2,
    assetsCount: 6,
    lastMaintenance: '2026-08-10',
    assignedEngineer: 'Tariq Al-Mansoori',
    openTickets: 1
  },
  {
    id: 'site-wasit',
    networkId: 'net-aqmn',
    networkName: 'Air Quality Monitoring Network',
    name: 'Wasit Wetland Protected Reserve',
    code: 'SEPA-SITE-002',
    zone: 'Wasit Wetland Ecosystem',
    lat: 25.3611,
    lng: 55.4678,
    status: 'Normal',
    protectedStatus: 'Ramsar Wetland Site',
    stationsCount: 2,
    assetsCount: 8,
    lastMaintenance: '2026-08-14',
    assignedEngineer: 'Fatima Al-Zahra',
    openTickets: 0
  },
  {
    id: 'site-khor-kalba',
    networkId: 'net-mcwmn',
    networkName: 'Marine & Coastal Water Quality Network',
    name: 'Khor Kalba Mangrove Sanctuary',
    code: 'SEPA-SITE-003',
    zone: 'Kalba Coastal Region',
    lat: 25.0185,
    lng: 56.3601,
    status: 'Warning',
    protectedStatus: 'Strict Nature Reserve',
    stationsCount: 2,
    assetsCount: 7,
    lastMaintenance: '2026-07-28',
    assignedEngineer: 'Rashid Al-Kaitoob',
    openTickets: 2
  },
  {
    id: 'site-sir-bu-nair',
    networkId: 'net-mcwmn',
    networkName: 'Marine & Coastal Water Quality Network',
    name: 'Sir Bu Nair Island Marine Reserve',
    code: 'SEPA-SITE-004',
    zone: 'Offshore Marine Sanctuary',
    lat: 25.2312,
    lng: 54.2215,
    status: 'Critical',
    protectedStatus: 'Protected Marine Island',
    stationsCount: 1,
    assetsCount: 5,
    lastMaintenance: '2026-06-18',
    assignedEngineer: 'Khalid Al-Nuaimi',
    openTickets: 3
  },
  {
    id: 'site-al-dhaid',
    networkId: 'net-gapn',
    networkName: 'Groundwater & Aquifer Protection Network',
    name: 'Al Dhaid Hydrological Basin',
    code: 'SEPA-SITE-005',
    zone: 'Central Agricultural Region',
    lat: 25.2843,
    lng: 55.8816,
    status: 'Normal',
    protectedStatus: 'Aquifer Conservation Area',
    stationsCount: 2,
    assetsCount: 6,
    lastMaintenance: '2026-08-01',
    assignedEngineer: 'Aisha Al-Husseini',
    openTickets: 0
  },
  {
    id: 'site-khorfakkan',
    networkId: 'net-aqmn',
    networkName: 'Air Quality Monitoring Network',
    name: 'Khorfakkan Port & Coastal Zone',
    code: 'SEPA-SITE-006',
    zone: 'East Coast Port Zone',
    lat: 25.3400,
    lng: 56.3533,
    status: 'Normal',
    protectedStatus: 'Industrial Marine Buffer',
    stationsCount: 2,
    assetsCount: 6,
    lastMaintenance: '2026-08-05',
    assignedEngineer: 'Saeed Al-Mutawa',
    openTickets: 1
  },
  {
    id: 'site-mleiha',
    networkId: 'net-splen',
    networkName: 'Soil & Protected Land Ecosystem Network',
    name: 'Mleiha Archaeological Biosphere',
    code: 'SEPA-SITE-007',
    zone: 'Mleiha Biosphere Reserve',
    lat: 25.1250,
    lng: 55.8640,
    status: 'Normal',
    protectedStatus: 'UNESCO Heritage & Desert Reserve',
    stationsCount: 1,
    assetsCount: 4,
    lastMaintenance: '2026-07-20',
    assignedEngineer: 'Omar Al-Qasimi',
    openTickets: 0
  },
  {
    id: 'site-al-hamriyah',
    networkId: 'net-aqmn',
    networkName: 'Air Quality Monitoring Network',
    name: 'Al Hamriyah Coastal Buffer Site',
    code: 'SEPA-SITE-008',
    zone: 'Hamriyah Coastal Freezone',
    lat: 25.4680,
    lng: 55.5180,
    status: 'Warning',
    protectedStatus: 'Environmental Emission Buffer',
    stationsCount: 2,
    assetsCount: 9,
    lastMaintenance: '2026-08-11',
    assignedEngineer: 'Mohammed Al-Shehhi',
    openTickets: 2
  }
];

export const STATIONS_DATA = [
  {
    id: 'stn-001',
    code: 'STN-AQ-01',
    name: 'Al Majaz Urban Air Quality Monitoring Station',
    siteId: 'site-al-majaz',
    siteName: 'Al Majaz Waterfront Site',
    type: 'Fixed Enclosure Station',
    powerSource: 'Dual Grid & Solar Hybrid',
    telemetry: '4G LTE Industrial Gateway',
    status: 'Active',
    aqi: 42,
    pm25: '12.4 µg/m³',
    no2: '18.2 ppb',
    o3: '24.1 ppb',
    temp: '31.5 °C',
    humidity: '58%',
    assignedEngineer: 'Tariq Al-Mansoori'
  },
  {
    id: 'stn-002',
    code: 'STN-AQ-02',
    name: 'Wasit Wetland Avian & Microclimate Station',
    siteId: 'site-wasit',
    siteName: 'Wasit Wetland Protected Reserve',
    type: 'Compact Solar Field Post',
    powerSource: '100% Off-Grid Solar PV',
    telemetry: 'Satellite Iridium Backup & 4G',
    status: 'Active',
    aqi: 28,
    pm25: '8.1 µg/m³',
    no2: '9.4 ppb',
    o3: '18.5 ppb',
    temp: '33.0 °C',
    humidity: '52%',
    assignedEngineer: 'Fatima Al-Zahra'
  },
  {
    id: 'stn-003',
    code: 'STN-MR-01',
    name: 'Khor Kalba Tidal & Water Quality Station',
    siteId: 'site-khor-kalba',
    siteName: 'Khor Kalba Mangrove Sanctuary',
    type: 'Marine Submersible Station',
    powerSource: 'Buoy Solar PV & Lithium Storage',
    telemetry: 'Cellular Narrowband IoT (NB-IoT)',
    status: 'Degraded',
    salinity: '38.2 PSU',
    dissolvedOxygen: '6.4 mg/L',
    ph: '8.15',
    temp: '29.8 °C',
    humidity: '64%',
    assignedEngineer: 'Rashid Al-Kaitoob'
  },
  {
    id: 'stn-004',
    code: 'STN-MR-02',
    name: 'Sir Bu Nair Offshore Marine Observatory Station',
    siteId: 'site-sir-bu-nair',
    siteName: 'Sir Bu Nair Island Marine Reserve',
    type: 'Offshore Telemetry Tower',
    powerSource: 'Hybrid Wind & Solar Array',
    telemetry: 'Encrypted VSAT Satellite Link',
    status: 'Under Maintenance',
    salinity: '41.0 PSU',
    dissolvedOxygen: '4.8 mg/L (Low)',
    ph: '7.95',
    temp: '32.1 °C',
    humidity: '72%',
    assignedEngineer: 'Khalid Al-Nuaimi'
  },
  {
    id: 'stn-005',
    code: 'STN-GW-01',
    name: 'Al Dhaid Borehole Hydrological Monitoring Station',
    siteId: 'site-al-dhaid',
    siteName: 'Al Dhaid Hydrological Basin',
    type: 'Subsurface Borehole Vault',
    powerSource: 'Solar Micro-Grid',
    telemetry: '4G LTE Gateway',
    status: 'Active',
    waterTableDepth: '42.8 m',
    ecConductivity: '1,840 µS/cm',
    temp: '35.2 °C',
    humidity: '40%',
    assignedEngineer: 'Aisha Al-Husseini'
  }
];

export const ASSETS_DATA = [
  {
    id: 'ast-001',
    serialNo: 'TF-42I-88421',
    name: 'Thermo Fisher 42i NOx Analyzer',
    category: 'Gas Analyzer',
    siteId: 'site-al-majaz',
    siteName: 'Al Majaz Waterfront Site',
    manufacturer: 'Thermo Fisher Scientific',
    model: '42i Chemiluminescence',
    status: 'Active',
    healthScore: 94,
    installDate: '2022-03-15',
    lastCalibrated: '2026-07-10',
    nextCalibration: '2026-10-10',
    warrantyStatus: 'Valid until 2027-03-15',
    componentsCount: 4
  },
  {
    id: 'ast-002',
    serialNo: 'HRB-APDA-9021',
    name: 'Horiba APDA-372 Dust Monitor',
    category: 'Particulate Monitor',
    siteId: 'site-wasit',
    siteName: 'Wasit Wetland Protected Reserve',
    manufacturer: 'Horiba Instruments',
    model: 'APDA-372 Continuous PM2.5/PM10',
    status: 'Active',
    healthScore: 98,
    installDate: '2023-01-20',
    lastCalibrated: '2026-08-01',
    nextCalibration: '2026-11-01',
    warrantyStatus: 'Valid until 2026-12-31',
    componentsCount: 3
  },
  {
    id: 'ast-003',
    serialNo: 'YSI-EXO2-55102',
    name: 'YSI EXO2 Multi-Parameter Marine Sonde',
    category: 'Water Quality Sonde',
    siteId: 'site-khor-kalba',
    siteName: 'Khor Kalba Mangrove Sanctuary',
    manufacturer: 'YSI Xylem',
    model: 'EXO2 7-Port Multiparameter',
    status: 'Degraded',
    healthScore: 68,
    installDate: '2021-09-10',
    lastCalibrated: '2026-05-15',
    nextCalibration: '2026-08-15 (OVERDUE)',
    warrantyStatus: 'Expired (AMC Active)',
    componentsCount: 7
  },
  {
    id: 'ast-004',
    serialNo: 'CS-CR1000X-7731',
    name: 'Campbell Scientific Environmental Data Logger',
    category: 'Telemetry & Data Logger',
    siteId: 'site-sir-bu-nair',
    siteName: 'Sir Bu Nair Island Marine Reserve',
    manufacturer: 'Campbell Scientific',
    model: 'CR1000X Outdoor Rugged',
    status: 'Under Maintenance',
    healthScore: 52,
    installDate: '2020-11-05',
    lastCalibrated: '2026-04-10',
    nextCalibration: '2026-10-10',
    warrantyStatus: 'Under AMC Service',
    componentsCount: 5
  },
  {
    id: 'ast-005',
    serialNo: 'VAI-WXT530-10492',
    name: 'Vaisala Weather Transmitter WXT530',
    category: 'Meteorological Sensor',
    siteId: 'site-al-dhaid',
    siteName: 'Al Dhaid Hydrological Basin',
    manufacturer: 'Vaisala',
    model: 'WXT530 6-in-1 Weather Suite',
    status: 'Active',
    healthScore: 92,
    installDate: '2023-05-18',
    lastCalibrated: '2026-06-22',
    nextCalibration: '2026-12-22',
    warrantyStatus: 'Valid until 2026-11-30',
    componentsCount: 2
  },
  {
    id: 'ast-006',
    serialNo: 'TEL-T400-33291',
    name: 'Teledyne API T400 Photometric Ozone Analyzer',
    category: 'Gas Analyzer',
    siteId: 'site-al-hamriyah',
    siteName: 'Al Hamriyah Coastal Buffer Site',
    manufacturer: 'Teledyne API',
    model: 'T400 UV Absorption',
    status: 'Active',
    healthScore: 88,
    installDate: '2022-08-01',
    lastCalibrated: '2026-07-28',
    nextCalibration: '2026-10-28',
    warrantyStatus: 'Valid until 2027-08-01',
    componentsCount: 4
  }
];

export const WORK_ORDERS_DATA = [
  {
    id: 'WO-2026-089',
    title: 'Quarterly Zero/Span Gas Calibration',
    siteName: 'Al Majaz Waterfront Site',
    assetName: 'Thermo Fisher 42i NOx Analyzer',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Tariq Al-Mansoori',
    createdDate: '2026-08-18',
    dueDate: '2026-08-23',
    type: 'Preventive Maintenance',
    slaTimeRemaining: '38 Hours',
    description: 'Perform standard zero gas and 100ppm NOx span drift check according to EPA SOP-AQ-04.'
  },
  {
    id: 'WO-2026-092',
    title: 'Replace Optical Filter Assembly & Pump Seals',
    siteName: 'Khor Kalba Mangrove Sanctuary',
    assetName: 'YSI EXO2 Multi-Parameter Marine Sonde',
    priority: 'Critical',
    status: 'Open',
    assignedTo: 'Rashid Al-Kaitoob',
    createdDate: '2026-08-19',
    dueDate: '2026-08-22',
    type: 'Corrective Maintenance',
    slaTimeRemaining: '14 Hours (Urgent)',
    description: 'Dissolved oxygen reading anomaly detected. Clean bio-fouling guard and replace glass electrode.'
  },
  {
    id: 'WO-2026-084',
    title: 'Solar PV Array & Battery Reserve Inspection',
    siteName: 'Wasit Wetland Protected Reserve',
    assetName: 'Horiba APDA-372 Dust Monitor',
    priority: 'Medium',
    status: 'Completed',
    assignedTo: 'Fatima Al-Zahra',
    createdDate: '2026-08-10',
    dueDate: '2026-08-14',
    type: 'Inspection',
    slaTimeRemaining: 'Completed on Time',
    description: 'Checked 400W solar panel voltage output, cleaned dust, and tested 24V gel battery discharge rate.'
  },
  {
    id: 'WO-2026-095',
    title: 'Marine Telemetry Gateway Firmware Flash',
    siteName: 'Sir Bu Nair Island Marine Reserve',
    assetName: 'Campbell Scientific Environmental Data Logger',
    priority: 'High',
    status: 'Pending Approval',
    assignedTo: 'Khalid Al-Nuaimi',
    createdDate: '2026-08-20',
    dueDate: '2026-08-25',
    type: 'Firmware & Software',
    slaTimeRemaining: '82 Hours',
    description: 'Update 4G IoT Gateway firmware to v4.2.1 to enable encrypted MQTT telemetry stream to EPA Cloud.'
  },
  {
    id: 'WO-2026-078',
    title: 'VOC Sampler Flow Rate Verification',
    siteName: 'Al Hamriyah Coastal Buffer Site',
    assetName: 'Teledyne API T400 Photometric Ozone Analyzer',
    priority: 'Low',
    status: 'Open',
    assignedTo: 'Mohammed Al-Shehhi',
    createdDate: '2026-08-16',
    dueDate: '2026-08-28',
    type: 'Routine Inspection',
    slaTimeRemaining: '140 Hours',
    description: 'Verify mass flow controller accuracy using certified bubble flowmeter standard.'
  }
];

export const CALIBRATIONS_DATA = [
  {
    id: 'CAL-2026-104',
    assetName: 'Thermo Fisher 42i NOx Analyzer',
    siteName: 'Al Majaz Waterfront Site',
    calibrationType: 'Zero/Span Gas Standard',
    performedBy: 'Tariq Al-Mansoori',
    date: '2026-07-10',
    dueDate: '2026-10-10',
    result: 'Passed (Drift < 1.2%)',
    certificateNo: 'EPA-CAL-CERT-9921',
    status: 'Valid'
  },
  {
    id: 'CAL-2026-101',
    assetName: 'YSI EXO2 Multi-Parameter Marine Sonde',
    siteName: 'Khor Kalba Mangrove Sanctuary',
    calibrationType: '2-Point Conductivity & pH Buffer',
    performedBy: 'Rashid Al-Kaitoob',
    date: '2026-05-15',
    dueDate: '2026-08-15',
    result: 'Failed (Slope Error 6.8%)',
    certificateNo: 'EPA-CAL-CERT-9844',
    status: 'Overdue / Required'
  },
  {
    id: 'CAL-2026-098',
    assetName: 'Horiba APDA-372 Dust Monitor',
    siteName: 'Wasit Wetland Protected Reserve',
    calibrationType: 'Optical Flow Calibration',
    performedBy: 'Fatima Al-Zahra',
    date: '2026-08-01',
    dueDate: '2026-11-01',
    result: 'Passed (Flow Accuracy ±0.5%)',
    certificateNo: 'EPA-CAL-CERT-1004',
    status: 'Valid'
  }
];

export const INVENTORY_DATA = [
  {
    id: 'inv-001',
    sku: 'SKU-FLT-47MM',
    name: 'PTFE Dust Sampler Filters 47mm',
    category: 'Consumable Filters',
    siteLocation: 'Sharjah Central EPA Warehouse',
    quantity: 140,
    minThreshold: 30,
    unitCost: '$12.50',
    supplier: 'Horiba Direct',
    status: 'In Stock'
  },
  {
    id: 'inv-002',
    sku: 'SKU-GAS-NOX100',
    name: 'NOx Calibration Gas Cylinder (100 ppm)',
    category: 'Calibration Gases',
    siteLocation: 'Sharjah Central EPA Warehouse',
    quantity: 4,
    minThreshold: 2,
    unitCost: '$680.00',
    supplier: 'Air Liquide Gulf',
    status: 'In Stock'
  },
  {
    id: 'inv-003',
    sku: 'SKU-ELE-PH-MAR',
    name: 'Marine High-Salinity pH Glass Electrode',
    category: 'Sensors & Probes',
    siteLocation: 'Kalba Field Depot',
    quantity: 2,
    minThreshold: 5,
    unitCost: '$340.00',
    supplier: 'YSI Xylem Middle East',
    status: 'Low Stock - Reorder Needed'
  },
  {
    id: 'inv-004',
    sku: 'SKU-SLR-INV-24V',
    name: '24V Solar Charge Controller 30A MPPT',
    category: 'Power Systems',
    siteLocation: 'Sharjah Central EPA Warehouse',
    quantity: 8,
    minThreshold: 3,
    unitCost: '$210.00',
    supplier: 'Victron Energy UAE',
    status: 'In Stock'
  }
];

export const PROCUREMENT_DATA = [
  {
    id: 'PR-2026-044',
    requisitionNo: 'REQ-EPA-2026-102',
    title: 'Replacement Marine pH Sensors & Refill Electrolyte Solution',
    requestedBy: 'Rashid Al-Kaitoob',
    department: 'Marine Ecosystem Division',
    totalAmount: '$3,400.00',
    dateRequested: '2026-08-15',
    status: 'Approved',
    vendor: 'YSI Xylem Middle East'
  },
  {
    id: 'PR-2026-048',
    requisitionNo: 'REQ-EPA-2026-118',
    title: 'Ultra-High Purity Zero Air Gas Generators for Air Monitoring Stations',
    requestedBy: 'Tariq Al-Mansoori',
    department: 'Air Quality Operations',
    totalAmount: '$18,500.00',
    dateRequested: '2026-08-19',
    status: 'Pending Finance Approval',
    vendor: 'Thermo Fisher Scientific'
  },
  {
    id: 'PR-2026-039',
    requisitionNo: 'REQ-EPA-2026-089',
    title: 'Industrial 4G LTE IoT Telemetry Gateways & IP67 Enclosures',
    requestedBy: 'Khalid Al-Nuaimi',
    department: 'Telemetry & IT Infrastructure',
    totalAmount: '$7,200.00',
    dateRequested: '2026-08-02',
    status: 'Order Placed',
    vendor: 'Campbell Scientific'
  }
];

export const CONTRACTS_DATA = [
  {
    id: 'cnt-001',
    title: 'Thermo Fisher Annual Service & Calibration Support',
    vendor: 'Thermo Fisher Scientific Middle East',
    contractType: 'Comprehensive AMC',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    value: '$85,000',
    status: 'Active',
    slaResponseTime: '4 Hours (Emergency)'
  },
  {
    id: 'cnt-002',
    title: 'Marine Telemetry & Buoy Maintenance Contract',
    vendor: 'Xylem Environmental Solutions UAE',
    contractType: 'Preventive Maintenance',
    startDate: '2025-06-01',
    endDate: '2027-05-31',
    value: '$140,000',
    status: 'Active',
    slaResponseTime: '12 Hours'
  },
  {
    id: 'cnt-003',
    title: 'Solar PV & Off-Grid Battery Warranty Support',
    vendor: 'Sharjah Clean Energy Systems',
    contractType: 'Equipment Warranty',
    startDate: '2023-03-01',
    endDate: '2026-09-30',
    value: '$45,000',
    status: 'Expiring Soon (39 Days)',
    slaResponseTime: '24 Hours'
  }
];

export const USERS_DATA = [
  {
    id: 'usr-101',
    name: 'Eng. Humaid Al-Suwaidi',
    role: 'EPA Director of Operations',
    department: 'Executive Leadership',
    email: 'h.alsuwaidi@epa.shj.ae',
    phone: '+971 6 500 4001',
    badge: 'EPA-DIR-01',
    status: 'Active',
    assignedZone: 'All Sharjah Territories'
  },
  {
    id: 'usr-102',
    name: 'Tariq Al-Mansoori',
    role: 'Lead Air Quality Engineer',
    department: 'Air Monitoring Network',
    email: 't.mansoori@epa.shj.ae',
    phone: '+971 50 442 8901',
    badge: 'EPA-ENG-12',
    status: 'Active',
    assignedZone: 'Sharjah City & Hamriyah'
  },
  {
    id: 'usr-103',
    name: 'Fatima Al-Zahra',
    role: 'Quality Assurance Officer',
    department: 'Environmental Compliance',
    email: 'f.alzahra@epa.shj.ae',
    phone: '+971 52 889 1204',
    badge: 'EPA-QA-04',
    status: 'Active',
    assignedZone: 'Wasit & Protected Reserves'
  },
  {
    id: 'usr-104',
    name: 'Rashid Al-Kaitoob',
    role: 'Marine Ecosystem Specialist',
    department: 'Marine Water Quality',
    email: 'r.kaitoob@epa.shj.ae',
    phone: '+971 55 331 9022',
    badge: 'EPA-MR-08',
    status: 'Active',
    assignedZone: 'Kalba & East Coast'
  },
  {
    id: 'usr-105',
    name: 'Khalid Al-Nuaimi',
    role: 'Field Maintenance Technician',
    department: 'Equipment Operations',
    email: 'k.nuaimi@epa.shj.ae',
    phone: '+971 56 771 4432',
    badge: 'EPA-TECH-22',
    status: 'Active',
    assignedZone: 'Sir Bu Nair Island'
  }
];

export const ROLES_DATA = [
  {
    id: 'role-dir',
    name: 'EPA Director of Operations',
    code: 'ROLE_ADMIN',
    usersCount: 2,
    description: 'Full administrative control, workflow approvals, regulatory report sign-off, system configuration.',
    permissions: {
      createWO: true,
      editWO: true,
      deleteWO: true,
      approveProcurement: true,
      manageUsers: true,
      configureSystem: true,
      exportReports: true
    }
  },
  {
    id: 'role-lead-eng',
    name: 'Lead Field Engineer',
    code: 'ROLE_LEAD_ENG',
    usersCount: 6,
    description: 'Dispatch work orders, perform drift calibrations, manage site equipment, submit procurement requisitions.',
    permissions: {
      createWO: true,
      editWO: true,
      deleteWO: false,
      approveProcurement: false,
      manageUsers: false,
      configureSystem: false,
      exportReports: true
    }
  },
  {
    id: 'role-qa',
    name: 'Quality Assurance Officer',
    code: 'ROLE_QA_OFFICER',
    usersCount: 4,
    description: 'Validate sensor drift logs, issue EPA calibration certs, inspect SLA compliance, audit system logs.',
    permissions: {
      createWO: true,
      editWO: true,
      deleteWO: false,
      approveProcurement: false,
      manageUsers: false,
      configureSystem: false,
      exportReports: true
    }
  },
  {
    id: 'role-tech',
    name: 'Field Maintenance Technician',
    code: 'ROLE_FIELD_TECH',
    usersCount: 12,
    description: 'Execute field work orders, update ticket status, record spare parts consumption, log site visits.',
    permissions: {
      createWO: false,
      editWO: true,
      deleteWO: false,
      approveProcurement: false,
      manageUsers: false,
      configureSystem: false,
      exportReports: false
    }
  },
  {
    id: 'role-auditor',
    name: 'Government Compliance Auditor',
    code: 'ROLE_AUDITOR',
    usersCount: 3,
    description: 'Read-only access to environmental compliance reports, system audit logs, and contract SLAs.',
    permissions: {
      createWO: false,
      editWO: false,
      deleteWO: false,
      approveProcurement: false,
      manageUsers: false,
      configureSystem: false,
      exportReports: true
    }
  }
];

export const CONFIG_DATA = {
  organizationName: 'Sharjah Environment Protected Authority (Sharjah EPA)',
  telemetryIntervalMinutes: 5,
  defaultSlaHoursCritical: 24,
  defaultSlaHoursHigh: 48,
  defaultSlaHoursMedium: 120,
  enableSmsAlerts: true,
  enableEmailAlerts: true,
  futureDomains: [
    { id: 'dom-soil', name: 'Soil & Terrestrial Ecosystems', status: 'Active (Configured)' },
    { id: 'dom-noise', name: 'Ambient Noise Pollution Network', status: 'Active (Configured)' },
    { id: 'dom-waste', name: 'Hazardous Waste Monitoring Network', status: 'Configurable (Planned)' },
    { id: 'dom-radiation', name: 'Environmental Radiation Monitoring', status: 'Configurable (Planned)' },
    { id: 'dom-bio', name: 'Biodiversity Reserve Telemetry', status: 'Configurable (Planned)' }
  ]
};

export const NOTIFICATIONS_DATA = [
  {
    id: 'notif-1',
    title: 'Critical Alarm: Khor Kalba Dissolved Oxygen Drop',
    message: 'Marine Sonde reading dropped below 5.0 mg/L threshold.',
    time: '12 mins ago',
    severity: 'critical',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Work Order Updated: WO-2026-089',
    message: 'Tariq Al-Mansoori uploaded gas calibration zero log.',
    time: '45 mins ago',
    severity: 'info',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Low Stock Alert: Marine pH Sensor Probe',
    message: 'Current stock is 2 (below minimum safety threshold of 5).',
    time: '2 hours ago',
    severity: 'warning',
    read: true
  }
];

export const AUDIT_LOGS_DATA = [
  {
    id: 'log-801',
    timestamp: '2026-08-21 13:42:10',
    user: 'Tariq Al-Mansoori (Lead Field Engineer)',
    action: 'CREATE_CALIBRATION_RECORD',
    target: 'Thermo Fisher 42i NOx Analyzer (Al Majaz)',
    ipAddress: '194.170.42.12',
    status: 'SUCCESS'
  },
  {
    id: 'log-802',
    timestamp: '2026-08-21 12:15:04',
    user: 'System Automated Monitor',
    action: 'TRIGGER_CRITICAL_ALERT',
    target: 'Site: Khor Kalba Mangrove Sanctuary',
    ipAddress: '10.200.4.1',
    status: 'ALERT_TRIGGERED'
  },
  {
    id: 'log-803',
    timestamp: '2026-08-21 10:04:55',
    user: 'Fatima Al-Zahra (QA Officer)',
    action: 'CLOSE_WORK_ORDER',
    target: 'WO-2026-084 Solar PV Inspection',
    ipAddress: '194.170.42.88',
    status: 'SUCCESS'
  }
];
