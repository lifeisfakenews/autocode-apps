const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const {Chess} = require('chess.js');
const chess = new Chess()
let game = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.channel_id}_chess`});
if (!game)
  return lib.discord.channels['@0.3.2'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `**${context.params.event.author.username}** there is no game in the channel!`
  });
chess.load(game.board)
let turn = chess.turn().replace('w', `${game.white.username}#${game.white.discriminator}`).replace('b', `${game.black.username}#${game.black.discriminator}`)

await lib.discord.channels['@0.3.2'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: "rich",
    author: {name: `${game.white.username} VS ${game.black.username}`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/995617018499846194/chess.png`},
    description: `♟︎  - ${game.white.username}#${game.white.discriminator}\n♙ - ${game.black.username}#${game.black.discriminator}\n\nIt is **${turn}**'s go
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
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});