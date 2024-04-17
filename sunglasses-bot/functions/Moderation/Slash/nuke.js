const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, token, channel_id } = event;
await lib.discord.interactions['@release'].responses.create({token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
try {
let caseNum = await lib.googlesheets.query['@0.3.0'].count({range: `Mod!A:H`, bounds: 'FIRST_EMPTY_ROW'});

let oldCh = await lib.discord.channels['@release'].retrieve({channel_id});
await lib.discord.channels['@release'].destroy({channel_id});
let newCh = await lib.discord.guilds['@release'].channels.create({
  guild_id: oldCh.guild_id,
  name: oldCh.name,
  type: oldCh.type,
  topic: oldCh.topic,
  user_limit: oldCh.user_limit,
  rate_limit_per_user: oldCh.rate_limit_per_user,
  position: oldCh.position,
  permission_overwrites: oldCh.permission_overwrites,
  parent_id: oldCh.parent_id,
});
await lib.discord.channels['@release'].messages.create({
  channel_id: newCh.id,
  content: `This channel has been nuked ${event.data.options?.length ?  `for ${event.data.options[0]?.value}` : ``}`
});
await lib.discord.channels['@release'].messages.create({
  channel_id: process.env.LOGGING,
  content: ``,
  embeds: [{
    type: 'rich',
    color: parseInt(process.env.RED),
    description: `<:channel:962633902118281216> | <#${newCh.id}>\n⚒ | <@${event.member.user.id}> | ${event.member.user.username}#${event.member.user.discriminator}\n${event.data.options?.length ?  `📝 | ${event.data.options[0]?.value}` : ``}`,
    footer: {text: `Case Number: ${caseNum.count + 1}`},
    author: {name: `${caseNum.count + 1} | Nuke`},
    timestamp: new Date().toISOString(),
  }],
});
await lib.googlesheets.query['@0.3.0'].insert({
  range: `Mod!A:H`,
  fieldsets: [{
    Channel: newCh.id,
    Reason: event.data.options?.length ?  event.data.options[0]?.value : `None Provided`,
    Type: `Nuke`,
    Moderator: event.member.user.id,
    Timestamp: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
    Case: caseNum.count + 1
  }]
});
} catch (e) {
  console.error(e);
  await lib.discord.interactions['@release'].followups.ephemeral.create({token, 
    content: `An error occurred, please try again\n\`\`\`${e.message}\`\`\``
  });
}