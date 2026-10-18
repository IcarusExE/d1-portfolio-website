import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

const encoder = new TextEncoder();
const SESSION_COOKIE = 'portfolio_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function base64UrlEncode(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function base64UrlDecode(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function createSession(username, secret) {
  const payload = base64UrlEncode(
    encoder.encode(JSON.stringify({ sub: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })),
  );
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(payload));
  return `${payload}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export async function verifySession(token, secret) {
  if (!token || !secret) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  try {
    const valid = await crypto.subtle.verify(
      'HMAC',
      await hmacKey(secret),
      base64UrlDecode(signature),
      encoder.encode(payload),
    );
    if (!valid) return null;
    const session = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
    return session.exp > Math.floor(Date.now() / 1000) ? session : null;
  } catch {
    return null;
  }
}

export async function verifyPassword(password, storedHash) {
  const [algorithm, iterationsText, salt, expected] = (storedHash || '').split('$');
  if (algorithm !== 'pbkdf2_sha256' || !iterationsText || !salt || !expected) return false;

  const iterations = Number.parseInt(iterationsText, 10);
  if (!Number.isSafeInteger(iterations) || iterations < 100_000) return false;

  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: base64UrlDecode(salt), iterations },
    keyMaterial,
    256,
  );
  const actual = new Uint8Array(bits);
  const expectedBytes = base64UrlDecode(expected);
  if (actual.length !== expectedBytes.length) return false;

  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual[index] ^ expectedBytes[index];
  return difference === 0;
}

export function setSessionCookie(context, token) {
  setCookie(context, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'Strict',
    secure: new URL(context.req.url).protocol === 'https:',
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  });
}

export function clearSessionCookie(context) {
  deleteCookie(context, SESSION_COOKIE, { path: '/' });
}

export async function requireAdmin(context, next) {
  const session = await verifySession(getCookie(context, SESSION_COOKIE), context.env.SESSION_SECRET);
  if (!session) return context.json({ error: 'unauthorized', message: 'Admin session required.' }, 401);
  context.set('admin', session.sub);
  await next();
}

export async function currentSession(context) {
  return verifySession(getCookie(context, SESSION_COOKIE), context.env.SESSION_SECRET);
}
