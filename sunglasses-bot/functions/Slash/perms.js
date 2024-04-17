const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.interactions['@release'].responses.create({token: context.params.event.token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
let user_id
if (!context.params.event.data.options.length) {user_id = context.params.event.member.user.id}
else {user_id = context.params.event.data.options[0].value}

let user = await lib.discord.guilds['@0.2.3'].members.retrieve({user_id, guild_id: context.params.event.guild_id});
let roles = await lib.discord.guilds['@0.1.0'].roles.list({guild_id: context.params.event.guild_id})
  .then((roles) => roles.filter((x) => user.roles.includes(x.id)));
let permissions = [];

for (let i = 0; i < roles.length; i++) {
  let role = i
  for (let i = 0; i < roles[role]?.permission_names.length; i++) {
    if (!permissions.includes(roles[role]?.permission_names[i])) permissions.push(roles[role]?.permission_names[i])
  }
}
await lib.discord.interactions['@release'].followups.create({
  token: context.params.event.token,
  content: ``,
  embeds: [{
    description: permissions.map((x) => `• \`${x}\`\n`).join(''),
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `${user.user.username}'s permissions`},
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});