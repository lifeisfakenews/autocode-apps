const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const items = await lib.googlesheets.query['@0.3.0'].select({
  range: `Shop!A:D`,
  bounds: 'FIRST_EMPTY_ROW',
});

let shop = items.rows.map((i) => `**${i.fields.Name}** - ${i.fields.Desc}\n\`${i.fields.ID}\` ⏣ ${i.fields.Cost}`)
await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: "rich",
    author: {name: `Shop`},
    description: `
${shop.join('\n')}

To buy something use \`j!buy {item}\``,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});