const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let bals = await lib.googlesheets.query['@0.3.0'].select({
  range: `Users!A:K`,
  bounds: 'FIRST_EMPTY_ROW',
});
bals.rows.sort(function(a, b){return (b.fields.Cash + b.fields.Bank) - (a.fields.Cash + a.fields.Bank)});

let leaderboard = bals.rows.map((r, i) => `\`${i < 10 ? `0` : ``}${i}\` <@${r.fields.User}>\n**Cash** ⏣ ${r.fields.Cash}\n**Bank** ⏣ ${r.fields.Bank}\n`)

await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: 'rich',
    author: {name: `Leaderboard`},
    description: leaderboard.join(''),
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});