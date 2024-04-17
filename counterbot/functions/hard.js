const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const snipes = require('../helpers/snipers.js');
let event = context.params.event;
let num = await lib.utils.kv['@0.1.16'].get({key: `hard_count`});
let score = await lib.googlesheets.query['@0.3.0'].select({
  range: `Users!A:E`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': event.author.id}],
});
score = score.rows[0].fields

if (event.content == num.current + 1 && num?.user != event.author.id) {
  let newnum = await lib.utils.kv['@0.1.16'].set({
    key: `hard_count`,
    value: {current: num.current + 1, user: event.author.id}
  });

  await lib.googlesheets.query['@0.3.0'].update({
    range: `Users!A:E`,
    where: [{'User__is': event.author.id}],
    fields: {'Hard': parseInt(score.Hard) + 1},
  });
  await snipes(num.current + 1, event);
} else {
  await lib.discord.channels['@0.3.0'].messages.destroy({
    message_id: event.id,
    channel_id: event.channel_id
  });
  await lib.discord.guilds['@0.2.2'].members.roles.update({
    role_id: `905932254373634089`,//Ruined Counter
    user_id: event.author.id,
    guild_id: event.guild_id
  });
}