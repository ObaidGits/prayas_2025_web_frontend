import React, { useState } from 'react';
import './SOSButton.css';
import getCurrentLocation from './getCurrentLocation';
import { getUser, sendSOSLocation } from '../../../services/Apis';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SOSButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const FORM_CONFIG = {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
  };

  const JSON_CONFIG = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  };

  const fetchCurrentUser = async () => {
    const response = await getUser({}, FORM_CONFIG);
    console.log('Current user:', response.data);
    return response.data;
  };

  const sendSOSAlert = async (alertData) => {
    const res = await sendSOSLocation(alertData, JSON_CONFIG);
    // console.log(alertData);
    // console.log("SOS alert response:", res);
  };

  const handleSOSClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const location = await getCurrentLocation();
      console.log("Current location:", location);

      const user = await fetchCurrentUser();

      if (!user) {
        console.log("No user data - redirecting to login");
        navigate('/login');
        return;
      }

      await sendSOSAlert({
        ...location,
        userId: user._id
      });

      toast("Help is on the way! Your location has been shared.");
    } catch (err) {
      console.error("Error during SOS:", err);
      setError("Failed to send SOS. Please try again or call emergency services.");
      toast.error("Failed to send SOS alert.");
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sos-container">
      <button
        onClick={handleSOSClick}
        disabled={isLoading}
        className="sos-button"
      >
        {isLoading ? 'Sending SOS...' : 'SOS EMERGENCY'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SOSButton;
