const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let amount = parseInt(context.params.event.content.split(' ')[2])
let user = context.params.event.mentions[0]

if (isNaN(amount))
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `Please provide a valid amount of coins to deposit!\nE.G. \`j!give @user 200\``
  });
if (!user)
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `You must mention auser to give coins to!\nE.G. \`j!give @user 200\``
  });

let bal = await lib.googlesheets.query['@0.3.0'].select({
  range: `Users!A:K`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.author.id}],
});
if (!bal?.rows?.length) {
  bal = await lib.googlesheets.query['@0.3.0'].insert({
    range: `Users!A:K`,
    fieldsets: [{
      'User': context.params.event.author.id,
      'Cash': 0,
      'Bank': 0
    }]
  });
}
let tBal = await lib.googlesheets.query['@0.3.0'].select({
  range: `Users!A:K`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': user.id}],
});
if (!tBal?.rows?.length) {
  tBal = await lib.googlesheets.query['@0.3.0'].insert({
    range: `Users!A:K`,
    fieldsets: [{
      'User': user.id,
      'Cash': 0,
      'Bank': 0
    }]
  });
}
if (amount > parseInt(bal.rows[0].fields.Cash))
  return lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `You don't have enough cash to do that`
  });

await lib.googlesheets.query['@0.3.0'].update({
  range: `Users!A:K`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.author.id}],
  fields: {
    'Cash': parseInt(bal.rows[0].fields.Cash) - amount,
  }
});
await lib.googlesheets.query['@0.3.0'].update({
  range: `Users!A:K`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': user.id}],
  fields: {
    'Cash': parseInt(tBal.rows[0].fields.Cash) + amount,
  }
});
await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `You gave **${user.username}** ⏣ ${amount}`,
});