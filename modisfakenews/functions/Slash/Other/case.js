const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.interactions['@release'].responses.create({token: context.params.event.token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
let base = await lib.airtable.query['@1.0.0'].select({
  table: `Cases`,
  where: [{'Guild__is': context.params.event.guild_id, 'Case__is': context.params.event.data.options[0].value}],
}).rows[0].fields
let mod = await lib.discord.users['@0.2.0'].retrieve({user_id: base.Moderator});
let user
if (base.user) {
  user = await lib.discord.users['@0.2.0'].retrieve({user_id: base.User});
}

await lib.discord.interactions['@release'].followups.create({
  token: context.params.event.token,
  content: ``,
  embeds: [{
    type: "rich",
    title: ``,
    description: `
${base.User ? `• **User:** <@${user.id}> | ${user.username}#${user.discriminator}\n` : ``}${base.Channel ? `<#${base.Channel}>` : ``}
• **Type:** ${Case.Type}
• **Moderator:** <@${mod.id}> | ${mod.username}#${mod.discriminator}
• **Timestamp:** ${base.Timestamp}
• **Reason:** ${base.Reason}
• **Misc:** ${base.Other}`,
    color: 0x00FFFF,
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'},
    timestamp: new Date().toISOString(),
    author: {name: `Case Number ${base.Case}`},
  }]
});