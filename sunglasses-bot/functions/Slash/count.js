const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let count = await lib.utils.kv['@0.1.16'].get({key: `count`});
await lib.discord.interactions['@release'].responses.create({
  token: context.params.event.token,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  content: `The current count is ${count.count}`
});