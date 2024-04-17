const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let game = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.channel_id}_chess`});

await lib.discord.channels['@0.3.2'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `To load this game use \`?play <@user> <code>\`\nGame code: \`${game.board}\``
});