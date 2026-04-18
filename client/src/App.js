import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Services from './components/Services';
import Recommendations from './components/Recommendations';
import Complaints from './components/Complaints';
import Documents from './components/Documents';

function App() {
  const [activeTab, setActiveTab] = useState('services');
  const [userId, setUserId] = useState('60f7b3b3b3b3b3b3b3b3b3b3'); // Mock user ID for demo

  const renderContent = () => {
    switch(activeTab) {
      case 'services':
        return <Services userId={userId} />;
      case 'recommendations':
        return <Recommendations userId={userId} />;
      case 'complaints':
        return <Complaints userId={userId} />;
      case 'documents':
        return <Documents userId={userId} />;
      default:
        return <Dashboard userId={userId} />;
    }
  };

  return (
    <div className="App">
      <div className="portal-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          <div className="content-header">
            <h1>My Dashboard</h1>
            <p>Welcome to your Service Portal</p>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
