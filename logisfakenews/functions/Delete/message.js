const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let channel = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.guild_id}_channels`});//Get log channels
let audit = await lib.discord.guilds['@0.2.3'].auditLogs.list({guild_id: context.params.event.guild_id, action_type: 72, limit: 1});//Get audit log data
let messages = await lib.keyvalue.store['@0.1.16'].get({key: `${context.params.event.guild_id}_messages`, defaultValue: []});
messages = messages.filter((m) => m.id == context.params.event.id)

let user
if (audit.audit_log_entries?.length)
  user = await lib.discord.users['@0.2.0'].retrieve({user_id: audit.audit_log_entries[0].user_id});//Get user data

if (!messages.length)
  return lib.discord.channels['@0.3.0'].messages.create({
    channel_id: channel?.message || channel?.default,
    content: ``,
    embeds: [{
      type: 'rich',
      description: `
**ID:** ${context.params.event.id}
**Channel:** <#${context.params.event.channel_id}>`,
      color: 0xE72020,
      author: {name: `Message Deleted`, icon_url: user ? user.avatar_url : 'https://bit.ly/3KPnEKt'},
      timestamp: new Date().toISOString(),
      footer: {text: user ? `${user.username}#${user.discriminator}` : `User Unknown`, icon_url: user ? user.avatar_url : 'https://bit.ly/3KPnEKt'}
    }],
  });

if (!user)
  user = await lib.discord.users['@0.2.1'].retrieve({user_id: messages[0].author.id});

if (channel?.message || channel?.default) {
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: channel?.message || channel?.default,
    content: ``,
    embeds: [{
      type: 'rich',
      description: `
**ID:** ${context.params.event.id}
**Channel:** <#${context.params.event.channel_id}>
**Author:** ${messages[0].author.username}#${messages[0].author.discriminator} | <@${messages[0].author.id}>
**Content:** \`${messages[0].content}\``,
      color: 0xE72020,
      author: {name: `Message Deleted`, icon_url: user.avatar_url},
      timestamp: new Date().toISOString(),
      footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
    }],
  });
}
let message = await lib.keyvalue.store['@0.1.16'].get({key: `${context.params.event.guild_id}_messages`, defaultValue: []});
message = message.filter((m) => m.id != context.params.event.id)

await lib.keyvalue.store['@0.1.16'].set({key: `${context.params.event.guild_id}_messages`, value: message});