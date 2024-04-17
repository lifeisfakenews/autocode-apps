const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let me = await lib.discord.users['@release'].me.list();
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': context.params.event.guild_id}]});
if (!base?.rows?.length) base = await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': context.params.event.guild_id}]});
let config = base.rows[0].fields
await lib.discord.interactions['@release'].responses.create({
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  token: context.params.event.token,
  embeds: [{
    type: "rich",
    description: `**Auto-moderation**
• **Anti-Profanity** - ${config.Profanity == `true` ? `<:yes:934410264424632330>` : `<:no:934410297081462804>`}
• **Anti-Links** - ${config.Links == `true` ? `<:yes:934410264424632330>` : `<:no:934410297081462804>`}
• **Anti-Invites** - ${config.Invites == `true` ? `<:yes:934410264424632330>` : `<:no:934410297081462804>`}
• **Anti-Caps** - ${config.Caps == `true` ? `<:yes:934410264424632330>` : `<:no:934410297081462804>`}
• **Anti-Token grabbers** - ${config.Scams == `true` ? `<:yes:934410264424632330>` : `<:no:934410297081462804>`}
• **Anti-Mass-mentions** - ${config.Mentions == `true` ? `<:yes:934410264424632330>` : `<:no:934410297081462804>`}
• **Anti-@everyone** - ${config.Everyone == `true` ? `<:yes:934410264424632330>` : `<:no:934410297081462804>`}\n
**Moderator Role**\n${config.Moderator ? `<@&${config.Moderator}>` : `No moderator role has been set`}
**Logging Channel**\n${config.Logging ? `<#${config.Logging}>` : `No logging channel has been set`}
**Report Channel**\n${config.Reports ? `<#${config.Reports}>` : `No report channel has been set`}
**Verification**\n${config.Verify ? `<#${config.Verify}>` : `No verification channel has been set`}`,
    color: 0x00FFFF,
    timestamp: new Date().toISOString(),
    author: {name: `Server Setup`, icon_url: me.avatar_url},
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'},
  }]
});