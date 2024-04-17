const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.interactions['@1.0.1'].responses.create({
  token: context.params.event.token,
  response_type: 'DEFERRED_UPDATE_MESSAGE'
});

let bal = await lib.googlesheets.query['@0.3.0'].update({
  range: `Users!A:L`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.member.user.id}],
  fields: {
    'Job': context.params.event.data.values[0]
  }
});
if (!bal?.rows?.length) {
  await lib.googlesheets.query['@0.3.0'].insert({
    range: `Users!A:L`,
    fieldsets: [{
      'User': context.params.event.member.user.id,
      'Cash': 0,
      'Job': context.params.event.data.values[0]
    }]
  });
}

await lib.discord.interactions['@1.0.1'].followups.update({
  token: context.params.event.token,
  message_id: context.params.event.message.id,
  content: ``,
  embeds: [{
    type: 'rich',
    author: {name: `New Job`},
    description: `You have been hired as a ${context.params.event.data.values[0]}!\nNow you can \`j!work\``,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }],
});