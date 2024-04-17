const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, token, channel_id, member, author} = event;
const error = require('../../../helpers/error.js')
try {
if (!event?.mentions?.length) throw new Error(`You need to mention a user!`);
let emojis = await lib.utils.kv['@0.1.16'].get({key: `emojis`, defaultValue: {moderator: null, user: null, reason: null, channel: null, error: null, timeout: null, clock: null}});
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': guild_id}]});
if (!base?.rows?.length) base = await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': guild_id}]});
let cNum = (await lib.airtable.query['@1.0.0'].max({table: `Cases`, where: [{'Guild__is': guild_id}], field: `Case`})).max.max + 1
let isAdmin = false, targetAdmin = false, reason = event.content.split(' ').slice(2).join(' ') || `No reason provided`
let guildInfo = await lib.discord.guilds['@0.2.4'].retrieve({guild_id});
let target = await lib.discord.guilds['@0.2.4'].members.retrieve({user_id: event.mentions[0].id, guild_id});
if (guildInfo.owner_id == author.id) isAdmin = true
if (guildInfo.owner_id == target.user.id) targetAdmin = true
if (member.roles.includes(base.rows[0].fields.Moderator)) isAdmin = true
if (target.roles.includes(base.rows[0].fields.Moderator)) targetAdmin = true
if (guildInfo.roles.filter(role => (role.permissions & (1 << 3)) === 1 << 3 && member.roles.includes(role.id))?.length) isAdmin = true
if (guildInfo.roles.filter(role => (role.permissions & (1 << 3)) === 1 << 3 && target.roles.includes(role.id))?.length) targetAdmin = true
if (!isAdmin)
  return lib.discord.channels['@release'].messages.create({channel_id, content: `<:error:${emojis.error}> | You don't have permission to use this command`});
if (targetAdmin)
  return lib.discord.channels['@release'].messages.create({channel_id, content: `<:error:${emojis.error}> | You can't moderate a moderator`});

await lib.airtable.query['@1.0.0'].delete({table: `Cases`, where: [{'Guild__is': guild_id, 'User__is': target.user.id, 'Type__is': `Warning`}]});
await lib.discord.channels['@release'].messages.create({channel_id, content: `Cleared **${target.user.username}** warnings for ${reason}`});
if (base.rows[0].fields.Logging) {
  await lib.discord.channels['@release'].messages.create({
    channel_id: base.rows[0].fields.Logging,
    content: ``,
    embeds: [{
      type: 'rich',
      color: 0x41CF3C,
      description: `
<:user:${emojis.user}> | <@${target.user.id}> | ${target.user.username}#${target.user.discriminator}
<:moderator:${emojis.moderator}> | <@${author.id}> | ${author.username}#${author.discriminator}
<:reason:${emojis.reason}> | ${reason}`,
      footer: {text: `Case Number: ${cNum}`},
      author: {name: `${cNum} | Clear Warns`, icon_url: target.user.avatar_url || 'https://cdn.discordapp.com/attachments/911294620439293993/965586325208195142/avatar.png'},
      timestamp: new Date().toISOString(),
    }],
  });
}
await lib.airtable.query['@1.0.0'].insert({table: `Cases`,
  fieldsets: [{
    User: target.user.id,
    Reason: reason,
    Type: `Clear Warns`,
    Moderator: author.id,
    Timestamp: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
    Case: cNum,
    Guild: guild_id,
  }],
});
} catch (e) {
  await error.prefix(channel_id, e.message)
}