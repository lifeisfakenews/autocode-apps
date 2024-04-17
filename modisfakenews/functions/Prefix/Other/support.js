const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let me = await lib.discord.users['@release'].me.list();
let user = await lib.discord.users['@release'].retrieve({user_id: context.params.event.author.id});
await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: "rich",
    title: ``,
    description: ``,
    color: 0x00FFFF,
    fields: [
      {name: `Add ${me.username} to your server`, value: `[Invite ${me.username}](https://discord.com/oauth2/authorize?client_id=${me.id}&permissions=292492405838&scope=bot%20applications.commands)`},
      {name: `Report bugs, get help & suggest features`, value: `[Join the Support Server](${process.env.SUPPORT_SERVER})`},
    ],
    author: {name: `My Links`, icon_url: me.avatar_url},
    footer: {text: `Requested By: ${user.username}#${user.discriminator}`, icon_url: user.avatar_url},
  }],
});