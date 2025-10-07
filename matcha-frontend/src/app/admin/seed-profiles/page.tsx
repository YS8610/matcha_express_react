'use client';

import { useState } from 'react';
import { Users, Play, CheckCircle, XCircle, Loader } from 'lucide-react';
import { generateFakeProfiles, FakeProfile } from '@/lib/fakeDataGenerator';

export default function SeedProfilesPage() {
  const [count, setCount] = useState(500);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const fetchRandomPhoto = async (gender: number): Promise<Blob | null> => {
    try {
      const genderParam = gender === 0 ? 'male' : gender === 1 ? 'female' : Math.random() > 0.5 ? 'male' : 'female';
      const response = await fetch(`https://randomuser.me/api/?gender=${genderParam}&inc=picture`);
      const data = await response.json();

      if (data.results && data.results[0]?.picture?.large) {
        const imageUrl = data.results[0].picture.large;
        const imageResponse = await fetch(imageUrl);
        const blob = await imageResponse.blob();
        return blob;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch random photo:', error);
      return null;
    }
  };

  const createProfile = async (profile: FakeProfile, index: number) => {
    try {
      const registerResponse = await fetch('/pubapi/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Registration failed: ${registerResponse.status}`);
      }

      const registerData = await registerResponse.json();
      addLog(`✓ Registered: ${profile.username} (${index + 1}/${count})`);

      const activationToken = registerData.msg || '';

      if (activationToken) {
        const activateResponse = await fetch(`/pubapi/activate/${activationToken}`, {
          method: 'GET',
        });

        if (activateResponse.ok) {
          const activateData = await activateResponse.json();
          const authToken = activateData.msg;

          await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
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

          for (const tag of profile.tags) {
            await fetch('/api/user/tag', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
              },
              body: JSON.stringify({ tagName: tag }),
            });
          }

          const photoCount = Math.floor(Math.random() * 3) + 1; 
          for (let i = 0; i < photoCount; i++) {
            const photoBlob = await fetchRandomPhoto(profile.gender);
            if (photoBlob) {
              const formData = new FormData();
              formData.append('photo', photoBlob, `photo${i}.jpg`);

              await fetch(`/api/user/photo/${i}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${authToken}`
                },
                body: formData,
              });
            }
          }

          addLog(`✓ Setup complete: ${profile.username}`);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 200));

      return { success: true, username: profile.username };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`✗ Failed: ${profile.username} - ${errorMessage}`);
      return { success: false, username: profile.username, error: errorMessage };
    }
  };

  const startSeeding = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setProgress(0);
    setSuccessCount(0);
    setFailureCount(0);
    setLogs([]);
    setCompleted(false);

    addLog(`Starting to generate ${count} profiles...`);

    const profiles = generateFakeProfiles(count);
    addLog(`Generated ${profiles.length} fake profiles`);
    addLog('Starting registration process...');

    let successTotal = 0;
    let failureTotal = 0;

    const batchSize = 5;
    for (let i = 0; i < profiles.length; i += batchSize) {
      const batch = profiles.slice(i, i + batchSize);

      const results = await Promise.all(
        batch.map((profile, batchIndex) => createProfile(profile, i + batchIndex))
      );

      results.forEach(result => {
        if (result.success) {
          successTotal++;
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
    addLog(`Total Profiles: ${count}`);
    addLog(`Successful: ${successTotal}`);
    addLog(`Failed: ${failureTotal}`);
    addLog(`Success Rate: ${((successTotal / count) * 100).toFixed(1)}%`);

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
          <p className="text-gray-600">Generate fake profiles for testing and evaluation</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Profiles to Generate
              </label>
              <input
                type="number"
                id="count"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 0))}
                disabled={isRunning}
                min="1"
                max="2000"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 500-1000 profiles. Each profile will have random data, tags, biography, and 1-3 random photos.
              </p>
            </div>

            <button
              onClick={startSeeding}
              disabled={isRunning || count < 1}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all flex items-center justify-center gap-2"
            >
              {isRunning ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating Profiles...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Seeding
                </>
              )}
            </button>
          </div>
        </div>

        {(isRunning || completed) && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Progress</h2>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Overall Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-600 to-green-400 h-full transition-all duration-300 flex items-center justify-center text-xs text-white font-medium"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 10 && `${progress}%`}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Success</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">{successCount}</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">Failed</span>
                </div>
                <p className="text-2xl font-bold text-red-600 mt-1">{failureCount}</p>
              </div>
            </div>
          </div>
        )}

        {logs.length > 0 && (
          <div className="bg-gray-900 rounded-lg shadow-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Logs</h2>
            <div className="bg-black rounded-md p-4 h-96 overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`${
                    log.includes('✓')
                      ? 'text-green-400'
                      : log.includes('✗')
                      ? 'text-red-400'
                      : log.includes('===')
                      ? 'text-yellow-400 font-bold'
                      : 'text-gray-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {completed && (
          <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <p className="font-medium">✓ Seeding completed!</p>
            <p className="text-sm mt-1">
              Successfully created {successCount} out of {count} profiles.
              {failureCount > 0 && ` ${failureCount} profiles failed (likely due to duplicate usernames).`}
            </p>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg">
          <p className="font-medium">⚠️ Important Notes:</p>
          <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
            <li>All generated profiles use the password: <code className="bg-yellow-200 px-1 rounded">Test123!@#</code></li>
            <li>Email format: <code className="bg-yellow-200 px-1 rounded">username@matchatest.com</code></li>
            <li>Profiles are created with random names, birthdates, genders, tags, and photos</li>
            <li>Each profile gets 1-3 random photos from randomuser.me API</li>
            <li>All accounts are automatically activated and fully set up</li>
            <li>The process may take several minutes depending on the number of profiles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
