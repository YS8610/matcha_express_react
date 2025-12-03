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
    console.log('💡 Make sure backend is running on http://localhost:3001');
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

function logResp(method: string, path: string, status: number, data?: any) {
  console.log(`  📤 ${method} ${path}`);
  console.log(`  📥 Status: ${status}`);
  if (data) {
    const str = JSON.stringify(data);
    console.log(`     Response: ${str.substring(0, 1000)}${str.length > 1000 ? '...' : ''}`);
  }
}

async function runTests() {
  console.log('=== Photo & Tag API Tests (03) ===\n');
  const token = await getValidToken();

  console.log('\n--- Get Photos ---');

  await test('Should reject photo list without token', async () => {
    const response = await fetch(`${BASE_URL}/api/user/photo`, { method: 'GET' });
    console.log(`  📤 GET /api/user/photo (no auth)`);
    console.log(`  📥 Status: ${response.status}`);
    if (response.status !== 401) throw new Error(`Expected 401, got ${response.status}`);
  });

  if (!token) return console.log('⚠ Warning: Could not get token - skipping authenticated tests');

  await test('Should return user photos', async () => {
    const response = await fetch(`${BASE_URL}/api/user/photo`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (![200, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/user/photo', response.status, data);
    } else {
      console.log(`  📤 GET /api/user/photo`);
      console.log(`  📥 Status: ${response.status}`);
    }
  });

  console.log('\n--- Upload Photo ---');

  await test('Should reject photo upload without file', async () => {
    const response = await fetch(`${BASE_URL}/api/user/photo/0`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 PUT /api/user/photo/0 (no file)`);
    console.log(`  📥 Status: ${response.status}`);
    if (![400, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  console.log('\n--- Get Tags ---');

  await test('Should return user tags', async () => {
    const response = await fetch(`${BASE_URL}/api/user/tag`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (![200, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/user/tag', response.status, data);
    } else {
      console.log(`  📤 GET /api/user/tag`);
      console.log(`  📥 Status: ${response.status}`);
    }
  });

  console.log('\n--- Update Tags ---');

  await test('Should update user tags', async () => {
    const response = await fetch(`${BASE_URL}/api/user/tag`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ tags: ['travel', 'photography'] })
    });
    console.log(`  📤 PUT /api/user/tag`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 400, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  console.log('\n=== Tests Complete ===');
}

runTests().catch(console.error);
