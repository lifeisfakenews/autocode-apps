const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async (event, game, chess) => {
  if (!chess.game_over()) return
  let turn = chess.turn().replace('w', `${game.white.username}#${game.white.discriminator}`).replace('b', `${game.black.username}#${game.black.discriminator}`)
  let opp = chess.turn().replace('b', `${game.white.username}#${game.white.discriminator}`).replace('w', `${game.black.username}#${game.black.discriminator}`)
  
  if (chess.in_draw() && chess.in_stalemate() || chess.insufficient_material()) {
    await lib.discord.channels['@0.3.2'].messages.create({
      channel_id: event.channel_id,
      content: ``,
      embeds: [{
        type: "rich",
        author: {name: `Stalemate`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/995617018499846194/chess.png`},
        description: `♟︎  - ${game.white.username}#${game.white.discriminator}\n♙ - ${game.black.username}#${game.black.discriminator}\n
${turn} is in stalemate ${chess.insufficient_material() ? `due to insufficient material` : ``}
\`\`\`${chess.ascii()
.replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙')
.replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎')
.replace('R', '♜').replace('R', '♜').replace('r', '♖').replace('r', '♖')
.replace('N', '♞').replace('N', '♞').replace('n', '♘').replace('n', '♘')
.replace('B', '♝').replace('B', '♝').replace('b', '♗').replace('b', '♗')
.replace('K', '♛').replace('k', '♕')
.replace('Q', '♚').replace('q', '♔')
}\`\`\``,
        color: chess.turn().replace('w', 0xffffff).replace('b', 0x000000),
        timestamp: new Date().toISOString(),
        footer: {text: `${event.author.username}#${event.author.discriminator}`, icon_url: event.author.avatar ? `https://cdn.discordapp.com/avatars/${event.author.id}/${event.author.avatar}.${event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
      }]
    });
  } else if (chess.in_checkmate()) {
    await lib.discord.channels['@0.3.2'].messages.create({
      channel_id: event.channel_id,
      content: ``,
      embeds: [{
        type: "rich",
        author: {name: `Checkmate!`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/995617018499846194/chess.png`},
        description: `♟︎  - ${game.white.username}#${game.white.discriminator}\n♙ - ${game.black.username}#${game.black.discriminator}\n
${opp} was checkmated by ${turn}
\`\`\`${chess.ascii()
.replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙')
.replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎')
.replace('R', '♜').replace('R', '♜').replace('r', '♖').replace('r', '♖')
.replace('N', '♞').replace('N', '♞').replace('n', '♘').replace('n', '♘')
.replace('B', '♝').replace('B', '♝').replace('b', '♗').replace('b', '♗')
.replace('K', '♛').replace('k', '♕')
.replace('Q', '♚').replace('q', '♔')
}\`\`\``,
        color: chess.turn().replace('w', 0xffffff).replace('b', 0x000000),
        timestamp: new Date().toISOString(),
        footer: {text: `${event.author.username}#${event.author.discriminator}`, icon_url: event.author.avatar ? `https://cdn.discordapp.com/avatars/${event.author.id}/${event.author.avatar}.${event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
      }]
    });
  }
  await lib.utils.kv['@0.1.16'].clear({key: `${event.channel_id}_chess`});
}