const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, token, channel_id, member} = event;
const error = require('../../../helpers/error.js')
try {
let emojis = await lib.utils.kv['@0.1.16'].get({key: `emojis`, defaultValue: {moderator: null, user: null, reason: null, channel: null, error: null, timeout: null, clock: null}});
await lib.discord.interactions['@release'].responses.create({token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': guild_id}]});
if (!base?.rows?.length) base = await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': guild_id}]});
let cNum = (await lib.airtable.query['@1.0.0'].max({table: `Cases`, where: [{'Guild__is': guild_id}], field: `Case`})).max.max + 1
let isAdmin = false, reason = event.data.options[1]?.value || `No reason provided`
let guildInfo = await lib.discord.guilds['@0.2.4'].retrieve({guild_id});
if (guildInfo.owner_id == member.user.id) isAdmin = true
if (member.roles.includes(base.rows[0].fields.Moderator)) isAdmin = true
if (guildInfo.roles.filter(role => (role.permissions & (1 << 3)) === 1 << 3 && member.roles.includes(role.id))?.length) isAdmin = true
if (!isAdmin)
  return lib.discord.interactions['@release'].followups.ephemeral.create({token,
    content: `<:error:${emojis.error}> | **${member.user.username}**, you don't have permission to use this.`
  });

await lib.discord.guilds['@release'].bans.destroy({guild_id,
  user_id: event.data.options[0].value,
  reason: `Reason: ${reason} | Moderator: ${member.user.username}#${member.user.discriminator}(${member.user.id})`
});
await lib.discord.interactions['@release'].followups.create({token, content: `**${target.username}** has been unbanned for ${reason}`});
if (base.rows[0].fields.Logging) {
  await lib.discord.channels['@release'].messages.create({
    channel_id: base.rows[0].fields.Logging,
    content: ``,
    embeds: [{
      type: 'rich',
      color: 0x41CF3C,
      description: `
<:user:${emojis.user}> | <@${target.user.id}> | ${target.user.username}#${target.user.discriminator}
<:moderator:${emojis.moderator}> | <@${member.user.id}> | ${member.user.username}#${member.user.discriminator}
<:reason:${emojis.reason}> | ${reason}`,
      footer: {text: `Case Number: ${cNum}`},
      author: {name: `${cNum} | Unban`, icon_url: target.user.avatar_url || 'https://cdn.discordapp.com/attachments/911294620439293993/965586325208195142/avatar.png'},
      timestamp: new Date().toISOString(),
    }],
  });
}
await lib.airtable.query['@1.0.0'].insert({table: `Cases`,
  fieldsets: [{
    User: target.id,
    Reason: reason,
    Type: `Unban`,
    Moderator: event.member.user.id,
    Timestamp: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
    Case: cNum,
    Guild: guild_id,
  }],
});
} catch (e) {
  await error.slash(token, channel_id, e.message)
}