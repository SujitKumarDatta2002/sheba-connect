import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateUserPersonalReport = async (stats, user, dateRange) => {
  const doc = new jsPDF();
  
  // Header with Personal Branding
  doc.setFillColor(0, 102, 204);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('My Activity Report', 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text('ShebaConnect - Government Service Portal', 105, 30, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  
  let yPos = 50;
  
  // Personal Information
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Personal Information', 14, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 10;
  
  doc.setFontSize(10);
  doc.text(`Name: ${user.name}`, 14, yPos);
  yPos += 6;
  doc.text(`Email: ${user.email}`, 14, yPos);
  yPos += 6;
  doc.text(`NID: ${user.nid}`, 14, yPos);
  yPos += 6;
  doc.text(`Phone: ${user.phone}`, 14, yPos);
  yPos += 6;
  doc.text(`Address: ${user.address}`, 14, yPos);
  yPos += 15;
  
  // Report Period
  doc.setFont(undefined, 'bold');
  doc.text('Report Period', 14, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 8;
  doc.text(`From: ${dateRange.start} to ${dateRange.end}`, 14, yPos);
  yPos += 6;
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yPos);
  yPos += 15;
  
  // Summary Statistics
  doc.setFillColor(240, 240, 240);
  doc.rect(14, yPos - 5, 182, 45, 'F');
  
  doc.setFont(undefined, 'bold');
  doc.text('Summary Statistics', 14, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 8;
  
  const statsData = [
    { label: 'Total Complaints Filed', value: stats.totalComplaints || 0 },
    { label: 'Resolved Complaints', value: stats.resolvedComplaints || 0 },
    { label: 'Pending Complaints', value: stats.pendingComplaints || 0 },
    { label: 'Documents Uploaded', value: stats.totalDocuments || 0 },
    { label: 'Solutions Shared', value: stats.totalSolutions || 0 },
    { label: 'Resolution Rate', value: `${stats.resolutionRate || 0}%` },
    { label: 'Average Resolution Time', value: stats.avgResolutionTime || 'N/A' }
  ];
  
  statsData.forEach(stat => {
    doc.text(`${stat.label}: ${stat.value}`, 20, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // Complaints List
  if (stats.recentComplaints && stats.recentComplaints.length > 0) {
    doc.setFont(undefined, 'bold');
    doc.text('Recent Complaints', 14, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 8;
    
    const complaintData = stats.recentComplaints.map(complaint => [
      complaint.complaintNumber,
      complaint.department,
      complaint.issueKeyword,
      complaint.status,
      new Date(complaint.createdAt).toLocaleDateString()
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Complaint #', 'Department', 'Issue', 'Status', 'Date']],
      body: complaintData,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
  }
  
  // Documents List
  if (stats.recentDocuments && stats.recentDocuments.length > 0) {
    doc.setFont(undefined, 'bold');
    doc.text('Uploaded Documents', 14, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 8;
    
    const docData = stats.recentDocuments.map(doc => [
      doc.documentType,
      doc.fileName,
      doc.status,
      new Date(doc.uploadedAt).toLocaleDateString()
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Document Type', 'File Name', 'Status', 'Date']],
      body: docData,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 }
    });
  }
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('ShebaConnect - Official Personal Report', 105, 290, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount} | Generated on ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });
  }
  
  doc.save(`my_activity_report_${new Date().toISOString().split('T')[0]}.pdf`);
};