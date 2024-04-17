const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let channel = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.guild_id}_channels`});//Get log channels
let audit = await lib.discord.guilds['@0.2.3'].auditLogs.list({guild_id: context.params.event.guild_id, action_type: 12, limit: 1});//Get audit log data
let user = await lib.discord.users['@0.2.0'].retrieve({user_id: audit.audit_log_entries[0].user_id});//Get user data
let permString = ``
let perms = context.params.event.permission_overwrites
for (let i = 0; i < perms.length; i++) {//For each permission overwrite
  if (perms[i].type == 0) {//If permission overwrite is for a role
    permString = permString + `> **Role:** <@&${perms[i].id}> Allow ${perms[i].allow} Deny ${perms[i].deny}\n`
  } else {//If permission overwrite is for a user
    permString = permString + `> **User:** <@${perms[i].id}> Allow ${perms[i].allow} Deny ${perms[i].deny}\n`
  }
}
if (channel?.channel || channel?.default) {
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: channel?.channel || channel?.default,
    content: ``,
    embeds: [{
      type: 'rich',
      description: `
**Name:** ${context.params.event.name} | ${context.params.event.id}
**Category:** <#${context.params.event.parent_id}>
**Type:** ${context.params.event.type.toString().replace('0', 'Text').replace('2', 'Voice').replace('4', 'Catagory').replace('5', 'News').replace('13', 'Stage')}
**Topic:** \`${context.params.event.topic || `No Topic`}\`
**Permissions:** \n${permString}`,
      color: 0xE72020,
      author: {name: `Channel Deleted`, icon_url: user.avatar_url},
      timestamp: new Date().toISOString(),
      footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
    }],
  });
}