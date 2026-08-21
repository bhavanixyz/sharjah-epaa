import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Wrench, Check } from 'lucide-react';

export default function WorkOrderModal() {
  const { isWoModalOpen, setIsWoModalOpen, sites, assets, createWorkOrder } = useApp();

  const [title, setTitle] = useState('');
  const [siteId, setSiteId] = useState(sites[0]?.id || '');
  const [assetId, setAssetId] = useState(assets[0]?.id || '');
  const [priority, setPriority] = useState('High');
  const [type, setType] = useState('Preventive Maintenance');
  const [assignedTo, setAssignedTo] = useState('Tariq Al-Mansoori');
  const [description, setDescription] = useState('');

  if (!isWoModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const siteObj = sites.find(s => s.id === siteId);
    const assetObj = assets.find(a => a.id === assetId);

    createWorkOrder({
      title: title || 'Routine Inspection & Gas Calibration',
      siteName: siteObj ? siteObj.name : 'Al Majaz Waterfront Station',
      assetName: assetObj ? assetObj.name : 'Thermo Fisher 42i NOx Analyzer',
      priority,
      type,
      assignedTo,
      description
    });

    setIsWoModalOpen(false);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ width: '540px', maxWidth: '90vw', padding: '24px', position: 'relative', background: '#FFFFFF' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#E6F6F2', color: '#00A878' }}>
              <Wrench size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937' }}>Dispatch New Maintenance Work Order</h3>
              <p style={{ fontSize: '0.78rem', color: '#6B7280' }}>Sharjah EPA Maintenance Dispatch</p>
            </div>
          </div>

          <button 
            onClick={() => setIsWoModalOpen(false)}
            style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>TASK TITLE</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Quarterly Sensor Zero/Span Verification" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>TARGET SITE</label>
              <select 
                className="input-field" 
                value={siteId} 
                onChange={(e) => setSiteId(e.target.value)}
              >
                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>EQUIPMENT ASSET</label>
              <select 
                className="input-field" 
                value={assetId} 
                onChange={(e) => setAssetId(e.target.value)}
              >
                {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>PRIORITY LEVEL</label>
              <select 
                className="input-field" 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Critical">Critical SLA (Urgent)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>WORKORDER TYPE</label>
              <select 
                className="input-field" 
                value={type} 
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Preventive Maintenance">Preventive Maintenance</option>
                <option value="Corrective Maintenance">Corrective Maintenance</option>
                <option value="Zero/Span Calibration">Zero/Span Calibration</option>
                <option value="Firmware & Software">Firmware & Software</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>ASSIGNED FIELD ENGINEER</label>
            <select 
              className="input-field" 
              value={assignedTo} 
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="Tariq Al-Mansoori">Tariq Al-Mansoori (Lead Engineer)</option>
              <option value="Rashid Al-Kaitoob">Rashid Al-Kaitoob (Marine Specialist)</option>
              <option value="Fatima Al-Zahra">Fatima Al-Zahra (QA Officer)</option>
              <option value="Khalid Al-Nuaimi">Khalid Al-Nuaimi (Field Tech)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '4px', display: 'block' }}>OPERATIONAL NOTES & SOP INSTRUCTIONS</label>
            <textarea 
              className="input-field" 
              rows="3" 
              placeholder="Enter SOP checklist, required spare parts, and access safety notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={() => setIsWoModalOpen(false)} 
              className="btn btn-secondary"
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-epa">
              <Check size={16} /> Dispatch Ticket
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
