const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, token, channel_id, member, author} = event;
const error = require('../../../helpers/error.js')
try {
let emojis = await lib.utils.kv['@0.1.16'].get({key: `emojis`, defaultValue: {moderator: null, user: null, reason: null, channel: null, error: null, timeout: null, clock: null}});
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': guild_id}]});
if (!base?.rows?.length) base = await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': guild_id}]});
let cNum = (await lib.airtable.query['@1.0.0'].max({table: `Cases`, where: [{'Guild__is': guild_id}], field: `Case`})).max.max + 1
let isAdmin = false, reason = event.content.split(' ').slice(2).join(' ') || `No reason provided`, num = event.content.split(' ')[1]
let guildInfo = await lib.discord.guilds['@0.2.4'].retrieve({guild_id});
if (guildInfo.owner_id == author.id) isAdmin = true
if (member.roles.includes(base.rows[0].fields.Moderator)) isAdmin = true
if (guildInfo.roles.filter(role => (role.permissions & (1 << 3)) === 1 << 3 && member.roles.includes(role.id))?.length) isAdmin = true
if (!isAdmin)
  return lib.discord.channels['@release'].messages.create({channel_id, content: `<:error:${emojis.error}> | You don't have permission to use this command`});

let msgs = await lib.discord.channels['@release'].messages.list({channel_id, limit: parseInt(num)});
await lib.discord.channels['@release'].messages.bulkDelete({channel_id, messages: msgs.map(x => x.id)});
await lib.discord.channels['@release'].messages.create({channel_id, content: `Purged ${num} messages for ${reason}`});
if (base.rows[0].fields.Logging) {
  await lib.discord.channels['@release'].messages.create({
    channel_id: base.rows[0].fields.Logging,
    content: ``,
    embeds: [{
      type: 'rich',
      color: 0xE72020,
      description: `
<:channel:${emojis.channel}> | <#${channel_id}>
<:moderator:${emojis.moderator}> | <@${author.id}> | ${author.username}#${author.discriminator}
<:reason:${emojis.reason}> | ${reason}`,
      footer: {text: `Case Number: ${cNum}`},
      author: {name: `${cNum} | Purge`},
      timestamp: new Date().toISOString(),
    }],
  });
}
await lib.airtable.query['@1.0.0'].insert({table: `Cases`,
  fieldsets: [{
    Channel: channel_id,
    Reason: reason,
    Other: num,
    Type: `Purge`,
    Moderator: author.id,
    Timestamp: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
    Case: cNum,
    Guild: guild_id,
  }],
});
} catch (e) {
  await error.prefix(channel_id, e.message)
}