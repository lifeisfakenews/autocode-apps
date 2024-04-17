const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const snipes = require('../helpers/snipers.js');
let event = context.params.event;
let num = await lib.utils.kv['@0.1.16'].get({key: `easy_count`});
let score = await lib.googlesheets.query['@0.3.0'].select({
  range: `Users!A:E`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': event.author.id}],
});
score = score.rows[0].fields

if (event.content == num.current + 1 && num?.user != event.author.id) {
  await lib.utils.kv['@0.1.16'].set({
    key: `easy_count`,
    value: {current: num.current + 1, user: event.author.id}
  });

  await lib.googlesheets.query['@0.3.0'].update({
    range: `Users!A:E`,
    where: [{'User__is': event.author.id}],
    fields: {'Easy': parseInt(score.Easy) + 1},
  });
  await snipes(num.current + 1, event);
  
  if (parseInt(score.Easy) + 1 == 1) {
    await lib.discord.guilds['@0.2.2'].members.roles.update({
      role_id: `905924425042518127`,//Counter
      user_id: event.author.id,
      guild_id: event.guild_id
    });
  } else if (parseInt(score.Easy) + 1 == 10) {
    await lib.discord.guilds['@0.2.2'].members.roles.update({
      role_id: `905924588955910266`,//Good Counter
      user_id: event.author.id,
      guild_id: event.guild_id
    });
    await lib.discord.channels['@release'].messages.create({
      channel_id: `918218770173009960`,//Hall of Fame
      content: `Hey, **${event.author.username}** you are now an offical counter! Thanks for being a member of our community.`
    });
  } else if (parseInt(score.Easy) + 1 == 100) {
    await lib.discord.guilds['@0.2.2'].members.roles.update({
      role_id: `905924584472211556`,//Super Counter
      user_id: event.author.id, 
      guild_id: event.guild_id
    });
    await lib.discord.channels['@release'].messages.create({
      channel_id: `918218770173009960`,//Hall of Fame
      content: `Hey, **${event.author.username}** you are a Super counter! Well done on getting a score of **100**.`
    });
  } else if (parseInt(score.Easy) + 1 == 1000) {
    await lib.discord.guilds['@0.2.2'].members.roles.update({
      role_id: `905941983741218867`,//Mega Counter
      user_id: event.author.id,
      guild_id: event.guild_id
    });
    await lib.discord.channels['@release'].messages.create({
      channel_id: `918218770173009960`,//Hall of Fame
      content: `Hey, **${event.author.username}** you are a Mega Counter! Well done on getting a score of **1000**.`
    });
  }
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