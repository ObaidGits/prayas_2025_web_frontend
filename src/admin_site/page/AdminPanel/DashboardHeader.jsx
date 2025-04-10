import React from 'react';
import { adminLogout } from '../../../services/Apis';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ activeTab, setActiveTab, alertCount, currentAdmin, totalAlertCount }) => {
  // console.log(currentAdmin  ,currentAdmin.officerName);
  const navigate = useNavigate();
  const adminLogoutFunction = async () => {
    console.log("Logout button clicked");
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      };
      const res = await adminLogout({}, config);
      console.log("Logout response:", res); // Check full response object
      if (res.status === 200) {
        toast.success(`${res.data.message}! Redirecting to login...`);
        navigate('/admin/login');
      } else {
        toast.error(res.data?.message || "Logout failed");
      }
    } catch (error) {
      console.log("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed. Please try again.");
    }
  }

  return (
    <header className="dashboard-header">
      <div className="logo">SafeStree Admin</div>

      <div className="alert-count-wrap">
        <div className="alert-indicator">
          <span className="alert-count">{alertCount}</span>
          Active Alerts
        </div>
        <div className="alert-indicator" style={{ "backgroundColor": "#2a9d8f" }}>
          <span className="alert-count" style={{ "color": "#2a9d8f" }}>{totalAlertCount}</span>
          Total Alerts
        </div>
      </div>

      <nav className="tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </nav>

      <div style={{"display":"flex", "alignItems":"center", "gap":"1rem"}}>
        <span>Station: {currentAdmin?.policeStation || "Kolkata Head"} </span>
        <span>Officer: {currentAdmin?.officerName}</span>
        <button className="logout-btn" onClick={adminLogoutFunction}>Logout</button>
      </div>
    </header>
  );
};

export default DashboardHeader;