/**
 * Backend smoke test: walks the whole candidate + recruiter flow against a running API.
 *
 *   npm run server          # in one terminal
 *   npm run smoke           # in another
 *
 * It creates a throwaway candidate and deletes it (and everything it created) at the end.
 * Override the target with API=https://your-host  node server/smoke.mjs
 */
import 'dotenv/config';

const API = (process.env.API || `http://localhost:${process.env.PORT || 8787}`).replace(/\/$/, '');
const ADMIN_ID = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_PW = process.env.ADMIN_PASSWORD || 'admin123';

let passed = 0;
let failed = 0;
const failures = [];

async function call(method, path, { token, body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* not json */
  }
  return { status: res.status, data };
}

function check(name, ok, detail = '') {
  if (ok) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    failures.push(name);
    console.log(`  FAIL  ${name}${detail ? `  -> ${detail}` : ''}`);
  }
}

const stamp = Date.now();
const email = `smoke.${stamp}@example.com`;
const password = 'Passw0rd!';
let candidateToken;
let candidateId;
let adminToken;
let sessionId;

console.log(`Recruitix API smoke test against ${API}\n`);

try {
  console.log('Server');
  let r = await call('GET', '/api/health');
  check('health check responds', r.status === 200 && r.data?.ok === true, `HTTP ${r.status}`);

  console.log('\nCandidate accounts');
  r = await call('POST', '/api/auth/signup', { body: { name: 'Smoke Test', email, year: '3', department: 'CSE', enrollmentNo: `SMK${stamp}`, password } });
  check('candidate can sign up', r.status === 201 && !!r.data?.token, `HTTP ${r.status} ${JSON.stringify(r.data)}`);
  candidateToken = r.data?.token;
  candidateId = r.data?.user?.id;
  check('new account is a candidate', r.data?.user?.role === 'candidate');

  r = await call('POST', '/api/auth/signup', { body: { name: 'Smoke Test', email, year: '3', department: 'CSE', enrollmentNo: 'X', password } });
  check('duplicate email is rejected', r.status === 409, `HTTP ${r.status}`);

  r = await call('POST', '/api/auth/signup', { body: { name: 'No Password', email: `x${stamp}@example.com` } });
  check('incomplete sign-up is rejected', r.status === 400, `HTTP ${r.status}`);

  r = await call('POST', '/api/auth/login', { body: { email, password } });
  check('candidate can log in', r.status === 200 && !!r.data?.token, `HTTP ${r.status}`);
  candidateToken = r.data?.token ?? candidateToken;

  r = await call('POST', '/api/auth/login', { body: { email, password: 'wrong-password' } });
  check('wrong password is rejected', r.status === 401, `HTTP ${r.status}`);

  r = await call('GET', '/api/auth/me', { token: candidateToken });
  check('token resolves to the profile', r.status === 200 && r.data?.user?.email === email, `HTTP ${r.status}`);

  r = await call('GET', '/api/auth/me');
  check('profile needs a token', r.status === 401, `HTTP ${r.status}`);

  console.log('\nCompanies and questions');
  r = await call('GET', '/api/companies');
  const companies = r.data?.companies ?? [];
  check('companies are seeded', r.status === 200 && companies.length > 0, `found ${companies.length}`);
  const company = companies.find((c) => c.slug === 'general') ?? companies[0];

  r = await call('GET', `/api/companies/${company?.id}`);
  check('single company loads', r.status === 200, `HTTP ${r.status}`);

  let question;
  for (const round of ['aptitude', 'english', 'technical']) {
    r = await call('GET', `/api/question-bank?companyId=${company?.id}&round=${round}`);
    const qs = r.data?.questions ?? [];
    check(`question bank has ${round} questions`, r.status === 200 && qs.length > 0, `found ${qs.length}`);
    question = question ?? { ...qs[0], round };
  }

  console.log('\nFace enrolment');
  const embedding = Array.from({ length: 128 }, (_, i) => Math.sin(i + 1) * 0.1);
  r = await call('POST', '/api/face/enroll', { token: candidateToken, body: { embedding } });
  check('face can be enrolled', r.status === 200, `HTTP ${r.status} ${JSON.stringify(r.data)}`);
  r = await call('POST', '/api/face/enroll', { token: candidateToken, body: { embedding: [1, 2, 3] } });
  check('bad embedding is rejected', r.status === 400, `HTTP ${r.status}`);
  r = await call('POST', '/api/face/match', { token: candidateToken, body: { embedding } });
  check('same face matches', r.status === 200 && r.data?.match === true, `HTTP ${r.status} ${JSON.stringify(r.data)}`);

  console.log('\nExam session');
  r = await call('POST', '/api/exam/sessions', { token: candidateToken, body: { companyId: company.id, section: 'aptitude' } });
  check('exam session can be created', (r.status === 201 || r.status === 200) && !!r.data?.sessionId, `HTTP ${r.status} ${JSON.stringify(r.data)}`);
  sessionId = r.data?.sessionId;

  r = await call('POST', '/api/exam/sessions', { token: candidateToken, body: { companyId: company.id, section: 'aptitude' } });
  check('asking again resumes the same session', r.data?.sessionId === sessionId, 'got a different session');

  r = await call('GET', `/api/exam/sessions/${sessionId}`, { token: candidateToken });
  check('session can be read', r.status === 200, `HTTP ${r.status}`);

  r = await call('POST', `/api/exam/sessions/${sessionId}/responses`, {
    token: candidateToken,
    body: { responses: [{ questionId: question.id, round: question.round, answer: question.correctAnswer ?? 'answer', score: question.points ?? 1 }] },
  });
  check('answers can be saved', r.status === 200, `HTTP ${r.status} ${JSON.stringify(r.data)}`);

  r = await call('POST', `/api/exam/sessions/${sessionId}/violations`, {
    token: candidateToken,
    body: { type: 'TAB_SWITCH', severity: 'medium', message: 'smoke test violation' },
  });
  check('proctoring violation is recorded', r.status === 201, `HTTP ${r.status} ${JSON.stringify(r.data)}`);

  r = await call('POST', `/api/exam/sessions/${sessionId}/round-score`, { token: candidateToken, body: { round: 'aptitude', score: 5, pct: 50 } });
  check('round score can be saved', r.status === 200, `HTTP ${r.status} ${JSON.stringify(r.data)}`);

  r = await call('GET', `/api/exam/sessions/${sessionId}/report`, { token: candidateToken });
  check('report loads', r.status === 200, `HTTP ${r.status} ${JSON.stringify(r.data).slice(0, 120)}`);

  r = await call('GET', '/api/exam/reports', { token: candidateToken });
  check('report list loads', r.status === 200, `HTTP ${r.status}`);

  console.log('\nPresence');
  r = await call('POST', '/api/auth/heartbeat', { token: candidateToken, body: { page: 'select_company' } });
  check('candidate heartbeat is accepted', r.status === 200, `HTTP ${r.status}`);

  console.log('\nRecruiter');
  r = await call('POST', '/api/auth/recruiter-login', { body: { id: ADMIN_ID, password: ADMIN_PW } });
  check('recruiter can log in', r.status === 200 && r.data?.user?.role === 'recruiter', `HTTP ${r.status}`);
  adminToken = r.data?.token;

  r = await call('POST', '/api/auth/recruiter-login', { body: { id: ADMIN_ID, password: 'wrong' } });
  check('recruiter wrong password is rejected', r.status === 401, `HTTP ${r.status}`);

  r = await call('GET', '/api/admin/overview', { token: adminToken });
  check('recruiter overview loads', r.status === 200, `HTTP ${r.status}`);
  const seen = JSON.stringify(r.data ?? {}).includes(email);
  check('overview lists the new candidate', seen, 'candidate not found in the overview');
  check('overview counts the candidate as live', (r.data?.analytics?.liveCandidates ?? 0) >= 1, JSON.stringify(r.data?.analytics));

  r = await call('GET', '/api/admin/overview', { token: candidateToken });
  check('a candidate cannot open the recruiter overview', r.status === 403 || r.status === 401, `HTTP ${r.status}`);
} catch (err) {
  failed++;
  failures.push('unexpected error');
  console.log(`  FAIL  unexpected error: ${err?.message ?? err}`);
} finally {
  console.log('\nCleanup');
  if (candidateId && adminToken) {
    const r = await call('DELETE', `/api/admin/candidates/${candidateId}`, { token: adminToken });
    check('test candidate and its data are deleted', r.status === 200 && r.data?.deleted === true, `HTTP ${r.status}`);
  } else {
    console.log('  (nothing to clean up)');
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) console.log(`Failed: ${failures.join('; ')}`);
process.exit(failed ? 1 : 0);
