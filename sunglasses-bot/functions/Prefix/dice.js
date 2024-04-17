const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `The dice landed on ${Math.floor(Math.random() * 6) + 1}.`,
});