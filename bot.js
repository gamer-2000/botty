const express = require('express');
const mineflayer = require('mineflayer');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Keep-Alive for Render
app.get('/', (req, res) => res.send('Bot Status: Online'));
app.listen(PORT, () => console.log(`Web server listening on ${PORT}`));

// 2. Bot Configuration
const createBot = () => {
  const bot = mineflayer.createBot({
    host: 'bbcv2.progamer.me',
    port: 25565,
    // Randomizing name slightly fixes "Duplicate UUID"
    username: `AFK_BOT_${Math.floor(Math.random() * 999)}`, 
    // FORCE 1.20.1 or 1.21: If 1.21 doesn't work, change this to '1.20.1'
    // ViaVersion servers often handle older protocol versions more stably.
    version: '1.21.1', 
    hideErrors: true
  });

  bot.on('login', () => {
    console.log(`[LOGIN] Joined as ${bot.username}. Waiting for spawn...`);
  });

  bot.on('spawn', () => {
    console.log('[SPAWN] Bot is now in the world.');
    
    // Safety: only start moving if entity exists
    if (bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 1000);
    }
    
    startAntiAFK(bot);
  });

  // Reconnect logic
  bot.on('end', (reason) => {
    console.log(`[DISCONNECT] Reason: ${reason}. Reconnecting in 20s...`);
    // Clear all listeners to prevent memory leaks on Render
    bot.removeAllListeners();
    setTimeout(createBot, 20000); 
  });

  bot.on('error', (err) => {
    console.error('[ERROR]', err.message);
  });
};

// 3. Optimized Anti-AFK (Randomized)
function startAntiAFK(bot) {
  setInterval(() => {
    if (!bot.entity) return;

    // Random action: Jump, Rotate, or Swing Arm
    const actions = ['jump', 'look', 'swing'];
    const choice = actions[Math.floor(Math.random() * actions.length)];

    if (choice === 'jump') {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    } else if (choice === 'look') {
      const yaw = bot.entity.yaw + (Math.random() - 0.5) * 2;
      bot.look(yaw, 0);
    } else {
      bot.swingArm('right');
    }
  }, 15000); // Every 15 seconds
}

// Start the bot
createBot();
