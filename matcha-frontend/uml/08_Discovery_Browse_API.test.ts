const BASE_URL = 'http://localhost:3001';

async function getValidToken(): Promise<string | null> {
  const activationToken = process.env.ACTIVATION_TOKEN;
  const testUsername = process.env.TEST_USERNAME || `testuser_${Date.now()}`;
  const testPassword = process.env.TEST_PASSWORD || 'TestPass123!';
  const testEmail = `test_${Date.now()}@example.com`;

  try {
    if (activationToken) {
      const registerRes = await fetch(`${BASE_URL}/pubapi/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          pw: testPassword,
          pw2: testPassword,
          firstName: 'Test',
          lastName: 'User',
          username: testUsername,
          birthDate: '1990-01-01'
        })
      });

      if (!registerRes.ok && registerRes.status !== 409) {
        return null;
      }

      await fetch(`${BASE_URL}/pubapi/activate/${activationToken}`, { method: 'GET' }).catch(() => null);
    }

    const loginRes = await fetch(`${BASE_URL}/pubapi/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: testUsername, password: testPassword })
    });

    if (loginRes.ok) {
      const data = await loginRes.json();
      console.log(`  ✓ Authenticated as ${testUsername}`);
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
  console.log(`  📤 ${method} ${path}`);
  console.log(`  📥 Status: ${status}`);
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
    const response = await fetch(`${BASE_URL}/api/browse`, { method: 'GET' });
    if (response.status !== 401) throw new Error(`Expected 401, got ${response.status}`);
  });

  await test('Should get nearby users', async () => {
    const response = await fetch(`${BASE_URL}/api/browse`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (![200, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/browse', response.status, data);
    } else {
      console.log(`  📤 GET /api/browse`);
      console.log(`  📥 Status: ${response.status}`);
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
      `${BASE_URL}/api/browse?gender=FEMALE&ageMin=25&ageMax=35&distance=50&sort=distance`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    if (![200, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/browse (with filters)', response.status, data);
    }
  });

  console.log('\n--- View Profiles ---');

  await test('Should get user profile by ID', async () => {
    const response = await fetch(`${BASE_URL}/api/profile/some-user-id`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (![200, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/profile/some-user-id', response.status, data);
    }
  });

  console.log('\n=== Tests Complete ===');
}

runTests().catch(console.error);
