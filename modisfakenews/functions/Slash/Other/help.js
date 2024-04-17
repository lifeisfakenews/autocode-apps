const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let me = await lib.discord.users['@release'].me.list();
await lib.discord.interactions['@release'].responses.create({
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  token: context.params.event.token,
  content: "",
  components: [
    {type: 1, components: [
      {style: 1, label: `Other`, custom_id: `help-other`, type: 2},
      {style: 2, label: `Moderation`, custom_id: `help-mod`, type: 2},
      {style: 2, label: `Setup`, custom_id: `help-setup`, type: 2},
      ]},
    {type: 1, components: [
      {style: 5, label: `Invite`, url: `https://discord.com/oauth2/authorize?client_id=${me.id}&permissions=292492405838&scope=bot%20applications.commands`, type: 2},
      {style: 5, label: `Support`, url: process.env.SUPPORT_SERVER, type: 2}
    ]}
  ],
  embeds: [{
    type: "rich",
    description: `These commands can be run by anyone:\n
**/help** - View this list of commands
**/support** - Get my invite link and support server
**/case [case NO]** - View the details about a previous case
**/actions {@user}** - View moderation actions against a user
**/mod-actions {@user}** - View the moderation actions made by a user
**/warns {@user}** - View how many warns a user has
**/user-info {@user}** - View info about a user
**/server-info** - View info about this server
**/role-info [@role]** - View info about a role`,
    color: 0x00FFFF,
    timestamp: new Date().toISOString(),
    author: {name: `Help Menu`, icon_url: me.avatar_url},
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
}); 