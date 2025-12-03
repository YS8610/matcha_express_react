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
  console.log('=== Matching API Tests (07) ===\n');
  const token = await getValidToken();

  if (!token) return console.log('⚠ Warning: Could not get token');

  console.log('\n--- Get Matching Profiles ---');

  await test('Should reject matches without token', async () => {
    const response = await fetch(`${BASE_URL}/api/match`, { method: 'GET' });
    if (response.status !== 401) throw new Error(`Expected 401, got ${response.status}`);
  });

  await test('Should return matching profiles', async () => {
    const response = await fetch(`${BASE_URL}/api/match`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (![200, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/match', response.status, data);
    } else {
      console.log(`  📤 GET /api/match`);
      console.log(`  📥 Status: ${response.status}`);
    }
  });

  console.log('\n--- Match Filters ---');

  await test('Should get match with filters', async () => {
    const response = await fetch(`${BASE_URL}/api/match?ageMin=20&ageMax=30&distance=100`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (![200, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/match (with filters)', response.status, data);
    }
  });

  console.log('\n--- Match Actions ---');

  await test('Should accept a match', async () => {
    const response = await fetch(`${BASE_URL}/api/match/some-user-id/accept`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 POST /api/match/some-user-id/accept`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  await test('Should reject a match', async () => {
    const response = await fetch(`${BASE_URL}/api/match/some-user-id/reject`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 POST /api/match/some-user-id/reject`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  console.log('\n=== Tests Complete ===');
}

runTests().catch(console.error);
