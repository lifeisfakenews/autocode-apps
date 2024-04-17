const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let bet = parseInt(context.params.event.content.split(' ')[1])
let guess = context.params.event.content.split(' ')[2]
let amount = 0
if (!bet || isNaN(bet))
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `Please provide a valid amount of coins to bet!\nE.G. \`j!roulette 50 black\``
  });
if (bet < 40)
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `You must bet more than ⏣ 40`
  });
if (guess == `odd` || guess == `even` || guess == `red` || guess == `black` || (parseInt(guess) < 36 && parseInt(guess) >= 0)) {
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

  let roll = Math.floor(Math.random() * 35)
  let red = [9, 30, 7, 32, 5, 34, 3, 36, 1, 27, 25, 12, 19, 18, 21, 16, 23, 14]
  let black = [28, 26, 11, 20, 17, 22, 15, 24, 13, 10, 29, 8, 31, 6, 33, 4, 35, 2]
  if (roll == parseInt(guess)) {
    amount = (bet * 36)
  } else if (roll != 0){
    if (roll % 2 == 1 && guess == `odd`) {
      amount = (bet * 2)
    } else if (roll % 2 == 0 && guess == `even`) {
      amount = (bet * 2)
    } else if (red.includes(roll) && guess == `red`) {
      amount = (bet * 2)
    } else if (black.includes(roll) && guess == `black`) {
      amount = (bet * 2)
    } else {
      amount = (bet * -1)
    }
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
      author: {name: `Roulette`},
      description: `You guessed ${guess} and spun the wheel\nYou got ${roll} and ${amount > 0 ? `won` : `lost`} ⏣ ${amount.toString().replace('-', '')}`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
} else {
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `Please provide a valid bet2\n It must be either \`odd\`, \`even\`, \`red\`, \`black\` or \`0-35\`\nE.G. \`j!roulette 50 black\``
  });
}