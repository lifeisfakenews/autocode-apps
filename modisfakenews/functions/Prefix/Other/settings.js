const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let me = await lib.discord.users['@release'].me.list();
let user = await lib.discord.users['@release'].retrieve({user_id: context.params.event.author.id});
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': context.params.event.guild_id}]});
if (!base.rows[0]) await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': context.params.event.guild_id}]});
let config = base.rows[0].fields
await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: "rich",
    title: ` `,
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
    author: {name: `Server Setup`, icon_url: me.avatar_url},
    footer: {text: `Requested By: ${user.username}#${user.discriminator}`, icon_url: user.avatar_url},
  }]
});