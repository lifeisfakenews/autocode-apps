const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let me = await lib.discord.users['@release'].me.list();
await lib.discord.channels['@release'].messages.update({
  message_id: context.params.event.message.id,
  channel_id: context.params.event.channel_id,
  content: "",
  components: [{
    type: 1, components: [
      {style: 2, label: `Other`, custom_id: `help-other`, type: 2},
      {style: 1, label: `Moderation`, custom_id: `help-mod`, type: 2},
      {style: 2, label: `Setup`, custom_id: `help-setup`, type: 2},
    ]
  }, {
    type: 1, components: [
      {style: 5, label: `Invite`, url: `https://discord.com/oauth2/authorize?client_id=${me.id}&permissions=292492405838&scope=bot%20applications.commands`, type: 2},
      {style: 5, label: `Support`, url: process.env.SUPPORT_SERVER, type: 2}
    ]
  }],
  embeds: [{
    type: "rich",
    description: `These commands can only be run by the server owner, an administrator or people with the moderator role\n
**/ban [@user] {reason}** - ban a user from the server
**/kick [@user] {reason}** - kick a user from the server
**/soft-ban [@user] {reason}** - soft-ban a user, deleting thier messages
**/time-out [@user] [time] {reason}** - time-out a user so that can't speak
**/time-in [@user] {reason}** - remove the time-out from a user
**/unban [user ID] {reason}** - unban a user from the server
**/warn [@user] {reason}** - warn a user
**/clear-warns [@user] {reason}** - clear all users warnings
**/edit [case NO] [new reason]** - update the reason for a previous case
**/slowmode [time] {reason}** - set the slowmode in that channel
**/lock {reason}** - lock/unlock a channel to toggle members speaking
**/lockdown {reason}** - lock all channels in the current server
**/nuke {reason}** - clones the current channel to remove all messages
**/purge [1-100] {reason}** - delete up to 100 messages`,
    color: 0x00FFFF,
    timestamp: new Date().toISOString(),
    author: {name: `Help Menu`, icon_url: me.avatar_url},
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'},
  }]
});