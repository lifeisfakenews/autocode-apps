const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let event = context.params.event;
if (event.guild_id == 905859582319026287) {
  let invites = await lib.discord.invites['@0.1.0'].list({guild_id: event.guild_id});
  let invPos
  for (let i = 0; i < invites.length; i++) {
    let uses = await lib.utils.kv['@0.1.16'].get({key: `${invites[i].code}_invite`});
    if (uses + 1 == invites[i].uses) {
      invPos = i
      await lib.utils.kv['@0.1.16'].set({key: `${invites[i].code}_invite`, value: invites[i].uses});
      break;
    }
  }
  let score = await lib.googlesheets.query['@0.3.0'].select({
  range: `Users!A:E`,
  bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': invites[invPos].inviter.id}],
  });
  await lib.googlesheets.query['@0.3.0'].insert({
    range: `Users!A:E`,
    fieldsets: [{
        'User': event.user.id,
        'Invites': `0`,
        'Easy': `0`,
        'Hard': `0`,
        'Pre': `0`,
      }],
  });
  await lib.googlesheets.query['@0.3.0'].update({
  range: `Users!A:E`,
  bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': invites[invPos].inviter.id}],
    fields: {'Invites': parseInt(score.rows[0].fields.Invites || 0) + 1},
  });
  let members = await lib.discord.guilds['@0.2.2'].members.list({guild_id: event.guild_id});
  await lib.discord.channels['@release'].messages.create({
    channel_id: `905859582969131052`,
    content: `
  ╭・⌬・Everyone welcome **${event.user.username}#${event.user.discriminator}** 
  ●▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬●
  ・Invited by **${invites[invPos].inviter.username}#${invites[invPos].inviter.discriminator}**
  ・${invites[invPos].inviter.username} now has ${parseInt(score.rows[0].fields.Invites || 0) + 1} invites!
  ●▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬●
  ╰・⌬・We now have ${members.length} members`,
  });
  if (parseInt(score.rows[0].fields.Invites || 0) + 1 >= 5) {
    await lib.discord.guilds['@0.2.2'].members.roles.update({
      role_id: `906385503178358824`,//Premium
      user_id: invites[invPos].inviter.id,
      guild_id: event.guild_id
    });
  }
  if (parseInt(score.rows[0].fields.Invites) + 1 >= 10) {
    await lib.discord.guilds['@0.2.2'].members.roles.update({
      role_id: `926198164732657694`,//Mega Premium
      user_id: invites[invPos].inviter.id,
      guild_id: event.guild_id
    });
  }
  if (members.length <= 100) {
    await lib.discord.guilds['@0.2.2'].members.roles.update({
      role_id: `907695456841257002`,//First 100
      user_id: event.user.id,
      guild_id: event.guild_id
    });
  }
}