import { ethers } from 'ethers';
import { saveWallet, getWallet } from './db';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Create a 32-byte key using SHA-256
const ENCRYPTION_KEY = crypto.createHash('sha256')
  .update(process.env.ENCRYPTION_KEY || 'default-key')
  .digest();

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(data: string): string {
  const [ivHex, encryptedHex] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString();
}

export async function createWallet(userId: string) {
  const wallet = ethers.Wallet.createRandom();
  const encryptedKey = encrypt(wallet.privateKey);
  await saveWallet(userId, wallet.address, encryptedKey);
  return wallet;
}

export async function getOrCreateUserWallet(userId: string) {
  const walletData = await getWallet(userId);
  if (walletData) {
    const decrypted = decrypt(walletData.encryptedKey);
    return new ethers.Wallet(decrypted);
  }
  return await createWallet(userId);
}
