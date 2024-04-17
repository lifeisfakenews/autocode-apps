const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let channel = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.guild_id}_channels`});//Get log channels
let audit = await lib.discord.guilds['@0.2.3'].auditLogs.list({guild_id: context.params.event.guild_id, limit: 1});//Get audit log data
let user = await lib.discord.users['@0.2.0'].retrieve({user_id: audit.audit_log_entries[0].user_id});//Get user data

let emojis = ``
for (let i = 0; i < context.params.event.emojis.length; i++) {
  emojis = emojis + `${context.params.event.emojis[i].animated ? `<a` : `<`}:${context.params.event.emojis[i].name}:${context.params.event.emojis[i].id}>`
}

if (channel?.emoji || channel?.default) {
  if (audit.audit_log_entries[0].action_type == 60) {
    let emoji = await lib.discord.guilds['@0.2.3'].emojis.retrieve({
      emoji_id: audit.audit_log_entries[0].target_id,
      guild_id: context.params.event.guild_id
    });
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: channel?.emoji || channel?.default,
      content: ``,
      embeds: [{
        type: 'rich',
        description: `
**Emoji Created:** ${emoji.animated ? `<a` : `<`}:${emoji.name}:${emoji.id}> | ${emoji.name}
**New Emoji List:** ${emojis}`,
        color: 0x41CF3C,
        author: {name: `Emoji Created`, icon_url: user.avatar_url  || 'https://bit.ly/3KPnEKt'},
        timestamp: new Date().toISOString(),
        footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
      }],
    });
  } else if (audit.audit_log_entries[0].action_type == 61) {
    let emoji = await lib.discord.guilds['@0.2.3'].emojis.retrieve({
      emoji_id: audit.audit_log_entries[0].target_id,
      guild_id: context.params.event.guild_id
    });
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: channel?.emoji || channel?.default,
      content: ``,
      embeds: [{
        type: 'rich',
        description: `
**Emoji Updated:** ${emoji.animated ? `<a` : `<`}:${emoji.name}:${emoji.id}> | **Old:** \`${audit.audit_log_entries[0].changes[0].old_value}\` **New:** \`${emoji.name}\`
**Current Emoji List:** ${emojis}`,
        fields: [{name: `Changes`, value: `\`\`\`js\n${JSON.stringify(audit.audit_log_entries[0].changes, null, ' ')}\`\`\``}],
        color: 0x0f94d7,
        author: {name: `Emoji Updated`, icon_url: user.avatar_url  || 'https://bit.ly/3KPnEKt'},
        timestamp: new Date().toISOString(),
        footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
      }],
    });
  } else if (audit.audit_log_entries[0].action_type == 62) {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: channel?.emoji || channel?.default,
      content: ``,
      embeds: [{
        type: 'rich',
        description: `
**Emoji Deleted:** ${audit.audit_log_entries[0].changes[0].old_value}
**Current Emoji List:** ${emojis}`,
        color: 0xE72020,
        author: {name: `Emoji Deleted`, icon_url: user.avatar_url  || 'https://bit.ly/3KPnEKt'},
        timestamp: new Date().toISOString(),
        footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
      }],
    });
  }
}