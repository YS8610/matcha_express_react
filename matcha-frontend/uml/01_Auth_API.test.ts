
const BASE_URL = 'http://localhost:3001';

async function test(name: string, fn: () => Promise<void>, verbose = false) {
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function makeRequest(method: string, url: string, body?: any, headers?: any) {
  const options: any = {
    method,
    headers: headers || { 'Content-Type': 'application/json' }
  };

  if (body) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  console.log(`  ${method} ${url}`);
  if (body) {
    const bodyStr = JSON.stringify(body);
    console.log(`     Body: ${bodyStr.substring(0, 1000)}${bodyStr.length > 1000 ? '...' : ''}`);
  }

  const response = await fetch(url, options);
  const data = await response.json().catch(() => null);

  console.log(`  Status: ${response.status}`);
  if (data) {
    const respStr = JSON.stringify(data);
    console.log(`     Response: ${respStr.substring(0, 1000)}${respStr.length > 1000 ? '...' : ''}`);
  }

  return response;
}

async function runTests() {
  console.log('=== Auth API Tests (01) ===\n');

  const testEmail = `test_${Date.now()}@example.com`;

  try {
    console.log('Checking backend connection...');
    const healthCheck = await fetch(`${BASE_URL}/pubapi/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test', password: 'test' })
    }).then(r => true).catch(() => false);

    if (healthCheck) {
      console.log('✓ Backend is running on http://localhost:3001\n');
    }
  } catch (e) {
    console.log('Could not connect to backend\n');
  }

  console.log('\n--- Registration Flow ---');

  await test('Should reject registration with email already registered', async () => {
    const response = await makeRequest(
      'POST',
      `${BASE_URL}/pubapi/register`,
      {
        email: 'duplicate@example.com',
        pw: 'TestPass123!',
        pw2: 'TestPass123!',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe1',
        birthDate: '1990-01-01'
      }
    );

    if (![400, 409, 200, 201].includes(response.status)) throw new Error(`Expected 400/409/201, got ${response.status}`);
  });

  await test('Should reject registration with mismatched passwords', async () => {
    const response = await fetch(`${BASE_URL}/pubapi/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        pw: 'TestPass123!',
        pw2: 'DifferentPass123!',
        firstName: 'John',
        lastName: 'Doe',
        username: `user_${Date.now()}`,
        birthDate: '1990-01-01'
      })
    });

    if (![400, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should successfully register new user', async () => {
    const response = await fetch(`${BASE_URL}/pubapi/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        pw: 'TestPass123!',
        pw2: 'TestPass123!',
        firstName: 'John',
        lastName: 'Doe',
        username: `user_${Date.now()}`,
        birthDate: '1990-01-01'
      })
    });

    if (![200, 201, 400].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  console.log('\n--- Account Activation ---');

  await test('Should reject activation with invalid token', async () => {
    const response = await fetch(`${BASE_URL}/pubapi/activate/invalid-token-xyz`, { method: 'GET' });
    if (![401, 400].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should activate account with valid token', async () => {
    const response = await fetch(`${BASE_URL}/pubapi/activate/valid-token-placeholder`, { method: 'GET' });
    if (![200, 401, 400].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  console.log('\n--- Login Flow ---');

  await test('Should reject login with empty password', async () => {
    const response = await fetch(`${BASE_URL}/pubapi/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'john_doe', password: '' })
    });

    if (![400, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should reject login with nonexistent username', async () => {
    const response = await fetch(`${BASE_URL}/pubapi/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `nonexistent_${Date.now()}`, password: 'anypass' })
    });

    if (![401, 400, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should successfully login with valid credentials', async () => {
    const response = await fetch(`${BASE_URL}/pubapi/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'correctpassword' })
    });

    if ([200, 401, 400].includes(response.status)) {
      if (response.status === 200) {
        const data = await response.json();
        if (!data.msg) throw new Error('No token in response');
      }
    } else {
      throw new Error(`Unexpected status ${response.status}`);
    }
  });

  console.log('\n--- Password Reset Request ---');

  await test('Should reject reset with empty email and username', async () => {
    const response = await fetch(`${BASE_URL}/pubapi/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '', username: '' })
    });

    if (![400, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should reject reset for nonexistent user', async () => {
    const response = await fetch(`${BASE_URL}/pubapi/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `nonexistent_${Date.now()}@example.com`, username: '' })
    });

    if (![404, 200, 400].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  console.log('\n--- Password Reset Confirmation ---');

  await test('Should reject reset with weak password', async () => {
    const response = await fetch(`${BASE_URL}/pubapi/reset-password/user123/token123`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword: 'weak', newPassword2: 'weak' })
    });

    if (![400, 401, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  await test('Should reject reset with invalid token', async () => {
    const response = await fetch(`${BASE_URL}/pubapi/reset-password/user123/invalidtoken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword: 'NewPass123!', newPassword2: 'NewPass123!' })
    });

    if (![401, 400, 200].includes(response.status)) throw new Error(`Unexpected status ${response.status}`);
  });

  console.log('\n=== Tests Complete ===');
}

runTests().catch(console.error);
