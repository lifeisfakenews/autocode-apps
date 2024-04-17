const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.interactions['@release'].responses.create({token: context.params.event.token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
const canvacord = require('canvacord');
await canvacord.Assets.font.load();
const images = require('../../images.json');

let user_id
if (!context.params.event.data.options.length) {user_id = context.params.event.member.user.id}
else {user_id = context.params.event.data.options[0].value}

let user = await lib.discord.users['@release'].retrieve({user_id});
let leaderboard = await lib.googlesheets.query['@0.3.0'].select({
  range: `UserData!A:I`,
  bounds: 'FIRST_EMPTY_ROW',
});

leaderboard.rows.sort((a, b) => {
  return parseInt(b.fields.TotalXP) - parseInt(a.fields.ToatlXP);
});

let rank = leaderboard.rows.findIndex((row) => row.fields.User === user_id);
let data = leaderboard.rows[rank];

let card = new canvacord.Rank()
  .setCurrentXP(parseInt(data?.fields?.XP) || 0)
  .setRequiredXP(2000)
  .setRank(rank + 1)
  .setLevel(parseInt(data?.fields?.Level) || 0)
  .setCustomStatusColor(user.accent_color && user.accent_color != `1579292` ? user.accent_color : `#ffcc4d`)
  .setProgressBar(user.accent_color && user.accent_color != `1579292` ? user.accent_color : `#ffcc4d`)
  .setUsername(user.username)
  .setBackground('IMAGE', `${images[Math.floor(Math.random() * images.length)]}`)
  .setDiscriminator(user.discriminator)
  .setAvatar(user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'https://bit.ly/3KPnEKt');

await lib.discord.interactions['@release'].followups.create({
  token: context.params.event.token,
  content: ``,
  attachments: [{
    file: await card.build(),
    filename: 'rank.png',
  }]
});