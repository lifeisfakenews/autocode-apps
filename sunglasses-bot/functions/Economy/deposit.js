const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let amount = context.params.event.content.split(' ')[1]

if (isNaN(amount) && amount != `all`)
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `Please provide a valid amount of coins to deposit!\nE.G. \`?despoit 200\``
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
if (amount == `all`) {
  amount = parseInt(bal.rows[0].fields.Cash)
} else {
  amount = parseInt(amount)
}
if (amount > parseInt(bal.rows[0].fields.Cash))
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `You don't have enough cash to do that`
  });

await lib.googlesheets.query['@0.3.0'].update({
  range: `UserData!A:Z`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.author.id}],
  fields: {
    'Cash': parseInt(bal.rows[0].fields.Cash) - amount,
    'Bank': parseInt(bal.rows[0].fields.Bank || 0) + amount
  }
});
await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `You deposited ⏣ ${amount}`,
});