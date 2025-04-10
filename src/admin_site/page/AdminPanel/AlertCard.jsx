import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AlertAudio from './AlertAudio'; // Adjust path if needed

const AlertCard = ({ alert, officers, onSelect, onDispatch, onResolve, onLocateOnMap }) => {
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [address, setAddress] = useState('Fetching location...');
  const [playAlarm, setPlayAlarm] = useState(false);

  const timeSinceAlert = () => {
    const seconds = Math.floor((new Date() - new Date(alert.alertTime)) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    const apiKey = '4c1c7d6e5d624184aafe6c823e02c811';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      const result = response.data.results[0];
      let formatted = result?.formatted || 'Address not found';

      if (formatted.toLowerCase().startsWith('unnamed road,')) {
        const parts = formatted.split(',').slice(1).map(p => p.trim());
        formatted = parts.join(', ');
      }

      return formatted;
    } catch (error) {
      console.error('OpenCage error:', error.message);
      return 'Address unavailable';
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      const { lat, lng } = alert.location;
      const fetchedAddress = await getAddressFromCoordinates(lat, lng);
      setAddress(fetchedAddress);
    };
    fetchAddress();
    console.log("CCTV Image Filename:", alert);

  }, [alert.location.lat, alert.location.lng]);

  const isCCTVAlert = alert.source === 'CCTV';

  return (
    <div className={`alert-card ${alert.location.severity || ''}`} onClick={() => onSelect(alert)}>
      <div className="alert-header" onClick={() => setShowDetails(!showDetails)}>
        {isCCTVAlert ? (
          // <img src={`${import.meta.env.VITE_WS_URL}/cctv_sos/${alert.user.photo || 'cctv-icon.png'}`} alt="CCTV Icon" className="profile-photo" />
          <img
            src={`${import.meta.env.VITE_WS_URL}/cctv_sos/${alert.user.photo || 'cctv-icon.png'}?t=${Date.now()}`}
            alt="CCTV Icon"
            className="profile-photo"
          />

        ) : (
          <img src={alert.user.photo} alt="User" className="profile-photo" />
        )}

        <div className="user-info">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>
              {isCCTVAlert ? 'CCTV Alert' : `Web Alert : ${alert.user.name}`}
            </h3>
            <button
              className="video-btn"
              type="button"
              style={{ padding: "0.5rem", fontWeight: "500" }}
              onClick={(e) => {
                e.stopPropagation();
                onLocateOnMap();
              }}
            >
              <i className="bi bi-geo-alt-fill" style={{ fontSize: "15px", marginRight: "7px" }}></i>
              <span className='locate-text'>Locate on Map</span>
            </button>
          </div>
          <p>{timeSinceAlert()} | <span style={{ fontWeight: "700" }}>From : </span>{address}</p>
        </div>
      </div>

      {showDetails && (
        <div className="alert-details">
          {!isCCTVAlert && (
            <div className="user-details">
              <p><strong>Blood Group:</strong> {alert.user.bloodGroup || 'B+'}</p>
              <p><strong>Medical Info:</strong> {alert.user.medicalInfo || 'Diabetic'}</p>
              <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                <p><strong>Emergency Contacts:</strong></p>
                <ul style={{ display: "flex", gap: "10px", listStyle: "none", padding: 0 }}>
                  <li>
                    <a href={`tel:${alert.user.emergencyContacts[0]}`} style={{ textDecoration: 'none' }}>
                      <button className="call-btn">📞 Call</button>
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${alert.user.emergencyContacts[1]}`} style={{ textDecoration: 'none' }}>
                      <button className="call-btn">✉️ Email</button>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {isCCTVAlert && (
            <div className="user-details">
              <p><strong>Camera Number:</strong> 6</p>
              <p><strong>Camera Location:</strong> Ward No. 30, B7-360, New, Gumar Gala, Maheshtala, West Bengal 700141</p>
            </div>
          )}

          {isCCTVAlert && alert.user.photo && (
            <div className="cctv-image-preview">
              <p><strong>Captured Image:</strong></p>
              <img
                src={`${import.meta.env.VITE_WS_URL}/cctv_sos/${alert.user.photo || 'cctv-icon.png'}?t=${Date.now()}`}
                alt="CCTV Snapshot"
                className="cctv-image"
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          )}

          <div className="location-details">
            <p><strong>Location Accuracy:</strong> {alert.location.accuracy}</p>
          </div>

          <div className="action-buttons">
            <button
              className="panic-btn"
              onClick={() => {
                setPlayAlarm(true);
                setTimeout(() => setPlayAlarm(false), 1000); // reset after 1s to allow retrigger
              }}
            >
              Trigger Panic Alarm
            </button>

            {!isCCTVAlert && (
              <button className="video-btn">Request Live Video</button>
            )}

            <div className="dispatch-controls">
              <select
                value={selectedOfficer}
                onChange={(e) => setSelectedOfficer(e.target.value)}
              >
                <option value="">Select Officer</option>
                {officers.filter(o => o.status === 'available').map(officer => (
                  <option key={officer.id} value={officer.id}>
                    {officer.name}
                  </option>
                ))}
              </select>

              {selectedOfficer && (
                <button
                  className="dispatch-btn"
                  onClick={() => onDispatch(alert.id, parseInt(selectedOfficer))}
                >
                  Dispatch
                </button>
              )}
            </div>

            <button className="resolve-btn" onClick={() => onResolve(alert.id)}>
              Mark as Resolved
            </button>
          </div>
        </div>
      )}

      {/* 🔊 Alarm Audio Player */}
      <AlertAudio play={playAlarm} />
    </div>
  );
};

export default AlertCard;
