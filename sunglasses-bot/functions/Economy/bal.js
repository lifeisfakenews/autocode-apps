const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const comma = require('comma-number');
let user = context.params.event?.mentions[0] || context.params.event.author
let bal = await lib.googlesheets.query['@0.3.0'].select({
  range: `UserData!A:Z`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': user.id}],
});
if (!bal?.rows?.length) {
  bal = await lib.googlesheets.query['@0.3.0'].insert({
    range: `UserData!A:Z`,
    fieldsets: [{
      'User': user.id,
      'Cash': 0,
      'Bank': 0
    }]
  });
}
await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: 'rich',
    author: {name: `${user.username}#${user.discriminator}'s Balance`},
    description: `**Cash:** ⏣ ${comma(bal.rows[0].fields.Cash || 0)}\n**Bank:** ⏣ ${comma(bal.rows[0].fields.Bank || 0)}`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});