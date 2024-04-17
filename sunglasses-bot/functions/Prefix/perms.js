const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let user_id 
if (!context.params.event.mentions.length) {user_id = context.params.event.author.id}
else {user_id = context.params.event.mentions[0].id}

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
await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    description: permissions.map((x) => `• \`${x}\`\n`).join(''),
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `${user.user.username}'s permissions`},
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});