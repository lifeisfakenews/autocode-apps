const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const cooldown = require('../../helpers/cooldown.js');

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
      'Cash': 0,
      'Bank': 0
    }]
  });
}
if (!bal.rows[0].fields.Job) {
  await lib.discord.channels['@release'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ``,
    components: [
      {type: 1, components: [
        {custom_id: `jobs`, placeholder: `Select a Job`, options: [
          {label: `Discord Mod`, value: `Discord Mod`},
          {label: `Reddit Mod`,  value: `Reddit Mod`},
          {label: `Teacher`, value: `Teacher`},
          {label: `Lawyer`, value: `Lawyer`},
          {label: `Doctor`, value: `Doctor`},
          {label: `Actor/Actress`, value: `Actor`},
          {label: `Tech Support`, value: `Tech Support`},
          {label: `YouTuber`, value: `YouTuber`},
          {label: `Vet`, value: `Vet`},
          {label: `Taxi Driver`, value: `Taxi Driver`},
          {label: `Bus Driver`, value: `Bus Driver`},
          {label: `Train Driver`, value: `Train Driver`},
          {label: `Civil Service Worker`, value: `Civil Service`},
          {label: `Engineer`, value: `Engineer`},
          {label: `Shop Keeper`, value: `Shop Keeper`},
          {label: `Designer`, value: `Designer`},
          {label: `Developer`, value: `Developer`},
          {label: `Janitor`, value: `Janitor`},
          {label: `Librarian`, value: `Librarian`},
          {label: `Carpenter`, value: `Carpenter`},
        ], min_values: 1, max_values: 1, type: 3}
      ]}
    ],
    embeds: [{
      type: "rich",
      author: {name: `Select a Job`},
      description: `In order to work, you must first get a job!\nPlease select one from the list below`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
} else {
  let duration = 3600 * 1000
  let userCd = await lib.googlesheets.query['@0.3.0'].select({
    range: `CD!A:G`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': context.params.event.author.id}],
  });
  if (userCd?.rows[0]?.fields?.Work && new Date().getTime() < parseInt(userCd?.rows[0]?.fields?.Work)) {
    let time = await cooldown.convert(parseInt(userCd.rows[0].fields.Work))
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: context.params.event.channel_id,
      content: ``,
      embeds: [{
        type: 'rich',
        author: {name: `Slow Down!`},
        description: `You must wait for \`${time.formatted}\` to use this command again!\nYou can work again ${time.relative}`,
        color: parseInt(process.env.COLOR),
        timestamp: new Date().toISOString(),
        footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
      }]
    });
  } else {
    let amount = Math.floor(Math.random() * (750 - 250 + 1)) + 250;
    await lib.googlesheets.query['@0.3.0'].update({
      range: `Users!A:L`,
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
          'Work': new Date().setTime(d)
        }]
      });
    } else {
      await lib.googlesheets.query['@0.3.0'].update({
        range: `CD!A:G`,
        bounds: 'FIRST_EMPTY_ROW',
        where: [{'User__is': context.params.event.author.id}],
        fields: {
          'Work': new Date().setTime(d)
        }
      });
    }
    await lib.discord.channels['@release'].messages.create({
      channel_id: context.params.event.channel_id,
      content: ``,
      embeds: [{
        type: "rich",
        author: {name: `Select a Job`},
        description: `You worked hard and earned ⏣ ${amount}\nYou can work more <t:${Math.floor(new Date().setTime(currentTime + duration) / 1000)}:R>`,
        color: parseInt(process.env.COLOR),
        timestamp: new Date().toISOString(),
        footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
      }]
    });
  }
}