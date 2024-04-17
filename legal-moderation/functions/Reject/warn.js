const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (context.params.event.member.user.id == context.params.event.message.embeds[0].description.split('Warn:** <@')[1].split('>')[0]) {
  await lib.discord.interactions['@1.0.1'].responses.create({
    token: `${context.params.event.token}`,
    content: `<@${context.params.event.member.user.id}>, you did not consent to being warned by${context.params.event.message.embeds[0].description.split('**Requester:**')[1].split('|')[0]}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });

  await lib.discord.channels['@0.3.1'].messages.update({
    message_id: `${context.params.event.message.id}`,
    channel_id: `${context.params.event.message.channel_id}`,
      components: [{
        type: 1,
        components: [
          {type: 2, style: 3, disabled: true, label: `I Consent To Being Warned`, custom_id: `warn-consent`},
          {type: 2, style: 4, disabled: true, label: `I Do Not Consent To Being Warned`, custom_id: `warn-reject`}
        ]
      }],
  });
} else if (context.params.event.member.user.id == context.params.event.message.embeds[0].description.split('**Requester:** <@')[1].split('>')[0]) {
  await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `**${context.params.event.member.user.username}**, you can't reject your own warn request!`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
} else {
  await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `**${context.params.event.member.user.username}**, you can't reject someone else's warn!`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
}