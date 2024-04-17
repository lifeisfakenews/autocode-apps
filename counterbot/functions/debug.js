const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (context.params.event.author.id == '760170825629958184') {
  let easy = await lib.utils.kv['@0.1.16'].get({key: `easy_count`});
  let hard = await lib.utils.kv['@0.1.16'].get({key: `hard_count`});
  let perm = await lib.utils.kv['@0.1.16'].get({key: `pre_count`});
  await lib.discord.users['@0.2.1'].dms.create({
    recipient_id: context.params.event.author.id,
    content: `**__DEBUG INFO__**\n\nEasy ${easy.current} <@${easy.user}>\nHard ${hard.current} <@${hard.user}>\nPremium ${perm}`
  });
  await lib.discord.channels['@0.3.2'].messages.reactions.create({
    emoji: '👍',
    message_id: context.params.event.id,
    channel_id: context.params.event.channel_id
  });
}