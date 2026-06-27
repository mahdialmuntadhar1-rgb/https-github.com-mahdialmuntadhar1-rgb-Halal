const API_BASE = process.env.VITE_API_URL || process.env.API_BASE;
const runId = Date.now();

let token = '';

async function call(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${path} failed: ${response.status} ${JSON.stringify(payload)}`);
  }

  return payload;
}

async function register(email, password) {
  const response = await call('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  token = response.token;
  return response.user;
}

async function login(email, password) {
  const response = await call('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  token = response.token;
  return response.user;
}

async function updateProfile(profile) {
  return call('/profile/me', {
    method: 'PUT',
    body: JSON.stringify(profile),
  });
}

async function main() {
  if (!API_BASE) {
    throw new Error('Set VITE_API_URL or API_BASE to the deployed Worker URL before running the smoke test.');
  }

  const password = 'SmokeTestPassword123!';
  const receiverEmail = `receiver.${runId}@example.com`;
  const senderEmail = `sender.${runId}@example.com`;

  console.log(`Smoke target: ${API_BASE}`);

  console.log('1. register receiver');
  const receiver = await register(receiverEmail, password);
  await updateProfile({
    fullName: 'Smoke Receiver',
    gender: 'female',
    birthYear: 1998,
    governorate: 'Baghdad',
    religion: 'islam',
    sect: 'sunni',
    ethnicity: 'arab',
    education: 'Bachelor',
    occupation: 'Teacher',
    bio: 'Smoke test receiver profile.',
    photoVisibility: 'private',
  });

  console.log('2. register sender');
  await register(senderEmail, password);

  console.log('3. login sender');
  await login(senderEmail, password);

  console.log('4. get profile');
  await call('/profile/me');

  console.log('5. update profile');
  await updateProfile({
    fullName: 'Smoke Sender',
    gender: 'male',
    birthYear: 1994,
    governorate: 'Baghdad',
    religion: 'islam',
    sect: 'sunni',
    ethnicity: 'arab',
    education: 'Bachelor',
    occupation: 'Engineer',
    bio: 'Smoke test sender profile.',
    photoVisibility: 'public',
  });

  console.log('6. get matches page 1');
  const page1 = await call('/matches?page=1&limit=1&gender=female&governorate=Baghdad&minAge=18&maxAge=45');
  if (!Array.isArray(page1.matches) || typeof page1.hasMore !== 'boolean' || page1.page !== 1 || page1.limit !== 1 || typeof page1.total !== 'number') {
    throw new Error(`Unexpected matches page 1 shape: ${JSON.stringify(page1)}`);
  }

  console.log('7. load page 2');
  await call('/matches?page=2&limit=1&gender=female&governorate=Baghdad&minAge=18&maxAge=45');

  const targetId = page1.matches[0]?.user_id || page1.matches[0]?.id || receiver.id;

  console.log('8. save profile');
  await call(`/saved-profiles/${encodeURIComponent(targetId)}`, { method: 'POST' });

  console.log('9. send introduction request');
  await call('/requests', {
    method: 'POST',
    body: JSON.stringify({ receiverId: targetId }),
  });

  console.log('10. get conversations');
  await call('/conversations');

  console.log('Production smoke test passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

