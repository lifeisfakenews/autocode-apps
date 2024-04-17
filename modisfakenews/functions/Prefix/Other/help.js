const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let me = await lib.discord.users['@0.2.0'].me.list();
let user = await lib.discord.users['@0.2.0'].retrieve({user_id: context.params.event.author.id});
await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
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
      title: "",
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
      author: {name: `Help Menu`, icon_url: me.avatar_url},
      footer: {text: `Requested By: ${user.username}#${user.discriminator}`, icon_url: user.avatar_url},
    }]
});