import { get } from 'https';
import { Context } from 'telegraf';
import { Markup } from 'telegraf';
import { CallbackQuery } from 'telegraf/types';

interface UserSettings {
  language: string;
  minPositionValue: number;
  sortTokensBy: 'alphabetical' | 'mostValuable' | 'leastValuable';
  autoBuy: boolean;
  buyButtonConfig: string;
  sellButtonConfig: string;
  slippageConfig: {
    buy: number;
    sell: number;
    maxPriceImpact: number;
  };
  mevProtect: 'turbo' | 'secure';
  transactionPriority: number;
  sellProtection: boolean;
  twoFactorEnabled: boolean;
  swapAutoApprove: boolean;
}

const defaultSettings: UserSettings = {
  language: 'en',
  minPositionValue: 0,
  sortTokensBy: 'mostValuable',
  autoBuy: false,
  buyButtonConfig: 'default',
  sellButtonConfig: 'default',
  slippageConfig: {
    buy: 1,
    sell: 1,
    maxPriceImpact: 15
  },
  mevProtect: 'turbo',
  transactionPriority: 1,
  sellProtection: true,
  twoFactorEnabled: false,
  swapAutoApprove: true
};

export const handleSettings = async (ctx: Context) => {
  if (!ctx.from) return;
  
  const settingsKeyboard = Markup.inlineKeyboard([
    [ { text: '--- GENERAL SETTINGS ---', callback_data: 'settings_header' } ],
    [
      { text: '💰 Min Pos Value: $0.001', callback_data: 'settings_minPosition' }
    ],
    [
      { text: '--- AUTO BUY ---', callback_data: 'settings_header' }
    ],
    [
      { text: 'Disabled', callback_data: 'settings_autoBuy_disable' },
      { text: '0.10 SOL', callback_data: 'settings_autoBuy_enable' }
    ],
    [ { text: '--- BUY BUTTONS CONFIG ---', callback_data: 'settings_header' } ],
    [
      { text: '🔘 Left: 1.0 SOL', callback_data: 'settings_button_buy' },
      { text: '🔘 Right: 5.0 SOL', callback_data: 'settings_button_sell' }
    ],
    [ { text: '--- SELECT BUTTONS CONFIG ---', callback_data: 'settings_header' } ],
    [
        { text: '🔘 Left: 25%', callback_data: 'settings_button_buy' },
        { text: '🔘 Right: 100%', callback_data: 'settings_button_sell' }
    ],
    [
      { text: 'Sell Initial Disabled', callback_data: 'settings_sellProtection' },
    ],
    [ { text: '--- SLIPPAGE CONFIG ---', callback_data: 'settings_header' } ],
    [
      { text: 'Buy: 10%', callback_data: 'settings_slippage_buy' },
      { text: 'Sell: 10%', callback_data: 'settings_slippage_sell' },
    ],
    [
      { text: 'Max Price Impact: 25%', callback_data: 'settings_slippage_impact' }
    ],
    [ { text: '--- MEV PROTECT ---', callback_data: 'settings_header' } ],
    [
      { text: 'Turbo', callback_data: 'settings_mev_turbo' }
    ],
    [ { text: '--- TRANSACTION PRIORITY ---', callback_data: 'settings_header' } ],
    [
      { text: 'Medium', callback_data: 'settings_priority_medium' },
      { text: '0.00100 SOL', callback_data: 'settings_priority_high' },
    ],
    [ { text: '--- SELL PROTECTION ---', callback_data: 'settings_header' } ],
    [
      { text: 'Enabled', callback_data: 'settings_sellProtection' },
    ],
    [{ text: 'Close', callback_data: 'home' }]
  ]);

  await ctx.reply(
    `*Settings*\n\n` +
    `*GENERAL SETTINGS*\n` +
    `Language: Shows the current language. Tap to switch between available languages.\n` +
    `Minimum Position Value: Minimum position value to show in portfolio. Will hide tokens below this threshhold. Tap to edit.\n` +
    `Sort Tokens By: Sorts tokens shown on homescreen based on the following options: Alphabetical (A to Z), Most Valuable (highest to lowest), Least Valuable (lowest to highest). Tap to toggle.\n\n` +
    `*AUTO BUY*\n` +
    `Immediately buy when pasting token address. Tap to toggle.\n\n` +
    `*BUTTONS CONFIG*\n` +
    `Customize your buy and sell buttons for buy token and manage position. Tap to edit.\n\n` +
    `*SLIPPAGE CONFIG*\n` +
    `Customize your slippage settings for buys and sells. Tap to edit.\n` +
    `Max Price Impact is to protect against trades in extremely illiquid pools.\n\n` +
    `*MEV PROTECT*\n` +
    `MEV Protect accelerates your transactions and protect against frontruns to make sure you get the best price possible.\n` +
    `Turbo: BONKbot will use MEV Protect, but if unprotected sending is faster it will use that instead.\n` +
    `Secure: Transactions are guaranteed to be protected. This is the ultra secure option, but may be slower.\n\n` +
    `*TRANSACTION PRIORITY*\n` +
    `Increase your Transaction Priority to improve transaction speed. Select preset or tap to edit.\n\n` +
    `*SELL PROTECTION*\n` +
    `100% sell commands require an additional confirmation step. Tap to toggle.\n\n` +
    `*SECURITY CONFIG*\n` +
    `Set Up Two-Factor Authentication: Launches Mini App to secure your BONKbot with 2FA.\n` +
    `Enable/Disable Swap Auto-Approve: Having Auto-Approve disabled means each token must first be whitelisted for trading via 2FA authorization.`,
    {
      parse_mode: 'Markdown',
      ...settingsKeyboard
    }
  );
};

export const handleSettingsCallback = async (ctx: Context) => {
  if (!ctx.callbackQuery) return;
  const callbackQuery = ctx.callbackQuery as any;
  if (!('data' in callbackQuery) || typeof callbackQuery.data !== 'string') return;

  const action = callbackQuery.data.split('_')[1];
  
  switch (action) {
    case 'header':
      // Do nothing for header clicks
      break;
    case 'language':
      await handleLanguageSettings(ctx);
      break;
    case 'minPosition':
      await handleMinPositionSettings(ctx);
      break;
    case 'sortTokens':
      await handleSortTokensSettings(ctx);
      break;
    case 'autoBuy':
      await handleAutoBuySettings(ctx);
      break;
    case 'buttons':
      await handleButtonsConfig(ctx);
      break;
    case 'slippage':
      await handleSlippageConfig(ctx);
      break;
    case 'mev':
      await handleMevProtectSettings(ctx);
      break;
    case 'priority':
      await handleTransactionPrioritySettings(ctx);
      break;
    case 'sellProtection':
      await handleSellProtectionSettings(ctx);
      break;
    case 'security':
      await handleSecurityConfig(ctx);
      break;
  }
};

// Individual settings handlers
const handleLanguageSettings = async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    [{ text: 'English', callback_data: 'settings_language_en' }],
    [{ text: 'Español', callback_data: 'settings_language_es' }],
    [{ text: '« Back', callback_data: 'settings' }]
  ]);
  
  await ctx.editMessageText(
    'Select your preferred language:',
    { ...keyboard }
  );
};

const handleMinPositionSettings = async (ctx: Context) => {
  await ctx.editMessageText(
    'Enter minimum position value in USD:',
    {
      reply_markup: {
        inline_keyboard: [[{ text: '« Back', callback_data: 'settings' }]]
      }
    }
  );
};

const handleSortTokensSettings = async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    [{ text: 'Alphabetical (A to Z)', callback_data: 'settings_sort_alphabetical' }],
    [{ text: 'Most Valuable', callback_data: 'settings_sort_mostValuable' }],
    [{ text: 'Least Valuable', callback_data: 'settings_sort_leastValuable' }],
    [{ text: '« Back', callback_data: 'settings' }]
  ]);
  
  await ctx.editMessageText(
    'Select how to sort tokens:',
    { ...keyboard }
  );
};

const handleAutoBuySettings = async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    [{ text: 'Enable', callback_data: 'settings_autoBuy_enable' }],
    [{ text: 'Disable', callback_data: 'settings_autoBuy_disable' }],
    [{ text: '« Back', callback_data: 'settings' }]
  ]);
  
  await ctx.editMessageText(
    'Configure Auto Buy:',
    { ...keyboard }
  );
};

const handleButtonsConfig = async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    [{ text: 'Buy Button', callback_data: 'settings_button_buy' }],
    [{ text: 'Sell Button', callback_data: 'settings_button_sell' }],
    [{ text: '« Back', callback_data: 'settings' }]
  ]);
  
  await ctx.editMessageText(
    'Customize your buttons:',
    { ...keyboard }
  );
};

const handleSlippageConfig = async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    [{ text: 'Buy Slippage', callback_data: 'settings_slippage_buy' }],
    [{ text: 'Sell Slippage', callback_data: 'settings_slippage_sell' }],
    [{ text: 'Max Price Impact', callback_data: 'settings_slippage_impact' }],
    [{ text: '« Back', callback_data: 'settings' }]
  ]);
  
  await ctx.editMessageText(
    'Configure slippage settings:',
    { ...keyboard }
  );
};

const handleMevProtectSettings = async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    [{ text: 'Turbo', callback_data: 'settings_mev_turbo' }],
    [{ text: 'Secure', callback_data: 'settings_mev_secure' }],
    [{ text: '« Back', callback_data: 'settings' }]
  ]);
  
  await ctx.editMessageText(
    'Select MEV Protect mode:\n\n' +
    'Turbo: BONKbot will use MEV Protect, but if unprotected sending is faster it will use that instead.\n\n' +
    'Secure: Transactions are guaranteed to be protected. This is the ultra secure option, but may be slower.',
    { ...keyboard }
  );
};

const handleTransactionPrioritySettings = async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    [{ text: 'Low', callback_data: 'settings_priority_low' }],
    [{ text: 'Normal', callback_data: 'settings_priority_normal' }],
    [{ text: 'High', callback_data: 'settings_priority_high' }],
    [{ text: '« Back', callback_data: 'settings' }]
  ]);
  
  await ctx.editMessageText(
    'Select transaction priority:',
    { ...keyboard }
  );
};

const handleSellProtectionSettings = async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    [{ text: 'Enable', callback_data: 'settings_sellProtection_enable' }],
    [{ text: 'Disable', callback_data: 'settings_sellProtection_disable' }],
    [{ text: '« Back', callback_data: 'settings' }]
  ]);
  
  await ctx.editMessageText(
    'Configure 100% sell protection:',
    { ...keyboard }
  );
};

const handleSecurityConfig = async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    [{ text: 'Set Up 2FA', callback_data: 'settings_security_2fa' }],
    [{ text: 'Swap Auto-Approve', callback_data: 'settings_security_autoApprove' }],
    [{ text: '« Back', callback_data: 'settings' }]
  ]);
  
  await ctx.editMessageText(
    'Security Configuration:\n\n' +
    'Set Up Two-Factor Authentication: Launches Mini App to secure your BONKbot with 2FA.\n\n' +
    'Enable/Disable Swap Auto-Approve: Having Auto-Approve disabled means each token must first be whitelisted for trading via 2FA authorization.',
    { ...keyboard }
  );
};
