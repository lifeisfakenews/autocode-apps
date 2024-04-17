const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let channel = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.guild_id}_channels`});//Get log channels
let audit = await lib.discord.guilds['@0.2.3'].auditLogs.list({guild_id: context.params.event.guild_id, limit: 1});//Get audit log data
let user = await lib.discord.users['@0.2.0'].retrieve({user_id: audit.audit_log_entries[0].user_id});//Get user data
let message = await lib.discord.channels['@0.3.0'].messages.retrieve({
  message_id: audit.audit_log_entries[0].options.message_id,
  channel_id: audit.audit_log_entries[0].options.channel_id
});
if (channel?.message || channel.default) {
  if (audit.audit_log_entries[0].action_type == 74) {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: channel?.message || channel?.default,
      content: ``,
      embeds: [{
        type: 'rich',
        description: `
**Author:** ${message.author.username}#${message.author.discriminator} | <@${message.author.id}>
**Message:** \`${message.id}\`
**Content:** ${message.content}
**Channel:** <#${message.channel_id}>`,
        color: 0x41CF3C,
        author: {name: `Message Pinned`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt', url: `https://discord.com/channels/${context.params.event.guild_id}/${audit.audit_log_entries[0].options.channel_id}/${audit.audit_log_entries[0].options.message_id}`},
        timestamp: new Date().toISOString(),
        footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
      }],
    });
  } else if (audit.audit_log_entries[0].action_type == 75) {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: channel?.message || channel?.default,
      content: ``,
      embeds: [{
        type: 'rich',
        description: `
**Author:** ${message.author.username}#${message.author.discriminator} | <@${message.author.id}>
**Message:** \`${message.id}\`
**Content:** ${message.content}
**Channel:** <#${message.channel_id}>`,
        color: 0xE72020,
        author: {name: `Message Unpinned`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt', url: `https://discord.com/channels/${context.params.event.guild_id}/${audit.audit_log_entries[0].options.channel_id}/${audit.audit_log_entries[0].options.message_id}`},
        timestamp: new Date().toISOString(),
        footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
      }],
    });
  }
}