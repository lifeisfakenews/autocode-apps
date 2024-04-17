const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const {Tools} = require('autocode-discordjs');
const DISCORD_EPOCH = 1420070400000;
let userId = context.params.event.mentions[0]?.id || context.params.event.author.id
let trigger = await lib.discord.users['@release'].retrieve({user_id: context.params.event.author.id});
let member = await lib.discord.guilds['@release'].members.retrieve({user_id: userId, guild_id: context.params.event.guild_id});
function convertSnowflakeToDate(snowflake) {return new Date(snowflake / 4194304 + DISCORD_EPOCH);}
let created = convertSnowflakeToDate(member.user.id)
await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: "rich",
    description: `
• **Username:** ${member.user.username}#${member.user.discriminator}
• **ID:** ${member.user.id}
• **Account Created:** <t:${Math.floor(created.getTime() / 1000)}:R>
• **Joined Server:** <t:${Math.round((new Date(member.joined_at)).getTime() / 1000)}:R>
• **IsBot:** ${member.user.bot ? 'Yes' : 'No'}
• **IsSystem:** ${member.user.system ? 'Yes' : 'No'}
• **Nickname**: ${member.nick ? member.nick : 'None'}`,
    thumbnail: {url: member.user.avatar_url},
    fields: [
      {name: 'Roles', value: member.roles.length ? member.roles.map((x) => `<@&${x}>`).join(' ') : 'No Roles'},
      {name: 'Badges', value: member.user.public_flags ? Tools.getUserBadges(member.user.public_flags).map((x) => `\`${x}\``).join(' | ') : 'No Badges'}
    ],
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `User Info`},
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});