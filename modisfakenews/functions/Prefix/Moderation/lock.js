const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, token, channel_id, member, author} = event;
const error = require('../../../helpers/error.js')
try {
let emojis = await lib.utils.kv['@0.1.16'].get({key: `emojis`, defaultValue: {moderator: null, user: null, reason: null, channel: null, error: null, timeout: null, clock: null}});
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': guild_id}]});
if (!base?.rows?.length) base = await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': guild_id}]});
let cNum = (await lib.airtable.query['@1.0.0'].max({table: `Cases`, where: [{'Guild__is': guild_id}], field: `Case`})).max.max + 1
let isAdmin = false, reason = event.content.split(' ').slice(1).join(' ') || `No reason provided`
let guildInfo = await lib.discord.guilds['@0.2.4'].retrieve({guild_id});
if (guildInfo.owner_id == author.id) isAdmin = true
if (member.roles.includes(base.rows[0].fields.Moderator)) isAdmin = true
if (guildInfo.roles.filter(role => (role.permissions & (1 << 3)) === 1 << 3 && member.roles.includes(role.id))?.length) isAdmin = true
if (!isAdmin)
  return lib.discord.channels['@release'].messages.create({channel_id, content: `<:error:${emojis.error}> | You don't have permission to use this command`});

let channel = await lib.discord.channels['@release'].retrieve({channel_id});
let coNum
for (let i = 0; i < channel.permission_overwrites.length; i++) {
  if (channel.permission_overwrites[i].id == guild_id) {coNum = i; break;}
}
let chCheck = await lib.airtable.query['@1.0.0'].select({table: `Locked`, where: [{'Channel__is': channel_id}]});
if (chCheck.rows[0]) {
  let perms = channel.permission_overwrites.concat([{
    id: guild_id, type: 0, 
    allow: chCheck.rows[0].fields.Allow,
    deny: chCheck.rows[0].fields.Deny,
  }])
  await lib.discord.channels['@0.3.0'].update({channel_id,
    name: chCheck.rows[0].fields.Name,
    topic: chCheck.rows[0].fields.Topic,
    permission_overwrites: perms
  });
  await lib.airtable.query['@1.0.0'].delete({
    table: `Locked`,
    where: [{'Channel__is': channel_id}],
  });
  await lib.discord.channels['@release'].messages.create({channel_id, content: `This channel has been unlocked for ${reason}`});
  if (base.rows[0].fields.Logging) {
    await lib.discord.channels['@release'].messages.create({
      channel_id: base.rows[0].fields.Logging,
      content: ``,
      embeds: [{
        type: 'rich',
        color: 0x41CF3C,
        description: `
  <:channel:${emojis.channel}> | <#${channel_id}>
  <:moderator:${emojis.moderator}> | <@${author.id}> | ${author.username}#${author.discriminator}
  <:reason:${emojis.reason}> | ${reason}`,
        footer: {text: `Case Number: ${cNum}`},
        author: {name: `${cNum} | Unlock`},
        timestamp: new Date().toISOString(),
      }],
    });
  }
  await lib.airtable.query['@1.0.0'].insert({table: `Cases`,
    fieldsets: [{
      Channel: channel_id,
      Reason: reason,
      Type: `Unlock`,
      Moderator: author.id,
      Timestamp: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
      Case: cNum,
      Guild: guild_id
    }],
  });
} else {
  let perms = channel.permission_overwrites.concat([{
    id: context.params.event.guild_id, type: 0, 
    allow: channel?.permission_overwrites[coNum]?.allow || 0, 
    deny: parseInt(channel?.permission_overwrites[coNum]?.deny || 0) + 377957124096
  }])
  await lib.discord.channels['@0.3.0'].update({
    channel_id: channel_id,
    name: `🔒 ${channel.name}`,
    topic: `🔒 Locked | ${channel.topic}`,
    permission_overwrites: perms
  });
  await lib.airtable.query['@1.0.0'].insert({table: `Locked`,
    fieldsets: [{
      Channel: channel.id,
      Name: channel.name,
      Topic: channel.topic,
      Allow: channel?.permission_overwrites[coNum]?.allow || `0`,
      Deny: channel?.permission_overwrites[coNum]?.deny || `0`,
    }],
  });
  await lib.discord.channels['@release'].messages.create({channel_id, content: `This channel has been locked for ${reason}`});
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
        author: {name: `${cNum} | Lock`},
        timestamp: new Date().toISOString(),
      }],
    });
  }
  await lib.airtable.query['@1.0.0'].insert({table: `Cases`,
    fieldsets: [{
      Channel: channel_id,
      Reason: reason,
      Type: `Lock`,
      Moderator: author.id,
      Timestamp: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
      Case: cNum,
      Guild: guild_id,
    }],
  });
}
} catch (e) {
  await error.prefix(channel_id, e.message)
}