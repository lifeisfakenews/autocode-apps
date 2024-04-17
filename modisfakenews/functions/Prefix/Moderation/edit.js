const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, token, channel_id, member, author} = event;
const error = require('../../../helpers/error.js')
try {
let emojis = await lib.utils.kv['@0.1.16'].get({key: `emojis`, defaultValue: {moderator: null, user: null, reason: null, channel: null, error: null, timeout: null, clock: null}});
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': guild_id}]});
if (!base?.rows?.length) base = await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': guild_id}]});
let isAdmin = false
let guildInfo = await lib.discord.guilds['@0.2.4'].retrieve({guild_id});
if (guildInfo.owner_id == author.id) isAdmin = true
if (member.roles.includes(base.rows[0].fields.Moderator)) isAdmin = true
if (guildInfo.roles.filter(role => (role.permissions & (1 << 3)) === 1 << 3 && member.roles.includes(role.id))?.length) isAdmin = true
if (!isAdmin)
  return lib.discord.channels['@release'].messages.create({channel_id, content: `<:error:${emojis.error}> | You don't have permission to use this command`});

  await lib.airtable.query['@1.0.0'].update({table: `Cases`, where: [{'Case__is': event.content.split(' ')[1], 'Guild__is': guild_id}], fields: {'Reason': event.content.split(' ').slice(2).join(' ')}});
  await lib.discord.channels['@release'].messages.create({channel_id, content: `Updated case **${event.content.split(' ')[1]}** with new reason ${event.content.split(' ').slice(2).join(' ')}.`});
} catch (e) {
  await error.prefix(channel_id, e.message)
}