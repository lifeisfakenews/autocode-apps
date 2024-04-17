const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let easy = await lib.utils.kv['@0.1.16'].get({key: `easy_count`});
let hard = await lib.utils.kv['@0.1.16'].get({key: `hard_count`});
let pre = await lib.utils.kv['@0.1.16'].get({key: `pre_count`});

await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  token: `${context.params.event.token}`,
  content: `**Easy:** ${easy.current}\n**Hard:** ${hard.current}\n**Premium:** ${pre}`
});