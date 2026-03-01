const express = require('express');
const mineflayer = require('mineflayer');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Keep-Alive Web Server for Render
app.get('/', (req, res) => res.send('Bot is active.'));
app.listen(PORT, () => console.log(`Web server on port ${PORT}`));

// 2. Bot Configuration
const botArgs = {
  host: 'bbcv2.progamer.me',
  port: 25565,
  username: 'AFK_BOT_PRO',
  version: false, // Auto-detects version to avoid 1.21.1 errors
  checkTimeoutInterval: 60000 // Increases stability on slow hosts
};

let bot;

function createBot() {
  bot = mineflayer.createBot(botArgs);

  // Fired when the handshake is successful
  bot.once('login', () => {
    console.log(`[LOG] Connected to ${botArgs.host}. Waiting for spawn...`);
  });

  // Fired when the bot is actually in the world
  bot.once('spawn', () => {
    console.log('[LOG] Bot spawned in-game.');
    startMovement(bot);
  });

  // Handle being kicked (e.g., AFK kick or server restart)
  bot.on('kicked', (reason) => {
    console.log('[WARN] Kicked from server:', reason);
  });

  // Handle connection errors (e.g., server down)
  bot.on('error', (err) => {
    console.error('[ERROR] Connection issue:', err.message);
  });

  // Auto-Reconnect Logic
  bot.on('end', () => {
    console.log('[LOG] Disconnected. Reconnecting in 15 seconds...');
    setTimeout(createBot, 15000);
  });
}

// 3. Optimized Anti-AFK Logic
function startMovement(bot) {
  console.log('[LOG] Starting anti-AFK routine.');

  // Constant slow forward pressure
  bot.setControlState('forward', true);

  setInterval(() => {
    if (!bot.entity) return;

    // Small jump to reset AFK timers
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);

    // Look in a random direction
    const yaw = (Math.random() - 0.5) * Math.PI;
    const pitch = (Math.random() - 0.5) * Math.PI;
    bot.look(yaw, pitch, false);

    // Randomly toggle walking to simulate activity
    const walking = Math.random() > 0.2;
    bot.setControlState('forward', walking);

  }, 20000); // Trigger every 20 seconds
}

// Initialize
createBot();
