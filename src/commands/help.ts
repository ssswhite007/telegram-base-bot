import { Context } from 'telegraf';
import { Markup } from 'telegraf';

export const handleHelp = async (ctx: Context) => {
  const helpText = `*Erjbot Help Guide* 🚀

*Available Commands:*
/start - Start the bot and accept terms
/home - View trades and open main menu
/settings - Customize your bot settings
/wallet - View your wallet details
/buy <token_address> <amount> - Buy tokens

*Main Features:*
• Fast token trading on Base
• Secure wallet management
• Customizable settings
• MEV protection
• Transaction priority control
• Sell protection
• Two-factor authentication

*Quick Tips:*
1. Always verify token addresses before trading
2. Use sell protection for safer transactions
3. Adjust slippage settings based on token liquidity
4. Enable 2FA for enhanced security

*Need More Help?*
Website: https://www.erjbot.com/
Twitter: https://x.com/erjbot
Telegram: https://t.me/+xM4kLebcIv83ZmI0`;

  const keyboard = Markup.inlineKeyboard([
    [{ text: "Back to Home", callback_data: "home" }]
  ]);

  await ctx.reply(helpText, {
    parse_mode: 'Markdown',
    ...keyboard
  });
}; 