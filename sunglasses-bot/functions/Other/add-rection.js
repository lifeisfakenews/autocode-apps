const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (context.params.event.message_id == `1008023413203406898`) {
  let validRoles = {'📣': '895910604534075412', '🎉': '895910603833634816', '📢': '895910603032510474', '🗳': '900425318513381388', 'sb': '902827371462271038'};
  if (validRoles[context.params.event.emoji.name]) {
    await lib.discord.guilds['@0.1.0'].members.roles.update({
      role_id: validRoles[context.params.event.emoji.name],
      user_id: context.params.event.user_id,
      guild_id: context.params.event.guild_id
    });
  }
} else if (context.params.event.message_id == `1008023398191996978`) {
  let validRoles = {'one': '895910620749258772', 'two': '895910621411942460', 'three': '895911824342519858', 'four': '895911824904560652', 'five': '895911841279139860', 'six': '895911826267713566'};
  if (validRoles[context.params.event.emoji.name]) {
    await lib.discord.guilds['@0.1.0'].members.roles.update({
      role_id: validRoles[context.params.event.emoji.name],
      user_id: context.params.event.user_id,
      guild_id: context.params.event.guild_id
    });
  }
}