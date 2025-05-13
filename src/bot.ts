import { Telegraf } from 'telegraf';   
import { initDB } from './db';
import { handleStart, handleAcceptTerms } from './commands/start';
import { handleHome } from './commands/home';
import { handleSettings } from './commands/settings';
import { handleWallet } from './commands/wallet';
import { handleBuy } from './commands/buy';
import { handleHelp } from './commands/help';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);
initDB();

// Start command
bot.start(handleStart);
bot.action('accept_terms', handleAcceptTerms);

// Home command
bot.command('home', handleHome);

// Settings command
bot.command('settings', handleSettings);

// Wallet command
bot.command('wallet', handleWallet);

// Buy command
bot.command('buy', handleBuy);

// Help command
bot.command('help', handleHelp);

// Set up menu commands
bot.telegram.setMyCommands([
  { command: 'home', description: 'view trades and open main menu' },
  { command: "settings", description: "customize your bot" },
  { command: "help", description: "tips and frequently asked questions" },
]);

// Set bot description
bot.telegram.setMyDescription(`What can this bot do?

Blazingly-fast trading at your fingertips. Use /start to open the main menu and start using all our features - fast swaps, new token alerts, trade tracking and PNL.

Website: https://www.erjbot.com/
Twitter: https://x.com/erjbot
Telegram: https://t.me/+xM4kLebcIv83ZmI0`);

// Set bot short description
bot.telegram.setMyShortDescription('Blazingly-fast trading at your fingertips');

bot.launch();
console.log('Bot is running...');
