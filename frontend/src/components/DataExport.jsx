import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '../context/ToastContext.jsx';
import { formatTime } from '../lib/utils';

export default function DataExport({ habits, logs, user }) {
  const showToast = useToast();

  if (!user?.is_pro) return null;

  const getExportData = () => {
    const rows = [];
    Object.keys(logs).sort().forEach(date => {
      const dayLogs = logs[date];
      Object.keys(dayLogs).forEach(habitId => {
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          rows.push({
            Date: date,
            Habit: habit.name,
            Category: habit.category,
            Time: formatTime(habit.time)
          });
        }
      });
    });
    return rows;
  };


  const handleExportCSV = () => {
    const data = getExportData();
    if (data.length === 0) {
      showToast('No habits logged yet!', '❌');
      return;
    }

    const headers = ['Date', 'Habit', 'Category', 'Time'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => `"${row.Date}","${row.Habit}","${row.Category}","${row.Time}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Habitly_Data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('CSV Exported Successfully!', '✅');
  };

  const handleExportPDF = () => {
    const data = getExportData();
    if (data.length === 0) {
      showToast('No habits logged yet!', '❌');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Habitly Journey Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = data.map(row => [row.Date, row.Habit, row.Category, row.Time]);

    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Habit', 'Category', 'Time']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(`Habitly_Journey_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('PDF Exported Successfully!', '✅');
  };

  return (
    <div style={{ marginTop: '40px' }} className="data-export-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
          Data Export 
          <span style={{ padding: '4px 10px', background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)', color: '#fff', fontSize: '0.75rem', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)' }}>PRO</span>
        </h2>
      </div>

      <div style={{ position: 'relative', borderRadius: '16px', padding: '2px', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))' }}>
        <div style={{ padding: '30px', background: 'var(--bg-raised)', borderRadius: '14px', display: 'flex', gap: '24px', flexDirection: 'column', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ padding: '12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 600 }}>Your Habit Journey</h3>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Download your complete habit history. Analyze your raw data in Excel or print a beautiful PDF report of your journey. To take a snapshot of your dashboard, use the camera icon on the Dashboard page.
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
            <button 
              type="button"
              className="export-btn outline" 
              onClick={handleExportCSV} 
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Export Raw CSV
            </button>
            <button 
              type="button"
              className="export-btn primary" 
              onClick={handleExportPDF} 
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg>
              Generate PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
