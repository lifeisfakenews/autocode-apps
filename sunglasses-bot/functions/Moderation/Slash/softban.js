const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, token, channel_id } = event;
await lib.discord.interactions['@release'].responses.create({token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
try {
let caseNum = await lib.googlesheets.query['@0.3.0'].count({range: `Mod!A:H`, bounds: 'FIRST_EMPTY_ROW'});
let target = await lib.discord.users['@release'].retrieve({user_id: event.data.options[0].value});

await lib.discord.guilds['@release'].bans.create({guild_id,
  user_id: target.id,
  delete_message_days: 7,
  reason: `Mod - ${event.member.user.username}#${event.member.user.discriminator}(${event.member.user.id}) ${event.data.options[1]?.value ?  `Reason - ${event.data.options[1]?.value}` : ``} (Soft Ban)`
});
await lib.discord.guilds['@release'].bans.destroy({guild_id, user_id: target.id});
await lib.discord.interactions['@release'].followups.create({token, 
  content: `**${target.username}** has been soft banned ${event.data.options[1]?.value ?  `for ${event.data.options[1]?.value}` : ``}`
});
await lib.discord.channels['@release'].messages.create({
  channel_id: process.env.LOGGING,
  content: ``,
  embeds: [{
    type: 'rich',
    color: parseInt(process.env.RED),
    description: `👤 | <@${target.id}> | ${target.username}#${target.discriminator}\n⚒ | <@${event.member.user.id}> | ${event.member.user.username}#${event.member.user.discriminator}\n${event.data.options[1]?.value ?  `📝 | ${event.data.options[1]?.value}` : ``}`,
    footer: {text: `Case Number: ${caseNum.count + 1}`},
    author: {name: `${caseNum.count + 1} | Soft Ban`, icon_url: target.avatar_url || 'https://bit.ly/3KPnEKt'},
    timestamp: new Date().toISOString(),
  }],
});
await lib.googlesheets.query['@0.3.0'].insert({
  range: `Mod!A:H`,
  fieldsets: [{
    User: target.id,
    Reason: event.data.options[1]?.value || `None Provided`,
    Type: `Soft Ban`,
    Moderator: event.member.user.id,
    Timestamp: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
    Case: caseNum.count + 1,
  }]
});
} catch (e) {
  console.error(e);
  await lib.discord.interactions['@release'].followups.ephemeral.create({token, 
    content: `An error occurred, please try again\n\`\`\`${e.message}\`\`\``
  });
}