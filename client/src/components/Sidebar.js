import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'services', label: 'My Services', icon: '🛠️' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡' },
    { id: 'complaints', label: 'Complains', icon: '📝' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'compliance', label: 'Compliance', icon: '✅' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Service Portal</h2>
      </div>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
