const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let item = context.params.event.content.split(' ')[1]?.toLowerCase()
let items = await lib.googlesheets.query['@0.3.0'].select({
  range: `Shop!A:D`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'ID__is': item}]
});
let bal = await lib.googlesheets.query['@0.3.0'].select({
  range: `UserData!A:Z`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.author.id}],
});
if (!bal?.rows?.length) {
  bal = await lib.googlesheets.query['@0.3.0'].insert({
    range: `UserData!A:Z`,
    fieldsets: [{
      'User': context.params.event.author.id,
      'Cash': 0,
      'Bank': 0
    }]
  });
}

if (!items?.rows?.length)
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `That is not a valid item\nPlease use \`?shop\` to view all items`
  });
if (!bal?.rows[0]?.fields?.Inv?.includes(item))
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `That item is not in your inventory\nPlease use \`?inv\` to view your inv`
  });

try {
  await require(`../../items/${item}.js`)(context.params.event)
} catch (e) {
  if (e.message.includes('cannot find module')) {
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: context.params.event.channel_id,
      content: ``,
      embeds: [{
        type: 'rich',
        author: {name: `Item Used`},
        description: `You used 1x ${items.rows[0].fields.Name}\nTo claim your reward please contact an admin\nUse \`?inv\` to view your inventory`,
        color: parseInt(process.env.COLOR),
        timestamp: new Date().toISOString(),
        footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
      }]
    });
    let inv = bal.rows[0].fields.Inv.replace(`${item},`, ``)
    
    await lib.googlesheets.query['@0.3.0'].update({
      range: `UserData!A:Z`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [{'User__is': context.params.event.author.id}],
      fields: {
        'Inv': inv,
      }
    });
  } else {
    console.log(e.message);
  }
}