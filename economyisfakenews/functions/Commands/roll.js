const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let bet = parseInt(context.params.event.content.split(' ')[1])
let guess = parseInt(context.params.event.content.split(' ')[2])
let amount = 0
if (!bet || isNaN(bet))
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `Please provide a valid amount of coins to bet!\nE.G. \`j!roll 50 4\``
  });
if (bet < 40)
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `You must bet more than ⏣ 40`
  });
if (guess > 6 || guess < 1 || !guess || isNaN(guess))
return lib.discord.channels['@0.2.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `Please provide a valid dice roll (1-6)!\nE.G. \`j!roll 50 4\``
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
      'Cash': 0
    }]
  });
}
if (bet > parseInt(bal.rows[0].fields.Cash))
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `You don't have enough cash to do that`
  });

let roll = Math.floor(Math.random() * 6) + 1
if (roll == guess) {
  amount = bet * 6
} else {
  amount = (bet * -1)
}
await lib.googlesheets.query['@0.3.0'].update({
  range: `Users!A:L`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.author.id}],
  fields: {
    'Cash': parseInt(bal.rows[0].fields.Cash) + amount
  }
});

await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: 'rich',
    author: {name: `Dice Roll`},
    description: `You guessed ${guess} and rolled the dice\nThe dice landed on ${roll} and you ${amount > 0 ? `won` : `lost`} ⏣ ${amount.toString().replace('-', '')}`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});