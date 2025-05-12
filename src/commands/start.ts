import { Context } from 'telegraf';
import { getOrCreateUserWallet } from '../wallet';
import { hasAcceptedTerms, saveTermsAcceptance, saveReferral } from '../db';

export const handleStart = async (ctx: Context) => {
  if (!ctx.from) return;
  const userId = ctx.from.id.toString();
  const hasAccepted = await hasAcceptedTerms(userId);
  
  if (hasAccepted) {
    // User has already accepted terms, show main interface
    const wallet = await getOrCreateUserWallet(userId);
    const messageText = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
    const refCode = messageText.split(" ")[1]; // /start ref123
    if (refCode) await saveReferral(userId, refCode);
    
    ctx.reply(`Welcome back to Erjbot(Test) - the fastest and most secure bot for trading any token on Base!

You currently have no ETH in your wallet. To start trading, deposit ETH to your Erjbot wallet address:

<code>${wallet.address}</code> (tap to copy)

For more info on your wallet and to export your seed phrase, tap "Wallet" below.`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Buy", callback_data: "buy" },{ text: "Fund", callback_data: "fund" }],
          [{ text: "Help", callback_data: "help" }, { text: "Refer Friends", callback_data: "referFriends" }],
          [{ text: "Wallet", callback_data: "wallet" }, { text: "Settings", callback_data: "settings" }],
          [{ text: "Refresh", callback_data: "refresh" }],
        ],
      },
    });
  } else {
    // Show terms of service for new users
    const termsOfService = `📜 Terms of Service

By using Erjbot, you agree to the following terms:

1. You are responsible for all activities that occur under your account
2. You must comply with all applicable laws and regulations
3. You understand that cryptocurrency trading involves risk
4. You are responsible for securing your wallet and private keys
5. We are not responsible for any financial losses

Please read and accept these terms to continue.`;

    ctx.reply(termsOfService, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "I Have Read and Accept the Terms of Use", callback_data: "accept_terms" }]
        ],
      },
    });
  }
};

export const handleAcceptTerms = async (ctx: Context) => {
  if (!ctx.from || !ctx.callbackQuery) return;
  const userId = ctx.from.id.toString();
  await saveTermsAcceptance(userId);
  
  const wallet = await getOrCreateUserWallet(userId);
  // Get refCode from the original start command if it exists
  const message = ctx.callbackQuery.message;
  let refCode: string | undefined;
  
  if (message && 'text' in message) {
    const text = message.text;
    if (text && text.includes(' ')) {
      refCode = text.split(" ")[1];
    }
  }
  
  if (refCode) await saveReferral(userId, refCode);
  
  await ctx.editMessageText(`Welcome to Erjbot(Test) - the fastest and most secure bot for trading any token on Base!

You currently have no ETH in your wallet. To start trading, deposit ETH to your Erjbot wallet address:

<code>${wallet.address}</code> (tap to copy)

For more info on your wallet and to export your seed phrase, tap "Wallet" below.`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Buy", callback_data: "buy" },{ text: "Fund", callback_data: "fund" }],
        [{ text: "Help", callback_data: "help" }, { text: "Refer Friends", callback_data: "referFriends" }],
        [{ text: "Wallet", callback_data: "wallet" }, { text: "Settings", callback_data: "settings" }],
        [{ text: "Refresh", callback_data: "refresh" }],
      ],
    },
  });
}; 