const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const cooldown = require('../../helpers/cooldown.js');
let duration = 86400 * 1000
let userCd = await lib.googlesheets.query['@0.3.0'].select({
  range: `CD!A:G`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.author.id}],
});
if (userCd?.rows[0]?.fields?.Daily && new Date().getTime() < parseInt(userCd?.rows[0]?.fields?.Daily)) {
  let time = await cooldown.convert(parseInt(userCd.rows[0].fields.Daily))
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ``,
    embeds: [{
      type: 'rich',
      author: {name: `Slow Down!`},
      description: `You must wait for \`${time.formatted}\` to use this command again!\nYou can claim your next daily ${time.relative}`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
} else {
  let amount = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
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
        'Cash': 0
      }]
    });
  }
  await lib.googlesheets.query['@0.3.0'].update({
    range: `Users!A:K`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': context.params.event.author.id}],
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
        'User': context.params.event.author.id,
        'Daily': new Date().setTime(d)
      }]
    });
  } else {
    await lib.googlesheets.query['@0.3.0'].update({
      range: `CD!A:G`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [{'User__is': context.params.event.author.id}],
      fields: {
        'Daily': new Date().setTime(d)
      }
    });
  }
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ``,
    embeds: [{
      type: 'rich',
      author: {name: `Daily Claimed`},
      description: `You have been given ⏣ ${amount}\nYou can claim your next daily <t:${Math.floor(new Date().setTime(currentTime + duration) / 1000)}:R>`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
}