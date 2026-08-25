import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, Download, Layers3, CheckCircle2, X, Compass, 
  Plus, Minus, Navigation, Maximize, Filter, Layers, 
  Minimize2, MapPin, Eye, Activity, Sparkles 
} from 'lucide-react';

// Helper component to bind Leaflet map instance to ref
function LeafletMapController({ mapRef }) {
  const map = useMap();
  React.useEffect(() => {
    if (map) {
      mapRef.current = map;
    }
  }, [map, mapRef]);
  return null;
}

// Custom Marker Icons for Leaflet Map with Unique Colors & Pulse Ring Animations
const createCustomIcon = (loc) => {
  // Unique color per location type/category
  let color = '#00A878'; // Emerald (Air Quality / Wasit)
  if (loc.id === 'loc-2') color = '#0284C7'; // Azure (Marine / Khorfakkan)
  if (loc.id === 'loc-3') color = '#8B5CF6'; // Purple (Groundwater / Al Dhaid)
  if (loc.id === 'loc-4') color = '#F59E0B'; // Amber (Industrial / Area 3)
  if (loc.id === 'loc-5') color = '#0D9488'; // Teal (Eco Reserve / Kalba)
  if (loc.id === 'loc-6') color = '#E11D48'; // Rose (Desert Weather / Al Madam)

  // Status indicator ring border
  let statusBorder = '#ffffff';
  if (loc.status === 'Degraded') statusBorder = '#F59E0B';
  if (loc.status === 'Non-Operational') statusBorder = '#DC2626';

  return L.divIcon({
    className: 'custom-leaflet-pulse-marker',
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: -8px; border-radius: 50%; background: ${color}; opacity: 0.45; animation: mapPulseRing 2.2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;"></div>
        <div style="position: absolute; inset: -4px; border-radius: 50%; background: ${color}; opacity: 0.6; animation: mapPulseRing 2.2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; animation-delay: 0.6s;"></div>
        <div style="width: 24px; height: 24px; border-radius: 50%; background: ${color}; border: 2.5px solid ${statusBorder}; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; z-index: 2;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

import { useApp } from '../../context/AppContext';

export default function MapView({ height = "520px", onSelectSite }) {
  const { triggerExportSuccess } = useApp();
  const mapRef = useRef(null);
  
  // Interactive Controls State (All Floating Inside Map)
  const [activeBasemap, setActiveBasemap] = useState('Topographic'); // Topographic, Satellite, Dark
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('ALL');
  const [showBasemaps, setShowBasemaps] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Layers Toggle State
  const [layersState, setLayersState] = useState({
    airQuality: true,
    marineWater: true,
    groundwater: true,
    weatherGrid: true
  });

  // Sharjah EPA Locations Data
  const locations = [
    { id: 'loc-1', name: 'Wasit Wetland Reserve Site', code: 'STN-AIR-01', lat: 25.362, lng: 55.471, type: 'Air Quality Station', status: 'Operational', pm25: 18.4, o3: 42.1, network: 'Air', color: '#00A878', zone: 'Sharjah City Zone A' },
    { id: 'loc-2', name: 'Khorfakkan Coastal Marine Station', code: 'STN-MAR-02', lat: 25.331, lng: 56.341, type: 'Marine Quality Station', status: 'Degraded', pm25: 44.2, o3: 68.0, network: 'Marine', color: '#0284C7', zone: 'East Coast Marine Sector' },
    { id: 'loc-3', name: 'Al Dhaid Agricultural Soil Depot', code: 'STN-GW-03', lat: 25.281, lng: 55.881, type: 'Groundwater Monitor', status: 'Maintenance', pm25: 12.0, o3: 31.5, network: 'Groundwater', color: '#8B5CF6', zone: 'Central Agricultural Belt' },
    { id: 'loc-4', name: 'Sharjah Industrial Area 3 Monitoring Site', code: 'STN-AIR-04', lat: 25.312, lng: 55.412, type: 'Air Quality Station', status: 'Operational', pm25: 22.8, o3: 50.4, network: 'Air', color: '#F59E0B', zone: 'Industrial Corridor' },
    { id: 'loc-5', name: 'Kalba Mangrove Eco Reserve Buoy', code: 'STN-MAR-05', lat: 25.012, lng: 56.355, type: 'Marine Quality Station', status: 'Operational', pm25: 9.5, o3: 28.2, network: 'Marine', color: '#0D9488', zone: 'Kalba Protected Reserve' },
    { id: 'loc-6', name: 'Al Madam Desert Weather Tower', code: 'STN-MET-06', lat: 24.962, lng: 55.772, type: 'Meteorological Tower', status: 'Non-Operational', pm25: 0.0, o3: 0.0, network: 'Weather', color: '#E11D48', zone: 'Southern Desert Basin' }
  ];

  // Filter Locations
  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || loc.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNetwork = selectedNetwork === 'ALL' || loc.network === selectedNetwork;
    return matchesSearch && matchesNetwork;
  });

  // Tile Config for Basemaps
  const getTileConfig = () => {
    switch (activeBasemap) {
      case 'Satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri &mdash; World Imagery'
        };
      case 'Dark':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> Dark Matter'
        };
      default: // Topographic
        return {
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> Voyager'
        };
    }
  };

  // Map Navigation Handlers
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetNorth = () => mapRef.current?.setView([25.18, 55.82], 9.15);
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 12);
        },
        () => {
          mapRef.current?.setView([25.18, 55.82], 9.15);
        }
      );
    }
  };

  const handleExportMap = () => {
    if (triggerExportSuccess) {
      triggerExportSuccess({
        filename: `Sharjah_EPA_GIS_Map_${Date.now()}.png`,
        format: 'PNG',
        count: filteredLocations.length,
        title: 'GIS Map Snapshot Downloaded Successfully!'
      });
    }
  };

  const tileConfig = getTileConfig();

  return (
    <div 
      style={{ 
        width: '100%', 
        height: isFullscreen ? '100vh' : height, 
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 1,
        borderRadius: isFullscreen ? 0 : '16px',
        overflow: 'hidden',
        border: '1px solid #CBD5E1',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}
    >

        {/* --- FLOATING OVERLAY: TOP-LEFT BAR (Search & Filter) --- */}
        <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 1000, display: 'flex', gap: '8px', alignItems: 'center' }}>
          
          {/* Search Box Inside Map */}
          <div style={{ position: 'relative', width: '210px', background: '#FFFFFF', borderRadius: '8px', boxShadow: '0 4px 14px rgba(0,0,0,0.18)', border: '1px solid #CBD5E1' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search site, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 32px',
                fontSize: '0.74rem',
                border: 'none',
                borderRadius: '8px',
                outline: 'none',
                fontWeight: 600,
                color: '#0F172A',
                background: 'transparent'
              }}
            />
          </div>

          {/* Filter Network Trigger Inside Map */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowFilter(!showFilter); setShowBasemaps(false); setShowLayers(false); }}
              style={{
                background: selectedNetwork !== 'ALL' ? '#00A878' : '#FFFFFF',
                color: selectedNetwork !== 'ALL' ? '#FFFFFF' : '#0F172A',
                padding: '6px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Filter size={13} /> {selectedNetwork === 'ALL' ? 'All Networks' : selectedNetwork}
            </button>

            {/* Filter Dropdown */}
            {showFilter && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 1100, background: '#FFFFFF', borderRadius: '10px', padding: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #CBD5E1', minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { id: 'ALL', label: 'All Networks' },
                  { id: 'Air', label: 'Air Quality' },
                  { id: 'Marine', label: 'Marine Water' },
                  { id: 'Groundwater', label: 'Groundwater' },
                  { id: 'Weather', label: 'Weather' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setSelectedNetwork(f.id); setShowFilter(false); }}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.74rem',
                      fontWeight: selectedNetwork === f.id ? 800 : 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      background: selectedNetwork === f.id ? 'rgba(0,168,120,0.1)' : 'transparent',
                      color: selectedNetwork === f.id ? '#00A878' : '#334155'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>


        {/* --- FLOATING OVERLAY: TOP-RIGHT BAR (Basemaps, Layers, Export) --- */}
        <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 1000, display: 'flex', gap: '8px', alignItems: 'center' }}>
          
          {/* Basemaps Gallery Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowBasemaps(!showBasemaps); setShowLayers(false); setShowFilter(false); }}
              style={{
                background: '#FFFFFF',
                color: '#0F172A',
                padding: '6px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Layers3 size={13} color="#00A878" /> Basemaps
            </button>

            {/* Basemap Gallery Thumbnails Popover with Real Map Images */}
            {showBasemaps && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 1100, background: '#FFFFFF', borderRadius: '12px', padding: '12px', boxShadow: '0 12px 30px rgba(0,0,0,0.22)', display: 'flex', gap: '10px', border: '1px solid #CBD5E1', minWidth: '350px' }}>
                {[
                  { 
                    name: 'Topographic', 
                    label: 'Topographic Map', 
                    imgUrl: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/9/308/218.png',
                    border: '#94A3B8' 
                  },
                  { 
                    name: 'Satellite', 
                    label: 'Satellite Imagery', 
                    imgUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/9/218/308',
                    border: '#38BDF8' 
                  },
                  { 
                    name: 'Dark', 
                    label: 'Dark Map', 
                    imgUrl: 'https://a.basemaps.cartocdn.com/dark_all/9/308/218.png',
                    border: '#6366F1' 
                  }
                ].map((mapItem) => {
                  const isSelected = activeBasemap === mapItem.name;
                  return (
                    <div
                      key={mapItem.name}
                      onClick={() => { setActiveBasemap(mapItem.name); setShowBasemaps(false); }}
                      style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', cursor: 'pointer', padding: '6px', borderRadius: '8px', border: isSelected ? '2px solid #00A878' : '1px solid #E2E8F0', background: isSelected ? 'rgba(0,168,120,0.06)' : '#FFFFFF', transition: 'all 0.15s ease' }}
                    >
                      {/* Real Map Image Thumbnail Container */}
                      <div style={{ width: '100%', height: '54px', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${mapItem.border}`, position: 'relative' }}>
                        <img 
                          src={mapItem.imgUrl} 
                          alt={mapItem.label} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        {isSelected && (
                          <div style={{ position: 'absolute', top: '3px', right: '3px', background: '#00A878', color: '#FFF', borderRadius: '50%', padding: '2px', display: 'flex', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                            <CheckCircle2 size={11} />
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isSelected ? '#00A878' : '#334155', textAlign: 'center' }}>{mapItem.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Layers Switcher Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowLayers(!showLayers); setShowBasemaps(false); setShowFilter(false); }}
              style={{
                background: '#FFFFFF',
                color: '#0F172A',
                padding: '6px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Layers size={13} color="#2563EB" /> Layers
            </button>

            {/* Layers Dropdown Overlay */}
            {showLayers && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 1100, background: '#FFFFFF', borderRadius: '10px', padding: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #CBD5E1', minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>Active GIS Data Layers</div>
                {[
                  { key: 'airQuality', label: 'Air Quality Network', color: '#00A878' },
                  { key: 'marineWater', label: 'Marine Water Network', color: '#0284C7' },
                  { key: 'groundwater', label: 'Groundwater Network', color: '#8B5CF6' },
                  { key: 'weatherGrid', label: 'Weather Stations', color: '#E11D48' }
                ].map((l) => (
                  <label key={l.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={layersState[l.key]}
                      onChange={(e) => setLayersState({ ...layersState, [l.key]: e.target.checked })}
                      style={{ accentColor: l.color }}
                    />
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                    {l.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Export GIS Map Button */}
          <button
            onClick={handleExportMap}
            className="btn btn-epa"
            style={{
              padding: '6px 12px',
              fontSize: '0.74rem',
              borderRadius: '8px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={13} /> Export
          </button>
        </div>


        {/* --- FLOATING OVERLAY: LEFT VERTICAL TOOLBAR (Zoom In/Out, North Arrow, Locate Me, Full Screen) --- */}
        <div style={{ position: 'absolute', top: '70px', left: '14px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          
          {/* North Arrow Compass Button */}
          <button
            onClick={handleResetNorth}
            title="Reset Map Orientation & View (North Arrow)"
            style={{
              width: '34px',
              height: '34px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#00A878'
            }}
          >
            <Compass size={18} />
          </button>

          {/* Zoom In Button */}
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            style={{
              width: '34px',
              height: '34px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px 8px 0 0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A'
            }}
          >
            <Plus size={16} />
          </button>

          {/* Zoom Out Button */}
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{
              width: '34px',
              height: '34px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '0 0 8px 8px',
              borderTop: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A'
            }}
          >
            <Minus size={16} />
          </button>

          {/* Locate Me Navigation Button */}
          <button
            onClick={handleLocateMe}
            title="Locate Me (Current GPS Coordinates)"
            style={{
              width: '34px',
              height: '34px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#2563EB',
              marginTop: '4px'
            }}
          >
            <Navigation size={16} />
          </button>

          {/* Full Screen Toggle Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Full Screen" : "Full Screen Mode"}
            style={{
              width: '34px',
              height: '34px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A'
            }}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize size={16} />}
          </button>
        </div>


        {/* --- FLOATING OVERLAY: BOTTOM-LEFT SCALE INDICATOR --- */}
        <div 
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '14px',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(6px)',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '0.68rem',
            fontWeight: 700,
            color: '#334155',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Scale 1:50,000</span>
          <div style={{ width: '40px', height: '4px', background: 'linear-gradient(90deg, #0F172A 50%, #E2E8F0 50%)', border: '1px solid #0F172A' }} />
          <span>Sharjah EPA Grid</span>
        </div>


        {/* --- FLOATING OVERLAY: BOTTOM-RIGHT NETWORK STATUS LEGEND --- */}
        {showLegend && (
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              right: '14px',
              zIndex: 1000,
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(8px)',
              padding: '10px 14px',
              borderRadius: '10px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
              border: '1px solid #CBD5E1',
              fontSize: '0.72rem',
              maxWidth: '220px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontWeight: 800, color: '#0F172A' }}>Network Status Legend</span>
              <button 
                onClick={() => setShowLegend(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
              >
                <X size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00A878' }} />
                <span>Operational (100% Stream)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
                <span>Degraded (Service Due)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B5CF6' }} />
                <span>Maintenance Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E11D48' }} />
                <span>Non-Operational Alert</span>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Legend button if hidden */}
        {!showLegend && (
          <button
            onClick={() => setShowLegend(true)}
            style={{
              position: 'absolute',
              bottom: '14px',
              right: '14px',
              zIndex: 1000,
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#0F172A',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Show Legend
          </button>
        )}


        {/* --- LEAFLET MAP CONTAINER --- */}
        <MapContainer 
          center={[25.18, 55.82]} 
          zoom={9.15} 
          zoomControl={false}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <LeafletMapController mapRef={mapRef} />

          <TileLayer
            key={activeBasemap}
            url={tileConfig.url}
            attribution={tileConfig.attribution}
          />

          {filteredLocations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={createCustomIcon(loc)}
              eventHandlers={{
                click: () => {
                  if (onSelectSite) onSelectSite(loc);
                }
              }}
            >
              <Popup>
                <div style={{ padding: '4px 6px', width: '220px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A' }}>{loc.name}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '6px' }}>
                    {loc.zone} • {loc.code}
                  </div>
                  <div style={{ fontSize: '0.74rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Status:</span>
                    <strong style={{ color: loc.color }}>{loc.status}</strong>
                  </div>
                  <button 
                    onClick={() => {
                      if (onSelectSite) onSelectSite(loc);
                      else alert(`Station Inspection: ${loc.name} (${loc.code})\nType: ${loc.type}\nPM2.5: ${loc.pm25} µg/m³`);
                    }}
                    className="btn btn-epa"
                    style={{ width: '100%', padding: '4px 8px', fontSize: '0.72rem' }}
                  >
                    View Station Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
    </div>
  );
}
