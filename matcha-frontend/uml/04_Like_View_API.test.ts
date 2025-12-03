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
  console.log(`  📤 ${method} ${path}`);
  console.log(`  📥 Status: ${status}`);
  if (data) {
    const str = JSON.stringify(data);
    console.log(`     Response: ${str.substring(0, 1000)}${str.length > 1000 ? '...' : ''}`);
  }
}

async function runTests() {
  console.log('=== Like & View API Tests (04) ===\n');
  const token = await getValidToken();

  if (!token) return console.log('⚠ Warning: Could not get token');

  console.log('\n--- Like Operations ---');

  await test('Should reject like without token', async () => {
    const response = await fetch(`${BASE_URL}/api/like/user123`, { method: 'POST' });
    if (response.status !== 401) throw new Error(`Expected 401, got ${response.status}`);
  });

  await test('Should like a user', async () => {
    const response = await fetch(`${BASE_URL}/api/like/some-user-id`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 POST /api/like/some-user-id`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  await test('Should unlike a user', async () => {
    const response = await fetch(`${BASE_URL}/api/like/some-user-id`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 DELETE /api/like/some-user-id`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  console.log('\n--- View Operations ---');

  await test('Should record view of user', async () => {
    const response = await fetch(`${BASE_URL}/api/view/some-user-id`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 POST /api/view/some-user-id`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  await test('Should get views', async () => {
    const response = await fetch(`${BASE_URL}/api/view`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (![200, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/view', response.status, data);
    }
  });

  console.log('\n=== Tests Complete ===');
}

runTests().catch(console.error);
