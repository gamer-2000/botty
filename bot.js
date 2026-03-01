const mineflayer = require('mineflayer')

function createBot() {
  const bot = mineflayer.createBot({
    host: process.env.MC_HOST,
    port: 25565,
    username: process.env.MC_USER,
    password: process.env.MC_PASS || undefined,
    version: false
  })

  bot.on('spawn', () => {
    console.log('Bot joined!')

    setTimeout(() => {
      bot.chat('/register yourpass yourpass')
      bot.chat('/login yourpass')
    }, 4000)

    bot.setControlState('forward', true)

    // Optional anti-AFK jump
    setInterval(() => {
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 500)
    }, 15000)
  })

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting...')
    setTimeout(createBot, 10000)
  })

  bot.on('error', err => console.log(err))
}

createBot()
