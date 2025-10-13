'use client';

import { useState } from 'react';
import { Users, Play, CheckCircle, XCircle, Loader } from 'lucide-react';
import { generateFakeProfiles, FakeProfile } from '@/lib/fakeDataGenerator';

const API_DELAY = 200;
const BATCH_SIZE = 5;

const fetchRandomPhoto = async (gender: number): Promise<Blob | null> => {
  try {
    const genderParam = gender === 0 ? 'male' : gender === 1 ? 'female' : Math.random() > 0.5 ? 'male' : 'female';
    const res = await fetch(`https://randomuser.me/api/?gender=${genderParam}&inc=picture`);
    const data = await res.json();
    if (data.results?.[0]?.picture?.large) {
      const imgRes = await fetch(data.results[0].picture.large);
      return await imgRes.blob();
    }
  } catch (error) {
    console.error('Failed to fetch photo:', error);
  }
  return null;
};

const apiCall = async (url: string, token: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });
};

const createProfile = async (profile: FakeProfile, index: number, count: number, addLog: (msg: string) => void) => {
  try {
    const regRes = await apiCall('/pubapi/register', '', {
      method: 'POST',
      body: JSON.stringify({
        email: profile.email,
        pw: profile.password,
        pw2: profile.password,
        firstName: profile.firstName,
        lastName: profile.lastName,
        username: profile.username,
        birthDate: profile.birthDate
      }),
    });

    if (!regRes.ok) {
      const err = await regRes.json().catch(() => ({}));
      throw new Error(err.message || `Registration failed: ${regRes.status}`);
    }

    addLog(`✓ Registered: ${profile.username} (${index + 1}/${count})`);
    const { msg: activationToken } = await regRes.json();

    if (activationToken) {
      const actRes = await fetch(`/pubapi/activate/${activationToken}`);
      if (actRes.ok) {
        const { msg: authToken } = await actRes.json();

        await apiCall('/api/user/profile', authToken, {
          method: 'PUT',
          body: JSON.stringify({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            gender: profile.gender,
            sexualPreference: profile.sexualPreference,
            biography: profile.biography,
            birthDate: profile.birthDate
          }),
        });

        await Promise.all(profile.tags.map(tag =>
          apiCall('/api/user/tag', authToken, {
            method: 'POST',
            body: JSON.stringify({ tagName: tag })
          })
        ));

        const photoCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < photoCount; i++) {
          const photoBlob = await fetchRandomPhoto(profile.gender);
          if (photoBlob) {
            const formData = new FormData();
            formData.append('photo', photoBlob, `photo${i}.jpg`);
            await fetch(`/api/user/photo/${i}`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${authToken}` },
              body: formData,
            });
          }
        }

        addLog(`✓ Setup complete: ${profile.username}`);
      }
    }

    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    return { success: true, username: profile.username, password: profile.password };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    addLog(`✗ Failed: ${profile.username} - ${errorMessage}`);
    return { success: false, username: profile.username, password: profile.password, error: errorMessage };
  }
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType, label: string, value: number, color: 'green' | 'red' }) => (
  <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
    <div className={`flex items-center gap-2 text-${color}-700`}>
      <Icon className="w-5 h-5" />
      <span className="font-semibold">{label}</span>
    </div>
    <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
  </div>
);

export default function SeedProfilesPage() {
  const [count, setCount] = useState(500);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [createdProfiles, setCreatedProfiles] = useState<Array<{ username: string; password: string }>>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const startSeeding = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setProgress(0);
    setSuccessCount(0);
    setFailureCount(0);
    setLogs([]);
    setCompleted(false);
    setCreatedProfiles([]);

    addLog(`Starting to generate ${count} profiles...`);
    const profiles = generateFakeProfiles(count);
    addLog(`Generated ${profiles.length} fake profiles. Starting registration...`);

    let successTotal = 0, failureTotal = 0;
    const successful: Array<{ username: string; password: string }> = [];

    for (let i = 0; i < profiles.length; i += BATCH_SIZE) {
      const batch = profiles.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map((profile, idx) => createProfile(profile, i + idx, count, addLog)));

      results.forEach(result => {
        if (result.success) {
          successTotal++;
          successful.push({ username: result.username, password: result.password });
        } else {
          failureTotal++;
        }
      });
      setSuccessCount(successTotal);
      setFailureCount(failureTotal);
      setProgress(Math.round(((i + batch.length) / profiles.length) * 100));
    }

    addLog('');
    addLog('=== SEEDING COMPLETED ===');
    addLog(`Total: ${count} | Success: ${successTotal} | Failed: ${failureTotal} | Rate: ${((successTotal / count) * 100).toFixed(1)}%`);

    setCreatedProfiles(successful);
    setCompleted(true);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-full">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
            Profile Database Seeder
          </h1>
          <p className="text-gray-600">Generate fake profiles for testing</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Profiles
          </label>
          <input
            type="number"
            id="count"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 0))}
            disabled={isRunning}
            min="1"
            max="2000"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 mb-2"
          />
          <p className="text-xs text-gray-500 mb-4">Recommended: 500-1000. Each gets random data, tags, bio, and 1-3 photos.</p>

          <button
            onClick={startSeeding}
            disabled={isRunning || count < 1}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-600 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <><Loader className="w-5 h-5 animate-spin" />Generating...</>
            ) : (
              <><Play className="w-5 h-5" />Start Seeding</>
            )}
          </button>
        </div>

        {(isRunning || completed) && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Progress</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Overall Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-600 to-green-400 h-full transition-all duration-300 rounded-full flex items-center justify-center text-xs text-white font-medium"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 10 && `${progress}%`}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard icon={CheckCircle} label="Success" value={successCount} color="green" />
              <StatCard icon={XCircle} label="Failed" value={failureCount} color="red" />
            </div>
          </div>
        )}

        {logs.length > 0 && (
          <div className="bg-gray-900 rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Logs</h2>
            <div className="bg-black rounded-md p-4 h-96 overflow-y-auto font-mono text-sm">
              {logs.map((log, i) => (
                <div key={i} className={`${log.includes('✓') ? 'text-green-400' : log.includes('✗') ? 'text-red-400' : log.includes('===') ? 'text-yellow-400 font-bold' : 'text-gray-300'}`}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {completed && createdProfiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Created Accounts</h2>
            <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="text-left p-2 font-semibold">#</th>
                    <th className="text-left p-2 font-semibold">Username</th>
                    <th className="text-left p-2 font-semibold">Password</th>
                  </tr>
                </thead>
                <tbody>
                  {createdProfiles.map((profile, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="p-2 text-gray-600">{idx + 1}</td>
                      <td className="p-2 font-mono">{profile.username}</td>
                      <td className="p-2 font-mono">{profile.password}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
