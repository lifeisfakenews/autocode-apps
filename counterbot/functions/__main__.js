// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let invites = await lib.discord.guilds['@0.2.4'].invites.list({
  guild_id: `905859582319026287`
});
for (let i = 0; i < invites.length; i++) {
  let score = await lib.googlesheets.query['@0.3.0'].select({
    range: `Users!A:E`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': invites[i].inviter.id}],
  });
  await lib.googlesheets.query['@0.3.0'].update({
    range: `Users!A:E`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': invites[i].inviter.id}],
    fields: {
      'Invites': parseInt(score.rows[0].fields.Invites) + invites[i].uses
    }
  });
}