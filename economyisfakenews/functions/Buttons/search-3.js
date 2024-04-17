const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.interactions['@1.0.1'].responses.create({
  token: context.params.event.token,
  response_type: 'DEFERRED_UPDATE_MESSAGE'
});

let message = {
  'Discord': 'looked around Discord and found',
  'Ebay': 'searched around Ebay and got',
  'Garden': 'looked in your garden and discovered',
  'Street': 'searched around the street and found some loose change, amounting to',
  'Bin': 'looked inside the bin and sold some stuff to get',
  'Rubbish': 'searched around the rubbish pile and discovered',
  'Sofa': 'checked behind your sofa, and found some change you had lost, totaling',
  'Bed': 'dug around round under your bed and got',
  'Cinema': 'searched on the floor of the cinema and got',
  'Yard': 'searched around the yard and found',
  'Google': 'searched around Google HQ and found',
  'Space': 'floated around in space and found a couple of lost coins, amounting to',
}

let bal = await lib.googlesheets.query['@0.3.0'].select({
  range: `Users!A:K`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.member.user.id}],
});
if (!bal?.rows?.length) {
  bal = await lib.googlesheets.query['@0.3.0'].insert({
    range: `Users!A:K`,
    fieldsets: [{
      'User': context.params.event.member.user.id,
      'Cash': 0,
      'Bank': 0
    }]
  });
}

await lib.googlesheets.query['@0.3.0'].update({
  range: `Users!A:K`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.member.user.id}],
  fields: {
    'Cash': parseInt(bal.rows[0].fields.Cash) + amount
  }
});
console.log(context.params.event.message.components[0].components[0].label);
await lib.discord.interactions['@1.0.1'].followups.update({
  token: context.params.event.token,
  message_id: context.params.event.message.id,
  content: ``,
  embeds: [{
    type: 'rich',
    author: {name: `Search`},
    description: `You ${message[context.params.event.message.components[0].components[0].label]} ⏣ ${amount}`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }],
});