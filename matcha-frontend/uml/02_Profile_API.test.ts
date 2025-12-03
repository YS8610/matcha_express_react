const BASE_URL = 'http://localhost:3001';
let validToken: string;

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
    } else {
      const error = await loginRes.json().catch(() => ({}));
      console.log(`✗ Login failed (${loginRes.status}): ${error.msg || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    console.error(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    console.log('Make sure backend is running on http://localhost:3001');
    return null;
  }
}

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function runTests() {
  console.log('=== Profile API Tests (02) ===\n');
  const token = await getValidToken();

  console.log('\n--- Get Own Profile ---');

  await test('Should reject request without token', async () => {
    const response = await fetch(`${BASE_URL}/api/user/profile`, { method: 'GET' });
    console.log(`  GET /api/user/profile (no auth)`);
    console.log(`  Status: ${response.status}`);
    if (response.status !== 401) throw new Error(`Expected 401, got ${response.status}`);
  });

  function logResp(method: string, path: string, status: number, data?: any) {
    console.log(`  ${method} ${path}`);
    console.log(`  Status: ${status}`);
    if (data) {
      const str = JSON.stringify(data);
      console.log(`     Response: ${str.substring(0, 1000)}${str.length > 1000 ? '...' : ''}`);
    }
  }

  if (!token) return console.log('⚠ Warning: Could not get token');

  await test('Should return own profile data', async () => {
    const response = await fetch(`${BASE_URL}/api/user/profile`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (![200, 403].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      if (!data.id || !data.username) throw new Error('Missing profile fields');
      logResp('GET', '/api/user/profile', response.status, data);
    } else {
      console.log(`  GET /api/user/profile`);
      console.log(`  Status: ${response.status}`);
    }
  });

  console.log('\n--- Update Own Profile ---');

  await test('Should reject update with empty firstName', async () => {
    const body = {
      firstName: '',
      lastName: 'Smith',
      email: 'john@example.com',
      gender: 'MALE',
      sexualPreference: 'FEMALE',
      biography: 'Hello',
      birthDate: '1990-05-15'
    };
    const response = await fetch(`${BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    console.log(`  PUT /api/user/profile (empty firstName)`);
    console.log(`     Body: ${JSON.stringify(body).substring(0, 300)}`);
    console.log(`  Status: ${response.status}`);
    const data = await response.json().catch(() => null);
    if (data) {
      console.log(`     Response: ${JSON.stringify(data).substring(0, 500)}`);
    }
    if (![400, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should successfully update profile', async () => {
    const body = {
      firstName: 'Jonathan',
      lastName: 'Smith',
      email: 'john@example.com',
      gender: 'MALE',
      sexualPreference: 'FEMALE',
      biography: 'I love traveling',
      birthDate: '1990-05-15'
    };
    const response = await fetch(`${BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    console.log(`  PUT /api/user/profile (update)`);
    console.log(`     Body: ${JSON.stringify(body).substring(0, 300)}`);
    console.log(`  Status: ${response.status}`);
    const data = await response.json().catch(() => null);
    if (data) {
      console.log(`     Response: ${JSON.stringify(data).substring(0, 500)}`);
    }
    if (![200, 400].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should reject update with invalid gender', async () => {
    const body = {
      firstName: 'Jonathan',
      lastName: 'Smith',
      email: 'john@example.com',
      gender: 'INVALID_GENDER',
      sexualPreference: 'FEMALE',
      biography: 'I love traveling',
      birthDate: '1990-05-15'
    };
    const response = await fetch(`${BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    console.log(`  PUT /api/user/profile (invalid gender)`);
    console.log(`     Body: ${JSON.stringify(body).substring(0, 300)}`);
    console.log(`  Status: ${response.status}`);
    const data = await response.json().catch(() => null);
    if (data) {
      console.log(`     Response: ${JSON.stringify(data).substring(0, 500)}`);
    }
    if (![400, 422].includes(response.status)) throw new Error(`Expected 4xx, got ${response.status}`);
  });

  console.log('\n--- Get Other Profile ---');

  await test('Should return 404/400 for nonexistent user', async () => {
    const response = await fetch(`${BASE_URL}/api/profile/nonexistent-user-xyz`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  GET /api/profile/nonexistent-user-xyz`);
    console.log(`  Status: ${response.status}`);
    const data = await response.json().catch(() => null);
    if (data) {
      console.log(`     Response: ${JSON.stringify(data).substring(0, 500)}`);
    }
    if (![404, 400, 401].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should get full profile of valid user', async () => {
    const browseRes = await fetch(`${BASE_URL}/api/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  GET /api/profile (to fetch valid user)`);
    console.log(`  Status: ${browseRes.status}`);
    const browseError = await browseRes.json().catch(() => null);
    if (browseError) {
      console.log(`     Error: ${JSON.stringify(browseError).substring(0, 500)}`);
    }

    if (browseRes.status === 200) {
      const users = await browseRes.json();
      console.log(`  Users fetched: ${users.length}`);
      if (Array.isArray(users) && users.length > 0) {
        const userId = users[0].id;
        console.log(`  GET /api/profile/${userId} (valid user)`);
        const response = await fetch(`${BASE_URL}/api/profile/${userId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`  Status: ${response.status}`);
        const data = await response.json().catch(() => null);
        if (data) {
          console.log(`     Response: ${JSON.stringify(data).substring(0, 500)}`);
        }
        if (![200, 400, 401, 403].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
      }
    }
  });

  await test('Should get short profile of valid user', async () => {
    const browseRes = await fetch(`${BASE_URL}/api/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  GET /api/profile (to fetch valid user)`);
    console.log(`  Status: ${browseRes.status}`);
    const browseError = await browseRes.json().catch(() => null);
    if (browseError) {
      console.log(`     Error: ${JSON.stringify(browseError).substring(0, 500)}`);
    }

    if (browseRes.status === 200) {
      const users = await browseRes.json();
      console.log(`  Users fetched: ${users.length}`);
      if (Array.isArray(users) && users.length > 0) {
        const userId = users[0].id;
        console.log(`  GET /api/profile/short/${userId} (valid user)`);
        const response = await fetch(`${BASE_URL}/api/profile/short/${userId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`  Status: ${response.status}`);
        const data = await response.json().catch(() => null);
        if (data) {
          console.log(`     Response: ${JSON.stringify(data).substring(0, 500)}`);
        }
        if (![200, 400, 401, 403].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
      }
    }
  });

  console.log('\n--- Update Location ---');

  await test('Should reject invalid coordinates', async () => {
    const body = { latitude: 999, longitude: 999 };
    const response = await fetch(`${BASE_URL}/api/user/location`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    console.log(`  PUT /api/user/location`);
    console.log(`     Body: ${JSON.stringify(body)}`);
    console.log(`  Status: ${response.status}`);
    const data = await response.json().catch(() => null);
    if (data) {
      console.log(`     Response: ${JSON.stringify(data).substring(0, 500)}`);
    }
    if (![400, 500].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should update location with valid coordinates', async () => {
    const body = { latitude: 40.7128, longitude: -74.0060 };
    const response = await fetch(`${BASE_URL}/api/user/location`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    console.log(`  PUT /api/user/location`);
    console.log(`     Body: ${JSON.stringify(body)}`);
    console.log(`  Status: ${response.status}`);
    const data = await response.json().catch(() => null);
    if (data) {
      console.log(`     Response: ${JSON.stringify(data).substring(0, 500)}`);
    }
    if (![200, 400, 401].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  console.log('\n=== Tests Complete ===');
}

runTests().catch(console.error);
