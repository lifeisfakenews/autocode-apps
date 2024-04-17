const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.interactions['@release'].responses.create({
  token: context.params.event.token,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  content: `The dice landed on ${Math.floor(Math.random() * 6) + 1}.`,
});