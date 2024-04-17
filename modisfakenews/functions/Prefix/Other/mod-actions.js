const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let event = context.params.event
let user_id = event.mentions[0]?.id || event.author.id
let user = await lib.discord.users['@release'].retrieve({user_id});
let cases = await lib.airtable.query['@1.0.0'].select({
  table: `Cases`,
  where: [{
    'Guild__is': event.guild_id,
    'Moderator__is': user_id
  }],
});
if (!cases.rows.length) {
  return lib.discord.channels['@release'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `No actions found for **${user.username}**`,
  });
}
let content = cases.rows.map((x) => `**__${x.fields.Case} | ${x.fields.Type}__**\n📝 | ${x.fields.Reason}\n${x.fields.User ? `👤 | <@${x.fields.User}>\n` : ``}${x.fields.Channel ? `📝 | <#${x.fields.Channel}>\n` : ``}⏰ | ${x.fields.Timestamp}`)
await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: 'rich',
    description: `• **Total Actions:** ${cases.rows.length}`,
    color: 0x00FFFF,
    timestamp: new Date().toISOString(),
    fields: [
      {name: `\u200B`, value: content.slice(0, Math.min(Math.floor(content.length/2), 5)).join('\n') || `\u200B`, inline: true}, 
      {name: `\u200B`, value: content.slice(Math.min(Math.floor(content.length/2), 5), Math.min(Math.floor(content.length), 10)).join('\n') || `\u200B`, inline: true}
    ],
    author: {name: `${user.username}#${user.discriminator}'s Actions`, icon_url: user.avatar_url},
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }],
});