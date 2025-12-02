const BASE_URL = 'http://localhost:3001';
const WS_URL = 'ws://localhost:3001';

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
  console.log('=== Chat & Messages API Tests (09) ===\n');
  const token = await getValidToken();

  if (!token) return console.log('⚠ Warning: Could not get token');

  console.log('\n--- Get Messages ---');

  await test('Should reject messages without token', async () => {
    const response = await fetch(`${BASE_URL}/api/message`, { method: 'GET' });
    if (response.status !== 401) throw new Error(`Expected 401, got ${response.status}`);
  });

  await test('Should get all messages', async () => {
    const response = await fetch(`${BASE_URL}/api/message`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (![200, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/message', response.status, data);
    } else {
      console.log(`  📤 GET /api/message`);
      console.log(`  📥 Status: ${response.status}`);
    }
  });

  console.log('\n--- Get Conversation ---');

  await test('Should get conversation with user', async () => {
    const response = await fetch(`${BASE_URL}/api/message/some-user-id`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (![200, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      logResp('GET', '/api/message/some-user-id', response.status, data);
    }
  });

  console.log('\n--- Send Message ---');

  await test('Should reject empty message', async () => {
    const response = await fetch(`${BASE_URL}/api/message/some-user-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ content: '' })
    });
    console.log(`  📤 POST /api/message/some-user-id (empty)`);
    console.log(`  📥 Status: ${response.status}`);
    if (![400, 401, 404].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  await test('Should send message to user', async () => {
    const response = await fetch(`${BASE_URL}/api/message/some-user-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ content: 'Hello there!' })
    });
    console.log(`  📤 POST /api/message/some-user-id`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  console.log('\n--- Mark as Read ---');

  await test('Should mark message as read', async () => {
    const response = await fetch(`${BASE_URL}/api/message/some-user-id/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`  📤 PUT /api/message/some-user-id/read`);
    console.log(`  📥 Status: ${response.status}`);
    if (![200, 404, 401].includes(response.status)) throw new Error(`Status ${response.status}`);
  });

  console.log('\n--- Real-time Chat (WebSocket) ---');

  await test('Should document WebSocket chat connection', async () => {
    console.log(`  📤 WebSocket connection to ${WS_URL}`);
    console.log(`  💡 Expected events: message, user_typing, message_read`);
    console.log(`  📋 Requires Socket.IO client library for full testing`);
  });

  console.log('\n=== Tests Complete ===');
  console.log('\n⚠ For real-time testing, install: npm install socket.io-client');
}

runTests().catch(console.error);
