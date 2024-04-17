const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
function numToEmoji(num) {
  let numWord = num < 9 ? num.toString().replace('0', 'one').replace('1', 'two').replace('2', 'three').replace('3', 'four').replace('4', 'five').replace('5', 'six').replace('6', 'seven').replace('7', 'eight').replace('8', 'nine') : `bigBoi`
  let numEmoji = numWord
  .replace('one', '<:1_:948138006131380234>').replace('two', '<:2_:948138038268137542>').replace('three', '<:3_:948138038331060265>').replace('four', '<:4_:948138067867336714>').replace('five', '<:5_:948138067892535346>')
  .replace('six', '<:6_:948138100364824576>').replace('seven', '<:7_:948138100369018931>').replace('eight', '<:8_:948138119956410421>').replace('nine', '<:9_:948138142790201405>').replace('bigBoi', '<:arrow:957320927979405402>')
  return numEmoji
}
await lib.discord.interactions['@release'].responses.create({token: context.params.event.token, response_type: 'DEFERRED_UPDATE_MESSAGE'});
let data = await lib.googlesheets.query['@0.3.0'].select({
  range: `UserData!A:Z`,
  bounds: 'FIRST_EMPTY_ROW',
});
data.rows.sort(function(a, b){return (b.fields.Cash + b.fields.Bank) - (a.fields.Cash + a.fields.Bank)});

await lib.discord.interactions['@release'].followups.update({
  token: context.params.event.token,
  message_id: context.params.event.message.id,
  content: ``,
  embeds: [{
    type: "rich",
    description: data.rows.map((r, i) =>  `${numToEmoji(i)}<@${r.fields.User}>\n<:blank:960094847023345705> **Total:** \`${r.fields.TotalInv}\` **Real:** \`${r.fields.Real}\` **Left:** \`${r.fields.Left}\``).join('\n'),
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `Economy Leaderboard`},
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }],
  components: [
    {type: 1, components: [
      {style: 2, label: `Invites`, custom_id: `leaderboard-invites`, type: 2},
      {style: 2, label: `Counting`, custom_id: `leaderboard-counts`, type: 2},
      {style: 1, label: `Economy`, custom_id: `leaderboard-money`, type: 2}
    ]}
  ],
});