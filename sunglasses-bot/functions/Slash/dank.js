const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.interactions['@release'].responses.create({
  token: context.params.event.token,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  content: `${context.params.event.data.options.length ? `<@${context.params.event.data.options[0].value}> is` : `You are`} ${Math.floor(Math.random() * 100) + 1}% dank.`,
});