import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

type PasswordHashParts = {
  salt: Buffer;
  hash: Buffer;
};

function encodeBase64(buf: Buffer) {
  return buf.toString('base64');
}

function decodeBase64(input: string) {
  return Buffer.from(input, 'base64');
}

function parseStoredHash(stored: string): PasswordHashParts | null {
  const [saltB64, hashB64] = stored.split(':');
  if (!saltB64 || !hashB64) return null;
  const salt = decodeBase64(saltB64);
  const hash = decodeBase64(hashB64);
  return { salt, hash };
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${encodeBase64(salt)}:${encodeBase64(derivedKey)}`;
}

export async function verifyPassword(password: string, stored: string) {
  const parsed = parseStoredHash(stored);
  if (!parsed) return false;
  const derivedKey = (await scrypt(password, parsed.salt, 64)) as Buffer;
  if (derivedKey.length !== parsed.hash.length) return false;
  return timingSafeEqual(derivedKey, parsed.hash);
}
