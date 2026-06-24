import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
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

  const handleExportPNG = async () => {
    try {
      // Get the Dashboard element by its ID or class
      const dashboardElement = document.getElementById('page-home') || document.querySelector('.dashboard-grid');
      if (!dashboardElement) {
        showToast('Please go to the dashboard to take a snapshot!', '❌');
        return;
      }
      
      showToast('Generating snapshot...', '⏳');
      const canvas = await html2canvas(dashboardElement, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#fafafa',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `Habitly_Dashboard_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      showToast('PNG Exported Successfully!', '✅');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate PNG', '❌');
    }
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
    <div style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Data Export <span style={{ padding: '2px 8px', background: 'var(--primary)', color: '#fff', fontSize: '0.7rem', borderRadius: '12px', verticalAlign: 'middle', marginLeft: '8px' }}>PRO</span></h2>
      </div>

      <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
        
        <div style={{ padding: '24px', background: 'var(--bg-raised)', display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Download your complete habit history. Take a snapshot of your dashboard, or print a beautiful PDF report of your journey.
          </p>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              type="button"
              className="btn btn-outline" 
              onClick={handleExportPNG} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '150px', justifyContent: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Export Dashboard PNG
            </button>
            <button 
              type="button"
              className="btn btn-primary" 
              onClick={handleExportPDF} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '150px', justifyContent: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg>
              Export as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
