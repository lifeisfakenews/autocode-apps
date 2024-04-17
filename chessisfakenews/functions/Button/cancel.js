const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
if (context.params.event.message.embeds[0].description.includes(context.params.event.member.user.id)) {
  await lib.discord.interactions['@1.0.1'].responses.create({token: context.params.event.token, response_type: 'DEFERRED_UPDATE_MESSAGE'});
  await lib.discord.interactions['@1.0.1'].responses.update({
    token: context.params.event.token,
    content: context.params.event.message.content,
    components: [{
      type: 1,
      components: [
        {type: 2, style: 3, label: `Yes`, custom_id: `chess-start`, disabled: true},
        {type: 2, style: 4, label: `No`, custom_id: `chess-nostart`, disabled: true}
      ]
    }],
    embeds: context.params.event.message.embeds
  });
  await lib.discord.interactions['@0.1.0'].followups.create({
    token: context.params.event.token,
    content: `**${context.params.event.member.user.username}** cancelled the game`
  });
} else {
  await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: context.params.event.token,
    content: `Its not your game!`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
}