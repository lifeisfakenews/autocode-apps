const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
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
let items = await lib.googlesheets.query['@0.3.0'].select({
  range: `Shop!A:D`,
  bounds: 'FIRST_EMPTY_ROW',
});
if (!bal.rows[0].fields.Inv) {
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ``,
    embeds: [{
      type: 'rich',
      author: {name: `${user.username}#${user.discriminator}'s Inventory`},
      description: `${user == context.params.event.author ? `You have` : `${user.username}#${user.discriminator} has`} no items`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
}
let invList = bal.rows[0].fields.Inv.split(',')
let inv = []
for (let i = 0; i < invList.length; i++) {
  let check = inv.filter((item) => item.ID == invList[i])
  if (!check?.length) {
    let itemDetails = items.rows.filter((r) => r.fields.ID == invList[i])
    inv.push({
      ID: itemDetails[0].fields.ID,
      Name: itemDetails[0].fields.Name,
      Desc: itemDetails[0].fields.Desc,
      Count: 1
    })
  } else {
    check[0].Count += 1
  }
}
await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: 'rich',
    author: {name: `${user.username}#${user.discriminator}'s Inventory`},
    description: inv.map((i) => `\`${i.Count}x\` ${i.Name} (\`${i.ID}\`)\n${i.Desc}`).join('\n') + `\n\nUse an item with \`?use {item}\``,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});