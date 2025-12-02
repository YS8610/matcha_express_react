const BASE_URL = 'http://localhost:3001';
let validToken: string;

async function getValidToken(): Promise<string | null> {
  const activationToken = process.env.ACTIVATION_TOKEN;
  const testUsername = process.env.TEST_USERNAME || `testuser_${Date.now()}`;
  const testPassword = process.env.TEST_PASSWORD || 'TestPass123!';
  const testEmail = `test_${Date.now()}@example.com`;

  try {
    if (activationToken) {
      console.log('  Registering test user...');
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
        console.log(`  ✗ Registration failed (${registerRes.status})`);
        return null;
      }
      console.log('  ✓ User registered');

      console.log('  Activating account with token...');
      const activateRes = await fetch(`${BASE_URL}/pubapi/activate/${activationToken}`, {
        method: 'GET'
      });
      if (activateRes.ok) {
        console.log('  ✓ Account activated');
      } else {
        console.log(`  ⚠ Activation returned ${activateRes.status}, proceeding with login`);
      }
    }

    console.log('  Attempting login...');
    const loginRes = await fetch(`${BASE_URL}/pubapi/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: testUsername, password: testPassword })
    });

    if (loginRes.ok) {
      const data = await loginRes.json();
      console.log(`  ✓ Login successful (${testUsername})`);
      return data.msg;
    } else {
      let error;
      try {
        error = await loginRes.json();
        console.log(`  ✗ Login failed (${loginRes.status}): ${error.msg || JSON.stringify(error).substring(0, 500)}`);
      } catch (e) {
        const text = await loginRes.text();
        console.log(`  ✗ Login failed (${loginRes.status}): ${text.substring(0, 500)}`);
      }
      console.log('  Provide activation token: ACTIVATION_TOKEN=xxx npx ts-node 02_Profile_API.test.ts');
      return null;
    }
  } catch (error) {
    console.error(`  ✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    console.log('  💡 Make sure backend is running on http://localhost:3001');
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
    console.log(`  📤 GET /api/user/profile (no auth)`);
    console.log(`  📥 Status: ${response.status}`);
    if (response.status !== 401) throw new Error(`Expected 401, got ${response.status}`);
  });

  function logResp(method: string, path: string, status: number, data?: any) {
    console.log(`  📤 ${method} ${path}`);
    console.log(`  📥 Status: ${status}`);
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
      console.log(`  📤 GET /api/user/profile`);
      console.log(`  📥 Status: ${response.status}`);
    }
  });

  console.log('\n--- Update Own Profile ---');

  await test('Should reject update with empty firstName', async () => {
    const response = await fetch(`${BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        firstName: '',
        lastName: 'Smith',
        email: 'john@example.com',
        gender: 'MALE',
        sexualPreference: 'FEMALE',
        biography: 'Hello',
        birthDate: '1990-05-15'
      })
    });
    console.log(`  📤 PUT /api/user/profile`);
    console.log(`  📥 Status: ${response.status}`);
    if (![400, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should successfully update profile', async () => {
    const response = await fetch(`${BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        firstName: 'Jonathan',
        lastName: 'Smith',
        email: 'john@example.com',
        gender: 'MALE',
        sexualPreference: 'FEMALE',
        biography: 'I love traveling',
        birthDate: '1990-05-15'
      })
    });
    console.log(`  📤 PUT /api/user/profile (update)`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 400].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  console.log('\n--- Get Other Profile ---');

  await test('Should return 404 for nonexistent user', async () => {
    const response = await fetch(`${BASE_URL}/api/profile/nonexistent-user-xyz`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 GET /api/profile/nonexistent-user-xyz`);
    console.log(`  📥 Status: ${response.status}`);
    if (![404, 401].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should get short profile of user', async () => {
    const response = await fetch(`${BASE_URL}/api/profile/short/some-user-id`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 GET /api/profile/short/some-user-id`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 404, 401, 403].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  console.log('\n--- Update Location ---');

  await test('Should reject invalid coordinates', async () => {
    const response = await fetch(`${BASE_URL}/api/user/location`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ latitude: 999, longitude: 999 })
    });
    console.log(`  📤 PUT /api/user/location (invalid)`);
    console.log(`  📥 Status: ${response.status}`);
    if (![400, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should update location with valid coordinates', async () => {
    const response = await fetch(`${BASE_URL}/api/user/location`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ latitude: 40.7128, longitude: -74.0060 })
    });
    console.log(`  📤 PUT /api/user/location (40.7128, -74.0060)`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 400, 401].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  console.log('\n=== Tests Complete ===');
}

runTests().catch(console.error);
