const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let channels = await lib.discord.guilds['@0.1.3'].channels.list({guild_id: context.params.event.guild_id});
let channel = channels.find(channel => channel.name.toLowerCase().includes(`📩｜`) && channel.id == context.params.event.channel_id)

if (channel?.length) {
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ``,
    components: [{
      type: 1, components: [
        {style: 4, label: `🔒 Close`, custom_id: `ticket-close`, type: 2},
        {style: 3, label: `🔓 Keep Open`, custom_id: `ticket-keep`, type: 2},
      ]
    }],
    embeds: [{
      type: "rich",
      description: `Are you sure you want to close this ticket?`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      author: {name: `Close Ticket?`},
      footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
}