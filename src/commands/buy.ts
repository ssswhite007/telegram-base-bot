import { Context } from 'telegraf';
import { handleSwap } from '../dex';

export const handleBuy = async (ctx: Context) => {
  if (!ctx.from || !ctx.message || !('text' in ctx.message)) return;
  
  const [_, tokenAddress, amount] = ctx.message.text.split(" ");
  if (!tokenAddress || !amount) {
    ctx.reply('Please provide both token address and amount. Usage: /buy <token_address> <amount>');
    return;
  }

  try {
    const tx = await handleSwap(ctx.from.id.toString(), tokenAddress, amount);
    ctx.reply(`Transaction sent: ${tx}`);
  } catch (error) {
    ctx.reply(`Error processing transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 