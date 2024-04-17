const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.interactions['@release'].responses.create({token: context.params.event.token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
let event = context.params.event;
let user_id = event.data.target_id
let user = await lib.discord.users['@release'].retrieve({user_id});
let cases = await lib.airtable.query['@1.0.0'].select({
  table: `Cases`,
  where: [{
    'Guild__is': event.guild_id,
    'User__is': user_id
  }],
});
if (!cases.rows.length) {
  return lib.discord.interactions['@release'].followups.ephemeral.create({
    token: context.params.event.token,
    content: `No actions found for **${user.username}**`,
  });
}

let content = cases.rows.map((x) => `**__${x.fields.Case} | ${x.fields.Type}__**\n📝 | ${x.fields.Reason}\n⚒ | <@${x.fields.Moderator}>\n⏰ | ${x.fields.Timestamp}`)
await lib.discord.interactions['@release'].followups.create({
  token: context.params.event.token,
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
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }],
});