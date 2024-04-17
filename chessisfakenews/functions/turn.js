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

await lib.discord.channels['@0.3.0'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: `It is currently **${turn}**'s go`
});