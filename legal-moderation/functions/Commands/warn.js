const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let user = await lib.discord.users['@0.2.1'].retrieve({user_id: context.params.event.data.options[0].value});

if (user.bot) {
  await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `**${context.params.event.member.user.username}**, you can't warn a bot as they are not able to consent!`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
} else if (user.id == context.params.event.member.user.id) {
  await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `**${context.params.event.member.user.username}**, you can't warn yourself!`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
}

await lib.discord.interactions['@1.0.1'].responses.create({
  token: `${context.params.event.token}`,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  content: `<@${user.id}>`,
  embeds: [{
    type: "rich",
    description: `**${user.username}**, **${context.params.event.member.user.username}** is requesting to warn you! Here are some details:\n
**Reason:** ${context.params.event.data.options[1]?.value || `None`}
**Requester:** <@${context.params.event.member.user.id}> | ${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}
**User to Warn:** <@${user.id}> | ${user.username}#${user.discriminator}`,
    color: parseInt(process.env.EMBED_COLOR),
    author: {name: `Wan Request`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/948131563810476032/moderator.png`},
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }],
  components: [{
    type: 1,
    components: [
      {type: 2, style: 3, label: `I Consent To Being Warned`, custom_id: `warn-consent`},
      {type: 2, style: 4, label: `I Do Not Consent To Being Warned`, custom_id: `warn-reject`}
    ]
  }],
});