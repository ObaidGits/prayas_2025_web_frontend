import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import DashboardHeader from './DashboardHeader';
import AlertCard from './AlertCard';
import EmergencyMap from './EmergencyMap';
import AlertAudio from './AlertAudio';
import { io } from 'socket.io-client';
import { fetchAllWebAlerts, fetchAllCCTVAlerts, getAdmin, markWebSosResolved, markCCTVSosResolved } from '../../../services/Apis';
import { convertToIST } from './TimeconvertToIST';
import { getAccuracyLevel } from './GetAccuracyLevel';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
import { IoClose } from "react-icons/io5";

const AdminPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [playAlertSound, setPlayAlertSound] = useState(false);
  const [previousAlertCount, setPreviousAlertCount] = useState(0);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedAlertCoords, setSelectedAlertCoords] = useState(null);

  const [officers, setOfficers] = useState([
    { id: 1, name: 'Officer Raj', status: 'available', location: 'Station' },
    { id: 2, name: 'Officer Priya', status: 'patrolling', location: 'MG Road' }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentAdmin = async () => {
      try {
        const config = { "Content-Type": "application/json" };
        const response = await getAdmin({}, config);
        if (response?.data?.data) {
          setCurrentAdmin(response.data.data);
        } else {
          throw new Error("No admin data");
        }
      } catch (error) {
        toast.error("Session expired. Please login again.");
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentAdmin();
  }, [navigate]);

  const fetchAndSetAlerts = async () => {
    try {
      const config = { "Content-Type": "application/json" };
      const [webRes, cctvRes] = await Promise.all([
        fetchAllWebAlerts({}, config),
        fetchAllCCTVAlerts({}, config)
      ]);

      const webAlerts = (webRes?.data?.data || []).map(data => ({
        alertTime: convertToIST(data.createdAt),
        id: data._id,
        location: {
          accuracy: getAccuracyLevel(data.location.accuracy),
          lat: data.location.coordinates[1],
          lng: data.location.coordinates[0],
        },
        status: data.status,
        source: 'Web',
        user: data.userId
          ? {
            age: data.userId.age,
            emergencyContacts: [data.userId.contact || data.userId.phone, data.userId.email],
            name: data.userId.fullName,
            photo: data.userId.avatar,
          }
          : {
            age: null,
            emergencyContacts: [],
            name: 'Unknown',
            photo: '',
          }
      }));

      const cctvAlerts = (cctvRes?.data?.data || []).map(data => ({
        alertTime: convertToIST(data.createdAt),
        id: data._id,
        location: {
          accuracy: getAccuracyLevel(data.location.accuracy),
          lat: data.location.coordinates[1],
          lng: data.location.coordinates[0],
        },
        status: data.status,
        source: 'CCTV',
        sosImg: `${import.meta.env.VITE_WS_URL}/cctv_sos/${data.sos_img}`,
        user: {
          age: null,
          emergencyContacts: [],
          name: 'CCTV Camera',
          photo: data.sos_img
        }
      }));


      const combined = [...webAlerts, ...cctvAlerts].sort(
        (a, b) => new Date(b.alertTime) - new Date(a.alertTime)
      );

      setAlerts(combined);
      setPreviousAlertCount(combined.filter(a => a.status === 'active').length);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error("Failed to refresh alerts.");
    }
  };

  useEffect(() => {
    fetchAndSetAlerts();

    const socket = io(import.meta.env.VITE_WS_URL);

    socket.on("connect", () => console.log("Socket connected:", socket.id));

    socket.on("new_alert", (data) => {
      const newAlert = {
        alertTime: convertToIST(data.createdAt),
        id: data._id,
        location: {
          accuracy: getAccuracyLevel(data.location.accuracy),
          lat: data.location.coordinates[1],
          lng: data.location.coordinates[0],
        },
        status: data.status,
        source: data.userId ? 'Web' : 'CCTV',
        user: data.userId
          ? {
            age: data.userId.age,
            emergencyContacts: [data.userId.contact || data.userId.phone, data.userId.email],
            name: data.userId.fullName,
            photo: data.userId.avatar,
          }
          : {
            age: null,
            emergencyContacts: [],
            name: 'CCTV Camera',
            photo: data.sos_img || 'cctv-icon.png',  // fix here
          }

      };
      // setAlerts(prev => [newAlert, ...prev]);
      setAlerts(prev => {
        const exists = prev.some(a => a.id === newAlert.id);
        return exists ? prev : [newAlert, ...prev];
      });

    });

    return () => socket.disconnect();
  }, [activeTab]);

  useEffect(() => {
    const currentActive = alerts.filter(a => a.status === 'active').length;
    if (currentActive > previousAlertCount) {
      setPlayAlertSound(true);
      const timer = setTimeout(() => setPlayAlertSound(false), 4000);
      return () => clearTimeout(timer);
    }
    setPreviousAlertCount(currentActive);
  }, [alerts]);

  useEffect(() => {
    const activeCount = alerts.filter(a => a.status === 'active').length;
    if (activeCount > previousAlertCount) {
      const alertListEl = document.querySelector('.alert-list');
      if (alertListEl) alertListEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [alerts]);

  const handleResolve = async (alertId, source = 'Web') => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      const response = source === 'CCTV'
        ? await markCCTVSosResolved(alertId, config)
        : await markWebSosResolved(alertId, config);

      if (response.data.success) {
        toast.success(`✅ ${source} SOS marked as resolved.`);
        await fetchAndSetAlerts();
      } else {
        toast.warning("⚠️ Server did not confirm resolution.");
      }
    } catch (error) {
      console.error('Error marking SOS resolved:', error);
      toast.error("❌ Failed to resolve SOS. Try again.");
    }
  };

  const handleDispatch = (alertId, officerId) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, status: 'dispatched', assignedOfficer: officerId } : alert
    ));
    setOfficers(prev => prev.map(officer =>
      officer.id === officerId ? { ...officer, status: 'assigned' } : officer
    ));
  };

  if (isLoading) return <div className="loading-container">Loading admin data...</div>;
  if (!currentAdmin) return <Navigate to="/admin/login" replace />;

  const filteredAlerts = activeTab === 'dashboard'
    ? alerts.filter(alert => alert.status === 'active')
    : alerts;

  const handleLocateOnMap = (coords) => {
    setSelectedAlertCoords(coords);
    setMapVisible(true);
  };

  return (
    <div className="admin-panel">
      <AlertAudio play={playAlertSound} onEnd={() => setPlayAlertSound(false)} />

      <DashboardHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={alerts.filter(a => a.status === 'active').length}
        totalAlertCount={alerts.length}
        currentAdmin={currentAdmin}
      />

      <div className="dashboard-content">
        <div className="alert-list">
          <h2>
            {activeTab === 'dashboard' ? 'Active Alerts' : 'Total Alerts'} ({filteredAlerts.length})
          </h2>
          {filteredAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              officers={officers}
              onSelect={() => setSelectedAlert(alert)}
              onDispatch={handleDispatch}
              onResolve={() => handleResolve(alert.id, alert.source)}
              onLocateOnMap={() => handleLocateOnMap(alert.location)}

            />
          ))}
        </div>

        <div className="map-container">
          {mapVisible && selectedAlertCoords ? (
            <>
              <div className='map-header'>
                <h2>Navigate through Map</h2>
                <button className='close-map-btn' type='button'
                  onClick={() => {
                    setSelectedAlertCoords(null)
                    setMapVisible(false)
                  }}><IoClose /> Close Map</button>
              </div>
              <EmergencyMap
                policeStationCoords={{ lat: 22.498029539422284, lng: 88.22654002489938 }}
                alertCoords={selectedAlertCoords}
              />
            </>
          ) : (
            <h2>Navigate through Map</h2>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;