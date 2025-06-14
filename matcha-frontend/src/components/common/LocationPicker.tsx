// src/components/common/LocationPicker.tsx
import React, { useState } from 'react';
import { MapPin, Navigation, Check, X } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';

interface LocationPickerProps {
  onLocationUpdate: (latitude: number, longitude: number) => void;
  currentLatitude?: number;
  currentLongitude?: number;
  className?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationUpdate,
  currentLatitude,
  currentLongitude,
  className = ''
}) => {
  const { getCurrentLocation, isLoading, hasPermission } = useLocation();
  const [manualCoords, setManualCoords] = useState({
    latitude: currentLatitude?.toString() || '',
    longitude: currentLongitude?.toString() || ''
  });
  const [showManualInput, setShowManualInput] = useState(false);

  const handleGPSLocation = async () => {
    await getCurrentLocation(true);
  };

  const handleManualSubmit = () => {
    const lat = parseFloat(manualCoords.latitude);
    const lng = parseFloat(manualCoords.longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Please enter valid coordinates');
      return;
    }

    onLocationUpdate(lat, lng);
    setShowManualInput(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleGPSLocation}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          <Navigation size={16} />
          <span>{isLoading ? 'Getting Location...' : 'Use Current Location'}</span>
        </button>

        <button
          onClick={() => setShowManualInput(!showManualInput)}
          className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <MapPin size={16} />
          <span>Manual Location</span>
        </button>
      </div>

      {!hasPermission && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="text-sm">
            Location permission denied. We'll use your IP address to estimate your location.
          </p>
        </div>
      )}

      {showManualInput && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium text-gray-800">Enter Coordinates Manually</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                placeholder="-90 to 90"
                value={manualCoords.latitude}
                onChange={(e) => setManualCoords(prev => ({ ...prev, latitude: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                placeholder="-180 to 180"
                value={manualCoords.longitude}
                onChange={(e) => setManualCoords(prev => ({ ...prev, longitude: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleManualSubmit}
              className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
            >
              <Check size={14} />
              <span>Update</span>
            </button>
            
            <button
              onClick={() => setShowManualInput(false)}
              className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
            >
              <X size={14} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
