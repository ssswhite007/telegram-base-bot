import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./bot.db');

export function initDB() {
  db.run(`CREATE TABLE IF NOT EXISTS wallets (
    user_id TEXT PRIMARY KEY,
    address TEXT,
    encryptedKey TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS referrals (
    user_id TEXT,
    referrer TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS terms_acceptance (
    user_id TEXT PRIMARY KEY,
    accepted_at INTEGER
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS trades (
    user_id TEXT,
    token_address TEXT,
    amount TEXT,
    status TEXT
  )`);
}

export function saveWallet(userId: string, address: string, encryptedKey: string) {
  return new Promise((resolve) => {
    db.run("INSERT OR REPLACE INTO wallets VALUES (?, ?, ?)", [userId, address, encryptedKey], resolve);
  });
}

export function getWallet(userId: string): Promise<any> {
  return new Promise((resolve) => {
    db.get("SELECT * FROM wallets WHERE user_id = ?", [userId], (err, row) => resolve(row));
  });
}

export function saveReferral(userId: string, referrer: string) {
  return new Promise((resolve) => {
    db.run("INSERT INTO referrals (user_id, referrer) VALUES (?, ?)", [userId, referrer], resolve);
  });
}

interface ReferralRow {
  referrer: string;
}

export function getReferral(userId: string): Promise<string | undefined> {
  return new Promise((resolve) => {
    db.get<ReferralRow>("SELECT referrer FROM referrals WHERE user_id = ?", [userId], (err, row) => resolve(row?.referrer));
  });
}

export function saveTermsAcceptance(userId: string) {
  return new Promise((resolve) => {
    db.run("INSERT OR REPLACE INTO terms_acceptance VALUES (?, ?)", [userId, Date.now()], resolve);
  });
}

export function hasAcceptedTerms(userId: string): Promise<boolean> {
  return new Promise((resolve) => {
    db.get("SELECT accepted_at FROM terms_acceptance WHERE user_id = ?", [userId], (err, row) => {
      resolve(!!row);
    });
  });
}
