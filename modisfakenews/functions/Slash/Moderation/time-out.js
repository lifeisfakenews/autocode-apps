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
let isAdmin = false, targetAdmin = false, reason = event.data.options[2]?.value || `No reason provided`
let guildInfo = await lib.discord.guilds['@0.2.4'].retrieve({guild_id});
let target = await lib.discord.guilds['@0.2.4'].members.retrieve({user_id: event.data.options[0].value, guild_id});
if (guildInfo.owner_id == member.user.id) isAdmin = true
if (guildInfo.owner_id == target.user.id) targetAdmin = true
if (member.roles.includes(base.rows[0].fields.Moderator)) isAdmin = true
if (target.roles.includes(base.rows[0].fields.Moderator)) targetAdmin = true
if (guildInfo.roles.filter(role => (role.permissions & (1 << 3)) === 1 << 3 && member.roles.includes(role.id))?.length) isAdmin = true
if (guildInfo.roles.filter(role => (role.permissions & (1 << 3)) === 1 << 3 && target.roles.includes(role.id))?.length) targetAdmin = true
if (!isAdmin)
  return lib.discord.interactions['@release'].followups.ephemeral.create({token,
    content: `<:error:${emojis.error}> | **${member.user.username}**, you don't have permission to use this.`
  });
if (targetAdmin)
  return lib.discord.interactions['@release'].followups.ephemeral.create({token,
    content: `<:error:${emojis.error}> | **${member.user.username}**, you can't ban a moderator.`
  });

let match = event.data.options[1].value.match(/(\d+)(s|m|h|d)/) 
if (!match)
  throw new Error(`Please provide a duration in days(\`d\`), hours(\`h\`), minutes(\`m\`) or seconds(\`s\`).`)

let secs = new Date().getSeconds()
let time = parseInt(match[1]), unit = match[2]
if (unit === 's') time *= 1
else if (unit === 'm') time *= 60
else if (unit === 'h') time *= 60 * 60
else if (unit === 'd') time *= 24 * 60 * 60
let until = `<t:${Math.floor(new Date().setSeconds(secs + time) / 1000)}>`

await lib.discord.guilds['@release'].members.timeout.update({guild_id,
  user_id: target.user.id,
  communication_disabled_until_seconds: time,
  reason: `Reason ${reason} | Moderator: ${member.user.username}#${member.user.discriminator}(${member.user.id})`
});
await lib.discord.interactions['@release'].followups.create({token,
  content: `**${target.user.username}** has been timed out for ${match[1]} ${match[2].replace('s', 'seconds').replace('d', 'days').replace('h', 'hours').replace('m', 'minutes')} for ${reason}`
});
if (base.rows[0].fields.Appeals) {
  try {
    await lib.discord.users['@release'].dms.create({
      recipient_id: target.user.id,
      content: ``,
      embeds: [{
        type: 'rich',
        title: 'Timed Out',
        description: `Hey! You've been timed out in **${guildInfo.name}**.\n
<:moderator:${emojis.moderator}> ${member.user.username}#${member.user.discriminator}
<:reason:${emojis.reason}> ${reason}
<:timeout:${emojis.timeout}> | ${until.replace('>', ':R>')} | ${time}`,
        color: 0xE72020,
        footer: {text: `Guild: ${guild_id}`}
      }],
      components: [{type: 1, components: [{style: 5, label: `Appeal`, url: base.rows[0].fields.Appeals, type: 2}]}]
    });
  } catch (e) {
    await lib.discord.interactions['@release'].followups.ephemeral.create({token, content: `<:error:${emojis.error}> | Failed to DM the user.`});
  }
}
if (base.rows[0].fields.Logging) {
  await lib.discord.channels['@release'].messages.create({
    channel_id: base.rows[0].fields.Logging,
    content: ``,
    embeds: [{
      type: 'rich',
      color: 0xE72020,
      description: `
<:user:${emojis.user}> | <@${target.user.id}> | ${target.user.username}#${target.user.discriminator}
<:moderator:${emojis.moderator}> | <@${member.user.id}> | ${member.user.username}#${member.user.discriminator}
<:reason:${emojis.reason}> | ${reason}
<:timeout:${emojis.timeout}> | ${until.replace('>', ':R>')} | ${time}`,
      footer: {text: `Case Number: ${cNum}`},
      author: {name: `${cNum} | Time Out`, icon_url: target.user.avatar_url || 'https://cdn.discordapp.com/attachments/911294620439293993/965586325208195142/avatar.png'},
      timestamp: new Date().toISOString(),
    }],
  });
}
await lib.airtable.query['@1.0.0'].insert({table: `Cases`,
  fieldsets: [{
    User: target.user.id,
    Reason: reason,
    Type: `Time-out`,
    Moderator: event.member.user.id,
    Timestamp: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
    Case: cNum,
    Guild: guild_id,
  }],
});
} catch (e) {
  await error.slash(token, channel_id, e.message)
}