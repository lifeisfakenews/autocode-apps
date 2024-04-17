const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let event = context.params.event;
let user_id = event.mentions[0]?.id || event.author.id
let user = await lib.discord.users['@release'].retrieve({user_id});
let cases = await lib.airtable.query['@1.0.0'].select({
  table: `Cases`,
  where: [{
    'Guild__is': event.guild_id,
    'User__is': user_id,
    'Type__is': `Warning`
  }],
});
if (!cases?.rows?.length) {
  return lib.discord.channels['@release'].messages.create({
    channel_id: event.channel_id,
    content: `No warnings found for **${user.username}**`,
  });
}
let content = cases.rows.map((x) => `**__Case ${x.fields.Case}__**\n📝 | ${x.fields.Reason}\n⚒ | <@${x.fields.Moderator}>\n⏰ | ${x.fields.Timestamp}`)
await lib.discord.channels['@release'].messages.create({
  channel_id: event.channel_id,
  content: ``,
  embeds: [{
    type: 'rich',
    description: `• **Total Warnings:** ${cases.rows.length}`,
    color: 0x00FFFFF,
    timestamp: new Date().toISOString(),
    fields: [
      {name: `\u200B`, value: content.slice(0, Math.min(Math.floor(content.length/2), 5)).join('\n') || `\u200B`, inline: true}, 
      {name: `\u200B`, value: content.slice(Math.min(Math.floor(content.length/2), 5), Math.min(Math.floor(content.length), 10)).join('\n') || `\u200B`, inline: true}
    ],
    author: {name: `${user.username}#${user.discriminator}'s Warnings`, icon_url: user.avatar_url},
    footer: {text: `${event.author.username}#${event.author.discriminator}`, icon_url: event.author.avatar ? `https://cdn.discordapp.com/avatars/${event.author.id}/${event.author.avatar}.${event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }],
});