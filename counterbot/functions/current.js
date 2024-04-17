const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let easy = await lib.utils.kv['@0.1.16'].get({key: `easy_count`});
let hard = await lib.utils.kv['@0.1.16'].get({key: `hard_count`});
let perm = await lib.utils.kv['@0.1.16'].get({key: `pre_count`});
await lib.discord.channels['@0.3.2'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `**Easy** \`${easy.current}\`\n**Hard** \`${hard.current}\`\n**Premium** \`${perm}\``
});