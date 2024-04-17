const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let guild = await lib.discord.guilds['@0.1.0'].retrieve({guild_id: context.params.event.guild_id, with_counts: true});
let members = await lib.discord.guilds['@0.0.6'].members.list({guild_id: context.params.event.guild_id, limit: 1000});
let bots = members.filter((x) => x.user.bot);

await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: "rich",
    title: "",
    description: `🤖 **| Bots**- ${bots.length}\n👤 **| Humans** - ${guild.approximate_member_count - bots.length}\n🆙 **| Online** - ${guild.approximate_presence_count}`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `Member Count`},
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});