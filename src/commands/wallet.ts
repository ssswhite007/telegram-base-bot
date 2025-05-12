import { Context } from 'telegraf';
import { getOrCreateUserWallet } from '../wallet';

export const handleWallet = async (ctx: Context) => {
  if (!ctx.from) return;
  const wallet = await getOrCreateUserWallet(ctx.from.id.toString());
  
  ctx.reply(`
    Welcome to Erjbot(Test) - the fastest and most secure bot for trading any token on Base!

    You currently have no ETH in your wallet. To start trading, deposit ETH to your Erjbot wallet address:

    <code>${wallet.address}</code>

    Once you have deposited ETH, you can start trading any token on Base.

    To start trading, use the /buy command.
        Your wallet address: <code>${wallet.address}</code>`, { parse_mode: 'HTML' });
};
