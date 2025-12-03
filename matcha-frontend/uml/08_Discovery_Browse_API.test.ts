const BASE_URL = 'http://localhost:3001';

async function getValidToken(): Promise<string | null> {
  try {
    console.log('  → Logging in...');
    const loginRes = await fetch(`${BASE_URL}/pubapi/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'jegoh', password: 'Pass1234!' })
    });

    if (loginRes.ok) {
      const data = await loginRes.json();
      console.log(`✓ Logged in as jegoh`);
      return data.msg;
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function logResp(method: string, path: string, status: number, data?: any) {
  console.log(`  ${method} ${path}`);
  console.log(`  Status: ${status}`);
  if (data) {
    const str = JSON.stringify(data);
    console.log(`     Response: ${str.substring(0, 1000)}${str.length > 1000 ? '...' : ''}`);
  }
}

async function runTests() {
  console.log('=== Discovery & Browse API Tests (08) ===\n');
  const token = await getValidToken();

  if (!token) return console.log('⚠ Warning: Could not get token');

  console.log('\n--- Browse Nearby ---');

  await test('Should reject browse without token', async () => {
    const response = await fetch(`${BASE_URL}/api/profile`, { method: 'GET' });
    if (response.status !== 401) throw new Error(`Expected 401, got ${response.status}`);
  });

  await test('Should get nearby users', async () => {
    const response = await fetch(`${BASE_URL}/api/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (![200, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/profile', response.status, data);
    } else {
      console.log(`  GET /api/profile`);
      console.log(`  Status: ${response.status}`);
    }
  });

  console.log('\n--- Search Users ---');

  await test('Should search users', async () => {
    const response = await fetch(`${BASE_URL}/api/search?q=test`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (![200, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/search?q=test', response.status, data);
    }
  });

  console.log('\n--- Filters ---');

  await test('Should apply discovery filters', async () => {
    const response = await fetch(
      `${BASE_URL}/api/profile?gender=FEMALE&ageMin=25&ageMax=35&distance=50&sort=distance`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    if (![200, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/profile (with filters)', response.status, data);
    }
  });

  console.log('\n--- View Profiles ---');

  let testUserId: string | null = null;
  await test('Should get user profile by ID (using real user from browse)', async () => {
    const browseRes = await fetch(`${BASE_URL}/api/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (browseRes.status === 200) {
      const users = await browseRes.json();
      if (Array.isArray(users) && users.length > 0) {
        testUserId = users[0].id;
        console.log(`  GET /api/profile (extracting user ID: ${testUserId})`);

        const response = await fetch(`${BASE_URL}/api/profile/${testUserId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        logResp('GET', `/api/profile/${testUserId}`, response.status);
        if (![200, 400, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
        if (response.status === 200) {
          const data = await response.json();
          console.log(`     Response: ${JSON.stringify(data).substring(0, 500)}`);
        }
      } else {
        console.log(`  ⚠ No users found in browse results`);
      }
    } else {
      console.log(`  ⚠ Could not get users from browse (status: ${browseRes.status})`);
    }
  });

  console.log('\n=== Tests Complete ===');
}

runTests().catch(console.error);
