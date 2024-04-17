const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let roleList = await lib.discord.guilds['@release'].roles.list({guild_id: context.params.event.guild_id});
let trigger = await lib.discord.users['@release'].retrieve({user_id: context.params.event.author.id});
let roleInfo
for (let i = 0; i < roleList.length; i++) {
  if (roleList[i].id === context.params.event.mention_roles[0]) {role = roleList[i]}
}
await lib.discord.channels['@release'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: ``,
  embeds: [{
    type: 'rich',
    title: ` `,
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
    footer: {text: `Requested by ${trigger.username}#${trigger.discriminator}`, icon_url: trigger.avatar_url},
    author: {name: `Role Info`, icon_url: role.icon},
  }]
});