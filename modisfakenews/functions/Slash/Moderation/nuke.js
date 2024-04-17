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
let isAdmin = false, reason = event.data.options[0]?.value || `No reason provided`
let guildInfo = await lib.discord.guilds['@0.2.4'].retrieve({guild_id});
if (guildInfo.owner_id == member.user.id) isAdmin = true
if (member.roles.includes(base.rows[0].fields.Moderator)) isAdmin = true
if (guildInfo.roles.filter(role => (role.permissions & (1 << 3)) === 1 << 3 && member.roles.includes(role.id))?.length) isAdmin = true
if (!isAdmin)
  return lib.discord.interactions['@release'].followups.ephemeral.create({token,
    content: `<:error:${emojis.error}> | **${member.user.username}**, you don't have permission to use this.`
  });

let oldCh = await lib.discord.channels['@release'].retrieve({channel_id});
await lib.discord.channels['@release'].destroy({channel_id});
let newCh = await lib.discord.guilds['@release'].channels.create({
  guild_id: oldCh.guild_id,
  name: oldCh.name,
  type: oldCh.type,
  topic: oldCh.topic,
  bitrate: oldCh.bitrate,
  user_limit: oldCh.user_limit,
  rate_limit_per_user: oldCh.rate_limit_per_user,
  position: oldCh.position,
  permission_overwrites: oldCh.permission_overwrites,
  parent_id: oldCh.parent_id,
  nsfw: oldCh.nsfw
});
await lib.discord.channels['@release'].messages.create({channel_id: newCh.id, content: `This channel has been nuked for ${reason}`});
if (base.rows[0].fields.Logging) {
  await lib.discord.channels['@release'].messages.create({
    channel_id: base.rows[0].fields.Logging,
    content: ``,
    embeds: [{
      type: 'rich',
      color: 0xE72020,
      description: `
<:channel:${emojis.channel}> | <#${channel_id}>
<:moderator:${emojis.moderator}> | <@${member.user.id}> | ${member.user.username}#${member.user.discriminator}
<:reason:${emojis.reason}> | ${reason}`,
      footer: {text: `Case Number: ${cNum}`},
      author: {name: `${cNum} | Nuke`},
      timestamp: new Date().toISOString(),
    }],
  });
}
await lib.airtable.query['@1.0.0'].insert({table: `Cases`,
  fieldsets: [{
    Channel: newCh.id,
    Reason: reason,
    Type: `Nuke`,
    Moderator: event.member.user.id,
    Timestamp: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
    Case: cNum,
    Guild: guild_id
  }],
});
} catch (e) {
  await error.slash(token, channel_id, e.message)
}