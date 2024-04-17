const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
if (context.params.event.guild_id != `891409977355419648`) return

let inviter = await lib.googlesheets.query['@0.3.0'].update({
  range: `Inviters!A:C`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.user.id, 'Left__is': `FALSE`}],
  fields: {
    'Left': true
  }
});
let score = await lib.googlesheets.query['@0.3.0'].select({
  range: `Invites!A:E`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': inviter.rows[0].fields.Inviter}],
});
await lib.googlesheets.query['@0.3.0'].update({
  range: `Invites!A:E`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': inviter.rows[0].fields.Inviter}],
  fields: {
    'Real': parseInt(score.rows[0].fields.Real) - 1,
    'Left': parseInt(score.rows[0].fields.Left) + 1
  }
});