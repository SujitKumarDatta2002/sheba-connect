import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
};

// Helper function to format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to get status color in PDF (using grayscale)
const getStatusColor = (status) => {
  switch(status) {
    case 'Resolved': return [0, 100, 0]; // Dark green
    case 'Pending': return [255, 165, 0]; // Orange
    case 'Processing': return [0, 0, 255]; // Blue
    default: return [128, 128, 128]; // Gray
  }
};

// Generate Service Usage Report
export const generateServiceReport = async (services, stats, dateRange) => {
  const doc = new jsPDF();
  
  // Header with Government Branding
  doc.setFillColor(0, 102, 204);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Service Usage Report', 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Government of Bangladesh • ShebaConnect', 105, 30, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Report Info Section
  let yPos = 50;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Report Information', 14, yPos);
  doc.setFont(undefined, 'normal');
  
  yPos += 8;
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yPos);
  yPos += 6;
  doc.text(`Period: ${dateRange.start} to ${dateRange.end}`, 14, yPos);
  yPos += 6;
  doc.text(`Total Services: ${stats.totalServices}`, 14, yPos);
  yPos += 6;
  doc.text(`Active Services: ${stats.activeServices}`, 14, yPos);
  yPos += 15;
  
  // Summary Statistics
  doc.setFillColor(240, 240, 240);
  doc.rect(14, yPos - 5, 182, 45, 'F');
  
  doc.setFont(undefined, 'bold');
  doc.text('Summary Statistics', 14, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 8;
  
  const summaryStats = [
    { label: 'Most Used Service', value: stats.mostUsedService || 'N/A' },
    { label: 'Average Processing Time', value: stats.avgProcessingTime || 'N/A' },
    { label: 'Total Complaints via Services', value: stats.totalComplaintsViaServices || 0 },
    { label: 'Success Rate', value: `${stats.successRate || 0}%` }
  ];
  
  summaryStats.forEach(stat => {
    doc.text(`${stat.label}: ${stat.value}`, 20, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // Department-wise Distribution
  doc.setFont(undefined, 'bold');
  doc.text('Department-wise Distribution', 14, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 8;
  
  if (stats.departmentStats && stats.departmentStats.length > 0) {
    const deptTableData = stats.departmentStats.map(dept => [
      dept.department,
      dept.serviceCount,
      dept.usageCount,
      dept.satisfactionRate ? `${dept.satisfactionRate}%` : 'N/A'
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Department', 'Services', 'Usage Count', 'Satisfaction']],
      body: deptTableData,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
  } else {
    doc.text('No department data available', 20, yPos);
    yPos += 15;
  }
  
  // Service List
  doc.setFont(undefined, 'bold');
  doc.text('Service Details', 14, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 8;
  
  if (services && services.length > 0) {
    const serviceTableData = services.map(service => [
      service.name,
      service.department,
      service.urgency.charAt(0).toUpperCase() + service.urgency.slice(1),
      formatCurrency(service.cost),
      service.processingTime,
      service.isActive ? 'Active' : 'Inactive'
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Service Name', 'Department', 'Urgency', 'Cost', 'Processing', 'Status']],
      body: serviceTableData,
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
    doc.text(`ShebaConnect - Official Report | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });
  }
  
  doc.save(`service_report_${dateRange.start}_to_${dateRange.end}.pdf`);
};

// Generate User Activity Report
export const generateUserActivityReport = async (users, stats, dateRange) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(0, 102, 204);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('User Activity Report', 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Government of Bangladesh • ShebaConnect', 105, 30, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  
  let yPos = 50;
  
  // Report Info
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Report Information', 14, yPos);
  doc.setFont(undefined, 'normal');
  
  yPos += 8;
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yPos);
  yPos += 6;
  doc.text(`Period: ${dateRange.start} to ${dateRange.end}`, 14, yPos);
  yPos += 6;
  doc.text(`Total Registered Users: ${stats.totalUsers}`, 14, yPos);
  yPos += 6;
  doc.text(`Active Users: ${stats.activeUsers}`, 14, yPos);
  yPos += 6;
  doc.text(`New Users (period): ${stats.newUsers}`, 14, yPos);
  yPos += 15;
  
  // Key Metrics
  doc.setFillColor(240, 240, 240);
  doc.rect(14, yPos - 5, 182, 55, 'F');
  
  doc.setFont(undefined, 'bold');
  doc.text('Key Metrics', 14, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 8;
  
  const metrics = [
    { label: 'Total Complaints Filed', value: stats.totalComplaints || 0 },
    { label: 'Resolved Complaints', value: stats.resolvedComplaints || 0 },
    { label: 'Documents Uploaded', value: stats.totalDocuments || 0 },
    { label: 'Solutions Shared', value: stats.totalSolutions || 0 },
    { label: 'Average Response Time', value: stats.avgResponseTime || 'N/A' },
    { label: 'User Satisfaction', value: `${stats.userSatisfaction || 0}%` }
  ];
  
  metrics.forEach(metric => {
    doc.text(`${metric.label}: ${metric.value}`, 20, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // Role Distribution
  doc.setFont(undefined, 'bold');
  doc.text('User Role Distribution', 14, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 8;
  
  if (stats.roleStats && stats.roleStats.length > 0) {
    const roleData = stats.roleStats.map(role => [
      role.role.charAt(0).toUpperCase() + role.role.slice(1),
      role.count,
      `${((role.count / stats.totalUsers) * 100).toFixed(1)}%`
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Role', 'Count', 'Percentage']],
      body: roleData,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
  }
  
  // Recent Users
  doc.setFont(undefined, 'bold');
  doc.text('Recent Users', 14, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 8;
  
  if (users && users.length > 0) {
    const userTableData = users.slice(0, 20).map(user => [
      user.name,
      user.email,
      user.role.charAt(0).toUpperCase() + user.role.slice(1),
      formatDate(user.createdAt),
      user.complaintsCount || 0,
      user.documentsCount || 0
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Name', 'Email', 'Role', 'Joined', 'Complaints', 'Documents']],
      body: userTableData,
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
    doc.text(`ShebaConnect - Official Report | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });
  }
  
  doc.save(`user_activity_report_${dateRange.start}_to_${dateRange.end}.pdf`);
};

// Generate Combined Statistics Report
export const generateCombinedReport = async (data) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(0, 102, 204);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('ShebaConnect Statistics Report', 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Government of Bangladesh', 105, 30, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  
  let yPos = 50;
  
  // Overview
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Executive Summary', 14, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 10;
  
  doc.setFontSize(10);
  const summaryText = `This report provides a comprehensive overview of ShebaConnect's performance, 
including service usage statistics, user activity metrics, and complaint resolution rates 
for the specified period. The data reflects the platform's effectiveness in serving citizens 
and highlights areas for improvement.`;
  
  const splitText = doc.splitTextToSize(summaryText, 180);
  doc.text(splitText, 14, yPos);
  yPos += splitText.length * 5 + 10;
  
  // Key Performance Indicators
  doc.setFont(undefined, 'bold');
  doc.text('Key Performance Indicators (KPIs)', 14, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 8;
  
  const kpiData = [
    ['Total Users', data.totalUsers || 0],
    ['Active Users', data.activeUsers || 0],
    ['Total Complaints', data.totalComplaints || 0],
    ['Resolution Rate', `${data.resolutionRate || 0}%`],
    ['Average Resolution Time', data.avgResolutionTime || 'N/A'],
    ['User Satisfaction', `${data.userSatisfaction || 0}%`]
  ];
  
  doc.autoTable({
    startY: yPos,
    head: [['Metric', 'Value']],
    body: kpiData,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
    margin: { left: 14, right: 14 }
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Recommendations
  doc.setFont(undefined, 'bold');
  doc.text('Recommendations', 14, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 8;
  
  const recommendations = [
    '• Increase awareness of available services through targeted campaigns',
    '• Improve response times for high-priority complaints',
    '• Enhance user onboarding process to increase registration completion',
    '• Implement automated verification for common document types',
    '• Expand service coverage to rural areas'
  ];
  
  recommendations.forEach(rec => {
    doc.text(rec, 14, yPos);
    yPos += 6;
  });
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`ShebaConnect - Official Report | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });
  }
  
  doc.save(`shebaconnect_comprehensive_report_${new Date().toISOString().split('T')[0]}.pdf`);
};