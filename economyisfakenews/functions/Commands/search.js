const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const cooldown = require('../../helpers/cooldown.js');
let duration = 600 * 1000
let userCd = await lib.googlesheets.query['@0.3.0'].select({
  range: `CD!A:G`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.author.id}],
});
if (userCd?.rows[0]?.fields?.Search && new Date().getTime() < parseInt(userCd?.rows[0]?.fields?.Search)) {
  let time = await cooldown.convert(parseInt(userCd.rows[0].fields.Search))
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ``,
    embeds: [{
      type: 'rich',
      author: {name: `Slow Down!`},
      description: `You must wait for \`${time.formatted}\` to use this command again!\nYou can search again ${time.relative}`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
} else {
  let places = ['Discord', 'Ebay', 'Garden', 'Street', 'Bin', 'Rubbish', 'Sofa', 'Bed', 'Cinema', 'Yard', 'Google', 'Space']

  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ``,
    embeds: [{
      type: 'rich',
      author: {name: `Search`},
      description: `Where would you like to search for money?`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }],
    components: [{
      type: 1,
      components: [
        {type: 2, style: 2, label: places[Math.floor(Math.random() * places.length)], custom_id: `search-1`},
        {type: 2, style: 2, label: places[Math.floor(Math.random() * places.length)], custom_id: `search-2`},
        {type: 2, style: 2, label: places[Math.floor(Math.random() * places.length)], custom_id: `search-3`}
      ]
    }]
  });
}