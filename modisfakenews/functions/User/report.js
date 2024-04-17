const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.interactions['@release'].responses.create({token: context.params.event.token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': context.params.event.guild_id}]});
let user = await lib.discord.users['@release'].retrieve({user_id: context.params.event.data.target_id});
let cases = await lib.airtable.query['@1.0.0'].select({
  table: `Cases`, 
  where: [{'Guild__is': context.params.event.guild_id, 'User__is': user.id}],
});
let trigger = await lib.discord.users['@release'].retrieve({user_id: context.params.event.member.user.id});
if (context.params.event.data.target_id == context.params.event.member.user.id) {
  await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
    token: context.params.event.token,
    content: `**${context.params.event.member.user.username}**, you can't report yourself!`
  });
} else if (base.rows[0].fields.Reports) {
  await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
    token: context.params.event.token,
    content: `**${user.username}** has been reported!`
  });
  await lib.discord.channels['@release'].messages.create({
    channel_id: base.rows[0].fields.Reports,
    content: ``,
    embeds: [{
      type: "rich",
      description: `
• **User:** <@${user.id}> | ${user.username}#${user.discriminator}
• **Bans:** ${cases.rows.filter(function countBans(row) {return row.fields.Type == `Ban`}).length}
• **Kicks:** ${cases.rows.filter(function countBans(row) {return row.fields.Type == `Kick`}).length}
• **Warns:** ${cases.rows.filter(function countBans(row) {return row.fields.Type == `Warning`}).length}
• **Time Outs:** ${cases.rows.filter(function countBans(row) {return row.fields.Type == `Time-out`}).length}`,
      color: 0x00FFFF,
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'},
      author: {name: `User Reported`, icon_url: user.avatar_url},
    }]
  });
} else {
  await lib.discord.interactions['@release'].followups.ephemeral.create({
    token: context.params.event.token,
    content: `Failed to report user: no reports channel set.`
  });
}