const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let me = await lib.discord.users['@release'].me.list();
await lib.discord.interactions['@release'].responses.create({
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  token: context.params.event.token,
  embeds: [{
    type: "rich",
    description: ``,
    color: 0x00FFFF,
    fields: [
      {name: `Add ${me.username} to your server`, value: `[Invite ${me.username}](https://discord.com/oauth2/authorize?client_id=${me.id}&permissions=292492405838&scope=bot%20applications.commands)`},
      {name: `Report bugs, get help & suggest features`, value: `[Join the Support Server](${process.env.SUPPORT_SERVER})`},
    ],
    author: {name: `My Links`, icon_url: me.avatar_url},
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'},
  }],
});