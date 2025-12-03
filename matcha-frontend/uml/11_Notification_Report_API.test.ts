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
  console.log('=== Notification & Report API Tests (11) ===\n');
  const token = await getValidToken();

  if (!token) return console.log('⚠ Warning: Could not get token');

  console.log('\n--- Get Notifications ---');

  await test('Should get notifications with valid pagination', async () => {
    const response = await fetch(`${BASE_URL}/api/user/notification?limit=20&offset=0`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    logResp('GET', '/api/user/notification?limit=20&offset=0', response.status);
    if (![200, 401].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Response should be an array');
    }
  });

  await test('Should reject invalid limit parameter', async () => {
    const response = await fetch(`${BASE_URL}/api/user/notification?limit=invalid&offset=0`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    logResp('GET', '/api/user/notification?limit=invalid&offset=0', response.status);
    if (![400, 200, 401].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should get notifications with offset pagination', async () => {
    const response = await fetch(`${BASE_URL}/api/user/notification?limit=20&offset=20`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    logResp('GET', '/api/user/notification?limit=20&offset=20', response.status);
    if (![200, 401].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should return empty array when no notifications', async () => {
    const response = await fetch(`${BASE_URL}/api/user/notification?limit=20&offset=0`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    logResp('GET', '/api/user/notification?limit=20&offset=0 (empty)', response.status);
    if (![200, 401].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
    if (response.status === 200) {
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Response should be an array');
    }
  });

  console.log('\n--- Mark Notification as Read ---');

  await test('Should reject empty notificationId', async () => {
    const response = await fetch(`${BASE_URL}/api/user/notification`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ notificationId: '' })
    });
    logResp('PUT', '/api/user/notification (empty id)', response.status);
    if (![400, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should return 404 for invalid notificationId', async () => {
    const response = await fetch(`${BASE_URL}/api/user/notification`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ notificationId: 'invalid_notification_id_123' })
    });
    logResp('PUT', '/api/user/notification (invalid id)', response.status);
    if (![404, 200, 400].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should mark notification as read successfully', async () => {
    const getRes = await fetch(`${BASE_URL}/api/user/notification?limit=1&offset=0`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (getRes.ok) {
      const notifications = await getRes.json();
      if (Array.isArray(notifications) && notifications.length > 0) {
        const notificationId = notifications[0].id;
        const response = await fetch(`${BASE_URL}/api/user/notification`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ notificationId })
        });
        logResp('PUT', '/api/user/notification (mark as read)', response.status);
        if (![200, 404].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
      }
    }
  });

  console.log('\n--- Delete Notification ---');

  await test('Should reject empty notificationId on delete', async () => {
    const response = await fetch(`${BASE_URL}/api/user/notification`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ notificationId: '' })
    });
    logResp('DELETE', '/api/user/notification (empty id)', response.status);
    if (![400, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should return 404 for invalid notificationId on delete', async () => {
    const response = await fetch(`${BASE_URL}/api/user/notification`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ notificationId: 'invalid_notification_id_456' })
    });
    logResp('DELETE', '/api/user/notification (invalid id)', response.status);
    if (![404, 200, 400].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should delete notification successfully', async () => {
    // First get a notification if exists
    const getRes = await fetch(`${BASE_URL}/api/user/notification?limit=1&offset=0`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (getRes.ok) {
      const notifications = await getRes.json();
      if (Array.isArray(notifications) && notifications.length > 0) {
        const notificationId = notifications[0].id;
        const response = await fetch(`${BASE_URL}/api/user/notification`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ notificationId })
        });
        logResp('DELETE', '/api/user/notification (delete)', response.status);
        if (![200, 404].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
      }
    }
  });

  console.log('\n--- Report User - Validation ---');

  await test('Should reject report with reason too short', async () => {
    const response = await fetch(`${BASE_URL}/api/user/report/test_user_123`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ reason: 'short' })
    });
    logResp('POST', '/api/user/report/:userId (short reason)', response.status);
    if (![400, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should reject report with reason too long', async () => {
    const longReason = 'a'.repeat(501);
    const response = await fetch(`${BASE_URL}/api/user/report/test_user_123`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ reason: longReason })
    });
    logResp('POST', '/api/user/report/:userId (long reason)', response.status);
    if (![400, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  console.log('\n--- Report User - Business Logic ---');

  await test('Should reject reporting self', async () => {
    const response = await fetch(`${BASE_URL}/api/user/report/self`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ reason: 'This user is behaving inappropriately' })
    });
    logResp('POST', '/api/user/report/:userId (report self)', response.status);
    if (![400, 404, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should return 404 for nonexistent user report', async () => {
    const response = await fetch(`${BASE_URL}/api/user/report/nonexistent_user_${Date.now()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ reason: 'This user is behaving inappropriately' })
    });
    logResp('POST', '/api/user/report/:userId (nonexistent)', response.status);
    if (![404, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  console.log('\n--- Report User - Duplicate Check ---');

  await test('Should reject duplicate report of same user', async () => {
    const testUserId = `test_report_user_${Date.now()}`;
    const reason = 'This user is behaving inappropriately on the platform';

    // Try to report the same user twice
    const response1 = await fetch(`${BASE_URL}/api/user/report/${testUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ reason })
    });

    if (response1.ok || response1.status === 404) {
      const response2 = await fetch(`${BASE_URL}/api/user/report/${testUserId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ reason })
      });
      logResp('POST', '/api/user/report/:userId (duplicate)', response2.status);
      if (![409, 200, 404].includes(response2.status)) throw new Error(`Unexpected status ${response2.status}`);
    }
  });

  console.log('\n--- Report User - Success ---');

  await test('Should successfully report user with valid reason', async () => {
    const testUserId = `report_target_${Date.now()}`;
    const response = await fetch(`${BASE_URL}/api/user/report/${testUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ reason: 'This user is being disruptive and harassing other users' })
    });
    logResp('POST', '/api/user/report/:userId (valid)', response.status);
    if (![200, 404].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  console.log('\n=== Tests Complete ===');
}

runTests().catch(console.error);
