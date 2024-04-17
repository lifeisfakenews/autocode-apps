const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, token, channel_id, member} = event;
const error = require('../../../helpers/error.js')
try {
let emojis = await lib.utils.kv['@0.1.16'].get({key: `emojis`, defaultValue: {moderator: null, user: null, reason: null, channel: null, error: null, timeout: null, clock: null}});
await lib.discord.interactions['@release'].responses.create({token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': guild_id}]});
if (!base?.rows?.length) base = await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': guild_id}]});
let isAdmin = false,  reason = event.data.options[1]?.value || `No reason provided`
let guildInfo = await lib.discord.guilds['@0.2.4'].retrieve({guild_id});
if (guildInfo.owner_id == member.user.id) isAdmin = true
if (member.roles.includes(base.rows[0].fields.Moderator)) isAdmin = true
if (guildInfo.roles.filter(role => (role.permissions & (1 << 3)) === 1 << 3 && member.roles.includes(role.id))?.length) isAdmin = true
if (!isAdmin)
  return lib.discord.interactions['@release'].followups.ephemeral.create({token,
    content: `<:error:${emojis.error}> | **${member.user.username}**, you don't have permission to use this.`
  });

await lib.airtable.query['@1.0.0'].update({
  table: `Cases`,
  where: [{
    'Case__is': event.data.options[0].value,
    'Guild__is': guild_id
  }],
  fields: {'Reason': event.data.options[1].value},
});
await lib.discord.interactions['@release'].followups.create({token,
  content: `Updated reason for case \`${event.data.options[0].value}\` to ${event.data.options[1].value}`
});
if (base.rows[0].fields.Logging) {
  await lib.discord.channels['@release'].messages.create({
    channel_id: base.rows[0].fields.Logging,
    content: ``,
    embeds: [{
      type: 'rich',
      color: 0x41CF3C,
      description: `
📂 | ${event.data.options[0].value}
<:moderator:${emojis.moderator}> | <@${member.user.id}> | ${member.user.username}#${member.user.discriminator}
<:reason:${emojis.reason}> | ${event.data.options[1].value}`,
      footer: {text: `Case Number: N/A`},
      author: {name: `Edited Case`, icon_url: `https://cdn.discordapp.com/emojis/965583572553584700.png?size=96&quality=lossless`},
      timestamp: new Date().toISOString(),
    }],
  });
} } catch (e) {
  await error.slash(token, channel_id, e.message)
}