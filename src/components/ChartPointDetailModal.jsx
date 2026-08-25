import React from 'react';
import { X, Calendar, Wrench, Clock, CheckCircle2, AlertTriangle, UserCheck } from 'lucide-react';

export default function ChartPointDetailModal({ pointData, onClose }) {
  if (!pointData) return null;

  const day = pointData.day || pointData.month || 'Selected Period';
  const completed = pointData.completedWO || pointData.completed || 0;
  const open = pointData.openWO || pointData.pipeline || 0;
  const avgHours = pointData.avgResponseHours || pointData.velocity || '2.8';

  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }}>
      <div 
        className="glass-panel" 
        style={{
          width: '620px',
          maxWidth: '95vw',
          padding: '26px',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          animation: 'fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(0, 168, 120, 0.1)', color: '#00A878', padding: '10px', borderRadius: '10px' }}>
              <Calendar size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                Field Dispatch Drill-Down: {day}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Detailed ticket audit & response velocity for {day}</p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Metric Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>COMPLETED WORK ORDERS</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00A878', marginTop: '2px' }}>{completed} Resolved</div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>PENDING TICKETS</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#EF4444', marginTop: '2px' }}>{open} Open</div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>AVG MTTR RESPONSE</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>{avgHours} Hours</div>
          </div>
        </div>

        {/* Itemized Tickets List */}
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
          Logged Field Tickets for {day}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto', marginBottom: '20px' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>WO-2026-089: Zero/Span Drift Check</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Al Majaz Waterfront Site • Eng. Tariq Al-Mansoori</div>
            </div>
            <span className="badge badge-normal">Completed</span>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>WO-2026-092: Optical Filter Assembly Replacement</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Khor Kalba Mangrove Sanctuary • Eng. Rashid Al-Kaitoob</div>
            </div>
            <span className="badge badge-warning">In Progress</span>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0F172A' }}>WO-2026-084: Solar PV Array Inspection</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Wasit Wetland Protected Reserve • Eng. Fatima Al-Zahra</div>
            </div>
            <span className="badge badge-normal">Completed</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
          <button onClick={onClose} className="btn btn-secondary">Close Drill-Down</button>
        </div>
      </div>
    </div>
  );
}
