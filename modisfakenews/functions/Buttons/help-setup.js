const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let me = await lib.discord.users['@release'].me.list();
await lib.discord.channels['@release'].messages.update({
  message_id: context.params.event.message.id,
  channel_id: context.params.event.channel_id,
  content: "",
  components: [{
    type: 1, components: [
      {style: 2, label: `Other`, custom_id: `help-other`, type: 2},
      {style: 2, label: `Moderation`, custom_id: `help-mod`, type: 2},
      {style: 1, label: `Setup`, custom_id: `help-setup`, type: 2},
    ]
  }, {
    type: 1, components: [
      {style: 5, label: `Invite`, url: `https://discord.com/oauth2/authorize?client_id=${me.id}&permissions=292492405838&scope=bot%20applications.commands`, type: 2},
      {style: 5, label: `Support`, url: process.env.SUPPORT_SERVER, type: 2}
    ]
  }],
  embeds: [{
    type: "rich",
    title: "",
    description: `These commands can only be run by the server owner or an administrator\n
**/setup appeals [link]** - Set the appeal URL for this server
**/setup logging [#channel]** - Set the logging channel for this server
**/setup reports [#channel]** - Set the reports channel for this server
**/setup moderator [@role]** - Set the moderator role for this server
**/setup automod [automod] [true/false/int]** - Configure automod for this server
**/setup verification [button/captcha/none] {#channel} {@role}** - Configure the verification for this server`,
    color: 0x00FFFF,
    timestamp: new Date().toISOString(),
    author: {name: `Help Menu`, icon_url: me.avatar_url},
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'},
  }]
});