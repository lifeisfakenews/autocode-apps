const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let channel = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.guild_id}_channels`});//Get log channels
let audit = await lib.discord.guilds['@0.2.3'].auditLogs.list({guild_id: context.params.event.guild_id, action_type: 110, limit: 1});//Get audit log data
let user = await lib.discord.users['@0.2.0'].retrieve({user_id: audit.audit_log_entries[0].user_id});//Get user data

console.log(audit);

if (channel?.thread || channel?.default) {
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: channel?.thread || channel?.default,
    content: ``,
    embeds: [{
      type: 'rich',
      description: `
**Name:** ${context.params.event.name} | <#${context.params.event.id}>
**Channel:** <#${context.params.event.parent_id}>
**Type:** ${context.params.event.type.toString().replace('10', 'News').replace('11', 'Public').replace('12', 'Private')}
**Auto Archive:** \`${parseInt(context.params.event.thread_metadata.auto_archive_duration)/60}h\`
**Members:** \`${audit.threads[0].member_count}\`
**Slowmode:** \`${audit.threads[0].rate_limit_per_user}\`
**Owner:** <@${context.params.event.owner_id}>`,
      color: 0x41CF3C,
      author: {name: `Thread Created`, icon_url: user.avatar_url},
      timestamp: new Date().toISOString(),
      footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
    }],
  });
}