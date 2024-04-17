const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.interactions['@release'].responses.create({token: context.params.event.token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
let role = await lib.discord.guilds['@release'].roles.list({guild_id: context.params.event.guild_id});
role = role.filter((x) => x.id == context.params.event.data.options[0].value)
await lib.discord.interactions['@release'].followups.create({
  token: context.params.event.token,
  content: ``,
  embeds: [{
    type: 'rich',
    description: `
• **ID:** ${role[0].id} || <@&${role[0].id}>
• **Position:** ${role[0].position}
• **Color:** ${role[0].color}
• **Display Seperate:** ${role[0].hoist ? `Yes` : `No`}
• **Bot Role:** ${role[0].managed ? `Yes` : `No`}
• **Mentionable:** ${role[0].mentionable ? `Yes` : `No`}
• **Permissions:** ${role[0].permissions}`,
    color: role[0].color,
    timestamp: new Date().toISOString(),
    fields: [{name: `Permission Names`, value: `${role[0].permission_names}`}],
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'},
    author: {name: `Role Info`, icon_url: role[0].icon},
  }]
});