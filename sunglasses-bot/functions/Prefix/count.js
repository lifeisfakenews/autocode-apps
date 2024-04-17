const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let count = await lib.utils.kv['@0.1.16'].get({key: `count`});
await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `The current count is ${count.count}`,
});