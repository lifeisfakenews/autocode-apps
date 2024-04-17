const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async (context, count) => {
  let score = await lib.googlesheets.query['@0.3.0'].select({
    range: `Count!A:B`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': context.params.event.author.id}]
  });
  if (!score?.rows?.length) {
    score = await lib.googlesheets.query['@0.3.0'].insert({
      range: `Count!A:B`,
      fieldsets: [{
        'User': context.params.event.author.id,
        'Score': `1`
      }],
    });
  }
  await lib.googlesheets.query['@0.3.0'].update({
    range: `Count!A:B`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': context.params.event.author.id}],
    fields: {'Score': parseInt(score.rows[0].fields.Score) + 1
    }
  });
  if (parseInt(score.rows[0].fields.Score) + 1 == 10) {
    await lib.discord.guilds['@0.2.3'].members.roles.update({
      role_id: `899282830364934154`,
      user_id: context.params.event.author.id,
      guild_id: context.params.event.guild_id
    });
  } else if (parseInt(score.rows[0].fields.Score) + 1 == 100) {
    await lib.discord.guilds['@0.2.3'].members.roles.update({
      role_id: `899282792226107392`,
      user_id: context.params.event.author.id,
      guild_id: context.params.event.guild_id
    });
  } else if (parseInt(score.rows[0].fields.Score) + 1 == 1000) {
    await lib.discord.guilds['@0.2.3'].members.roles.update({
      role_id: `899282697321611265`,
      user_id: context.params.event.author.id,
      guild_id: context.params.event.guild_id
    });
  } else if (parseInt(score.rows[0].fields.Score) + 1 == 10000) {
    await lib.discord.guilds['@0.2.3'].members.roles.update({
      role_id: `900411717291495525`,
      user_id: context.params.event.author.id,
      guild_id: context.params.event.guild_id
    });
  } else if (parseInt(score.rows[0].fields.Score) + 1 == 100000) {
    await lib.discord.guilds['@0.2.3'].members.roles.update({
      role_id: `900411791669092382`,
      user_id: context.params.event.author.id,
      guild_id: context.params.event.guild_id
    });
  }
};