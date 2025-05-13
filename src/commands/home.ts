import { Context } from 'telegraf';
import { getOrCreateUserWallet } from '../wallet';

export const handleHome = async (ctx: Context) => {
  if (!ctx.from) return;
  const userId = ctx.from.id.toString();
  const wallet = await getOrCreateUserWallet(userId);
  
  ctx.reply(`Welcome back to Erjbot(Test) - the fastest and most secure bot for trading any token on Base!

You currently have no ETH in your wallet. To start trading, deposit ETH to your Erjbot wallet address:

<code>${wallet.address}</code> (tap to copy)

For more info on your wallet and to export your seed phrase, tap "Wallet" below.`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Buy", callback_data: "buy" },{ text: "Sell & Manage", callback_data: "fund" }],
        [{ text: "Help", callback_data: "help" }, { text: "Refer Friends", callback_data: "referFriends" }],
        [{ text: "Wallet", callback_data: "wallet" }, { text: "Settings", callback_data: "settings" }],
        [{ text: "Refresh", callback_data: "refresh" }],
      ],
    },
  });
};
