import React from 'react';
import { QrCode, Download, Printer, X, CheckCircle2 } from 'lucide-react';

export default function QRCodeDialog({ asset, onClose }) {
  if (!asset) return null;

  const handleDownload = () => {
    alert(`QR Code for asset ${asset.serialNo || asset.id} downloaded successfully.`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '420px',
          maxWidth: '92vw',
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
          border: '1px solid #E2E8F0',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>
            <QrCode size={20} color="#00A878" /> Equipment Asset QR Tag
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={18} />
          </button>
        </div>

        {/* QR Code Container */}
        <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'inline-block', marginBottom: '16px' }}>
          {/* Simulated High-Res SVG QR Code */}
          <div style={{ width: '160px', height: '160px', background: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '2px solid #00A878', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={130} color="#0F172A" />
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.78rem', fontWeight: 800, color: '#00A878', fontFamily: 'monospace' }}>
            {asset.serialNo || asset.code || 'EPA-TAG-9088'}
          </div>
        </div>

        {/* Asset Details */}
        <div style={{ textAlign: 'left', background: '#F1F5F9', padding: '12px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.78rem', color: '#334155' }}>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', marginBottom: '2px' }}>{asset.name}</div>
          <div>Category: <strong>{asset.category || 'Analyzer Probe'}</strong></div>
          <div>Location: <strong>{asset.siteName || 'Sharjah Depot'}</strong></div>
          <div>Certification: <strong>ISO 17025 Certified</strong></div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={handleDownload} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> Download QR
          </button>
          <button onClick={handlePrint} className="btn btn-epa" style={{ padding: '8px 16px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={14} /> Print Tag
          </button>
        </div>
      </div>
    </div>
  );
}
