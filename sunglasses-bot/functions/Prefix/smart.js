const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `${context.params.event.mentions.length ? `${context.params.event.mentions[0].username} is` : `You are`} ${Math.floor(Math.random() * 100) + 1}% smart.`,
});