import { describe, expect, it } from 'vitest';
import { createSession, verifyPassword, verifySession } from '../../worker/middleware/auth.js';

const passwordHash = 'pbkdf2_sha256$100000$dW5pdC10ZXN0LXNhbHQtMQ$IGjkeBMeAd2FyYmfUFHT8us4Q3Qv8RMi3pcZi3FFMqo';
const sessionSecret = 'a-test-session-secret-that-is-long-enough';

describe('admin authentication', () => {
  it('accepts the matching PBKDF2 password and rejects another password', async () => {
    await expect(verifyPassword('test-password', passwordHash)).resolves.toBe(true);
    await expect(verifyPassword('wrong-password', passwordHash)).resolves.toBe(false);
  });

  it('creates a verifiable, tamper-evident session', async () => {
    const token = await createSession('admin', sessionSecret);
    await expect(verifySession(token, sessionSecret)).resolves.toMatchObject({ sub: 'admin' });
    await expect(verifySession(`${token}x`, sessionSecret)).resolves.toBeNull();
  });
});
