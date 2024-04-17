const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
function numToEmoji(num) {
  let numWord = num < 9 ? num.toString().replace('0', 'one').replace('1', 'two').replace('2', 'three').replace('3', 'four').replace('4', 'five').replace('5', 'six').replace('6', 'seven').replace('7', 'eight').replace('8', 'nine') : `bigBoi`
  let numEmoji = numWord
  .replace('one', '<:1_:948138006131380234>').replace('two', '<:2_:948138038268137542>').replace('three', '<:3_:948138038331060265>').replace('four', '<:4_:948138067867336714>').replace('five', '<:5_:948138067892535346>')
  .replace('six', '<:6_:948138100364824576>').replace('seven', '<:7_:948138100369018931>').replace('eight', '<:8_:948138119956410421>').replace('nine', '<:9_:948138142790201405>').replace('bigBoi', '<:arrow:957320927979405402>')
  return numEmoji
}
let data = await lib.googlesheets.query['@0.3.0'].select({
  range: `UserData!A:I`,
  bounds: 'FIRST_EMPTY_ROW',
});
data.rows.sort(function(a, b){return b.fields.TotalXP - a.fields.TotalXP});

await lib.discord.channels['@0.3.1'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: "rich",
    description: data.rows.map((r, i) =>  `${numToEmoji(i)}<@${r.fields.User}> - \`${r.fields.Count}\``).join('\n'),
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `Counting Leaderboard`},
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }],
  components: [
    {type: 1, components: [
      {style: 2, label: `Invites`, custom_id: `leaderboard-invites`, type: 2},
      {style: 1, label: `Counting`, custom_id: `leaderboard-counts`, type: 2},
      {style: 2, label: `Economy`, custom_id: `leaderboard-money`, type: 2}
    ]}
  ],
});