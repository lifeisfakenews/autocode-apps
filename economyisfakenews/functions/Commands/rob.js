const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const cooldown = require('../../helpers/cooldown.js');
let duration = 1800 * 1000
let userCd = await lib.googlesheets.query['@0.3.0'].select({
  range: `CD!A:G`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.author.id}],
});
if (userCd?.rows[0]?.fields?.Rob && new Date().getTime() < parseInt(userCd?.rows[0]?.fields?.Rob)) {
  let time = await cooldown.convert(parseInt(userCd.rows[0].fields.Rob))
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ``,
    embeds: [{
      type: 'rich',
      author: {name: `Slow Down!`},
      description: `You must wait for \`${time.formatted}\` to use this command again!\nYou can rob someone again ${time.relative}`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
} else {
  let user = context.params.event.mentions[0]

  if (!user)
    return lib.discord.channels['@0.2.0'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `You must mention auser to rob!\nE.G. \`j!rob @user\``
    });

  let tarCd = await lib.googlesheets.query['@0.3.0'].select({
    range: `CD!A:G`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': user.id}],
  });
  if (tarCd?.rows[0]?.fields?.Robbed && new Date().getTime() < parseInt(tarCd?.rows[0]?.fields?.Robbed)) {
    let time = await cooldown.convert(parseInt(tarCd.rows[0].fields.Robbed))
    return lib.discord.channels['@0.2.0'].messages.create({
      channel_id: context.params.event.channel_id,
      content: ``,
      embeds: [{
        type: 'rich',
        author: {name: `Slow Down!`},
        description: `**${user.username}** has been robbed recently. You must wait \`${time.formatted}\` to rob them again!\nYou can rob them again ${time.relative}`,
        color: parseInt(process.env.COLOR),
        timestamp: new Date().toISOString(),
        footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
      }]
    });
  }

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

  let currentTime = new Date().getTime()
  const d = new Date().setTime(currentTime + duration);
  const d2 = new Date().setTime(currentTime + (21600 * 1000));

  if (tBal.rows[0].fields.Padlock == `TRUE` || tBal.rows[0].fields.Padlock == `PERM`) {
    await lib.googlesheets.query['@0.3.0'].update({
      range: `Users!A:K`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [{'User__is': user.id}],
      fields: {
        'Padlock': tBal.rows[0].fields.Padlock == `PERM` ? `PERM` : false,
      }
    });
    if (!tarCd?.rows?.length) {
      await lib.googlesheets.query['@0.3.0'].insert({
        range: `CD!A:G`,
        fieldsets: [{
          'User': user.id,
          'Robbed': new Date().setTime(d2)
        }]
      });
    } else {
      await lib.googlesheets.query['@0.3.0'].update({
        range: `CD!A:G`,
        bounds: 'FIRST_EMPTY_ROW',
        where: [{'User__is': user.id}],
        fields: {
          'Robbed': new Date().setTime(d2)
        }
      });
    }
    return lib.discord.channels['@0.2.0'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `It turns out <@${user.id}> had a padlock on thier wallet!\nYou couldnt steal any money`
    });
  }

  let amount = Math.floor(Math.random() * ((tBal.rows[0].fields.Cash / 10) + 1));
  await lib.googlesheets.query['@0.3.0'].update({
    range: `Users!A:K`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': context.params.event.author.id}],
    fields: {
      'Cash': parseInt(bal.rows[0].fields.Cash) + amount,
    }
  });
  await lib.googlesheets.query['@0.3.0'].update({
    range: `Users!A:K`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': user.id}],
    fields: {
      'Cash': parseInt(tBal.rows[0].fields.Cash) - amount,
    }
  });
  if (!userCd?.rows?.length) {
    await lib.googlesheets.query['@0.3.0'].insert({
      range: `CD!A:G`,
      fieldsets: [{
        'User': context.params.event.author.id,
        'Rob': new Date().setTime(d)
      }]
    });
  } else {
    await lib.googlesheets.query['@0.3.0'].update({
      range: `CD!A:G`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [{'User__is': context.params.event.author.id}],
      fields: {
        'Rob': new Date().setTime(d)
      }
    });
  }
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ``,
    embeds: [{
      type: 'rich',
      author: {name: `Robbing`},
      description: `You stole ⏣ ${amount} from **${user.username}#${user.discriminator}**\nYou can rob someone again <t:${Math.floor(new Date().setTime(currentTime + duration) / 1000)}:R>`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
}