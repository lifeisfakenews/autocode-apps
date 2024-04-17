const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let item = context.params.event.content.split(' ')[1]?.toLowerCase()
let items = await lib.googlesheets.query['@0.3.0'].select({
  range: `Shop!A:D`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'ID__is': item}]
});

if (!items?.rows?.length)
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `That is not a valid item\nPlease use \`j!shop\` to view all items`
  });

let bal = await lib.googlesheets.query['@0.3.0'].select({
  range: `Users!A:L`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.author.id}],
});
if (!bal?.rows?.length) {
  bal = await lib.googlesheets.query['@0.3.0'].insert({
    range: `Users!A:L`,
    fieldsets: [{
      'User': context.params.event.author.id,
      'Cash': 0,
      'Bank': 0,
      'Inv': []
    }]
  });
}
if (parseInt(items.rows[0].fields.Cost) > parseInt(bal.rows[0].fields.Cash))
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `You don't have enough cash to do that`
  });

let inv
if (bal.rows[0].fields.Inv) {
  inv = bal.rows[0].fields.Inv + `,` + items.rows[0].fields.ID
} else {
  inv = items.rows[0].fields.ID
}

await lib.googlesheets.query['@0.3.0'].update({
  range: `Users!A:K`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.author.id}],
  fields: {
    'Inv': inv,
    'Cash': parseInt(bal.rows[0].fields.Cash) - parseInt(items.rows[0].fields.Cost)
  }
});

await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: 'rich',
    author: {name: `Item Bought`},
    description: `You bought 1x ${items.rows[0].fields.Name} for ⏣ ${items.rows[0].fields.Cost}\nUse \`j!inv\` to view your inventory`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});