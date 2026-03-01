const mineflayer = require('mineflayer')

function createBot() {
  const bot = mineflayer.createBot({
    host: 'bbcv2.progamer.me',
    port: 25565,
    username: 'AFK-BOT',
    version: '1.21.11'
  })

  bot.on('spawn', () => {
    console.log('Bot joined server.')

    startMovement(bot)
  })

  bot.on('end', () => {
    console.log('Disconnected. Reconnecting in 10s...')
    setTimeout(createBot, 10000)
  })

  bot.on('error', err => console.log(err))
}

function startMovement(bot) {
  // Move forward
  bot.setControlState('forward', true)

  // Random anti-AFK behavior
  setInterval(() => {
    // Random jump
    bot.setControlState('jump', true)
    setTimeout(() => bot.setControlState('jump', false), 500)

    // Slight random turn
    const yaw = bot.entity.yaw + (Math.random() - 0.5) * 2
    bot.look(yaw, bot.entity.pitch, true)

    // Random stop/start to look human
    if (Math.random() > 0.7) {
      bot.setControlState('forward', false)
      setTimeout(() => {
        bot.setControlState('forward', true)
      }, 3000)
    }

  }, 20000)
}

createBot()
