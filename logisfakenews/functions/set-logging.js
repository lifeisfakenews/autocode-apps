const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.interactions['@release'].responses.create({token: context.params.event.token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
let channel = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_channels`,
  defaultValue: {
    'default': null,
    'channel': null,
    'message': null,
    'member': null,
    'invite': null,
    'thread': null,
    'emoji': null,
    'voice': null,
    'role': null,
  }
});
if (context.params.event.data.options[0].value == `default`) {
  channel.default = context.params.event.data.options[1].value
  await lib.discord.interactions['@1.0.1'].followups.create({
    token: `${context.params.event.token}`,
    content: `<#${context.params.event.data.options[1].value}> is now your default logging channel`
  });
} else if (context.params.event.data.options[0].value == `channel`) {
  channel.channel = context.params.event.data.options[1].value
  await lib.discord.interactions['@1.0.1'].followups.create({
    token: `${context.params.event.token}`,
    content: `<#${context.params.event.data.options[1].value}> is now your channel logging channel`
  });
} else if (context.params.event.data.options[0].value == `message`) {
  channel.message = context.params.event.data.options[1].value
  await lib.discord.interactions['@1.0.1'].followups.create({
    token: `${context.params.event.token}`,
    content: `<#${context.params.event.data.options[1].value}> is now your message logging channel`
  });
} else if (context.params.event.data.options[0].value == `member`) {
  channel.member = context.params.event.data.options[1].value
  await lib.discord.interactions['@1.0.1'].followups.create({
    token: `${context.params.event.token}`,
    content: `<#${context.params.event.data.options[1].value}> is now your member logging channel`
  });
} else if (context.params.event.data.options[0].value == `invite`) {
  channel.invite = context.params.event.data.options[1].value
  await lib.discord.interactions['@1.0.1'].followups.create({
    token: `${context.params.event.token}`,
    content: `<#${context.params.event.data.options[1].value}> is now your invite logging channel`
  });
} else if (context.params.event.data.options[0].value == `thread`) {
  channel.thread = context.params.event.data.options[1].value
  await lib.discord.interactions['@1.0.1'].followups.create({
    token: `${context.params.event.token}`,
    content: `<#${context.params.event.data.options[1].value}> is now your thread logging channel`
  });
} else if (context.params.event.data.options[0].value == `emoji`) {
  channel.emoji = context.params.event.data.options[1].value
  await lib.discord.interactions['@1.0.1'].followups.create({
    token: `${context.params.event.token}`,
    content: `<#${context.params.event.data.options[1].value}> is now your emoji logging channel`
  });
} else if (context.params.event.data.options[0].value == `voice`) {
  channel.voice = context.params.event.data.options[1].value
  await lib.discord.interactions['@1.0.1'].followups.create({
    token: `${context.params.event.token}`,
    content: `<#${context.params.event.data.options[1].value}> is now your voice logging channel`
  });
} else if (context.params.event.data.options[0].value == `role`) {
  channel.role = context.params.event.data.options[1].value
  await lib.discord.interactions['@1.0.1'].followups.create({
    token: `${context.params.event.token}`,
    content: `<#${context.params.event.data.options[1].value}> is now your role logging channel`
  });
}
console.log(channel);
await lib.utils.kv['@0.1.16'].set({key: `${context.params.event.guild_id}_channels`, value: channel});