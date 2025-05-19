import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';

const jwtSecret = process.env.JWT_SECRET ?? '';

const key = crypto.scryptSync(jwtSecret, 'salt', 32);
const algo = 'aes-256-gcm';

export const generateToken = (payload: { email: string }): string => {
  const jwtToken: string = jwt.sign(payload, 'Lucky123', { expiresIn: '1d' });

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algo, key, iv);

  let encrypted = cipher.update(jwtToken, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  const result = `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  return result;
};

export const decryptToken = (token: string): string => {
  const [ivHex, authTagHex, encrypted] = token.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(algo, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};
