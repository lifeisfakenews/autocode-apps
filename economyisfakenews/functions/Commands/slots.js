const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let bet = parseInt(context.params.event.content.split(' ')[1])
let amount = 0
if (!bet || isNaN(bet))
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `Please provide a valid amount of coins to bet!\nE.G. \`j!slots 50\``
  });

if (bet < 40)
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `You must bet more than ⏣ 40`
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

let streak = parseInt(bal.rows[0].fields.Slots)
let streakAmount = 0
for (let i = 0; i < 3; i++) {
  if ((Math.floor(Math.random() * 5) + 3) == 7) {
    amount += bet
  }
}
if (amount == (bet * 3)) {
  amount += 500
}
if (amount > 0) {
  streak += 1
}
if (parseInt(bal.rows[0].fields.Slots) > 3) {
  streakAmount += (100 * (parseInt(bal.rows[0].fields.Slots) - 2))
}
if (amount == 0) {
  amount = (bet * -1)
  streak = 0
}
let total = amount > 0 ? amount + bet : amount
await lib.googlesheets.query['@0.3.0'].update({
  range: `Users!A:L`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.author.id}],
  fields: {
    'Cash': parseInt(bal.rows[0].fields.Cash) + total + streakAmount,
    'Slots': streak
  }
});

await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: 'rich',
    author: {name: `Slots`},
    description: `You played on the slots machine
It rolled ${amount < 0 ? `no sevens and you lost ⏣ ${bet}` : `${amount > (bet * 3) ? `3 sevens` : amount == bet ? `1 seven` : `2 sevens`} and you won **⏣ ${total}**
${streak < 3 ? `` : `Plus, you got **⏣ ${streakAmount}** for your \`${streak}x\` streak`}`}`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});