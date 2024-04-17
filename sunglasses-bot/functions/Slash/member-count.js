const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let guild = await lib.discord.guilds['@0.1.0'].retrieve({guild_id: context.params.event.guild_id, with_counts: true});
let members = await lib.discord.guilds['@0.0.6'].members.list({guild_id: context.params.event.guild_id, limit: 1000});
let bots = members.filter((x) => x.user.bot);

await lib.discord.interactions['@release'].responses.create({
  token: context.params.event.token,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  content: ``,
  embeds: [{
    type: "rich",
    title: "",
    description: `🤖 **| Bots**- ${bots.length}\n👤 **| Humans** - ${guild.approximate_member_count - bots.length}\n🆙 **| Online** - ${guild.approximate_presence_count}`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `Member Count`},
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});