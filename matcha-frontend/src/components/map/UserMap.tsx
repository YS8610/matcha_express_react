'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ProfileShort } from '@/types';
import { api, generateAvatarUrl } from '@/lib/api';
import Link from 'next/link';
import { MapPin, Navigation } from 'lucide-react';

const createUserIcon = (isOnline: boolean) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${isOnline ? '#10b981' : '#6b7280'};
        border: 3px solid white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        font-size: 18px;
      ">
        👤
      </div>
    `,
    className: 'user-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const UserLocationButton = () => {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <button
      onClick={handleLocateUser}
      className="absolute bottom-20 right-4 z-[500] bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex items-center gap-2 shadow-md transition-colors"
      title="Find my location"
    >
      <Navigation className="w-4 h-4" />
      My Location
    </button>
  );
};

interface UserMapProps {
  users?: ProfileShort[];
  center?: [number, number];
  zoom?: number;
}

export default function UserMap({ users = [], center = [48.8566, 2.3522], zoom = 5 }: UserMapProps) {
  const [mapUsers, setMapUsers] = useState<ProfileShort[]>(users);
  const [loading, setLoading] = useState(!users.length);
  const [error, setError] = useState('');

  useEffect(() => {
    if (users.length > 0) {
      setMapUsers(users);
      setLoading(false);
      return;
    }

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.getFilteredProfiles({ skip: 0, limit: 500 });
        const profiles = Array.isArray(response) ? response : response.data || [];
        setMapUsers(profiles);
      } catch (err) {
        console.error('Failed to load users for map:', err);
        setError('Failed to load user locations');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [users]);

  const usersWithLocation = mapUsers.filter(
    (user) => user.latitude && user.longitude
  );

  if (loading) {
    return (
      <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 dark:border-green-400 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading user locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
      <MapContainer center={center} zoom={zoom} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {usersWithLocation.length > 0 && (
          <>
            {usersWithLocation.map((user) => {
              const isOnline = user.lastOnline ? Date.now() - user.lastOnline < 5 * 60 * 1000 : false;
              const photoUrl = user.photo0
                ? `/api/photo/${user.photo0}`
                : generateAvatarUrl(user.firstName + ' ' + user.lastName, user.id);

              return (
                <Marker
                  key={user.id}
                  position={[user.latitude!, user.longitude!]}
                  icon={createUserIcon(isOnline)}
                >
                  <Popup maxWidth={300} className="user-popup">
                    <div className="p-2">
                      <div className="flex items-start gap-3 mb-2">
                        <img
                          src={photoUrl}
                          alt={user.username}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = generateAvatarUrl(
                              user.firstName + ' ' + user.lastName,
                              user.id
                            );
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">@{user.username}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`inline-block w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <span className="text-xs text-gray-500">
                              {isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {user.latitude && user.longitude && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                          <MapPin className="w-3 h-3" />
                          <span>{user.latitude.toFixed(3)}, {user.longitude.toFixed(3)}</span>
                        </div>
                      )}

                      {user.fameRating && (
                        <div className="text-sm text-yellow-600 mb-3">
                          ⭐ Fame Rating: {typeof user.fameRating === 'object' ? (user.fameRating as any)?.low || 0 : user.fameRating}
                        </div>
                      )}

                      <Link
                        href={`/profile/${user.id}`}
                        className="block text-center bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded text-sm font-medium hover:from-green-700 hover:to-green-600 transition-all"
                      >
                        View Profile
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </>
        )}

        <UserLocationButton />
      </MapContainer>

      {usersWithLocation.length === 0 && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-white mx-auto mb-4" />
            <p className="text-white">No user locations available</p>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md z-[400] text-sm text-gray-700 dark:text-gray-300">
        <p className="font-semibold text-green-600">
          {usersWithLocation.length} user{usersWithLocation.length !== 1 ? 's' : ''} online
        </p>
      </div>
    </div>
  );
}
