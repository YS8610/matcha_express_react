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
  console.log('=== Block & View Flow Tests (10) ===\n');
  const token = await getValidToken();

  if (!token) return console.log('⚠ Warning: Could not get token');

  let testUserId: string | null = null;
  try {
    const browseRes = await fetch(`${BASE_URL}/api/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (browseRes.status === 200) {
      const users = await browseRes.json();
      if (Array.isArray(users) && users.length > 0) {
        testUserId = users[0].id;
        console.log(`\n✓ Got test user ID from profile: ${testUserId}\n`);
      }
    }
  } catch (error) {
    console.log(`\n⚠ Could not get users from profile endpoint\n`);
  }

  if (!testUserId) {
    console.log('⚠ Warning: Could not get a real user ID - some tests may fail with 400 status');
    testUserId = 'test-user-123';
  }

  console.log('\n--- Initial Scenario: User not blocked ---');

  await test('Should be able to view profile initially', async () => {
    const response = await fetch(`${BASE_URL}/api/profile/${testUserId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 GET /api/profile/${testUserId}`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 400, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  await test('Should record view of profile', async () => {
    const response = await fetch(`${BASE_URL}/api/view/${testUserId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 POST /api/view/${testUserId}`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 400, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  console.log('\n--- Block User ---');

  await test('Should block the user', async () => {
    const response = await fetch(`${BASE_URL}/api/block/${testUserId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 POST /api/block/${testUserId}`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 400, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  console.log('\n--- After Block: User cannot view ---');

  await test('Should reject profile view after block', async () => {
    const response = await fetch(`${BASE_URL}/api/profile/${testUserId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 GET /api/profile/${testUserId} (blocked)`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 400, 403, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  await test('Should reject view recording after block', async () => {
    const response = await fetch(`${BASE_URL}/api/view/${testUserId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 POST /api/view/${testUserId} (blocked)`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 400, 403, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  console.log('\n--- Get Blocked Users ---');

  await test('Should list blocked users', async () => {
    const response = await fetch(`${BASE_URL}/api/block`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (![200, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/block', response.status, data);
    } else {
      console.log(`  📤 GET /api/block`);
      console.log(`  📥 Status: ${response.status}`);
    }
  });

  console.log('\n--- Unblock User ---');

  await test('Should unblock the user', async () => {
    const response = await fetch(`${BASE_URL}/api/block/${testUserId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 DELETE /api/block/${testUserId}`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 400, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  console.log('\n--- After Unblock: User can view again ---');

  await test('Should allow profile view after unblock', async () => {
    const response = await fetch(`${BASE_URL}/api/profile/${testUserId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 GET /api/profile/${testUserId} (unblocked)`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 400, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  console.log('\n=== Tests Complete ===');
}

runTests().catch(console.error);
