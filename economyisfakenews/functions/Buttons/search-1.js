const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const cooldown = require('../../helpers/cooldown.js');
await lib.discord.interactions['@1.0.1'].responses.create({
  token: context.params.event.token,
  response_type: 'DEFERRED_UPDATE_MESSAGE'
});
let duration = 600 * 1000
let userCd = await lib.googlesheets.query['@0.3.0'].select({
  range: `CD!A:G`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.member.user.id}],
});
if (userCd?.rows[0]?.fields?.Search && new Date().getTime() < parseInt(userCd?.rows[0]?.fields?.Search)) {
  let time = await cooldown.convert(parseInt(userCd.rows[0].fields.Search))
  await lib.discord.interactions['@1.0.1'].followups.update({
    token: context.params.event.token,
    message_id: context.params.event.message.id,
    content: ``,
    embeds: [{
      type: 'rich',
      author: {name: `Slow Down!`},
      description: `You must wait for \`${time.formatted}\` to use this command again!\nYou can search again ${time.relative}`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
} else {
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

  let amount = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
  await lib.googlesheets.query['@0.3.0'].update({
    range: `Users!A:K`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': context.params.event.member.user.id}],
    fields: {
      'Cash': parseInt(bal.rows[0].fields.Cash) + amount
    }
  });
  let currentTime = new Date().getTime()
  const d = new Date().setTime(currentTime + duration);
  if (!userCd?.rows?.length) {
    await lib.googlesheets.query['@0.3.0'].insert({
      range: `CD!A:G`,
      fieldsets: [{
        'User': context.params.event.member.user.id,
        'Search': new Date().setTime(d)
      }]
    });
  } else {
    await lib.googlesheets.query['@0.3.0'].update({
      range: `CD!A:G`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [{'User__is': context.params.event.member.user.id}],
      fields: {
        'Search': new Date().setTime(d)
      }
    });
  }
  await lib.discord.interactions['@1.0.1'].followups.update({
    token: context.params.event.token,
    message_id: context.params.event.message.id,
    content: ``,
    embeds: [{
      type: 'rich',
      author: {name: `Search`},
      description: `You ${message[context.params.event.message.components[0].components[0].label]} ⏣ ${amount}\nYou can search more <t:${Math.floor(new Date().setTime(currentTime + duration) / 1000)}:R>`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }],
  });
}