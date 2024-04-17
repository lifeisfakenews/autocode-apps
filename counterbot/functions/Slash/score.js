const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let user = context.params.event.data?.resolved?.users[context.params.event.data?.options[0]?.value] || context.params.event.member.user
let scores = await lib.googlesheets.query['@0.3.0'].select({
  range: `Users!A:E`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': user.id}],
});
await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  token: `${context.params.event.token}`,
  content: `${user.username}'s Scores:\n**Easy Mode:** ${scores.rows[0].fields.Easy}\n**Hard Mode:** ${scores.rows[0].fields.Hard}\n**Premium Mode:** ${scores.rows[0].fields.Pre}`
});