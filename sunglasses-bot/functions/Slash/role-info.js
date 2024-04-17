const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.interactions['@release'].responses.create({token: context.params.event.token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
let roleList = await lib.discord.guilds['@release'].roles.list({guild_id: context.params.event.guild_id});
let trigger = await lib.discord.users['@release'].retrieve({user_id: context.params.event.member.user.id});
let roleInfo
for (let i = 0; i < roleList.length; i++) {
  if (roleList[i].id === context.params.event.data.options[0].value) {role = roleList[i]}
}
await lib.discord.interactions['@release'].followups.create({
  token: context.params.event.token,
  content: ``,
  embeds: [{
    type: 'rich',
    description: `
• **ID:** ${role.id} || <@&${role.id}>
• **Position:** ${role.position}
• **Color:** ${role.color}
• **Display Seperate:** ${role.hoist ? `Yes` : `No`}
• **Bot Role:** ${role.managed ? `Yes` : `No`}
• **Mentionable:** ${role.mentionable ? `Yes` : `No`}
• **Permissions:** ${role.permissions}`,
    color: role.color,
    fields: [{name: `Permission Names`, value: `${role.permission_names}`}],
    author: {name: `Role Info`},
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }],
});