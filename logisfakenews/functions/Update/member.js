const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let channel = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.guild_id}_channels`});//Get log channels
let audit = await lib.discord.guilds['@0.2.3'].auditLogs.list({guild_id: context.params.event.guild_id, limit: 1});//Get audit log data
let user = await lib.discord.users['@0.2.0'].retrieve({user_id: audit.audit_log_entries[0].user_id});//Get user data

if (audit.audit_log_entries[0].action_type == 24 || audit.audit_log_entries[0].action_type == 25) {
  if (channel?.member || channel?.default) {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: channel?.member || channel?.default,
      content: ``,
      embeds: [{
        type: 'rich',
        description: `
**User:** ${context.params.event.user.username}#${context.params.event.user.discriminator} | <@${context.params.event.user.id}>
**Nick:** ${context.params.event.nick || `none`}
**Roles:** ${context.params.event.roles.map((r) => `<@&${r}>`).join(' ')}`,
        fields: [{name: `Changes`, value: `\`\`\`js\n${JSON.stringify(audit.audit_log_entries[0].changes, null, ' ')}\`\`\``}],
        color: 0x0f94d7,
        author: {name: `Member Updated`, icon_url: user.avatar_url},
        timestamp: new Date().toISOString(),
        footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
      }],
    });
  }
}