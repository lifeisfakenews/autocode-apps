const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, token, channel_id } = event;
await lib.discord.interactions['@release'].responses.create({token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
try {
let caseNum = await lib.googlesheets.query['@0.3.0'].count({range: `Mod!A:H`, bounds: 'FIRST_EMPTY_ROW'});
let target = await lib.discord.users['@release'].retrieve({user_id: event.data.options[0].value});

let match = event.data.options[1].value.match(/(\d+)(s|m|h|d)/) 
if (!match) {
  throw new Error(`Please provide a duration in days(\`d\`), hours(\`h\`), minutes(\`m\`) or seconds(\`s\`)`);
}
let time = parseInt(match[1]), unit = match[2]
if (unit === 's') time *= 1
else if (unit === 'm') time *= 60
else if (unit === 'h') time *= 60 * 60
else if (unit === 'd') time *= 24 * 60 * 60
await lib.discord.guilds['@release'].members.timeout.update({guild_id,
  user_id: target.id,
  communication_disabled_until_seconds: time
});
await lib.discord.interactions['@release'].followups.create({token, 
  content: `**${target.username}** has been Timed Out for \`${event.data.options[1].value}\` ${event.data.options[2]?.value ?  `for ${event.data.options[2]?.value}` : ``}`
});
await lib.discord.channels['@release'].messages.create({
  channel_id: process.env.LOGGING,
  content: ``,
  embeds: [{
    type: 'rich',
    color: parseInt(process.env.RED),
    description: `👤 | <@${target.id}> | ${target.username}#${target.discriminator}\n⚒ | <@${event.member.user.id}> | ${event.member.user.username}#${event.member.user.discriminator}\n🕓 | \`${event.data.options[1].value}\`\n${event.data.options[2]?.value ?  `📝 | ${event.data.options[2]?.value}` : ``}`,
    footer: {text: `Case Number: ${caseNum.count + 1}`},
    author: {name: `${caseNum.count + 1} | Time Out`, icon_url: target.avatar_url || 'https://bit.ly/3KPnEKt'},
    timestamp: new Date().toISOString(),
  }],
});
await lib.googlesheets.query['@0.3.0'].insert({
  range: `Mod!A:H`,
  fieldsets: [{
    User: target.id,
    Reason: event.data.options[2]?.value || `None Provided`,
    Type: `Time Out`,
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