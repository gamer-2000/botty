const express = require('express');
const mineflayer = require('mineflayer');
const app = express();

const PORT = process.env.PORT || 3000;

// Keep Render Happy
app.get('/', (req, res) => {
  res.send('AFK Bot is alive and kicking.');
});

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

function createBot() {
  const bot = mineflayer.createBot({
    host: 'bbcv2.progamer.me',
    port: 25565,
    username: 'AFK_BOT_PRO', // Avoid hyphens if the server has strict name plugins
    version: '1.21.1' // Corrected version (Check if your server is 1.21 or 1.21.1)
  });

  bot.on('spawn', () => {
    console.log('Successfully joined the server!');
    // Wait 2 seconds after spawning before moving to ensure entities are loaded
    setTimeout(() => startMovement(bot), 2000);
  });

  bot.on('kicked', (reason) => {
    console.log('Kicked for:', reason);
  });

  bot.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
      console.log(`Failed to connect to ${err.address}`);
    } else {
      console.log('Error:', err);
    }
  });

  bot.on('end', () => {
    console.log('Disconnected. Reconnecting in 15s...');
    setTimeout(createBot, 15000);
  });
}

function startMovement(bot) {
  console.log('Starting Anti-AFK routine...');
  
  // Basic forward movement
  bot.setControlState('forward', true);

  setInterval(() => {
    if (!bot.entity) return; // Safety check

    // Jump
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);

    // Look around
    const yaw = bot.entity.yaw + (Math.random() - 0.5) * 2;
    const pitch = (Math.random() - 0.5) * 0.5;
    bot.look(yaw, pitch, false);

    // Random pause
    if (Math.random() > 0.8) {
      bot.setControlState('forward', false);
      setTimeout(() => bot.setControlState('forward', true), 3000);
    }
  }, 15000); // Run every 15 seconds
}

createBot();
