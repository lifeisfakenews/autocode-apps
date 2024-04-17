const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.interactions['@1.0.1'].responses.create({
  token: context.params.event.token,
  content: `The ticket will remain open`,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
});
await lib.discord.channels['@0.3.1'].messages.update({
  message_id: context.params.event.message.id,
  channel_id: context.params.event.message.channel_id,
  components: [{
    type: 1, components: [
      {style: 4, label: `🔒 Close`, custom_id: `ticket-close`, type: 2, disabled: true},
      {style: 3, label: `🔓 Keep Open`, custom_id: `ticket-keep`, type: 2, disabled: true},
    ]
  }]
});