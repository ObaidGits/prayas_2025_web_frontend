import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const EmergencyMap = ({ policeStationCoords, alertCoords }) => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const orsApiKey = '5b3ce3597851110001cf6248faeaa86e3ffb46ce97252e71ddeb6afa';

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await axios.post(
          'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
          {
            coordinates: [
              [policeStationCoords.lng, policeStationCoords.lat],
              [alertCoords.lng, alertCoords.lat]
            ]
          },
          {
            headers: {
              Authorization: orsApiKey,
              'Content-Type': 'application/json'
            }
          }
        );

        const route = response.data.features[0];
        const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteCoords(coords);

        const distInKm = (route.properties.summary.distance / 1000).toFixed(2);
        const timeInMin = Math.round(route.properties.summary.duration / 60);
        setDistance(`${distInKm} km`);
        setDuration(`${timeInMin} min`);
      } catch (err) {
        console.error('Error fetching route:', err);
      }
    };

    if (policeStationCoords && alertCoords) {
      fetchRoute();
    }
  }, [policeStationCoords, alertCoords, orsApiKey]);

  const centerPosition = alertCoords || policeStationCoords;

  // Component to fit bounds when routeCoords update
  const FitBounds = () => {
    const map = useMap();

    useEffect(() => {
      if (routeCoords.length > 0) {
        const bounds = L.latLngBounds(routeCoords);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [routeCoords, map]);

    return null;
  };

  return (
    <div className="emergency-map">
      {/* Info Section */}
      <div style={{"display":"flex", "justifyContent":"space-between"}}>
        <p style={{"fontSize":"17px", "paddingBottom":"5px", "marginBottom":"0"}}><strong>Distance:</strong> {distance}</p>
        <p style={{"fontSize":"17px", "paddingBottom":"5px", "marginBottom":"0"}}><strong>Estimated Time:</strong> {duration}</p>
      </div>

      <MapContainer center={centerPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[policeStationCoords.lat, policeStationCoords.lng]}>
          <Popup>🚓 Police Station</Popup>
        </Marker>

        <Marker position={[alertCoords.lat, alertCoords.lng]}>
          <Popup>🚨 SOS Alert Location</Popup>
        </Marker>

        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="red" />
        )}

        <FitBounds />
      </MapContainer>
    </div>
  );
};

export default EmergencyMap;
