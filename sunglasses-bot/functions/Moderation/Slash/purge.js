const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, token, channel_id } = event;
await lib.discord.interactions['@release'].responses.create({token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
try {
let caseNum = await lib.googlesheets.query['@0.3.0'].count({range: `Mod!A:H`, bounds: 'FIRST_EMPTY_ROW'});

let msgs = await lib.discord.channels['@release'].messages.list({channel_id, limit: event.data.options[0].value, before: event.id});
await lib.discord.channels['@release'].messages.bulkDelete({channel_id, messages: msgs.map(x => x.id)});
await lib.discord.interactions['@release'].followups.create({token, 
  content: `Deleted \`${event.data.options[0].value}\` messages ${event.data.options[1]?.value ?  `for ${event.data.options[1]?.value}` : ``}`
});
await lib.discord.channels['@release'].messages.create({
  channel_id: process.env.LOGGING,
  content: ``,
  embeds: [{
    type: 'rich',
    color: parseInt(process.env.RED),
    description: `<:channel:962633902118281216> | <#${channel_id}>\n⚒ | <@${event.member.user.id}> | ${event.member.user.username}#${event.member.user.discriminator}\n📋 | \`${event.data.options[0].value}\`\n${event.data.options[1]?.value ?  `📝 | ${event.data.options[1]?.value}` : ``}`,
    footer: {text: `Case Number: ${caseNum.count + 1}`},
    author: {name: `${caseNum.count + 1} | Purge`},
    timestamp: new Date().toISOString(),
  }],
});
await lib.googlesheets.query['@0.3.0'].insert({
  range: `Mod!A:H`,
  fieldsets: [{
    Channel: channel_id,
    Reason: event.data.options[1]?.value || `None Provided`,
    Type: `Purge`,
    Moderator: event.member.user.id,
    Timestamp: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
    Case: caseNum.count + 1,
    Other: event.data.options[0].value
  }]
});
} catch (e) {
  console.error(e);
  await lib.discord.interactions['@release'].followups.ephemeral.create({token, 
    content: `An error occurred, please try again\n\`\`\`${e.message}\`\`\``
  });
}