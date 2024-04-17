const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let channel = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.guild_id}_channels`});//Get log channels
let audit = await lib.discord.guilds['@0.2.3'].auditLogs.list({guild_id: context.params.event.guild_id, action_type: 32, limit: 1});//Get audit log data
let user = await lib.discord.users['@0.2.0'].retrieve({user_id: audit.audit_log_entries[0].user_id});//Get user data

if (channel?.role || channel?.default) {
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: channel?.role || channel?.default,
    content: ``,
    embeds: [{
      type: 'rich',
      description: `
**Name:** ${audit.audit_log_entries[0].changes[0].old_value} | ${context.params.event.role_id}
**Color:** \`${audit.audit_log_entries[0].changes[2].old_value}\`
**Mentionable:** ${audit.audit_log_entries[0].changes[4].old_value ? `Yes` : `No`}
**Display Seperate:** ${audit.audit_log_entries[0].changes[3].old_value ? `Yes` : `No`}
**Permissions:** \`${audit.audit_log_entries[0].changes[1].old_value}\``,
      color: 0xE72020,
      author: {name: `Role Deleted`, icon_url: user.avatar_url},
      timestamp: new Date().toISOString(),
      footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
    }],
  });
}