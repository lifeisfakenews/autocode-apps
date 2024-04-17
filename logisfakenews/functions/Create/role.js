const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let channel = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.guild_id}_channels`});//Get log channels
let audit = await lib.discord.guilds['@0.2.3'].auditLogs.list({guild_id: context.params.event.guild_id, action_type: 30, limit: 1});//Get audit log data
let user = await lib.discord.users['@0.2.0'].retrieve({user_id: audit.audit_log_entries[0].user_id});//Get user data

if (channel?.role || channel?.default) {
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: channel?.role || channel?.default,
    content: ``,
    embeds: [{
      type: 'rich',
      description: `
**Name:** ${context.params.event.role.name} | <@&${context.params.event.role.id}>
**Color:** \`${context.params.event.role.color}\`
**Position:** \`${context.params.event.role.position}\`
**Mentionable:** ${context.params.event.role.mentionable ? `Yes` : `No`}
**Display Seperate:** ${context.params.event.role.hoist ? `Yes` : `No`}
**Managed:** ${context.params.event.role.managed ? `Yes` : `No`}
**Permissions:** \`${context.params.event.role.permissions}\``,
      color: 0x41CF3C,
      author: {name: `Role Created`, icon_url: user.avatar_url},
      timestamp: new Date().toISOString(),
      footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
    }],
  });
}